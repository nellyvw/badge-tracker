"""Check annual certs (IDs 7-11) for all learning trainers."""
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, 'associates-data.js')

ENTRY_RE = re.compile(
    r"login: '([^']+)', full_name: '([^']+)', start_date: '([^']*)', "
    r"employment_type: '([^']+)', manager_name: '([^']*)', "
    r"records: \{(.*?)\} \}"
)
RECORD_RE = re.compile(
    r"(\d+): \{ completed: '([^']*)', expiry: '([^']*)', trainer: '([^']*)' \}"
)

TEAM = ['nellyvw', 'edwarfif', 'camortim', 'gidluong', 'naduw', 'bhattilw']
ANNUAL_NAMES = {
    2: 'Auto Slam', 3: 'Destuff-IT', 4: 'Jam Clear',
    6: 'Vacuum Lift', 7: 'VRC', 8: 'TDR/GTDR', 9: 'Yard',
    10: 'PIT 101', 11: 'Fall Prot',
}

with open(DATA_FILE, 'r') as f:
    content = f.read()

for m in ENTRY_RE.finditer(content):
    login = m.group(1)
    if login not in TEAM:
        continue
    name = m.group(2)
    records = {}
    for rm in RECORD_RE.finditer(m.group(6)):
        records[int(rm.group(1))] = (rm.group(2), rm.group(3))

    print(f"--- {login} ({name}) ---")
    for tid in sorted(ANNUAL_NAMES.keys()):
        label = ANNUAL_NAMES[tid]
        if tid in records:
            c, e = records[tid]
            print(f"  {label:12s} (ID {tid:2d}): completed={c}, expiry={e}")
        else:
            print(f"  {label:12s} (ID {tid:2d}): MISSING")
    print()
