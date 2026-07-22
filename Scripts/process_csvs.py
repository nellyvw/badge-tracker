"""
Badge Tracker Data Update Script (Python)

Reads CSV exports and generates an updated associates-data.js file.

Expected CSV files in same directory:
  - pit-safety.csv
  - yard-safety.csv
  - employee-list.csv

Usage:
  python process_csvs.py
"""

import csv
import os
import re
import json
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PIT_CSV = os.path.join(SCRIPT_DIR, 'pit-safety.csv')
YARD_CSV = os.path.join(SCRIPT_DIR, 'yard-safety.csv')
EMP_CSV = os.path.join(SCRIPT_DIR, 'employee-list.csv')
OUTPUT = os.path.join(SCRIPT_DIR, 'associates-data.js')
EXISTING = os.path.join(SCRIPT_DIR, 'associates-data.js')

# Training ID mapping
PIT_TOPIC_MAP = {
    '01. PIT Safety Overview 101': 10,
    '02. PIT Fall Protection Hazard': 11,
    '03. Electric Pallet Jack (EPJ)': 13,
    '06. Tow Tugger (PTOW)': 12,
    '07. Centre Rider': 18,
    '08. PIT Sit Down Counterbalance (LF)': 15,
    '09. PIT Stand Up Counterbalance (LF)': 16,
    '10. PIT High Reach (LF)': 17,
    '11. PIT Order Picker (LO)': 14,
    '12. PIT Turret Truck': 19,
}

YARD_TOPIC_MAP = {
    '01. Yard Access': 9,
    '02. GTDR': 8,
    '02. TDR': 8,
}

# Duration in days
DURATION = {
    8: 365, 9: 365, 10: 365, 11: 365,
    12: 1095, 13: 1095, 14: 1095, 15: 1095,
    16: 1095, 17: 1095, 18: 1095, 19: 1095,
}

CSV_IDS = set(range(8, 20))
PRESERVED_IDS = set(range(1, 8))


def parse_date(s):
    """Parse various date formats to YYYY-MM-DD."""
    if not s or not s.strip():
        return None
    s = s.strip()
    # YYYY-MM-DD HH:MM:SS
    m = re.match(r'^(\d{4}-\d{2}-\d{2})', s)
    if m:
        return m.group(1)
    # DD/MM/YYYY
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', s)
    if m:
        return f"{m.group(3)}-{m.group(2).zfill(2)}-{m.group(1).zfill(2)}"
    # Try "Mon DD YYYY" or similar
    for fmt in ['%a %b %d %H:%M:%S %Z %Y', '%b %d, %Y', '%d %b %Y']:
        try:
            d = datetime.strptime(s, fmt)
            return d.strftime('%Y-%m-%d')
        except ValueError:
            continue
    # Fallback: extract date from strings like "Wed Jun 25 00:00:00 UTC 2025"
    m = re.match(r'\w+ (\w+) (\d+) .* (\d{4})', s)
    if m:
        try:
            d = datetime.strptime(f"{m.group(1)} {m.group(2)} {m.group(3)}", '%b %d %Y')
            return d.strftime('%Y-%m-%d')
        except ValueError:
            pass
    return None


def subtract_days(date_str, days):
    """Subtract days from a YYYY-MM-DD date string."""
    if not date_str:
        return None
    d = datetime.strptime(date_str, '%Y-%m-%d')
    result = d - timedelta(days=days)
    return result.strftime('%Y-%m-%d')


def format_manager(name):
    """Convert 'Last,First' to 'First Last'."""
    if not name or not name.strip():
        return ''
    name = name.strip()
    if ',' in name:
        parts = [p.strip() for p in name.split(',', 1)]
        if len(parts) == 2:
            return f"{parts[1]} {parts[0]}"
    return name


def parse_existing_data(filepath):
    """Parse existing associates-data.js and return dict of login -> records."""
    existing = {}
    if not os.path.exists(filepath):
        return existing
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        # Extract records using regex - find each associate entry
        pattern = r"\{\s*login:\s*'([^']+)'.*?records:\s*(\{[^}]*(?:\{[^}]*\}[^}]*)*\})"
        for match in re.finditer(pattern, content):
            login = match.group(1)
            records_str = match.group(2)
            # Parse individual records
            records = {}
            rec_pattern = r'(\d+):\s*\{\s*completed:\s*\'([^\']*)\',\s*expiry:\s*\'([^\']*)\',\s*trainer:\s*\'([^\']*)\'\s*\}'
            for rec_match in re.finditer(rec_pattern, records_str):
                tid = int(rec_match.group(1))
                records[tid] = {
                    'completed': rec_match.group(2),
                    'expiry': rec_match.group(3),
                    'trainer': rec_match.group(4),
                }
            existing[login] = records
    except Exception as e:
        print(f"Warning: Could not parse existing data: {e}")
    return existing


def read_csv(filepath):
    """Read CSV file with BOM handling."""
    rows = []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def main():
    print("=== Badge Tracker Data Update ===\n")

    # Check files
    missing = []
    if not os.path.exists(PIT_CSV):
        missing.append('pit-safety.csv')
    if not os.path.exists(YARD_CSV):
        missing.append('yard-safety.csv')
    if not os.path.exists(EMP_CSV):
        missing.append('employee-list.csv')

    if missing:
        print(f"ERROR: Missing files: {', '.join(missing)}")
        print(f"Place them in: {SCRIPT_DIR}")
        return

    # Load existing records (for preserving IDs 1-7)
    existing = parse_existing_data(EXISTING)
    print(f"Loaded {len(existing)} existing associate records.")

    # Parse employee list
    emp_rows = read_csv(EMP_CSV)
    print(f"Employee List: {len(emp_rows)} rows")

    # Build associate roster
    associates = {}
    for emp in emp_rows:
        login = (emp.get('User ID') or '').strip().lower()
        if not login:
            continue
        full_name = (emp.get('Employee Name') or '').strip()
        # Remove surrounding quotes from name if present
        if full_name.startswith('"') and full_name.endswith('"'):
            full_name = full_name[1:-1]
        start_date = parse_date(emp.get('Employment Start Date') or '')
        manager = format_manager(emp.get('Manager Name') or '')
        temp_agency = (emp.get('Temp Agency Code') or '').strip()
        emp_type = '3PTY' if temp_agency else 'AMZN'

        associates[login] = {
            'login': login,
            'full_name': full_name,
            'start_date': start_date or '',
            'employment_type': emp_type,
            'manager_name': manager,
            'records': {},
        }

    print(f"Active employees in roster: {len(associates)}")

    # Preserve IDs 1-7 from existing data
    preserved = 0
    for login, assoc in associates.items():
        if login in existing:
            for tid, rec in existing[login].items():
                if tid in PRESERVED_IDS:
                    assoc['records'][tid] = rec
                    preserved += 1
    print(f"Preserved {preserved} existing records (IDs 1-7).")

    # Process PIT Safety CSV
    pit_rows = read_csv(PIT_CSV)
    print(f"\nPIT Safety CSV: {len(pit_rows)} rows")
    pit_count = 0

    for row in pit_rows:
        if (row.get('Compliant Yes/No') or '').strip() != 'Yes':
            continue
        topic = (row.get('Topic') or '').strip()
        login = (row.get('Emp Login') or '').strip().lower()
        if not login or not topic:
            continue

        # Match topic to training ID
        tid = None
        for prefix, t_id in PIT_TOPIC_MAP.items():
            if topic == prefix or topic.startswith(prefix):
                tid = t_id
                break
        if tid is None:
            continue

        # Get expiry
        expiry = parse_date(row.get('Theory Expiry Date') or '')
        if not expiry:
            continue

        # Calculate completed
        completed = subtract_days(expiry, DURATION[tid])
        if not completed:
            continue

        # Add to associate (create if not in roster)
        if login not in associates:
            full_name = (row.get('Full Name') or '').strip()
            associates[login] = {
                'login': login,
                'full_name': full_name,
                'start_date': parse_date(row.get('Last Hire Date') or '') or '',
                'employment_type': '3PTY' if 'Temp' in (row.get('Regular / Temp') or '') else 'AMZN',
                'manager_name': '',
                'records': {},
            }
            # Preserve IDs 1-7
            if login in existing:
                for t, r in existing[login].items():
                    if t in PRESERVED_IDS:
                        associates[login]['records'][t] = r

        associates[login]['records'][tid] = {
            'completed': completed,
            'expiry': expiry,
            'trainer': 'AVV2 Safety',
        }
        pit_count += 1

    print(f"  Added {pit_count} PIT training records.")

    # Process Yard Safety CSV
    yard_rows = read_csv(YARD_CSV)
    print(f"\nYard Safety CSV: {len(yard_rows)} rows")
    yard_count = 0

    for row in yard_rows:
        if (row.get('Compliant Yes/No') or '').strip() != 'Yes':
            continue
        topic = (row.get('Topic') or '').strip()
        login = (row.get('Emp Login') or '').strip().lower()
        if not login or not topic:
            continue

        # Match topic
        tid = None
        for prefix, t_id in YARD_TOPIC_MAP.items():
            if topic == prefix or topic.startswith(prefix):
                tid = t_id
                break
        if tid is None:
            continue

        # Get expiry based on topic
        if tid == 9:  # Yard Access
            expiry = parse_date(row.get('Expiry Date') or '')
        elif tid == 8:  # TDR/GTDR
            expiry = parse_date(row.get('Theory Expiry Date') or '')
        else:
            continue

        if not expiry:
            continue

        completed = subtract_days(expiry, DURATION[tid])
        if not completed:
            continue

        if login not in associates:
            full_name = (row.get('Full Name') or '').strip()
            associates[login] = {
                'login': login,
                'full_name': full_name,
                'start_date': parse_date(row.get('Last Hire Date') or '') or '',
                'employment_type': '3PTY' if 'Temp' in (row.get('Regular / Temp') or '') else 'AMZN',
                'manager_name': '',
                'records': {},
            }
            if login in existing:
                for t, r in existing[login].items():
                    if t in PRESERVED_IDS:
                        associates[login]['records'][t] = r

        associates[login]['records'][tid] = {
            'completed': completed,
            'expiry': expiry,
            'trainer': 'AVV2 Safety',
        }
        yard_count += 1

    print(f"  Added {yard_count} Yard training records.")

    # Generate output
    print("\nGenerating associates-data.js...")
    assoc_list = sorted(associates.values(), key=lambda a: a['login'])

    lines = ['const ASSOCIATES_DATA = [']
    for assoc in assoc_list:
        # Sort records by ID
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

    with open(OUTPUT, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    total_records = sum(len(a['records']) for a in assoc_list)
    with_records = sum(1 for a in assoc_list if a['records'])
    print(f"\nDone! Written to: {OUTPUT}")
    print(f"  Total associates: {len(assoc_list)}")
    print(f"  Associates with records: {with_records}")
    print(f"  Total training records: {total_records}")


if __name__ == '__main__':
    main()
