"""User authentication, registration, session management, and password recovery router."""

import os
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status, Header
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.database import get_db
from backend.app.models.user import User, PasswordResetToken
from backend.app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from backend.app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    check_rate_limit,
    record_failed_login,
    clear_failed_logins,
    generate_password_reset_token,
    hash_token,
    send_password_reset_email,
    check_forgot_password_rate_limit,
    record_forgot_password_attempt,
    verify_smtp_connectivity,
    send_test_email,
    get_smtp_runtime_config
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

COOKIE_NAME = "rootwhisper_session"


def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency that extracts and validates JWT from Bearer header or HttpOnly session cookie.
    Raises HTTP 401 if token is missing, invalid, or expired.
    """
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:].strip()
    elif COOKIE_NAME in request.cookies:
        token = request.cookies[COOKIE_NAME]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or credentials are invalid. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = int(payload.get("sub", 0))
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or has been deactivated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    payload: UserRegisterRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """Registers a new human user with secure Argon2id password hashing."""
    # Check for existing email (case-insensitive)
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists. Please sign in instead."
        )

    # Hash password using Argon2id
    hashed = hash_password(payload.password)

    new_user = User(
        email=payload.email,
        full_name=payload.full_name.strip(),
        hashed_password=hashed,
        is_active=True,
        created_at=datetime.now(timezone.utc),
        last_login=datetime.now(timezone.utc)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue authenticated session token
    token, expires_in = create_access_token(new_user.id, new_user.email, new_user.full_name, remember_me=False)

    # Set secure HttpOnly session cookie
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=expires_in,
        httponly=True,
        samesite="lax",
        secure=False  # Set to True in production HTTPS
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=expires_in,
        user=UserResponse(**new_user.to_dict())
    )


@router.post("/login", response_model=TokenResponse)
def login_user(
    payload: UserLoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    """Verifies user credentials with rate limiting and issues authenticated session."""
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"{client_ip}:{payload.email}"

    # Check brute-force rate limit
    is_limited, remaining = check_rate_limit(rate_key)
    if is_limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many failed login attempts. For security, please wait {remaining} seconds before trying again."
        )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        record_failed_login(rate_key)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password. Please verify your credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact the administrator."
        )

    # Success: Clear failed attempt record and update last login
    clear_failed_logins(rate_key)
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token, expires_in = create_access_token(user.id, user.email, user.full_name, remember_me=payload.remember_me)

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=expires_in,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=expires_in,
        user=UserResponse(**user.to_dict())
    )


@router.post("/logout")
def logout_user(response: Response):
    """Invalidates the session by deleting the HttpOnly cookie."""
    response.delete_cookie(key=COOKIE_NAME, httponly=True, samesite="lax")
    return {"status": "SUCCESS", "message": "Logged out successfully."}


@router.get("/me", response_model=UserResponse)
def get_authenticated_user_profile(current_user: User = Depends(get_current_user)):
    """Returns the profile of the currently authenticated human user."""
    return UserResponse(**current_user.to_dict())


@router.post("/forgot-password")
def forgot_password_endpoint(
    payload: ForgotPasswordRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Initiates real password recovery flow using Gmail SMTP:
    1. Validates email format and applies abuse rate limiting.
    2. Generates cryptographically secure, single-use 32-byte token.
    3. Stores only SHA-256 hash in SQLite with 30-minute expiration.
    4. Dispatches professional Eco-Tech reset link via Gmail SMTP.
    5. Returns privacy-preserving generic confirmation.
    """
    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"{client_ip}:{payload.email}"

    # Rate limiting to prevent password recovery enumeration and email bombing
    is_limited, remaining = check_forgot_password_rate_limit(rate_key)
    if is_limited:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Too many password reset requests. For security, please wait {remaining} seconds before trying again."
        )

    record_forgot_password_attempt(rate_key)

    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        # Standard anti-enumeration: do not disclose whether email exists
        return {
            "status": "SUCCESS",
            "message": "If an account exists for this email address, password-reset instructions will be sent."
        }

    # Generate single-use token and store SHA-256 hash
    raw_token, token_hash, expires_at = generate_password_reset_token()
    reset_record = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
        used=False
    )
    db.add(reset_record)
    db.commit()

    # Dispatch email via Gmail SMTP
    sent, msg = send_password_reset_email(user.email, raw_token, recipient_name=user.full_name)

    if not sent:
        # Honest error reporting when SMTP server cannot deliver
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=msg
        )

    return {
        "status": "SUCCESS",
        "message": "If an account exists for this email address, password-reset instructions will be sent."
    }


@router.get("/verify-reset-token")
def verify_reset_token_endpoint(token: str, db: Session = Depends(get_db)):
    """
    Validates recovery token from URL before presenting password update form.
    Checks:
    - Token existence in database
    - Single-use status (used == False)
    - Expiration (expires_at > now)
    """
    if not token or len(token) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The recovery token provided is invalid or malformed."
        )

    t_hash = hash_token(token)
    now = datetime.now(timezone.utc)

    reset_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == t_hash
    ).first()

    if not reset_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password recovery token does not exist or has already been purged."
        )

    if reset_record.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password recovery token has already been used. Please request a new link."
        )

    if reset_record.expires_at <= now:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password recovery token has expired. Password reset links are valid for 30 minutes."
        )

    user = db.query(User).filter(User.id == reset_record.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated user account was not found."
        )

    # Obfuscate email for friendly UI confirmation (e.g., p***s@gmail.com)
    parts = user.email.split("@")
    if len(parts) == 2 and len(parts[0]) > 2:
        masked_user = f"{parts[0][0]}***{parts[0][-1]}@{parts[1]}"
    else:
        masked_user = user.email

    return {
        "status": "VALID",
        "message": "Recovery token is valid and unexpired.",
        "user_email_masked": masked_user,
        "expires_at": reset_record.expires_at.isoformat()
    }


@router.post("/reset-password")
def reset_password_endpoint(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Validates single-use token and updates password using Argon2id.
    Marks token as used, invalidating it against replay attacks.
    """
    t_hash = hash_token(payload.token)
    now = datetime.now(timezone.utc)

    reset_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token_hash == t_hash,
        PasswordResetToken.used == False,
        PasswordResetToken.expires_at > now
    ).first()

    if not reset_record:
        # Check if it was already used
        used_record = db.query(PasswordResetToken).filter(
            PasswordResetToken.token_hash == t_hash,
            PasswordResetToken.used == True
        ).first()
        if used_record:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This recovery token has already been used. Tokens are strictly single-use."
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired."
        )

    user = db.query(User).filter(User.id == reset_record.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    # Update password hash with Argon2id
    user.hashed_password = hash_password(payload.new_password)
    reset_record.used = True

    # Invalidate any other outstanding reset tokens for this user
    db.query(PasswordResetToken).filter(
        PasswordResetToken.user_id == user.id,
        PasswordResetToken.used == False
    ).update({"used": True})

    db.commit()

    return {
        "status": "SUCCESS",
        "message": "Your password has been successfully reset. You may now sign in with your new password."
    }


@router.get("/smtp-status")
def get_smtp_status():
    """
    Reports SMTP configuration status and diagnostics.
    Never exposes passwords or sensitive credentials.
    """
    is_valid, missing, cfg = get_smtp_runtime_config()
    return {
        "configured": is_valid,
        "missing_variables": missing,
        "smtp_host": cfg["host"] or None,
        "smtp_port": cfg["port"],
        "smtp_from_email": cfg["from_email"] or None,
        "frontend_base_url": cfg["frontend_url"],
        "tls_encryption": "STARTTLS (port 587)",
    }


@router.post("/test-smtp")
def test_smtp_endpoint(payload: dict):
    """Sends a verification email to test SMTP delivery end-to-end."""
    target_email = payload.get("email")
    if not target_email or "@" not in target_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A valid recipient email is required.")
    
    success, msg = send_test_email(target_email)
    if not success:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=msg)
    
    return {"status": "SUCCESS", "message": msg, "recipient": target_email}

