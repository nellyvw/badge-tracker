import re
import os
from datetime import datetime, timedelta

file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'associates-data.js')

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

def add_days(date_str, days):
    d = datetime.strptime(date_str, '%Y-%m-%d')
    d += timedelta(days=days)
    return d.strftime('%Y-%m-%d')

# Training data from CSV
training_data = {
    7: {  # VRC
        'nellyvw': '2025-06-21', 'bhattilw': '2025-06-22', 'ishamsin': '2025-06-21', 'faqurban': '2025-06-21',
        'bbsadimu': '2025-06-21', 'sfatimap': '2025-06-21', 'roopran': '2025-06-21', 'asehashi': '2025-06-27',
        'dgguglie': '2026-06-21', 'akbarroh': '2026-01-23', 'sharvalq': '2026-01-23', 'uadityap': '2025-11-18',
        'ciftikha': '2025-07-09', 'windwula': '2025-07-09', 'dulanith': '2025-06-23', 'conbular': '2025-06-21',
        'eleedoan': '2025-07-05', 'grimwd': '2025-06-27', 'cofepule': '2025-06-27', 'jdonoand': '2025-06-27',
        'wasibtai': '2025-06-29', 'lukfeng': '2026-06-23', 'cwilsshe': '2025-10-08', 'ucoboswe': '2025-07-10',
        'mccashne': '2025-07-10', 'camortim': '2025-07-10', 'bhavbood': '2025-07-10', 'xavielay': '2025-08-25',
        'vatamich': '2025-07-17', 'saattaie': '2025-07-04', 'ahaidern': '2025-06-26', 'skamaaum': '2025-06-26',
        'kanivale': '2026-04-20', 'ozadrana': '2025-06-24', 'tfilipkr': '2025-08-15', 'pnutnunt': '2025-10-08',
        'natdrata': '2026-06-09', 'nammande': '2025-12-28', 'yvetteno': '2026-01-03', 'roymusta': '2025-11-05',
        'baldersi': '2026-06-06', 'slovkaur': '2025-06-26', 'ynesharm': '2025-07-09', 'gtruphin': '2025-07-09',
        'yetsabgo': '2025-06-27', 'thiphngu': '2025-06-27', 'fgsalima': '2025-10-03', 'rboavida': '2026-06-21',
        'celischr': '2025-07-19', 'tshainah': '2025-10-04', 'jkaurmnz': '2025-06-28', 'catuluga': '2025-06-24',
        'bhaushar': '2025-07-04', 'nidimasi': '2025-07-01', 'edwarfif': '2025-06-21', 'hormnarv': '2025-07-04',
        'smjordai': '2025-07-17', 'ferokhal': '2025-06-26', 'sabirnow': '2025-06-26', 'wamansor': '2025-06-26',
        'mohadisa': '2025-08-25', 'sanchayr': '2026-03-14', 'ypsunilk': '2025-10-03', 'mirzaeim': '2025-07-04',
        'jamcorma': '2025-10-03', 'sanhohar': '2025-10-03', 'deligena': '2025-10-03', 'mshafaqh': '2025-06-24',
        'shoukatc': '2025-06-25', 'abhisava': '2025-06-25', 'nazayasi': '2025-06-25', 'petheka': '2025-06-25',
        'afzalmad': '2025-06-25', 'pushapds': '2025-07-10', 'bhypatel': '2026-06-21', 'pemmanud': '2025-06-24',
        'anchungk': '2026-01-09', 'wlewjade': '2025-06-30', 'falleyla': '2025-07-02', 'kishbaig': '2025-07-02',
        'rsitaro': '2026-01-23', 'zubrezay': '2026-01-23', 'panestar': '2026-01-23', 'kunnaung': '2025-08-25',
        'nasibamo': '2026-01-23', 'pawandlk': '2026-01-23', 'qumbriir': '2025-08-25', 'prasalkr': '2026-05-07',
        'marimolc': '2025-10-31', 'fayafari': '2025-09-26', 'mbintomp': '2025-11-05', 'hazarama': '2025-10-14',
        'mahrukba': '2025-10-14', 'lmorroro': '2025-10-07', 'rahisuml': '2025-10-07', 'repfatem': '2026-01-23',
        'sebatooi': '2025-10-31', 'josetung': '2026-01-23', 'mmozafad': '2026-02-03', 'mormattz': '2026-06-21',
        'ryzdana': '2026-06-25', 'wperafiq': '2026-01-16', 'mrzpzabi': '2025-10-04', 'ehhazrat': '2026-01-03',
        'weechriv': '2025-09-24', 'voigtzab': '2025-09-24', 'kkaswaln': '2025-10-12', 'krysinga': '2025-12-28',
        'margmehr': '2025-12-28', 'patvhard': '2025-11-16', 'prahishe': '2025-12-15', 'shojaebi': '2026-01-23',
        'tsmitjor': '2026-02-03', 'fsafdari': '2026-05-07', 'ufizaidi': '2026-05-07', 'doamandc': '2025-10-04',
        'dansmilz': '2025-11-04', 'nasqzaka': '2026-01-23', 'irsibrah': '2026-01-23', 'mahmpmin': '2026-01-23',
        'milsamad': '2026-01-23', 'jamilimc': '2026-01-23', 'arinangu': '2026-02-13', 'uzahrajo': '2026-04-02',
        'shivaulo': '2026-03-27', 'zdfayazi': '2026-05-26', 'bhreejan': '2026-02-03', 'xausafah': '2026-01-03',
        'hugnoori': '2026-01-14', 'joelwith': '2026-05-23', 'abrahkme': '2026-01-14', 'robihaid': '2026-05-23',
        'jmomuh': '2026-05-23', 'samiqasi': '2026-05-23', 'keocharl': '2026-01-16', 'saryakh': '2026-01-16',
        'maoaliza': '2026-05-23', 'tekattyr': '2026-06-09', 'sunhlee': '2026-06-09', 'hanntiai': '2026-06-09',
        'richclai': '2026-06-09', 'aruzxehs': '2026-02-10', 'harnekse': '2026-05-07', 'nawrozis': '2026-06-21',
        'bsyurong': '2026-03-22', 'azamkhod': '2025-09-22', 'simagusu': '2025-11-08', 'mursalgh': '2025-10-14',
        'kapigoun': '2025-10-07', 'guaricat': '2025-10-14', 'aalimish': '2026-01-11', 'somaial': '2026-05-23',
        'gwijenay': '2026-05-26', 'qstemars': '2026-06-09', 'mehalmod': '2026-01-16', 'karifabb': '2025-12-30',
        'yussimus': '2025-10-19', 'nithlamw': '2026-02-07', 'gibkylie': '2026-02-07', 'micjessm': '2026-05-07',
        'fahnasin': '2025-10-31', 'rezaiemj': '2026-05-07', 'kumbunis': '2026-01-23', 'salimmun': '2025-11-08',
        'laurmaye': '2025-10-12', 'mandikoi': '2026-06-09', 'rahueame': '2026-02-06', 'nandakrj': '2025-10-11',
        'sajitelq': '2026-05-07', 'asgkobra': '2026-03-27', 'tubaoreh': '2026-03-14', 'dhazrupi': '2026-03-22',
        'almarip': '2026-03-22', 'bucktlac': '2025-10-24', 'pachangh': '2026-06-22', 'eeuchhen': '2025-07-01',
        'muttij': '2025-06-04', 'elimaris': '2025-06-27', 'codpinon': '2025-06-24', 'laritait': '2025-09-24',
        'oldaker': '2025-07-01', 'yagtipen': '2026-05-07', 'swsamals': '2026-03-22', 'pierkif': '2025-07-09'
    },
    2: {  # Auto SLAM
        'oldaker': '2026-04-06', 'saattaie': '2025-09-23', 'wasibtai': '2025-09-23', 'hakdshah': '2026-02-25',
        'keocharl': '2026-02-25', 'basrezae': '2026-02-12', 'nithlamw': '2026-02-12', 'chhunlen': '2025-11-16',
        'eeuchhen': '2025-11-16', 'bucktlac': '2026-01-28', 'pachangh': '2026-01-28', 'vadsreel': '2025-09-23',
        'kkeawill': '2025-09-23', 'nauvcski': '2026-01-28'
    },
    4: {  # Jam Clear
        'uadityap': '2026-02-11', 'ciftikha': '2026-05-06', 'gtruphin': '2026-05-06', 'eleedoan': '2026-05-14',
        'mormattz': '2026-05-13', 'casgropp': '2026-05-13', 'wsantoas': '2026-05-13', 'buianth': '2026-05-13',
        'ryzdana': '2025-09-26', 'trssorav': '2025-09-26', 'patelura': '2025-09-26', 'nagaradt': '2025-09-26',
        'crebekaj': '2026-04-28', 'vhettiwe': '2026-02-11', 'marybuol': '2026-02-11', 'cazsimio': '2026-02-11',
        'sullailu': '2026-02-18', 'arinangu': '2026-02-18', 'nithlamw': '2026-02-18', 'basrezae': '2026-02-18',
        'marimolc': '2026-05-14', 'mrzpzabi': '2026-05-14', 'nargeshu': '2026-06-10', 'rezaiemj': '2026-06-10',
        'nrosetam': '2026-06-10', 'pmealani': '2026-06-10', 'mmadanag': '2026-06-10', 'mortezka': '2026-06-11',
        'khacahma': '2026-06-11', 'hakdshah': '2026-02-25', 'keocharl': '2026-02-25', 'eeuchhen': '2025-11-16',
        'chhunlen': '2025-11-16', 'elimaris': '2026-05-13', 'pierakif': '2026-05-06', 'mlogagra': '2026-05-06'
    },
    6: {  # Vacuum Lift
        'nellyvw': '2025-06-20', 'wimals': '2025-06-21', 'zamsyed': '2026-01-25', 'omatther': '2025-06-21',
        'lukfeng': '2026-06-22', 'camortim': '2026-01-25', 'naduw': '2026-01-15', 'edwarfif': '2025-08-16',
        'haferoza': '2025-06-21', 'eformarc': '2025-06-21', 'kertapar': '2025-06-23', 'kishbaig': '2025-06-23',
        'falleyla': '2025-06-23', 'baldersi': '2026-06-06', 'qstemars': '2026-01-15', 'wlewjade': '2026-01-15',
        'okojdenn': '2026-01-15', 'mhamsami': '2026-01-15', 'farhuhus': '2026-01-13', 'djoaolay': '2025-06-21',
        'randollw': '2025-06-21', 'uadityap': '2025-06-25'
    },
    3: {  # Destuff-IT
        'gidluong': '2026-05-05'
    }
}

# Parse associates from the JS file
# Extract each associate object as a line
lines = content.strip().split('\n')

# Build a lookup: login -> line index
associates = []
login_to_idx = {}

for i, line in enumerate(lines):
    m = re.search(r"login:\s*'([^']+)'", line)
    if m:
        login = m.group(1)
        login_to_idx[login] = len(associates)
        associates.append({'login': login, 'line': line, 'line_idx': i})

# For each associate, parse existing record keys
def get_existing_record_ids(line):
    """Extract existing training IDs from a records object in the line"""
    # Find the records: { ... } part
    m = re.search(r'records:\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}', line)
    if not m:
        return set()
    records_content = m.group(1).strip()
    if not records_content:
        return set()
    # Find all numeric keys
    ids = re.findall(r'(\d+):\s*\{', records_content)
    return set(int(x) for x in ids)

def add_record_to_line(line, training_id, completed, expiry):
    """Add a new training record to the line"""
    new_record = f"{training_id}: {{ completed: '{completed}', expiry: '{expiry}', trainer: 'AVV2 Safety' }}"
    
    # Find 'records: { }' (empty) or 'records: { ...existing... }'
    # Check if records is empty
    empty_match = re.search(r'records:\s*\{\s*\}', line)
    if empty_match:
        # Replace empty records with new record
        return line[:empty_match.start()] + f'records: {{ {new_record} }}' + line[empty_match.end():]
    
    # Records has existing content - add before the closing } of records
    # Find the last } } pattern (closing of records object then closing of associate object)
    # We need to insert before the last closing brace of records
    # Strategy: find 'records: {' and then find the matching closing brace
    records_start = line.find('records: {')
    if records_start == -1:
        records_start = line.find('records:{')
    if records_start == -1:
        return line  # shouldn't happen
    
    # Find the position after 'records: {'
    brace_start = line.index('{', records_start + len('records'))
    
    # Count braces to find the matching close
    depth = 0
    pos = brace_start
    for idx in range(brace_start, len(line)):
        if line[idx] == '{':
            depth += 1
        elif line[idx] == '}':
            depth -= 1
            if depth == 0:
                pos = idx
                break
    
    # Insert before the closing brace of records
    # Check if there's existing content
    inner = line[brace_start+1:pos].strip()
    if inner:
        return line[:pos] + f', {new_record} ' + line[pos:]
    else:
        return line[:brace_start+1] + f' {new_record} ' + line[pos:]

# Process training data
changes_count = 0

for training_id, login_map in training_data.items():
    for login, completed_date in login_map.items():
        if login not in login_to_idx:
            continue  # Not in file
        
        idx = login_to_idx[login]
        assoc = associates[idx]
        existing_ids = get_existing_record_ids(assoc['line'])
        
        if training_id in existing_ids:
            continue  # Already has this training
        
        expiry_date = add_days(completed_date, 365)
        assoc['line'] = add_record_to_line(assoc['line'], training_id, completed_date, expiry_date)
        changes_count += 1

# Rebuild the file
output_lines = []
assoc_idx = 0
for i, line in enumerate(lines):
    if assoc_idx < len(associates) and associates[assoc_idx]['line_idx'] == i:
        output_lines.append(associates[assoc_idx]['line'])
        assoc_idx += 1
    else:
        output_lines.append(line)

output = '\n'.join(output_lines) + '\n'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Done! Added {changes_count} new training records.")
