"""
Badge Tracker CSV Update Script

Processes 3 CSV files and updates associates-data.js:
1. Course Learning Report - Training IDs 2, 3, 4, 6, 7
2. PIT Safety Compliance - Training IDs 10-19
3. Yard Safety Compliance - Training IDs 8-9

Rules:
- Only UPDATE existing associates (by login match)
- Only update if new expiry > existing expiry (or no existing record)
- Skip protected logins (Learning Team)
- Trainer is always 'AVV2 Safety'
"""

import csv
import os
import re
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

# ============== CONFIGURATION ==============

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ASSOCIATES_FILE = os.path.join(SCRIPT_DIR, 'associates-data.js')

DOWNLOADS = os.path.join(os.path.expanduser('~'), 'Downloads')
COURSE_CSV = os.path.join(DOWNLOADS, 'course-learning-report-2026-07-18_02-47-32.csv')
PIT_CSV = os.path.join(DOWNLOADS, 'PIT_Safety_Complianc_1784306465987.csv')
YARD_CSV = os.path.join(DOWNLOADS, 'Yard_Safety_Complian_1784306414631.csv')

# Protected logins - NEVER modify these
PROTECTED_LOGINS = {'nellyvw', 'edwarfif', 'camortim', 'gidluong', 'naduw', 'bhattilw'}

# Course Learning Report -> Training ID mapping
COURSE_TITLE_MAP = {
    'AUSG_CF_TS Auto SLAM': 2,
    'AUSG_CF_TS Jam Buster': 4,
    'AUSG_CF_TS Vertical Reciprocating Conveyor (VRC)': 7,
    'AUSG_CF_TS Vacuum Lifter': 6,
    'AUSG_ALL_ILT_Destuff_IT': 3,
}

# PIT Safety -> Training ID mapping
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

# Yard Safety -> Training ID mapping
YARD_TOPIC_MAP = {
    '01. Yard Access': 9,
    '02. TDR': 8,
    '02. GTDR': 8,
}

# Annual training IDs (expiry = completed + 1 year)
ANNUAL_IDS = {2, 3, 4, 6, 7, 8, 9, 10, 11}
# 3-year training IDs (expiry = completed + 3 years)
THREE_YEAR_IDS = {12, 13, 14, 15, 16, 17, 18, 19}


# ============== HELPER FUNCTIONS ==============

def parse_date_iso(s):
    """Parse a date string to YYYY-MM-DD format."""
    if not s or not s.strip():
        return None
    s = s.strip()
    # ISO format: 2026-07-18T02:47:32.000Z or 2026-07-18 00:00:00
    m = re.match(r'^(\d{4}-\d{2}-\d{2})', s)
    if m:
        return m.group(1)
    # DD/MM/YYYY
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', s)
    if m:
        return f"{m.group(3)}-{m.group(2).zfill(2)}-{m.group(1).zfill(2)}"
    return None


def add_years(date_str, years):
    """Add years to a YYYY-MM-DD date string."""
    if not date_str:
        return None
    d = datetime.strptime(date_str, '%Y-%m-%d')
    result = d + relativedelta(years=years)
    return result.strftime('%Y-%m-%d')


def subtract_years(date_str, years):
    """Subtract years from a YYYY-MM-DD date string."""
    if not date_str:
        return None
    d = datetime.strptime(date_str, '%Y-%m-%d')
    result = d - relativedelta(years=years)
    return result.strftime('%Y-%m-%d')


def parse_associates_data(filepath):
    """
    Parse associates-data.js and return:
    - list of associate dicts (preserving order and all fields)
    - dict of login -> index for quick lookup
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    associates = []
    login_index = {}

    # Process line by line for more reliable parsing
    for line in content.split('\n'):
        line = line.strip()
        if not line.startswith("{ login:"):
            continue

        # Extract fields using targeted regex
        login_m = re.search(r"login:\s*'([^']*)'", line)
        name_m = re.search(r"full_name:\s*'([^']*)'", line)
        start_m = re.search(r"start_date:\s*'([^']*)'", line)
        emp_m = re.search(r"employment_type:\s*'([^']*)'", line)
        mgr_m = re.search(r"manager_name:\s*'([^']*)'", line)
        shift_m = re.search(r"shift:\s*'([^']*)'", line)

        if not login_m:
            continue

        login = login_m.group(1)
        full_name = name_m.group(1) if name_m else ''
        start_date = start_m.group(1) if start_m else ''
        employment_type = emp_m.group(1) if emp_m else ''
        manager_name = mgr_m.group(1) if mgr_m else ''
        shift = shift_m.group(1) if shift_m else ''

        # Extract the records section - find "records: {" and match all inner records
        records = {}
        rec_pattern = re.compile(
            r'(\d+):\s*\{\s*completed:\s*\'([^\']*)\'\s*,\s*expiry:\s*\'([^\']*)\'\s*,\s*trainer:\s*\'([^\']*)\'\s*\}'
        )
        # Search the entire line for record patterns
        for rec_match in rec_pattern.finditer(line):
            tid = int(rec_match.group(1))
            records[tid] = {
                'completed': rec_match.group(2),
                'expiry': rec_match.group(3),
                'trainer': rec_match.group(4),
            }

        assoc = {
            'login': login,
            'full_name': full_name,
            'start_date': start_date,
            'employment_type': employment_type,
            'manager_name': manager_name,
            'shift': shift,
            'records': records,
        }
        login_index[login] = len(associates)
        associates.append(assoc)

    return associates, login_index


def write_associates_data(filepath, associates):
    """Write the associates-data.js file."""
    lines = ['const ASSOCIATES_DATA = [']
    for assoc in associates:
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
            f"manager_name: '{mgr}', shift: '{assoc['shift']}', records: {records_str} }},"
        )

    lines.append('];')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')


def should_update(existing_records, tid, new_expiry):
    """
    Return True if we should update this training record.
    Update if: no existing record for tid, OR new expiry > existing expiry.
    """
    if tid not in existing_records:
        return True
    existing_expiry = existing_records[tid].get('expiry', '')
    if not existing_expiry:
        return True
    return new_expiry > existing_expiry


# ============== PROCESSING FUNCTIONS ==============

def process_course_learning(csv_path, associates, login_index):
    """
    Process Course Learning Report CSV.
    For each login+course, find the MOST RECENT closedDateTimeUtc.
    completed = that date (UTC date portion, YYYY-MM-DD)
    expiry = completed + 1 year (annual trainings)
    """
    print(f"\n--- Processing Course Learning Report ---")
    print(f"  File: {csv_path}")

    if not os.path.exists(csv_path):
        print(f"  ERROR: File not found!")
        return 0

    # Read CSV - no BOM expected for this one
    rows = []
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    print(f"  Total rows: {len(rows)}")

    # Build: login -> course_title -> most recent closedDateTimeUtc
    latest = {}  # {login: {course_title: closedDateTimeUtc}}

    for row in rows:
        status = (row.get('status') or '').strip()
        if status != 'completed':
            continue

        login = (row.get('login') or '').strip().lower()
        course_title = (row.get('courseTitle') or '').strip()
        closed_dt = (row.get('closedDateTimeUtc') or '').strip()

        if not login or not course_title or not closed_dt:
            continue

        # Only process courses we care about
        if course_title not in COURSE_TITLE_MAP:
            continue

        if login not in latest:
            latest[login] = {}

        if course_title not in latest[login] or closed_dt > latest[login][course_title]:
            latest[login][course_title] = closed_dt

    # Now apply updates
    update_count = 0
    skipped_protected = 0
    skipped_not_found = 0
    skipped_not_newer = 0

    for login, courses in latest.items():
        if login in PROTECTED_LOGINS:
            skipped_protected += 1
            continue

        if login not in login_index:
            skipped_not_found += 1
            continue

        idx = login_index[login]
        assoc = associates[idx]

        for course_title, closed_dt in courses.items():
            tid = COURSE_TITLE_MAP[course_title]

            # Extract UTC date portion
            completed = parse_date_iso(closed_dt)
            if not completed:
                continue

            # Annual training: expiry = completed + 1 year
            expiry = add_years(completed, 1)
            if not expiry:
                continue

            if should_update(assoc['records'], tid, expiry):
                assoc['records'][tid] = {
                    'completed': completed,
                    'expiry': expiry,
                    'trainer': 'AVV2 Safety',
                }
                update_count += 1
            else:
                skipped_not_newer += 1

    print(f"  Updates applied: {update_count}")
    print(f"  Skipped (protected): {skipped_protected}")
    print(f"  Skipped (login not in data): {skipped_not_found}")
    print(f"  Skipped (existing expiry newer): {skipped_not_newer}")
    return update_count


def process_pit_safety(csv_path, associates, login_index):
    """
    Process PIT Safety Compliance CSV.
    Only "Yes" compliant records.
    Use Theory Expiry Date as expiry.
    For annual (IDs 10, 11): completed = expiry - 1 year
    For 3-year (IDs 12-19): use NOBA Cert. Date as completed if available,
      otherwise completed = expiry - 3 years
    """
    print(f"\n--- Processing PIT Safety CSV ---")
    print(f"  File: {csv_path}")

    if not os.path.exists(csv_path):
        print(f"  ERROR: File not found!")
        return 0

    rows = []
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    print(f"  Total rows: {len(rows)}")

    update_count = 0
    skipped_protected = 0
    skipped_not_found = 0
    skipped_not_newer = 0
    skipped_not_compliant = 0

    for row in rows:
        compliant = (row.get('Compliant Yes/No') or '').strip()
        if compliant != 'Yes':
            skipped_not_compliant += 1
            continue

        topic = (row.get('Topic') or '').strip()
        login = (row.get('Emp Login') or '').strip().lower()

        if not login or not topic:
            continue

        # Match topic to training ID
        tid = PIT_TOPIC_MAP.get(topic)
        if tid is None:
            continue

        if login in PROTECTED_LOGINS:
            skipped_protected += 1
            continue

        if login not in login_index:
            skipped_not_found += 1
            continue

        # Get expiry from Theory Expiry Date
        expiry = parse_date_iso(row.get('Theory Expiry Date') or '')
        if not expiry:
            continue

        # Calculate completed date
        if tid in ANNUAL_IDS:
            # Annual: completed = expiry - 1 year
            completed = subtract_years(expiry, 1)
        elif tid in THREE_YEAR_IDS:
            # 3-year cert: use NOBA Cert. Date if available
            noba_date = parse_date_iso(row.get('NOBA Cert. Date') or '')
            if noba_date:
                completed = noba_date
            else:
                # Fallback: completed = expiry - 3 years
                completed = subtract_years(expiry, 3)
        else:
            continue

        if not completed:
            continue

        idx = login_index[login]
        assoc = associates[idx]

        if should_update(assoc['records'], tid, expiry):
            assoc['records'][tid] = {
                'completed': completed,
                'expiry': expiry,
                'trainer': 'AVV2 Safety',
            }
            update_count += 1
        else:
            skipped_not_newer += 1

    print(f"  Updates applied: {update_count}")
    print(f"  Skipped (not compliant): {skipped_not_compliant}")
    print(f"  Skipped (protected): {skipped_protected}")
    print(f"  Skipped (login not in data): {skipped_not_found}")
    print(f"  Skipped (existing expiry newer): {skipped_not_newer}")
    return update_count


def process_yard_safety(csv_path, associates, login_index):
    """
    Process Yard Safety Compliance CSV.
    Only "Yes" compliant records.
    For Yard Access (ID 9): use Expiry Date column, completed = expiry - 1 year
    For TDR/GTDR (ID 8): use Theory Expiry Date column, completed = expiry - 1 year
    """
    print(f"\n--- Processing Yard Safety CSV ---")
    print(f"  File: {csv_path}")

    if not os.path.exists(csv_path):
        print(f"  ERROR: File not found!")
        return 0

    rows = []
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)

    print(f"  Total rows: {len(rows)}")

    update_count = 0
    skipped_protected = 0
    skipped_not_found = 0
    skipped_not_newer = 0
    skipped_not_compliant = 0

    for row in rows:
        compliant = (row.get('Compliant Yes/No') or '').strip()
        if compliant != 'Yes':
            skipped_not_compliant += 1
            continue

        topic = (row.get('Topic') or '').strip()
        login = (row.get('Emp Login') or '').strip().lower()

        if not login or not topic:
            continue

        # Match topic to training ID
        tid = YARD_TOPIC_MAP.get(topic)
        if tid is None:
            continue

        if login in PROTECTED_LOGINS:
            skipped_protected += 1
            continue

        if login not in login_index:
            skipped_not_found += 1
            continue

        # Get expiry based on topic
        if tid == 9:  # Yard Access - use "Expiry Date" column
            expiry = parse_date_iso(row.get('Expiry Date') or '')
        elif tid == 8:  # TDR/GTDR - use "Theory Expiry Date" column
            expiry = parse_date_iso(row.get('Theory Expiry Date') or '')
        else:
            continue

        if not expiry:
            continue

        # Both are annual: completed = expiry - 1 year
        completed = subtract_years(expiry, 1)
        if not completed:
            continue

        idx = login_index[login]
        assoc = associates[idx]

        if should_update(assoc['records'], tid, expiry):
            assoc['records'][tid] = {
                'completed': completed,
                'expiry': expiry,
                'trainer': 'AVV2 Safety',
            }
            update_count += 1
        else:
            skipped_not_newer += 1

    print(f"  Updates applied: {update_count}")
    print(f"  Skipped (not compliant): {skipped_not_compliant}")
    print(f"  Skipped (protected): {skipped_protected}")
    print(f"  Skipped (login not in data): {skipped_not_found}")
    print(f"  Skipped (existing expiry newer): {skipped_not_newer}")
    return update_count


# ============== MAIN ==============

def main():
    print("=" * 60)
    print("  Badge Tracker - CSV Update Script")
    print("=" * 60)

    # Verify files exist
    missing = []
    if not os.path.exists(COURSE_CSV):
        missing.append(f"Course Learning: {COURSE_CSV}")
    if not os.path.exists(PIT_CSV):
        missing.append(f"PIT Safety: {PIT_CSV}")
    if not os.path.exists(YARD_CSV):
        missing.append(f"Yard Safety: {YARD_CSV}")
    if not os.path.exists(ASSOCIATES_FILE):
        missing.append(f"Associates Data: {ASSOCIATES_FILE}")

    if missing:
        print("\nERROR: Missing files:")
        for m in missing:
            print(f"  - {m}")
        return

    # Parse existing associates data
    print(f"\nParsing existing associates-data.js...")
    associates, login_index = parse_associates_data(ASSOCIATES_FILE)
    print(f"  Found {len(associates)} associates")

    total_records_before = sum(len(a['records']) for a in associates)
    print(f"  Total training records before: {total_records_before}")

    # Process each CSV
    course_updates = process_course_learning(COURSE_CSV, associates, login_index)
    pit_updates = process_pit_safety(PIT_CSV, associates, login_index)
    yard_updates = process_yard_safety(YARD_CSV, associates, login_index)

    total_updates = course_updates + pit_updates + yard_updates
    total_records_after = sum(len(a['records']) for a in associates)

    # Write updated file
    print(f"\n--- Writing Updated File ---")
    write_associates_data(ASSOCIATES_FILE, associates)

    print(f"\n{'=' * 60}")
    print(f"  SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Course Learning updates: {course_updates}")
    print(f"  PIT Safety updates:      {pit_updates}")
    print(f"  Yard Safety updates:     {yard_updates}")
    print(f"  Total updates applied:   {total_updates}")
    print(f"  Records before: {total_records_before}")
    print(f"  Records after:  {total_records_after}")
    print(f"  New records added: {total_records_after - total_records_before}")
    print(f"\n  Output: {ASSOCIATES_FILE}")
    print(f"{'=' * 60}")


if __name__ == '__main__':
    main()
