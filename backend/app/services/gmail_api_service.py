"""RootWhisper Gmail API Service (OAuth 2.0 over HTTPS).

Dispatches transactional password recovery emails via the official Google Gmail REST API
(POST https://gmail.googleapis.com/gmail/v1/users/me/messages/send) over port 443 (HTTPS).

Advantages for Cloud Deployment:
- Operates over standard HTTPS (port 443), bypassing SMTP port blocks on Render Free.
- Can send from patnaaik.ayes@gmail.com to ANY registered user email address.
- Uses persistent OAuth 2.0 Refresh Tokens (never expires unless revoked).
- Eliminates Google App Password 'BadCredentials' / 'SMTPServerDisconnected' lockouts.
"""

import os
import time
import base64
import json
from pathlib import Path
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Tuple, Dict, Any, Optional

# In-memory access token cache
_CACHED_ACCESS_TOKEN: Optional[str] = None
_TOKEN_EXPIRY_TIMESTAMP: float = 0.0


def get_gmail_oauth_config() -> Tuple[bool, list, Dict[str, str]]:
    """Checks whether Gmail API OAuth 2.0 credentials are configured."""
    client_id = os.environ.get("GMAIL_CLIENT_ID", "").strip()
    client_secret = os.environ.get("GMAIL_CLIENT_SECRET", "").strip()
    refresh_token = os.environ.get("GMAIL_REFRESH_TOKEN", "").strip()
    sender_email = os.environ.get("GMAIL_SENDER_EMAIL", os.environ.get("SMTP_USER", "")).strip()

    # Load from backend/.env if missing from environment
    if not (client_id and client_secret and refresh_token):
        env_file = Path(__file__).resolve().parent.parent.parent / ".env"
        if env_file.exists():
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GMAIL_CLIENT_ID=") and not client_id:
                        client_id = line.split("=", 1)[1].strip().strip("'\"")
                        os.environ["GMAIL_CLIENT_ID"] = client_id
                    elif line.startswith("GMAIL_CLIENT_SECRET=") and not client_secret:
                        client_secret = line.split("=", 1)[1].strip().strip("'\"")
                        os.environ["GMAIL_CLIENT_SECRET"] = client_secret
                    elif line.startswith("GMAIL_REFRESH_TOKEN=") and not refresh_token:
                        refresh_token = line.split("=", 1)[1].strip().strip("'\"")
                        os.environ["GMAIL_REFRESH_TOKEN"] = refresh_token
                    elif line.startswith("GMAIL_SENDER_EMAIL=") and not sender_email:
                        sender_email = line.split("=", 1)[1].strip().strip("'\"")
                        os.environ["GMAIL_SENDER_EMAIL"] = sender_email

    missing = []
    if not client_id:
        missing.append("GMAIL_CLIENT_ID")
    if not client_secret:
        missing.append("GMAIL_CLIENT_SECRET")
    if not refresh_token:
        missing.append("GMAIL_REFRESH_TOKEN")
    if not sender_email:
        missing.append("GMAIL_SENDER_EMAIL")

    cfg = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "sender_email": sender_email,
    }
    return len(missing) == 0, missing, cfg


def get_fresh_access_token() -> Tuple[bool, str]:
    """
    Exchanges the OAuth 2.0 Refresh Token for a short-lived Bearer Access Token.
    Caches token in memory until expiration.
    """
    global _CACHED_ACCESS_TOKEN, _TOKEN_EXPIRY_TIMESTAMP

    # Return cached token if valid for at least 60 more seconds
    now = time.time()
    if _CACHED_ACCESS_TOKEN and now < (_TOKEN_EXPIRY_TIMESTAMP - 60):
        return True, _CACHED_ACCESS_TOKEN

    is_configured, missing, cfg = get_gmail_oauth_config()
    if not is_configured:
        return False, f"Missing Gmail API credentials: {', '.join(missing)}"

    token_endpoint = "https://oauth2.googleapis.com/token"
    token_payload = {
        "client_id": cfg["client_id"],
        "client_secret": cfg["client_secret"],
        "refresh_token": cfg["refresh_token"],
        "grant_type": "refresh_token",
    }

    try:
        data = urllib.parse.urlencode(token_payload).encode("utf-8")
        req = urllib.request.Request(
            token_endpoint,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded", "User-Agent": "RootWhisper-App/1.0"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            access_token = resp_data.get("access_token")
            expires_in = resp_data.get("expires_in", 3600)

            if not access_token:
                return False, "Google OAuth response did not contain access_token."

            _CACHED_ACCESS_TOKEN = access_token
            _TOKEN_EXPIRY_TIMESTAMP = now + expires_in
            return True, access_token

    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        return False, f"Google OAuth token refresh failed (HTTP {e.code}): {err_body}"
    except Exception as e:
        return False, f"Google OAuth connection error: {type(e).__name__} - {e}"


def verify_gmail_api_connectivity() -> Tuple[bool, str, Dict[str, Any]]:
    """
    Validates Gmail API connectivity and confirms authorized scopes with Google OAuth tokeninfo.
    Never exposes credentials or tokens in the response.
    """
    ok, token_or_err = get_fresh_access_token()
    if not ok:
        return False, token_or_err, {}

    try:
        tokeninfo_url = f"https://oauth2.googleapis.com/tokeninfo?access_token={token_or_err}"
        req = urllib.request.Request(
            tokeninfo_url,
            headers={"User-Agent": "RootWhisper-App/1.0"},
            method="GET"
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            info = json.loads(resp.read().decode("utf-8"))
            granted_scopes = info.get("scope", "")
            if "gmail.send" in granted_scopes:
                sender = os.environ.get("GMAIL_SENDER_EMAIL", "")
                return True, f"Gmail API connected successfully with gmail.send scope ({sender})", {
                    "scope": granted_scopes,
                    "expires_in": info.get("expires_in", 0)
                }
            return False, f"Token missing gmail.send scope. Granted: {granted_scopes}", info
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        return False, f"Token validation failed (HTTP {e.code}): {err_body}", {}
    except Exception as e:
        return False, f"Connectivity error: {type(e).__name__} - {e}", {}


def send_email_via_gmail_api(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: str,
    sender_name: str = "RootWhisper Security"
) -> Tuple[bool, str]:
    """
    Constructs an RFC 2822 email, base64url-encodes it, and sends it via
    the official Google Gmail REST API over HTTPS port 443.
    """
    is_configured, missing, cfg = get_gmail_oauth_config()
    if not is_configured:
        return False, f"Gmail API OAuth credentials incomplete. Missing: {', '.join(missing)}"

    ok, token_or_err = get_fresh_access_token()
    if not ok:
        return False, f"Could not acquire Gmail API access token: {token_or_err}"

    # Build MIME message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{sender_name} <{cfg['sender_email']}>"
    msg["To"] = to_email
    msg.attach(MIMEText(text_content, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # Convert to URL-safe Base64 as required by Gmail API
    raw_bytes = msg.as_bytes()
    raw_base64 = base64.urlsafe_b64encode(raw_bytes).decode("ascii")

    send_url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send"
    payload = json.dumps({"raw": raw_base64}).encode("utf-8")

    try:
        req = urllib.request.Request(
            send_url,
            data=payload,
            headers={
                "Authorization": f"Bearer {token_or_err}",
                "Content-Type": "application/json",
                "User-Agent": "RootWhisper-App/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            msg_id = resp_data.get("id", "accepted")
            return True, f"Email accepted by Google Gmail API (Message ID: {msg_id})."

    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        return False, f"Gmail API send error (HTTP {e.code}): {err_body}"
    except Exception as e:
        return False, f"Gmail API network error: {type(e).__name__} - {e}"

