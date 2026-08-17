"""
webhooks.py — Secure Webhook Delivery & Event Notification System
Signs webhook HTTP POST payloads using HMAC-SHA256 signatures.
"""

import hmac
import hashlib
import json
import urllib.request
import threading

DEFAULT_WEBHOOK_SECRET = "whsec_namelens_ai_991823"

def sign_webhook_payload(payload_json_bytes, secret=DEFAULT_WEBHOOK_SECRET):
    """Computes HMAC-SHA256 signature string for webhook verification."""
    signature = hmac.new(
        secret.encode('utf-8'),
        payload_json_bytes,
        hashlib.sha256
    ).hexdigest()
    return f"sha256={signature}"

def deliver_webhook_notification(webhook_url, event_type, payload, secret=DEFAULT_WEBHOOK_SECRET):
    """
    Delivers a signed HTTP POST webhook request asynchronously.
    """
    def _send_request():
        try:
            event_payload = {
                "event": event_type,
                "data": payload
            }
            body_bytes = json.dumps(event_payload).encode('utf-8')
            signature = sign_webhook_payload(body_bytes, secret)

            req = urllib.request.Request(
                webhook_url,
                data=body_bytes,
                headers={
                    'Content-Type': 'application/json',
                    'X-Signature': signature,
                    'User-Agent': 'NameLens-Webhook-Delivery/2.4'
                },
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                print(f"[Webhook] Delivered '{event_type}' to {webhook_url} -> Status {resp.status}")
        except Exception as e:
            print(f"[Webhook] Delivery failed for '{event_type}' to {webhook_url}: {e}")

    thread = threading.Thread(target=_send_request, daemon=True)
    thread.start()
