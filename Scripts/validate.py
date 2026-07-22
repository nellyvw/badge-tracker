import re

with open('associates-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Check basic structure
assert content.startswith('const ASSOCIATES_DATA = ['), "File should start with const ASSOCIATES_DATA = ["
assert content.strip().endswith('];'), "File should end with ];"

# Count opening/closing braces and brackets
open_braces = content.count('{')
close_braces = content.count('}')
open_brackets = content.count('[')
close_brackets = content.count(']')

print(f"Open braces: {open_braces}, Close braces: {close_braces}")
print(f"Open brackets: {open_brackets}, Close brackets: {close_brackets}")

assert open_braces == close_braces, f"Brace mismatch: {open_braces} open vs {close_braces} close"
assert open_brackets == close_brackets, f"Bracket mismatch: {open_brackets} open vs {close_brackets} close"

# Count lines with 'login:'
logins = re.findall(r"login:\s*'([^']+)'", content)
print(f"Total associates: {len(logins)}")
print(f"Total lines: {len(content.split(chr(10)))}")

# Check for 'pierkif' which is NOT in the file (should be 'pierakif')
if 'pierkif' in [l for l in logins]:
    print("WARNING: pierkif found as a login")
else:
    print("Note: pierkif is NOT a login in the file (pierakif is)")

# Check that pierakif has the right data
for line in content.split('\n'):
    if "'pierakif'" in line and 'login:' in line:
        print(f"\npierakif line check: has training 4? {'4:' in line}")
        break

print("\nValidation passed!")
