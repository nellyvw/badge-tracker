"""
Add Learning Team (Mallackay) PIT certifications.
These are manually maintained and should NOT be overwritten by CSV updates.
"""
import re
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

# Training durations for calculating expiry
# Annual = 365 days, 3-Year = 1095 days
DURATIONS = {
    10: 365,   # PIT 101
    11: 365,   # Fall Protection
    12: 1095,  # Tugger (PTOW)
    13: 1095,  # EPJ
    14: 1095,  # Order Picker (LO)
    15: 1095,  # Sit Down (LF)
    16: 1095,  # Stand Up (LF)
    17: 1095,  # High Reach (LF)
    18: 1095,  # Centre Rider
    19: 1095,  # Turret Truck
}

# Learning Team data - completed dates (DD/MM/YYYY)
# Empty string means no cert for that person
TEAM_DATA = {
    # PIT 101 (ID 10)
    10: {
        'nellyvw': '21/06/2026',
        'edwarfif': '27/01/2026',
        'camortim': '30/04/2026',
        'gidluong': '16/06/2026',
        'naduw': '04/07/2025',
        'bhattilw': '16/03/2026',
    },
    # Fall Protection (ID 11) - all have same date as PIT 101 (earned together)
    11: {
        'nellyvw': '21/06/2026',
        'edwarfif': '27/01/2026',
        'camortim': '30/04/2026',
        'gidluong': '16/06/2026',
        'naduw': '04/07/2025',
        'bhattilw': '16/03/2026',
    },
    # Tugger PTOW (ID 12)
    12: {
        'nellyvw': '',
        'edwarfif': '',
        'camortim': '',
        'gidluong': '13/07/2025',
        'naduw': '',
        'bhattilw': '03/01/2025',
    },
    # EPJ (ID 13)
    13: {
        'nellyvw': '14/06/2025',
        'edwarfif': '14/06/2025',
        'camortim': '',
        'gidluong': '',
        'naduw': '',
        'bhattilw': '',
    },
    # Order Picker LO (ID 14)
    14: {
        'nellyvw': '26/06/2025',
        'edwarfif': '',
        'camortim': '08/07/2025',
        'gidluong': '07/12/2025',
        'naduw': '27/08/2025',
        'bhattilw': '29/09/2025',
    },
    # Sit Down LF (ID 15)
    15: {
        'nellyvw': '06/06/2025',
        'edwarfif': '',
        'camortim': '22/12/2025',
        'gidluong': '',
        'naduw': '',
        'bhattilw': '',
    },
    # Stand Up LF (ID 16)
    16: {
        'nellyvw': '06/06/2025',
        'edwarfif': '30/06/2026',
        'camortim': '',
        'gidluong': '',
        'naduw': '',
        'bhattilw': '',
    },
    # High Reach LF (ID 17)
    17: {
        'nellyvw': '06/06/2025',
        'edwarfif': '',
        'camortim': '30/06/2026',
        'gidluong': '09/11/2025',
        'naduw': '',
        'bhattilw': '',
    },
    # Centre Rider (ID 18)
    18: {
        'nellyvw': '26/06/2025',
        'edwarfif': '',
        'camortim': '',
        'gidluong': '29/07/2025',
        'naduw': '27/08/2025',
        'bhattilw': '',
    },
    # Turret Truck (ID 19)
    19: {
        'nellyvw': '26/06/2025',
        'edwarfif': '',
        'camortim': '15/07/2025',
        'gidluong': '07/07/2025',
        'naduw': '05/02/2026',
        'bhattilw': '',
    },
}


def parse_date(s):
    """Parse DD/MM/YYYY to YYYY-MM-DD."""
    if not s:
        return None
    parts = s.strip().split('/')
    if len(parts) == 3:
        return f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
    return None


def add_days(date_str, days):
    """Add days to YYYY-MM-DD and return YYYY-MM-DD."""
    d = datetime.strptime(date_str, '%Y-%m-%d')
    return (d + timedelta(days=days)).strftime('%Y-%m-%d')


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
    print("=== Adding Learning Team PIT Certifications ===\n")

    with open(DATA_FILE, 'r') as f:
        associates = parse_file(f.read())

    added = 0
    for tid, people in TEAM_DATA.items():
        duration = DURATIONS[tid]
        for login, completed_str in people.items():
            if not completed_str:
                continue
            completed = parse_date(completed_str)
            if not completed:
                print(f"  WARNING: Could not parse date '{completed_str}' for {login} ID {tid}")
                continue
            expiry = add_days(completed, duration)

            if login not in associates:
                print(f"  WARNING: {login} not found in data file!")
                continue

            associates[login]['records'][tid] = {
                'completed': completed,
                'expiry': expiry,
                'trainer': 'AVV2 Safety',
            }
            added += 1

    print(f"Added/updated {added} records.\n")

    # Show final state for team
    team_logins = ['nellyvw', 'edwarfif', 'camortim', 'gidluong', 'naduw', 'bhattilw']
    NAMES = {
        10: 'PIT 101', 11: 'Fall Protection', 12: 'Tugger', 13: 'EPJ',
        14: 'Order Picker', 15: 'Sit Down', 16: 'Stand Up',
        17: 'High Reach', 18: 'Centre Rider', 19: 'Turret Truck',
    }
    for login in team_logins:
        assoc = associates.get(login)
        if not assoc:
            continue
        print(f"{login} ({assoc['full_name']}):")
        for tid in sorted(assoc['records'].keys()):
            rec = assoc['records'][tid]
            name = NAMES.get(tid, f'ID {tid}')
            print(f"  {name:18s}: completed={rec['completed']}, expiry={rec['expiry']}")
        print()

    write_file(associates, DATA_FILE)
    print("File updated successfully.")


if __name__ == '__main__':
    main()
