"""
Badge Tracker - CSV Compliance Update Script

Reads Yard Safety and PIT Safety compliance CSVs and updates associates-data.js.

Expected CSV files in same directory:
  - yard_safety.csv   (Yard Safety compliance export)
  - pit_safety.csv    (PIT Safety compliance export)

Rules:
  - Protected associates (Learning Team) are NEVER modified
  - Associates under excluded managers (contractors) are NEVER added
  - Only "Compliant Yes/No" = "Yes" records are processed
  - Training IDs 1-7 are always preserved (not in CSVs)
  - Yard Safety CSV -> IDs 8 (TDR/GTDR) and 9 (Yard Access)
  - PIT Safety CSV -> IDs 10-19

Usage:
  python process_new_csvs.py
"""

import csv
import os
import re
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
YARD_CSV = os.path.join(SCRIPT_DIR, 'yard_safety.csv')
PIT_CSV = os.path.join(SCRIPT_DIR, 'pit_safety.csv')
DATA_FILE = os.path.join(SCRIPT_DIR, 'associates-data.js')

# === PROTECTED ASSOCIATES (Learning Team under Mallackay Howlett) ===
# These logins must NEVER have their records overwritten or removed.
PROTECTED_LOGINS = {'nellyvw', 'edwarfif', 'camortim', 'gidluong', 'naduw', 'bhattilw'}

# === EXCLUDED MANAGER SUPERVISOR LOGINS ===
# Associates under these supervisors are NEVER added to the website.
EXCLUDED_SUPERVISOR_LOGINS = {'finiotm', 'saadnisa', 'jchanau'}

# === TRAINING ID MAPPINGS ===
YARD_TOPIC_MAP = {
    '01. Yard Access': 9,
    '02. GTDR': 8,
    '02. TDR': 8,
}

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

# === DURATION (for calculating completed = expiry - duration) ===
# Annual certs (IDs 8-11): 365 days
# 3-Year certs (IDs 12-19): 1095 days (3 * 365)
DURATION_DAYS = {
    8: 365, 9: 365, 10: 365, 11: 365,
    12: 1095, 13: 1095, 14: 1095, 15: 1095,
    16: 1095, 17: 1095, 18: 1095, 19: 1095,
}

# IDs that come from CSVs vs IDs that are always preserved
CSV_IDS = set(range(8, 20))
PRESERVED_IDS = set(range(1, 8))

# === REGEX for parsing associates-data.js ===
# Match each associate entry line. The records block includes nested braces.
ENTRY_RE = re.compile(
    r"login: '([^']+)', full_name: '([^']+)', start_date: '([^']*)', "
    r"employment_type: '([^']+)', manager_name: '([^']*)', "
    r"records: \{(.*?)\} \},"
)
RECORD_RE = re.compile(
    r"(\d+): \{ completed: '([^']*)', expiry: '([^']*)', trainer: '([^']*)' \}"
)


def parse_date(s):
    """Parse various date formats to YYYY-MM-DD string."""
    if not s or not s.strip():
        return None
    s = s.strip()
    # Already YYYY-MM-DD (possibly with time)
    m = re.match(r'^(\d{4}-\d{2}-\d{2})', s)
    if m:
        return m.group(1)
    # DD/MM/YYYY
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', s)
    if m:
        return f"{m.group(3)}-{m.group(2).zfill(2)}-{m.group(1).zfill(2)}"
    # "Wed Jun 25 00:00:00 UTC 2025" style
    m = re.match(r'\w+\s+(\w+)\s+(\d+)\s+[\d:]+\s+\w+\s+(\d{4})', s)
    if m:
        try:
            d = datetime.strptime(f"{m.group(1)} {m.group(2)} {m.group(3)}", '%b %d %Y')
            return d.strftime('%Y-%m-%d')
        except ValueError:
            pass
    # Try common formats
    for fmt in ['%d/%m/%Y', '%m/%d/%Y', '%b %d, %Y', '%d %b %Y']:
        try:
            d = datetime.strptime(s, fmt)
            return d.strftime('%Y-%m-%d')
        except ValueError:
            continue
    return None


def subtract_days(date_str, days):
    """Subtract days from YYYY-MM-DD date string, return YYYY-MM-DD."""
    if not date_str:
        return None
    d = datetime.strptime(date_str, '%Y-%m-%d')
    result = d - timedelta(days=days)
    return result.strftime('%Y-%m-%d')


def parse_associates_file(filepath):
    """Parse associates-data.js into a dict of login -> associate data."""
    associates = {}
    if not os.path.exists(filepath):
        print(f"WARNING: {filepath} not found!")
        return associates

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

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


def write_associates_file(associates, filepath):
    """Write associates dict back to associates-data.js format."""
    assoc_list = sorted(associates.values(), key=lambda a: a['login'])
    lines = ['const ASSOCIATES_DATA = [']

    for assoc in assoc_list:
        sorted_recs = dict(sorted(assoc['records'].items(), key=lambda x: x[0]))
        rec_parts = []
        for tid, rec in sorted_recs.items():
            rec_parts.append(
                f"{tid}: {{ completed: '{rec['completed']}', expiry: '{rec['expiry']}', "
                f"trainer: '{rec['trainer']}' }}"
            )
        records_str = '{ ' + ', '.join(rec_parts) + ' }'

        # Escape single quotes in names
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


def read_csv_file(filepath):
    """Read CSV with BOM handling, return list of row dicts."""
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        return list(reader)


def process_yard_safety(csv_rows, associates):
    """
    Process Yard Safety CSV rows and update associates records.
    
    Rules:
    - Topic "01. Yard Access" -> Training ID 9, uses "Expiry Date" column
    - Topic "02. GTDR" or "02. TDR" -> Training ID 8, uses "Theory Expiry Date" column
    - Include ALL records that have a date (not just compliant ones)
    - Skip protected logins
    - Skip excluded supervisor logins
    - Duration: 1 year (365 days)
    """
    added = 0
    skipped_protected = 0
    skipped_excluded = 0
    skipped_no_date = 0

    for row in csv_rows:
        login = (row.get('Emp Login') or '').strip().lower()
        if not login:
            continue

        # Skip protected associates
        if login in PROTECTED_LOGINS:
            skipped_protected += 1
            continue

        # Skip excluded supervisor logins
        supervisor_login = (row.get('Supervisor Login') or '').strip().lower()
        if supervisor_login in EXCLUDED_SUPERVISOR_LOGINS:
            skipped_excluded += 1
            continue

        topic = (row.get('Topic') or '').strip()

        # Map topic to training ID
        tid = None
        for topic_key, t_id in YARD_TOPIC_MAP.items():
            if topic == topic_key or topic.startswith(topic_key):
                tid = t_id
                break
        if tid is None:
            continue

        # Get expiry date:
        # - Yard Access (ID 9): use "Expiry Date" column
        # - TDR/GTDR (ID 8): use "Theory Expiry Date" column
        if tid == 9:
            expiry = parse_date(row.get('Expiry Date') or '')
        else:
            expiry = parse_date(row.get('Theory Expiry Date') or '')

        if not expiry:
            skipped_no_date += 1
            continue

        # Calculate completed date (expiry - 1 year)
        completed = subtract_days(expiry, DURATION_DAYS[tid])
        if not completed:
            continue

        # Only update if the associate exists in the data file
        if login not in associates:
            continue

        # Only update if this is newer than existing
        existing = associates[login]['records'].get(tid)
        if existing and existing['expiry'] >= expiry:
            continue

        associates[login]['records'][tid] = {
            'completed': completed,
            'expiry': expiry,
            'trainer': 'AVV2 Safety',
        }
        added += 1

    print(f"  Yard Safety results:")
    print(f"    Records added/updated: {added}")
    print(f"    Skipped (no date): {skipped_no_date}")
    print(f"    Skipped (protected login): {skipped_protected}")
    print(f"    Skipped (excluded manager): {skipped_excluded}")
    return added


def process_pit_safety(csv_rows, associates):
    """
    Process PIT Safety CSV rows and update associates records.
    
    Rules:
    - Maps topics to Training IDs 10-19
    - Uses "Theory Expiry Date" for ALL IDs (regardless of NOBA/compliance status)
    - Include ALL records that have a Theory Expiry Date (not just compliant ones)
    - Duration: IDs 10-11 = 1 year, IDs 12-19 = 3 years
    - Skip protected logins
    - Skip excluded supervisor logins
    """
    added = 0
    skipped_protected = 0
    skipped_excluded = 0
    skipped_no_date = 0

    for row in csv_rows:
        login = (row.get('Emp Login') or '').strip().lower()
        if not login:
            continue

        # Skip protected associates
        if login in PROTECTED_LOGINS:
            skipped_protected += 1
            continue

        # Skip excluded supervisor logins
        supervisor_login = (row.get('Supervisor Login') or '').strip().lower()
        if supervisor_login in EXCLUDED_SUPERVISOR_LOGINS:
            skipped_excluded += 1
            continue

        topic = (row.get('Topic') or '').strip()

        # Map topic to training ID
        tid = None
        for topic_key, t_id in PIT_TOPIC_MAP.items():
            if topic == topic_key or topic.startswith(topic_key):
                tid = t_id
                break
        if tid is None:
            continue

        # Use Theory Expiry Date for all PIT certs
        expiry = parse_date(row.get('Theory Expiry Date') or '')

        if not expiry:
            skipped_no_date += 1
            continue

        # Calculate completed date
        completed = subtract_days(expiry, DURATION_DAYS[tid])
        if not completed:
            continue

        # Only update if the associate exists in the data file
        if login not in associates:
            continue

        # Only update if this is newer than existing
        existing = associates[login]['records'].get(tid)
        if existing and existing['expiry'] >= expiry:
            continue

        associates[login]['records'][tid] = {
            'completed': completed,
            'expiry': expiry,
            'trainer': 'AVV2 Safety',
        }
        added += 1

    print(f"  PIT Safety results:")
    print(f"    Records added/updated: {added}")
    print(f"    Skipped (no theory date): {skipped_no_date}")
    print(f"    Skipped (protected login): {skipped_protected}")
    print(f"    Skipped (excluded manager): {skipped_excluded}")
    return added


def main():
    print("=" * 60)
    print("  Badge Tracker - CSV Compliance Update")
    print("=" * 60)
    print()

    # --- Step 1: Load existing associates-data.js ---
    print(f"[1] Loading existing data from: {DATA_FILE}")
    associates = parse_associates_file(DATA_FILE)
    if not associates:
        print("ERROR: No associates found in data file. Aborting.")
        return
    print(f"    Loaded {len(associates)} associates.")
    print()

    # --- Step 2: Preserve all records for protected associates ---
    # Store a copy of protected associates' records before any processing
    protected_snapshots = {}
    for login in PROTECTED_LOGINS:
        if login in associates:
            protected_snapshots[login] = dict(associates[login]['records'])
            print(f"    Protected: {login} ({len(protected_snapshots[login])} records preserved)")
    print()

    # --- Step 3: Clear CSV-managed IDs (8-19) for non-protected associates ---
    # This ensures we start fresh from CSV data for these IDs
    print("[2] Clearing CSV-managed records (IDs 8-19) for non-protected associates...")
    cleared_count = 0
    for login, assoc in associates.items():
        if login in PROTECTED_LOGINS:
            continue  # Never touch protected
        records_to_remove = [tid for tid in assoc['records'] if tid in CSV_IDS]
        for tid in records_to_remove:
            del assoc['records'][tid]
            cleared_count += 1
    print(f"    Cleared {cleared_count} existing CSV records (will re-populate from CSVs).")
    print()

    # --- Step 4: Process Yard Safety CSV ---
    print(f"[3] Processing Yard Safety CSV: {YARD_CSV}")
    yard_rows = read_csv_file(YARD_CSV)
    if yard_rows is None:
        print("    WARNING: yard_safety.csv not found. Skipping Yard Safety processing.")
        print("    (IDs 8-9 will have no records for non-protected associates.)")
    else:
        print(f"    Loaded {len(yard_rows)} rows from CSV.")
        process_yard_safety(yard_rows, associates)
    print()

    # --- Step 5: Process PIT Safety CSV ---
    print(f"[4] Processing PIT Safety CSV: {PIT_CSV}")
    pit_rows = read_csv_file(PIT_CSV)
    if pit_rows is None:
        print("    WARNING: pit_safety.csv not found. Skipping PIT Safety processing.")
        print("    (IDs 10-19 will have no records for non-protected associates.)")
    else:
        print(f"    Loaded {len(pit_rows)} rows from CSV.")
        process_pit_safety(pit_rows, associates)
    print()

    # --- Step 6: Restore protected associates' records ---
    print("[5] Restoring protected associates' records...")
    for login in PROTECTED_LOGINS:
        if login in associates and login in protected_snapshots:
            associates[login]['records'] = protected_snapshots[login]
            print(f"    Restored: {login} ({len(protected_snapshots[login])} records)")
    print()

    # --- Step 7: Write output ---
    print(f"[6] Writing updated file: {DATA_FILE}")
    write_associates_file(associates, DATA_FILE)

    # Summary stats
    total_associates = len(associates)
    with_records = sum(1 for a in associates.values() if a['records'])
    total_records = sum(len(a['records']) for a in associates.values())
    print(f"\n{'=' * 60}")
    print(f"  COMPLETE!")
    print(f"  Total associates: {total_associates}")
    print(f"  Associates with records: {with_records}")
    print(f"  Total training records: {total_records}")
    print(f"{'=' * 60}")


if __name__ == '__main__':
    main()
