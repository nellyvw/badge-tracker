"""
Fix missing annual certs for Learning Team.
Re-reads Yard CSV and git history to restore Yard, TDR, VRC, Vacuum Lift.
"""
import re
import csv
import subprocess
import os
from datetime import datetime, timedelta

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


def parse_date(s):
    if not s or not s.strip():
        return None
    s = s.strip()
    m = re.match(r'^(\d{4}-\d{2}-\d{2})', s)
    if m:
        return m.group(1)
    return None


def subtract_days(date_str, days):
    d = datetime.strptime(date_str, '%Y-%m-%d')
    return (d - timedelta(days=days)).strftime('%Y-%m-%d')


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
            'start_date': m.group(3),
            'employment_type': m.group(4),
            'manager_name': m.group(5),
            'records': records,
        }
    return associates


def write_file(associates, filepath):
    assoc_list = sorted(associates.values(), key=lambda a: a['login'])
    lines = ['const ASSOCIATES_DATA = [']
    for assoc in assoc_list:
        sorted_recs = dict(sorted(assoc['records'].items(), key=lambda x: x[0]))
        rec_parts = []
        for tid, rec in sorted_recs.items():
            rec_parts.append(
                f"{tid}: {{ completed: '{rec['completed']}', expiry: '{rec['expiry']}', trainer: '{rec['trainer']}' }}"
            )
        records_str = '{ ' + ', '.join(rec_parts) + ' }'
        name = assoc['full_name'].replace("'", "\\'")
        mgr = assoc['manager_name'].replace("'", "\\'")
        lines.append(
            f"  {{ login: '{assoc['login']}', full_name: '{name}', "
            f"start_date: '{assoc['start_date']}', employment_type: '{assoc['employment_type']}', "
            f"manager_name: '{mgr}', records: {records_str} }},"
        )
    lines.append('];')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')


def main():
    print("=== Fixing Annual Certs for Learning Team ===\n")

    # Load current data
    with open(DATA_FILE, 'r') as f:
        associates = parse_file(f.read())

    # 1. Restore from git history (VRC, Vacuum Lift, Yard, TDR that were there before)
    result = subprocess.run(
        ['git', '-C', SCRIPT_DIR, 'show', 'HEAD:associates-data.js'],
        capture_output=True, text=True
    )
    old = parse_file(result.stdout)

    print("Restoring from git history...")
    for login in TEAM:
        if login in old:
            old_recs = old[login]['records']
            for tid in [6, 7, 8, 9]:  # Vacuum Lift, VRC, TDR, Yard
                if tid in old_recs and tid not in associates.get(login, {}).get('records', {}):
                    if login in associates:
                        associates[login]['records'][tid] = old_recs[tid]
                        print(f"  {login}: restored ID {tid} from git")

    # 2. Also check the Yard CSV for team members (may have newer data than git)
    yard_csv = os.path.join(SCRIPT_DIR, 'yard-safety.csv')
    if os.path.exists(yard_csv):
        print("\nChecking Yard CSV for team data...")
        with open(yard_csv, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                login = (row.get('Emp Login') or '').strip().lower()
                if login not in TEAM:
                    continue
                if (row.get('Compliant Yes/No') or '').strip() != 'Yes':
                    continue
                topic = (row.get('Topic') or '').strip()

                if topic == '01. Yard Access':
                    expiry = parse_date(row.get('Expiry Date') or '')
                    if expiry:
                        completed = subtract_days(expiry, 365)
                        if login in associates:
                            associates[login]['records'][9] = {
                                'completed': completed,
                                'expiry': expiry,
                                'trainer': 'AVV2 Safety',
                            }
                            print(f"  {login}: Yard from CSV, expiry={expiry}")

                elif topic in ('02. GTDR', '02. TDR'):
                    expiry = parse_date(row.get('Theory Expiry Date') or '')
                    if expiry:
                        completed = subtract_days(expiry, 365)
                        if login in associates:
                            associates[login]['records'][8] = {
                                'completed': completed,
                                'expiry': expiry,
                                'trainer': 'AVV2 Safety',
                            }
                            print(f"  {login}: TDR from CSV, expiry={expiry}")
    else:
        print("\nNo yard-safety.csv found, using git data only.")

    # Print final state
    print("\n=== Final Annual Certs ===\n")
    NAMES = {2: 'Auto Slam', 3: 'Destuff-IT', 4: 'Jam Clear', 6: 'Vacuum Lift',
             7: 'VRC', 8: 'TDR/GTDR', 9: 'Yard', 10: 'PIT 101', 11: 'Fall Prot'}
    for login in TEAM:
        assoc = associates.get(login)
        if not assoc:
            continue
        print(f"{login} ({assoc['full_name']}):")
        for tid in sorted(NAMES.keys()):
            if tid in assoc['records']:
                rec = assoc['records'][tid]
                print(f"  {NAMES[tid]:12s}: expiry={rec['expiry']}")
            else:
                print(f"  {NAMES[tid]:12s}: --")
        print()

    write_file(associates, DATA_FILE)
    print("File updated.")


if __name__ == '__main__':
    main()
