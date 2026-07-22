import re

with open('associates-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

checks = ['nellyvw', 'oldaker', 'gidluong', 'saattaie', 'basrezae']
for line in content.split('\n'):
    for login in checks:
        if f"'{login}'" in line and 'login:' in line:
            print(f"\n{login}:")
            # Extract records part
            m = re.search(r'records:\s*(\{.*\})\s*\}', line)
            if m:
                print(f"  records: {m.group(1)}")
