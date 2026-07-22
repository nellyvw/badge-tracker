"""
Badge Tracker Compliance Update Script

Processes Yard Safety and PIT Safety CSVs and updates associates-data.js.

Rules:
- Protected associates (nellyvw, edwarfif, camortim, gidluong, naduw, bhattilw): preserve ALL records
- Excluded manager supervisor logins (finiotm, saadnisa): skip their associates
- Only process records where Compliant Yes/No = "Yes"
- Training IDs 1-7: always preserved from existing data
- Training IDs 8-19: updated from CSVs for non-protected associates
"""

import csv
import os
import re
from datetime import datetime, timedelta

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, 'associates-data.js')
YARD_CSV = r'C:\Users\nellyvw\Downloads\Yard_Safety_Complian_1783609184806.csv'
PIT_CSV = r'C:\Users\nellyvw\Downloads\PIT_Safety_Complianc_1783609147141.csv'

# Protected logins - never overwrite their records
PROTECTED_LOGINS = {'nellyvw', 'edwarfif', 'camortim', 'gidluong', 'naduw', 'bhattilw'}

# Excluded supervisor logins (contractors)
EXCLUDED_SUPERVISORS = {'finiotm', 'saadnisa'}

# Training IDs that are never in CSVs - always preserve
PRESERVED_IDS = set(range(1, 8))

# CSV training IDs
CSV_IDS = set(range(8, 20))

# PIT Topic -> Training ID mapping
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

# Yard Topic -> Training ID mapping
YARD_TOPIC_MAP = {
    '01. Yard Access': 9,
    '02. GTDR': 8,
    '02. TDR': 8,
}

# Duration for computing completed date from expiry
ANNUAL_DAYS = 365
THREE_YEAR_DAYS = 1095

DURATION_MAP = {
    8: ANNUAL_DAYS, 9: ANNUAL_DAYS, 10: ANNUAL_DAYS, 11: ANNUAL_DAYS,
    12: THREE_YEAR_DAYS, 13: THREE_YEAR_DAYS, 14: THREE_YEAR_DAYS,
    15: THREE_YEAR_DAYS, 16: THREE_YEAR_DAYS, 17: THREE_YEAR_DAYS,
    18: THREE_YEAR_DAYS, 19: THREE_YEAR_DAYS,
}


def parse_date(s):
    """Parse date string to YYYY-MM-DD format."""
    if not s or not s.strip():
        return None
    s = s.strip()
    # Handle "YYYY-MM-DD HH:MM:SS" format
    m = re.match(r'^(\d{4}-\d{2}-\d{2})', s)
    if m:
        return m.group(1)
    # Handle "DD/MM/YYYY"
    m = re.match(r'^(\d{1,2})/(\d{1,2})/(\d{4})$', s)
    if m:
        return f"{m.group(3)}-{m.group(2).zfill(2)}-{m.group(1).zfill(2)}"
    return None


def subtract_days(date_str, days):
    """Subtract days from YYYY-MM-DD date string."""
    if not date_str:
        return None
    d = datetime.strptime(date_str, '%Y-%m-%d')
    result = d - timedelta(days=days)
    return result.strftime('%Y-%m-%d')


def parse_existing_data(filepath):
    """Parse existing associates-data.js into a list of associate dicts."""
    associates = []
    if not os.path.exists(filepath):
        return associates

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match each associate line
    pattern = r"\{\s*login:\s*'([^']+)',\s*full_name:\s*'([^']*)',\s*start_date:\s*'([^']*)',\s*employment_type:\s*'([^']*)',\s*manager_name:\s*'([^']*)',\s*records:\s*(\{[^}]*(?:\{[^}]*\}[^}]*)*\})\s*\}"
    for match in re.finditer(pattern, content):
        login = match.group(1)
        full_name = match.group(2)
        start_date = match.group(3)
        employment_type = match.group(4)
        manager_name = match.group(5)
        records_str = match.group(6)

        # Parse records
        records = {}
        rec_pattern = r'(\d+):\s*\{\s*completed:\s*\'([^\']*)\',\s*expiry:\s*\'([^\']*)\',\s*trainer:\s*\'([^\']*)\'\s*\}'
        for rec_match in re.finditer(rec_pattern, records_str):
            tid = int(rec_match.group(1))
            records[tid] = {
                'completed': rec_match.group(2),
                'expiry': rec_match.group(3),
                'trainer': rec_match.group(4),
            }

        associates.append({
            'login': login,
            'full_name': full_name,
            'start_date': start_date,
            'employment_type': employment_type,
            'manager_name': manager_name,
            'records': records,
        })

    return associates


def read_csv_file(filepath):
    """Read CSV file with BOM handling."""
    rows = []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def get_latest_date(*dates):
    """Return the latest non-None date from a list of date strings."""
    valid = [d for d in dates if d]
    if not valid:
        return None
    return max(valid)


def get_earliest_date(*dates):
    """Return the earliest non-None date from a list of date strings."""
    valid = [d for d in dates if d]
    if not valid:
        return None
    return min(valid)


def process_yard_csv(filepath, login_set):
    """Process Yard Safety CSV. Returns dict of login -> {training_id: record}."""
    results = {}
    rows = read_csv_file(filepath)
    print(f"  Yard Safety CSV: {len(rows)} total rows")

    compliant_count = 0
    skipped_supervisor = 0
    skipped_not_in_file = 0

    for row in rows:
        # Only process compliant records
        if (row.get('Compliant Yes/No') or '').strip() != 'Yes':
            continue

        compliant_count += 1
        login = (row.get('Emp Login') or '').strip().lower()
        topic = (row.get('Topic') or '').strip()
        supervisor = (row.get('Supervisor Login') or '').strip().lower()

        if not login or not topic:
            continue

        # Skip excluded supervisors
        if supervisor in EXCLUDED_SUPERVISORS:
            skipped_supervisor += 1
            continue

        # Only process if associate exists in our data file
        if login not in login_set:
            skipped_not_in_file += 1
            continue

        # Skip protected associates
        if login in PROTECTED_LOGINS:
            continue

        # Determine training ID
        tid = None
        for prefix, t_id in YARD_TOPIC_MAP.items():
            if topic == prefix or topic.startswith(prefix):
                tid = t_id
                break

        if tid is None:
            continue

        # Determine expiry date based on topic
        if tid == 9:  # Yard Access - use Expiry Date column
            expiry = parse_date(row.get('Expiry Date') or '')
        elif tid == 8:  # TDR/GTDR - use latest of Theory/Practical expiry
            theory = parse_date(row.get('Theory Expiry Date') or '')
            practical = parse_date(row.get('Practical Expiry Date') or '')
            expiry = get_latest_date(theory, practical)
        else:
            continue

        if not expiry:
            continue

        # Calculate completed date
        completed = subtract_days(expiry, DURATION_MAP[tid])
        if not completed:
            continue

        # Store the record
        if login not in results:
            results[login] = {}
        results[login][tid] = {
            'completed': completed,
            'expiry': expiry,
            'trainer': 'AVV2 Safety',
        }

    print(f"  Compliant rows: {compliant_count}")
    print(f"  Skipped (excluded supervisor): {skipped_supervisor}")
    print(f"  Skipped (not in data file): {skipped_not_in_file}")
    print(f"  Records to apply: {sum(len(v) for v in results.values())}")
    return results


def process_pit_csv(filepath, login_set):
    """Process PIT Safety CSV. Returns dict of login -> {training_id: record}."""
    results = {}
    rows = read_csv_file(filepath)
    print(f"  PIT Safety CSV: {len(rows)} total rows")

    compliant_count = 0
    skipped_supervisor = 0
    skipped_not_in_file = 0

    for row in rows:
        # Only process compliant records
        if (row.get('Compliant Yes/No') or '').strip() != 'Yes':
            continue

        compliant_count += 1
        login = (row.get('Emp Login') or '').strip().lower()
        topic = (row.get('Topic') or '').strip()
        supervisor = (row.get('Supervisor Login') or '').strip().lower()

        if not login or not topic:
            continue

        # Skip excluded supervisors
        if supervisor in EXCLUDED_SUPERVISORS:
            skipped_supervisor += 1
            continue

        # Only process if associate exists in our data file
        if login not in login_set:
            skipped_not_in_file += 1
            continue

        # Skip protected associates
        if login in PROTECTED_LOGINS:
            continue

        # Determine training ID
        tid = None
        for prefix, t_id in PIT_TOPIC_MAP.items():
            if topic == prefix or topic.startswith(prefix):
                tid = t_id
                break

        if tid is None:
            continue

        # Determine expiry date
        theory = parse_date(row.get('Theory Expiry Date') or '')
        practical = parse_date(row.get('Practical Expiry Date') or '')

        if tid == 10 or tid == 11:
            # PIT 101 and Fall Protection: use Theory Expiry Date
            expiry = theory
        else:
            # 3-year PIT certs (IDs 12-19): use earliest of theory/practical
            expiry = get_earliest_date(theory, practical)

        if not expiry:
            continue

        # Calculate completed date
        completed = subtract_days(expiry, DURATION_MAP[tid])
        if not completed:
            continue

        # Store the record
        if login not in results:
            results[login] = {}
        results[login][tid] = {
            'completed': completed,
            'expiry': expiry,
            'trainer': 'AVV2 Safety',
        }

    print(f"  Compliant rows: {compliant_count}")
    print(f"  Skipped (excluded supervisor): {skipped_supervisor}")
    print(f"  Skipped (not in data file): {skipped_not_in_file}")
    print(f"  Records to apply: {sum(len(v) for v in results.values())}")
    return results


def write_output(associates, filepath):
    """Write the updated associates-data.js file."""
    lines = ['const ASSOCIATES_DATA = [']

    for assoc in associates:
        # Build records string
        sorted_recs = dict(sorted(assoc['records'].items(), key=lambda x: x[0]))
        rec_parts = []
        for tid, rec in sorted_recs.items():
            rec_parts.append(
                f"{tid}: {{ completed: '{rec['completed']}', expiry: '{rec['expiry']}', trainer: '{rec['trainer']}' }}"
            )
        if rec_parts:
            records_str = '{ ' + ', '.join(rec_parts) + ' }'
        else:
            records_str = '{  }'

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


def main():
    print("=== Badge Tracker Compliance Update ===\n")

    # Verify CSV files exist
    if not os.path.exists(YARD_CSV):
        print(f"ERROR: Yard Safety CSV not found: {YARD_CSV}")
        return
    if not os.path.exists(PIT_CSV):
        print(f"ERROR: PIT Safety CSV not found: {PIT_CSV}")
        return

    # Parse existing data
    print("1. Loading existing associates-data.js...")
    associates = parse_existing_data(DATA_FILE)
    print(f"   Found {len(associates)} associates")

    # Build login set for quick lookup
    login_set = {a['login'] for a in associates}

    # Count existing records
    existing_records = sum(len(a['records']) for a in associates)
    print(f"   Existing training records: {existing_records}")

    # List protected associates and their current records
    print("\n2. Protected associates (records will be preserved):")
    for a in associates:
        if a['login'] in PROTECTED_LOGINS:
            print(f"   {a['login']}: IDs {sorted(a['records'].keys()) if a['records'] else 'none'}")

    # Process Yard Safety CSV
    print("\n3. Processing Yard Safety CSV...")
    yard_records = process_yard_csv(YARD_CSV, login_set)

    # Process PIT Safety CSV
    print("\n4. Processing PIT Safety CSV...")
    pit_records = process_pit_csv(PIT_CSV, login_set)

    # Apply updates
    print("\n5. Applying updates to associates...")
    updates_applied = 0

    for assoc in associates:
        login = assoc['login']

        # Skip protected associates entirely
        if login in PROTECTED_LOGINS:
            continue

        # For non-protected: preserve IDs 1-7, replace IDs 8-19 with new CSV data
        preserved_records = {tid: rec for tid, rec in assoc['records'].items() if tid in PRESERVED_IDS}

        # Start with preserved records
        new_records = dict(preserved_records)

        # Add yard records
        if login in yard_records:
            for tid, rec in yard_records[login].items():
                new_records[tid] = rec
                updates_applied += 1

        # Add PIT records
        if login in pit_records:
            for tid, rec in pit_records[login].items():
                new_records[tid] = rec
                updates_applied += 1

        assoc['records'] = new_records

    print(f"   Total record updates applied: {updates_applied}")

    # Write output
    print("\n6. Writing updated associates-data.js...")
    write_output(associates, DATA_FILE)

    # Final stats
    final_records = sum(len(a['records']) for a in associates)
    with_records = sum(1 for a in associates if a['records'])
    print(f"\n=== DONE ===")
    print(f"   Total associates: {len(associates)}")
    print(f"   Associates with records: {with_records}")
    print(f"   Total training records: {final_records}")
    print(f"   (was {existing_records}, now {final_records})")


if __name__ == '__main__':
    main()
