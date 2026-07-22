import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://badgephotos.corp.amazon.com/?uid=nellyvw"
req = urllib.request.Request(url)
req.add_header("User-Agent", "Mozilla/5.0")

r = urllib.request.urlopen(req, timeout=10, context=ctx)
data = r.read()

print(f"Size: {len(data)} bytes")
print(f"Content-Type: {r.headers.get('Content-Type')}")
print(f"First 200 chars: {data[:200]}")
