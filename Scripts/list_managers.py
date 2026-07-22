import re
f = open(r'c:\Users\nellyvw\Documents\Kora\Badge Tracker\training-tracker\preview\associates-data.js', 'r')
content = f.read()
f.close()
managers = set(re.findall(r"manager_name: '([^']*)'", content))
targets = ['farquhar','finiotis','lees','mckenna','nisar','van koeverden','whitefield']
print("All managers matching targets:")
for m in sorted(managers):
    if any(t in m.lower() for t in targets):
        print(f"  '{m}'")
print(f"\nTotal unique managers: {len(managers)}")
