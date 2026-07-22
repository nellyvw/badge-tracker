"""Remove associates under specific contractor managers."""
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

# Managers to remove (case-insensitive matching)
REMOVE_MANAGERS = [
    'alison farquhar',
    'michael finiotis',
    'jo lees',
    'mark mckenna',
    'saad nisar',
    'matthew james van koeverden',
    'haydn whitefield',
]


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
    print("=== Removing Contractor Associates ===\n")

    with open(DATA_FILE, 'r') as f:
        associates = parse_file(f.read())

    print(f"Total before: {len(associates)}")

    removed = []
    to_keep = {}
    for login, assoc in associates.items():
        mgr_lower = assoc['manager_name'].lower()
        should_remove = False
        for rm_mgr in REMOVE_MANAGERS:
            if rm_mgr in mgr_lower:
                should_remove = True
                break
        if should_remove:
            removed.append((login, assoc['full_name'], assoc['manager_name']))
        else:
            to_keep[login] = assoc

    print(f"Removed: {len(removed)}")
    print(f"Remaining: {len(to_keep)}\n")

    # Group removed by manager
    by_mgr = {}
    for login, name, mgr in removed:
        by_mgr.setdefault(mgr, []).append(f"{name} ({login})")

    for mgr in sorted(by_mgr.keys()):
        print(f"  {mgr}: {len(by_mgr[mgr])} removed")

    write_file(to_keep, DATA_FILE)
    print(f"\nDone! File updated with {len(to_keep)} associates.")


if __name__ == '__main__':
    main()
