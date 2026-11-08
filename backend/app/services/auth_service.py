"""Core authentication, password hashing (Argon2id), JWT session, and security utilities."""

import os
import time
import secrets
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Tuple, Any

import jwt
from argon2 import PasswordHasher, Type
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

# Ensure environment configuration is loaded
import backend.app.config

# Argon2id hasher configuration
# time_cost=2, memory_cost=65536 (64 MB), parallelism=1, 32-byte hash
_ph = PasswordHasher(
    time_cost=2,
    memory_cost=65536,
    parallelism=1,
    hash_len=32,
    type=Type.ID
)

# JWT configuration
JWT_SECRET = os.environ.get(
    "ROOTWHISPER_JWT_SECRET",
    "rootwhisper-botanical-ai-secret-key-production-e298df89a1"
)
JWT_ALGORITHM = "HS256"
DEFAULT_SESSION_HOURS = 24
REMEMBER_ME_DAYS = 7

# Password Reset Token Expiry (Strict 30-minute security window)
RESET_TOKEN_EXPIRY_MINUTES = 30

# In-memory Login Rate Limiting (Identifier -> list of failed attempt timestamps)
_FAILED_LOGIN_ATTEMPTS: Dict[str, list] = {}
RATE_LIMIT_MAX_ATTEMPTS = 5
RATE_LIMIT_WINDOW_SECONDS = 300  # 5 minutes
LOCKOUT_DURATION_SECONDS = 900   # 15 minutes

# In-memory Forgot Password Request Rate Limiting (Identifier -> list of request timestamps)
_FORGOT_PASSWORD_ATTEMPTS: Dict[str, list] = {}
FORGOT_PASSWORD_MAX_ATTEMPTS = 5
FORGOT_PASSWORD_WINDOW_SECONDS = 600  # 10 minutes
FORGOT_PASSWORD_LOCKOUT_SECONDS = 900  # 15 minutes


def check_forgot_password_rate_limit(identifier: str) -> Tuple[bool, int]:
    """
    Prevents password-reset enumeration and spamming by rate limiting requests.
    Returns (is_limited, remaining_lockout_seconds).
    """
    now = time.time()
    attempts = _FORGOT_PASSWORD_ATTEMPTS.get(identifier, [])
    recent_attempts = [t for t in attempts if now - t < FORGOT_PASSWORD_LOCKOUT_SECONDS]
    _FORGOT_PASSWORD_ATTEMPTS[identifier] = recent_attempts

    if len(recent_attempts) >= FORGOT_PASSWORD_MAX_ATTEMPTS:
        time_since_last = now - recent_attempts[-1]
        if time_since_last < FORGOT_PASSWORD_LOCKOUT_SECONDS:
            remaining = int(FORGOT_PASSWORD_LOCKOUT_SECONDS - time_since_last)
            return True, remaining

    return False, 0


def record_forgot_password_attempt(identifier: str) -> None:
    """Records a password reset request attempt for rate limiting."""
    now = time.time()
    attempts = _FORGOT_PASSWORD_ATTEMPTS.setdefault(identifier, [])
    attempts.append(now)


def hash_password(plain_password: str) -> str:
    """Hash plaintext password using Argon2id."""
    return _ph.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plaintext password against Argon2id hash."""
    try:
        return _ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False


def check_rate_limit(identifier: str) -> Tuple[bool, int]:
    """
    Checks if an IP or email is rate-limited due to repeated failed login attempts.
    Returns (is_limited, remaining_lockout_seconds).
    """
    now = time.time()
    attempts = _FAILED_LOGIN_ATTEMPTS.get(identifier, [])
    # Filter attempts within lockout + window
    recent_attempts = [t for t in attempts if now - t < LOCKOUT_DURATION_SECONDS]
    _FAILED_LOGIN_ATTEMPTS[identifier] = recent_attempts

    if len(recent_attempts) >= RATE_LIMIT_MAX_ATTEMPTS:
        time_since_last = now - recent_attempts[-1]
        if time_since_last < LOCKOUT_DURATION_SECONDS:
            remaining = int(LOCKOUT_DURATION_SECONDS - time_since_last)
            return True, remaining

    return False, 0


def record_failed_login(identifier: str) -> None:
    """Records a failed login attempt for rate limiting."""
    now = time.time()
    attempts = _FAILED_LOGIN_ATTEMPTS.setdefault(identifier, [])
    attempts.append(now)


def clear_failed_logins(identifier: str) -> None:
    """Clears failed login counter upon successful authentication."""
    _FAILED_LOGIN_ATTEMPTS.pop(identifier, None)


def create_access_token(
    user_id: int,
    email: str,
    full_name: str,
    remember_me: bool = False
) -> Tuple[str, int]:
    """
    Issues a cryptographically signed JWT access token.
    Returns (token_string, expires_in_seconds).
    """
    duration = timedelta(days=REMEMBER_ME_DAYS) if remember_me else timedelta(hours=DEFAULT_SESSION_HOURS)
    expires_at = datetime.now(timezone.utc) + duration
    expires_in_seconds = int(duration.total_seconds())

    payload = {
        "sub": str(user_id),
        "email": email,
        "name": full_name,
        "exp": expires_at,
        "iat": datetime.now(timezone.utc),
        "iss": "RootWhisper-Auth"
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token, expires_in_seconds


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a JWT access token. Returns payload or None if invalid/expired."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], issuer="RootWhisper-Auth")
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def generate_password_reset_token() -> Tuple[str, str, datetime]:
    """
    Generates a secure, time-limited, single-use password reset token.
    Returns (raw_token_for_user, token_hash_for_db, expires_at_dt).
    """
    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRY_MINUTES)
    return raw_token, token_hash, expires_at


def hash_token(raw_token: str) -> str:
    """Computes SHA-256 hash of a raw token for database lookup."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def get_smtp_runtime_config() -> Tuple[bool, list, Dict[str, Any]]:
    """Returns (is_valid, missing_keys, config_dict). Never exposes passwords."""
    host = os.environ.get("SMTP_HOST", "")
    port_str = os.environ.get("SMTP_PORT", "587")
    try:
        port = int(port_str)
    except ValueError:
        port = 587
    user = os.environ.get("SMTP_USER", "")
    password = os.environ.get("SMTP_PASSWORD", "")
    from_email = os.environ.get("SMTP_FROM_EMAIL", os.environ.get("SMTP_FROM", user))
    frontend_url = os.environ.get("FRONTEND_BASE_URL", os.environ.get("ROOTWHISPER_APP_URL", "http://localhost:3000")).rstrip("/")

    missing = []
    if not host:
        missing.append("SMTP_HOST")
    if not port_str:
        missing.append("SMTP_PORT")
    if not user:
        missing.append("SMTP_USER")
    if not password:
        missing.append("SMTP_PASSWORD")

    cfg = {
        "host": host,
        "port": port,
        "user": user,
        "password": password,
        "from_email": from_email or user,
        "frontend_url": frontend_url,
    }
    return len(missing) == 0, missing, cfg


def verify_smtp_connectivity() -> Tuple[bool, str]:
    """
    Verifies outgoing email connectivity.
    Checks Gmail API OAuth 2.0 first if configured; falls back to SMTP STARTTLS.
    Returns (success, message). Never exposes sensitive credentials in output.
    """
    from backend.app.services.gmail_api_service import get_gmail_oauth_config, verify_gmail_api_connectivity
    is_oauth, _, _ = get_gmail_oauth_config()
    if is_oauth:
        ok, msg, _ = verify_gmail_api_connectivity()
        return ok, msg

    is_valid, missing, cfg = get_smtp_runtime_config()
    if not is_valid:
        return False, f"Email configuration incomplete. Missing environment variable(s): {', '.join(missing)}."

    try:
        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            pwd = cfg["password"]
            try:
                server.login(cfg["user"], pwd.strip())
            except smtplib.SMTPAuthenticationError:
                server.login(cfg["user"], pwd.replace(" ", "").strip())
        return True, "Gmail SMTP connectivity and authentication verified successfully."
    except (smtplib.SMTPAuthenticationError, smtplib.SMTPServerDisconnected):
        return False, "Gmail SMTP authentication failed or connection closed by Google. Please verify your Google App Password and account settings."
    except smtplib.SMTPConnectError:
        return False, f"Failed to connect to SMTP host {cfg['host']}:{cfg['port']}. Please verify network connectivity."
    except Exception as e:
        return False, f"SMTP connection error: {type(e).__name__}"


def send_password_reset_email(
    to_email: str,
    reset_token: str,
    recipient_name: Optional[str] = None
) -> Tuple[bool, str]:
    """
    Dispatches a professional Eco-Tech styled password reset email via Google Gmail API (OAuth 2.0 HTTPS)
    or fallback Gmail SMTP.
    Returns (success, message). Strictly reports failures without disclosing secrets.
    """
    frontend_url = os.environ.get("FRONTEND_BASE_URL", os.environ.get("ROOTWHISPER_APP_URL", "http://localhost:3000")).rstrip("/")
    reset_url = f"{frontend_url}/?token={reset_token}"
    localhost_url = f"http://localhost:3000/?token={reset_token}"
    greeting_name = recipient_name if recipient_name else "RootWhisper Researcher"

    # Eco-Tech Botanical Design System Palette:
    # Deep Forest: #123B36
    # Eco Teal:    #087E75
    # Fresh Teal:  #55B6A3
    # Mint:        #D9F0EA
    # White:       #FFFFFF

    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - RootWhisper</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EAF2ED; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #26342D;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #EAF2ED; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #D4E7E1; box-shadow: 0 10px 25px rgba(18, 59, 54, 0.08); overflow: hidden;">
          
          <!-- Deep Forest Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #123B36 0%, #0F3530 100%); padding: 32px 30px; text-align: center;">
              <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="background-color: #087E75; border-radius: 10px; width: 44px; height: 44px; text-align: center; vertical-align: middle;">
                    <span style="color: #FFFFFF; font-size: 22px; line-height: 44px;">🌿</span>
                  </td>
                  <td style="padding-left: 14px; text-align: left;">
                    <div style="font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px; margin: 0;">RootWhisper</div>
                    <div style="font-size: 11px; font-family: monospace; color: #55B6A3; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 2px;">Multi-Node AgriTech Platform</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 36px 34px 28px 34px;">
              <div style="display: inline-block; background-color: #D9F0EA; color: #087E75; font-size: 11px; font-weight: 700; font-family: monospace; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
                Account Security Notice
              </div>
              <h1 style="color: #123B36; font-size: 22px; font-weight: 700; margin: 0 0 14px 0; letter-spacing: -0.4px;">
                Reset Your Password
              </h1>
              
              <p style="font-size: 14px; line-height: 1.6; color: #26342D; margin: 0 0 16px 0;">
                Hello <strong>{greeting_name}</strong>,
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #26342D; margin: 0 0 24px 0;">
                We received a request to reset the password associated with your RootWhisper account. Click the button below to establish a new secure password:
              </p>

              <!-- Reset Password Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 28px auto; width: 100%;">
                <tr>
                  <td align="center">
                    <a href="{reset_url}" target="_blank" style="display: inline-block; background-color: #087E75; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 14px rgba(8, 126, 117, 0.35); text-align: center;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Direct URL Fallback -->
              <div style="background-color: #F5FAF8; border: 1px solid #D4E7E1; border-radius: 10px; padding: 14px; margin-bottom: 24px;">
                <p style="font-size: 11px; color: #78847C; margin: 0 0 8px 0; font-weight: 600;">
                  Button not displaying? Paste the secure link into your browser:
                </p>
                <p style="font-size: 11px; margin: 0 0 6px 0; color: #123B36;">
                  <strong>Wi-Fi / Mobile Device:</strong><br>
                  <a href="{reset_url}" style="color: #087E75; font-family: monospace; word-break: break-all; text-decoration: underline;">{reset_url}</a>
                </p>
                <p style="font-size: 11px; margin: 0; color: #123B36;">
                  <strong>This Computer (Localhost):</strong><br>
                  <a href="{localhost_url}" style="color: #087E75; font-family: monospace; word-break: break-all; text-decoration: underline;">{localhost_url}</a>
                </p>
              </div>

              <!-- Security Information Notice -->
              <div style="border-left: 3px solid #55B6A3; background-color: #F8FCFA; padding: 12px 14px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                <p style="font-size: 12px; line-height: 1.5; color: #26342D; margin: 0;">
                  <strong>Security Reminder:</strong> This single-use recovery link will expire in <strong>{RESET_TOKEN_EXPIRY_MINUTES} minutes</strong>. If you did not make this request, you can safely ignore this email; your current password remains secure and active.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer Information -->
          <tr>
            <td style="background-color: #F5FAF8; border-top: 1px solid #D9F0EA; padding: 20px 34px; text-align: center;">
              <p style="font-size: 11px; color: #78847C; margin: 0 0 4px 0;">
                RootWhisper Multi-Node Physiological Intelligence & Canopy Screening
              </p>
              <p style="font-size: 10px; font-family: monospace; color: #A8BDA8; margin: 0;">
                Automated security notification · Do not reply directly to this email
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    text_body = f"""RootWhisper — Password Reset Request

Hello {greeting_name},

We received a request to reset the password associated with your RootWhisper account.

Please visit the link below to set your new password:

Wi-Fi / Mobile:
{reset_url}

Localhost (This PC):
{localhost_url}

This password reset link is valid for {RESET_TOKEN_EXPIRY_MINUTES} minutes and can only be used once.

If you did not request this password reset, please ignore this email. Your RootWhisper account remains secure.

--
RootWhisper Multi-Node AgriTech Platform
Contactless Radiometric IR Thermography & Plant Screening
"""

    # 1. Prefer Gmail API over HTTPS (Port 443) if configured
    from backend.app.services.gmail_api_service import get_gmail_oauth_config, send_email_via_gmail_api
    is_oauth, _, oauth_cfg = get_gmail_oauth_config()
    if is_oauth:
        return send_email_via_gmail_api(
            to_email=to_email,
            subject="Reset Your Password - RootWhisper",
            html_content=html_body,
            text_content=text_body,
            sender_name="RootWhisper Security"
        )

    # 2. Fall back to SMTP STARTTLS if configured
    is_valid, missing, cfg = get_smtp_runtime_config()
    if not is_valid:
        return False, (
            "Email service is not configured on this server. "
            "Please configure Google Gmail API OAuth or SMTP credentials in backend/.env."
        )

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Reset Your Password - RootWhisper"
        msg["From"] = f"RootWhisper Security <{cfg['from_email']}>"
        msg["To"] = to_email
        msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            pwd = cfg["password"]
            try:
                server.login(cfg["user"], pwd.strip())
            except smtplib.SMTPAuthenticationError:
                server.login(cfg["user"], pwd.replace(" ", "").strip())
            server.sendmail(cfg["from_email"], [to_email], msg.as_string())

        return True, "Password reset email delivered successfully."
    except smtplib.SMTPAuthenticationError:
        return False, "Gmail SMTP authentication failed. Please verify your Google App Password."
    except smtplib.SMTPConnectError:
        return False, f"Failed to connect to SMTP server at {cfg['host']}:{cfg['port']}."
    except Exception as e:
        return False, f"Email delivery error: {type(e).__name__}"


def send_test_email(to_email: str) -> Tuple[bool, str]:
    """
    Sends a test verification email via Gmail API (if configured) or Gmail SMTP to verify end-to-end delivery.
    """
    from backend.app.services.gmail_api_service import get_gmail_oauth_config, send_email_via_gmail_api
    is_oauth, _, oauth_cfg = get_gmail_oauth_config()
    if is_oauth:
        subject = "RootWhisper: Gmail API HTTPS Connectivity Verification"
        text_body = f"""RootWhisper Gmail API Test

This is an automated test message from your RootWhisper AgriTech backend.
Google Gmail REST API over HTTPS (port 443) has been verified successfully.

Timestamp: {datetime.now(timezone.utc).isoformat()}
Sender: {oauth_cfg['sender_email']}
Recipient: {to_email}
"""
        html_body = f"""<div style="font-family:sans-serif;padding:24px;border-radius:12px;border:1px solid #087E75;background-color:#EAF2ED;max-width:540px;">
<h2 style="color:#123B36;margin-top:0;">🌿 RootWhisper Gmail API Verification</h2>
<p style="color:#26342D;line-height:1.5;">This automated test message confirms that RootWhisper has successfully dispatched an email via the <strong>official Google Gmail REST API over HTTPS (Port 443)</strong>.</p>
<ul style="color:#26342D;line-height:1.6;">
  <li><strong>Sender:</strong> {oauth_cfg['sender_email']}</li>
  <li><strong>Recipient:</strong> {to_email}</li>
  <li><strong>Protocol:</strong> HTTPS OAuth 2.0 (Port 443)</li>
  <li><strong>Timestamp (UTC):</strong> {datetime.now(timezone.utc).isoformat()}</li>
</ul>
<p style="color:#087E75;font-weight:600;margin-bottom:0;">&#10004; Cloud Deployment Ready (Render Free / Neon PostgreSQL)</p>
</div>"""
        return send_email_via_gmail_api(
            to_email=to_email,
            subject=subject,
            html_content=html_body,
            text_content=text_body,
            sender_name="RootWhisper Platform"
        )

    is_valid, missing, cfg = get_smtp_runtime_config()
    if not is_valid:
        return False, f"Email configuration incomplete. Missing: {', '.join(missing)}."

    subject = "RootWhisper: Gmail SMTP Connectivity Verification"
    text_body = f"""RootWhisper Gmail SMTP Test

This is an automated test message from your RootWhisper AgriTech backend.
Gmail SMTP STARTTLS connection (smtp.gmail.com:587) has been verified successfully.

Timestamp: {datetime.now(timezone.utc).isoformat()}
Sender: {cfg['from_email']}
Recipient: {to_email}
"""

    try:
        msg = MIMEText(text_body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = f"RootWhisper Platform <{cfg['from_email']}>"
        msg["To"] = to_email

        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            pwd = cfg["password"]
            try:
                server.login(cfg["user"], pwd.strip())
            except smtplib.SMTPAuthenticationError:
                server.login(cfg["user"], pwd.replace(" ", "").strip())
            server.sendmail(cfg["from_email"], [to_email], msg.as_string())

        return True, "Verification email accepted by Gmail SMTP server."
    except Exception as e:
        return False, f"Failed to dispatch test email: {type(e).__name__}"
