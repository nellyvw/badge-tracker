import re
f = open(r'c:\Users\nellyvw\Documents\Kora\Badge Tracker\training-tracker\preview\associates-data.js', 'r')
content = f.read()
f.close()
managers = {}
for m in re.finditer(r"manager_name: '([^']*)'", content):
    mgr = m.group(1)
    managers[mgr] = managers.get(mgr, 0) + 1
print("All managers (count):")
for mgr in sorted(managers.keys()):
    print(f"  {mgr}: {managers[mgr]}")
