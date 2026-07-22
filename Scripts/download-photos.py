# Badge Photo Downloader
# =====================
# Downloads associate photos from badgephotos.corp.amazon.com
#
# SETUP:
#   1. Open Chrome and go to https://badgephotos.corp.amazon.com/?uid=nellyvw
#      (make sure the photo loads - authenticate via Midway if prompted)
#   2. Press F12 to open DevTools
#   3. Go to Network tab
#   4. Refresh the page
#   5. Click on the first request (the page itself)
#   6. In the Headers section, find "Cookie:" under Request Headers
#   7. Copy the ENTIRE cookie value and paste it below between the quotes
#
# Then run: python download-photos.py

import os
import re
import time
import urllib.request
import ssl

# ============================================================
# PASTE YOUR COOKIE HERE (from browser DevTools)
# ============================================================
COOKIE = "aea_plugin_present=eyAicGx1Z2luX3ZlcnNpb24iOiAiMi4wLjUiIH0=; amzn_sso_rfp=7c7941171dc4e37d; amzn_sso_token=eyJ0eXAiOiJKV1MiLCJhbGciOiJSUzI1NiIsImtpZCI6IjI5OTM1MjAyIn0.eyJpc3MiOiJodHRwczovL21pZHdheS1hdXRoLmFtYXpvbi5jb20iLCJzdWIiOiJuZWxseXZ3IiwiYXVkIjoiaHR0cHM6Ly9iYWRnZXBob3Rvcy5jb3JwLmFtYXpvbi5jb206NDQzIiwiZXhwIjoxNzgyNDA2OTI3LCJpYXQiOjE3ODI0MDYwMjcsImF1dGhfdGltZSI6MTc4MjQwNjAyNywibm9uY2UiOiJhNDNlM2NkM2U5Y2ZiMzg0OWI1MDI5YTBmZmM1YWI4OWU3MDc2ODBmZTE1Y2M5ZjMzYWMxMWE5NWE1OWM5Y2E4IiwiYW1yIjoiW1wicGluXCIsIFwidTJmXCJdIiwidHJ1c3Rfc2NvcmUiOm51bGwsInJlcV9pZCI6bnVsbCwibWlkd2F5X3RydXN0X3Njb3JlIjpudWxsLCJhcGVzX3Jlc3VsdHMiOm51bGwsImlhbCI6MCwiYWFsIjowLCJqdGkiOiJ4NzdoYjJsZmV4eUI3RU5uNjdvTVVBPT0iLCJwb3N0dXJlX2NoZWNrIjowLCJtd2kiOjB9.KAJwNSQr79OgTV0XZIY9YcRXmN42-cy1hzR3VyyCFpDAZI8W7hde_63MAuZZIe7IjPW9WainF2XAOe055gLBgL5hDlUX28Rgr3qzJjDpF7H1fLdRJeJ-TOpyJcFq1iGQybunphM8w7G8k2V8qSxWKmHRVUN1Ntvio1pLONUJWMCboahRgGgo43VaAy8W4mZOLCz4SXZROcRyIZbs4M09A9wSmbdLCK2PVuyF6UQZniGU6_wiJg4j_6FCE3ePY4NirGQf0dWVqyJJhi2xTUyrr6ioduL5rQNZ499949SAsbwjfeL7yf1AUTMhpmtUmNf5E4lPiupHwpyAMeBNulYX1A"
# ============================================================

if not COOKIE:
    print("ERROR: You need to paste your Midway cookie first!")
    print()
    print("Steps:")
    print("  1. Open Chrome, go to: https://badgephotos.corp.amazon.com/?uid=nellyvw")
    print("  2. Press F12 (DevTools) -> Network tab")
    print("  3. Refresh the page")
    print("  4. Click the first request")
    print("  5. Find 'Cookie:' in Request Headers")
    print("  6. Copy the full cookie string")
    print("  7. Paste it in this script on the COOKIE = '' line")
    print("  8. Run this script again")
    exit(1)

# Create photos folder
PHOTOS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "photos")
os.makedirs(PHOTOS_DIR, exist_ok=True)

# Read logins from associates-data.js
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "associates-data.js")

print("Reading associates data...")
with open(DATA_FILE, "r", encoding="utf-8") as f:
    content = f.read()

logins = re.findall(r"login:\s*'([^']+)'", content)
print(f"Found {len(logins)} associates")

# SSL context
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Download photos
success = 0
failed = 0
skipped = 0

for i, login in enumerate(logins, 1):
    filepath = os.path.join(PHOTOS_DIR, f"{login}.jpg")

    # Skip if already downloaded
    if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
        skipped += 1
        continue

    url = f"https://badgephotos.corp.amazon.com/?uid={login}"

    try:
        req = urllib.request.Request(url)
        req.add_header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0")
        req.add_header("Cookie", COOKIE)

        response = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = response.read()
        content_type = response.headers.get("Content-Type", "")

        # Check if we got an image
        if "image" in content_type or data[:3] == b"\xff\xd8\xff" or data[:8] == b"\x89PNG\r\n\x1a\n":
            with open(filepath, "wb") as f:
                f.write(data)
            success += 1
            print(f"  [{i}/{len(logins)}] OK {login} ({len(data)} bytes)")
        else:
            failed += 1
            if i <= 3:
                print(f"  [{i}/{len(logins)}] SKIP {login} (got {content_type}, {len(data)} bytes)")
                if b"Midway" in data:
                    print("    >> Cookie expired! Get a fresh cookie and try again.")
                    break
            else:
                print(f"  [{i}/{len(logins)}] SKIP {login} (no photo available)")
    except Exception as e:
        failed += 1
        print(f"  [{i}/{len(logins)}] ERR {login} ({str(e)[:60]})")

    # Small delay
    time.sleep(0.3)

print()
print(f"Done!")
print(f"  Downloaded: {success}")
print(f"  No photo:   {failed}")
print(f"  Skipped:    {skipped} (already had)")
print(f"  Photos in:  {PHOTOS_DIR}")
