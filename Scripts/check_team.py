"""Check Mallackay team records in old vs new data."""
import re
import subprocess
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

TRAINING_NAMES = {
    1: 'Auto Pallet Wrapper', 2: 'Auto Slam', 3: 'Destuff-IT', 4: 'Jam Clear',
    5: 'Robotic Pallet Wrapper', 6: 'Vacuum Lift', 7: 'VRC', 8: 'TDR/GTDR',
    9: 'Yard', 10: 'PIT 101', 11: 'Fall Protection', 12: 'Tugger (PTOW)',
    13: 'EPJ', 14: 'Order Picker (LO)', 15: 'Sit Down (LF)',
    16: 'Stand Up (LF)', 17: 'High Reach (LF)', 18: 'Centre Rider',
    19: 'Turret Truck',
}


def parse_file(content):
    associates = {}
    for m in ENTRY_RE.finditer(content):
        login = m.group(1)
        records = {}
        for rm in RECORD_RE.finditer(m.group(6)):
            records[int(rm.group(1))] = {
                'completed': rm.group(2),
                'expiry': rm.group(3),
                'trainer': rm.group(4),
            }
        associates[login] = {
            'login': login,
            'full_name': m.group(2),
            'manager_name': m.group(5),
            'records': records,
        }
    return associates


def main():
    # Get old data
    result = subprocess.run(
        ['git', '-C', SCRIPT_DIR, 'show', 'HEAD:associates-data.js'],
        capture_output=True, text=True
    )
    old = parse_file(result.stdout)

    # Get current data
    with open(DATA_FILE, 'r') as f:
        new = parse_file(f.read())

    # Find Mallackay team in old data
    print("=== MALLACKAY TEAM - OLD vs CURRENT ===\n")

    for login, assoc in sorted(old.items()):
        mgr = assoc['manager_name'].lower()
        if 'mallackay' not in mgr and 'howlett' not in mgr:
            continue

        print(f"--- {assoc['full_name']} ({login}) ---")
        old_recs = assoc['records']
        new_recs = new.get(login, {}).get('records', {})

        all_ids = sorted(set(list(old_recs.keys()) + list(new_recs.keys())))
        for tid in all_ids:
            name = TRAINING_NAMES.get(tid, f'Unknown({tid})')
            in_old = tid in old_recs
            in_new = tid in new_recs
            if in_old and in_new:
                status = "OK"
            elif in_old and not in_new:
                status = "MISSING <---"
            else:
                status = "NEW"
            exp = old_recs[tid]['expiry'] if in_old else new_recs[tid]['expiry']
            print(f"  ID {tid:2d} ({name:22s}): expiry={exp}  [{status}]")
        print()


if __name__ == '__main__':
    main()
