"""
Fix: Restore records for associates under Mallackay that were lost during the update.
Reads the old data from git, finds all Mallackay associates, and merges their old
records back into the current file (preserving any new records from the CSVs).
"""
import re
import subprocess
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, 'associates-data.js')

# Regex to match an associate entry
ENTRY_PATTERN = re.compile(
    r"login: '([^']+)', full_name: '([^']+)', start_date: '([^']*)', "
    r"employment_type: '([^']+)', manager_name: '([^']*)', "
    r"records: \{(.*?)\} \}"
)

RECORD_PATTERN = re.compile(
    r"(\d+): \{ completed: '([^']*)', expiry: '([^']*)', trainer: '([^']*)' \}"
)


def parse_records(records_str):
    """Parse records string into dict of id -> {completed, expiry, trainer}."""
    records = {}
    for m in RECORD_PATTERN.finditer(records_str):
        tid = int(m.group(1))
        records[tid] = {
            'completed': m.group(2),
            'expiry': m.group(3),
            'trainer': m.group(4),
        }
    return records


def parse_associates(content):
    """Parse all associates from file content into dict of login -> data."""
    associates = {}
    for m in ENTRY_PATTERN.finditer(content):
        login = m.group(1)
        associates[login] = {
            'login': login,
            'full_name': m.group(2),
            'start_date': m.group(3),
            'employment_type': m.group(4),
            'manager_name': m.group(5),
            'records': parse_records(m.group(6)),
        }
    return associates


def format_associate(assoc):
    """Format an associate back into JS object string."""
    sorted_recs = dict(sorted(assoc['records'].items(), key=lambda x: x[0]))
    rec_parts = []
    for tid, rec in sorted_recs.items():
        rec_parts.append(
            f"{tid}: {{ completed: '{rec['completed']}', expiry: '{rec['expiry']}', trainer: '{rec['trainer']}' }}"
        )
    records_str = '{ ' + ', '.join(rec_parts) + ' }'
    name = assoc['full_name'].replace("'", "\\'")
    mgr = assoc['manager_name'].replace("'", "\\'")
    return (
        f"  {{ login: '{assoc['login']}', full_name: '{name}', "
        f"start_date: '{assoc['start_date']}', employment_type: '{assoc['employment_type']}', "
        f"manager_name: '{mgr}', records: {records_str} }},"
    )


def main():
    print("=== Restoring Mallackay Team Records ===\n")

    # Get old data from git
    result = subprocess.run(
        ['git', '-C', SCRIPT_DIR, 'show', 'HEAD:associates-data.js'],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"ERROR: Could not get old data from git: {result.stderr}")
        return

    old_content = result.stdout
    old_associates = parse_associates(old_content)
    print(f"Old data: {len(old_associates)} associates")

    # Read current data
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        new_content = f.read()
    new_associates = parse_associates(new_content)
    print(f"Current data: {len(new_associates)} associates")

    # Find Mallackay team in old data
    mallackay_logins = set()
    for login, assoc in old_associates.items():
        mgr = assoc['manager_name'].lower()
        if 'mallackay' in mgr or 'howlett' in mgr:
            mallackay_logins.add(login)

    print(f"\nMallackay team members in old data: {len(mallackay_logins)}")

    # Restore/merge records
    restored_count = 0
    added_associates = 0

    for login in mallackay_logins:
        old_assoc = old_associates[login]
        old_records = old_assoc['records']

        if not old_records:
            continue

        if login in new_associates:
            # Merge: add any old records that are missing in new data
            new_assoc = new_associates[login]
            for tid, rec in old_records.items():
                if tid not in new_assoc['records']:
                    new_assoc['records'][tid] = rec
                    restored_count += 1
                    print(f"  Restored ID {tid} for {login} ({old_assoc['full_name']})")
        else:
            # Associate not in new data at all - add them back entirely
            new_associates[login] = old_assoc
            added_associates += 1
            restored_count += len(old_records)
            print(f"  Added back {login} ({old_assoc['full_name']}) with {len(old_records)} records")

    print(f"\nRestored {restored_count} records, added back {added_associates} associates")

    # Write updated file
    assoc_list = sorted(new_associates.values(), key=lambda a: a['login'])

    lines = ['const ASSOCIATES_DATA = [']
    for assoc in assoc_list:
        lines.append(format_associate(assoc))
    lines.append('];')

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    total_records = sum(len(a['records']) for a in assoc_list)
    print(f"\nDone! Updated {DATA_FILE}")
    print(f"  Total associates: {len(assoc_list)}")
    print(f"  Total training records: {total_records}")


if __name__ == '__main__':
    main()
