"""Restore ALL missing Mallackay team records from old git data."""
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
    # Get old data from git
    result = subprocess.run(
        ['git', '-C', SCRIPT_DIR, 'show', 'HEAD:associates-data.js'],
        capture_output=True, text=True
    )
    old = parse_file(result.stdout)

    # Read current
    with open(DATA_FILE, 'r') as f:
        new = parse_file(f.read())

    # Find Mallackay team in old data and restore ALL their old records
    mallackay_logins = set()
    for login, assoc in old.items():
        mgr = assoc['manager_name'].lower()
        if 'mallackay' in mgr or 'howlett' in mgr:
            mallackay_logins.add(login)

    print(f"Mallackay team: {mallackay_logins}\n")

    restored = 0
    for login in mallackay_logins:
        old_assoc = old[login]
        if login in new:
            for tid, rec in old_assoc['records'].items():
                if tid not in new[login]['records']:
                    new[login]['records'][tid] = rec
                    restored += 1
                    print(f"  Restored ID {tid} for {login}")
        else:
            new[login] = old_assoc
            restored += len(old_assoc['records'])
            print(f"  Added back {login} with all records")

    print(f"\nRestored {restored} records total.")

    # Write
    write_file(new, DATA_FILE)
    print("File updated.")


if __name__ == '__main__':
    main()
