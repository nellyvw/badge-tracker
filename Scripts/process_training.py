"""
Process training records from CSV data and update associates-data.js
Fixed version with better duplicate detection
"""
import re
from datetime import datetime, timedelta

# Read the ORIGINAL file (restore from backup approach - re-read and reprocess)
# First, let's read the original content by looking at what we have
# Actually, let's revert and redo. We need the original file.
# Since we already modified it, let's work with what we have but be smarter about detection.

# Actually let me rebuild this properly. The issue is that in some records, 
# the existing format has `, 7: {` at the END (after the main records block closed with `}`)
# which means the structure is: records: { ...main... } , 7: { ... } , 2: { ... } }
# This is the format used for previously-added records.

# Let me rewrite with a completely different approach:
# 1. Parse each line to extract the full records portion as text
# 2. Check if a training ID key exists anywhere in that text  
# 3. If not, add it

# Read the current file (which has some duplicates from first run)
with open(r'c:\Users\nellyvw\Documents\Kora\Badge Tracker\training-tracker\preview\associates-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Training data
vrc_data = {
    'oldaker': '2025-07-01', 'browjoa': '2025-07-01', 'suona': '2025-11-03',
    'dgguglie': '2026-06-21', 'gidluong': '2025-08-24', 'rboavida': '2026-06-21',
    'almarip': '2026-03-22', 'lisraymo': '2025-06-29', 'garclint': '2025-06-24',
    'roopran': '2025-06-21', 'muttij': '2025-06-04', 'elimaris': '2025-06-27',
    'catuluga': '2025-06-24', 'grimwd': '2025-06-27', 'guilalla': '2025-06-27',
    'codpinon': '2025-06-24', 'celischr': '2025-07-19', 'tshainah': '2025-10-04',
    'jkaurmnz': '2025-06-28', 'bhattilw': '2025-06-22', 'eeuchhen': '2025-07-01',
    'pachangh': '2026-06-22', 'cofepule': '2025-06-27', 'laritait': '2025-09-24',
    'nidimasi': '2025-07-01', 'asehashi': '2025-06-27', 'bhaushar': '2025-07-04',
    'edwarfif': '2025-06-21', 'ciftikha': '2025-07-09', 'fgsalima': '2025-10-03',
    'meichenc': '2025-07-09', 'akbarroh': '2026-01-23', 'eformarc': '2025-06-28',
    'windwula': '2025-07-09', 'sharvalq': '2026-01-23', 'taraeina': '2025-06-23',
    'uadityap': '2025-11-18', 'falleyla': '2025-07-02', 'haferoza': '2025-06-24',
    'nagaradt': '2025-06-27', 'gtruphin': '2025-07-09', 'moniquix': '2025-06-23',
    'dulanith': '2025-06-23', 'jyordo': '2025-06-04', 'xavielay': '2025-08-25',
    'djoaolay': '2025-06-23', 'pierakif': '2025-07-09', 'fakarimh': '2026-01-23',
    'kanivale': '2026-04-20', 'cwilsshe': '2025-10-08', 'ucoboswe': '2025-07-10',
    'ishamsin': '2025-06-21', 'farhuhus': '2025-06-30', 'deligena': '2025-10-03',
    'pnutnunt': '2025-10-08', 'bbsadimu': '2025-06-21', 'sfatimap': '2025-06-21',
    'naduw': '2025-10-22', 'afzalmad': '2025-06-25', 'nazayasi': '2025-06-25',
    'abhisava': '2025-06-25', 'shoukatc': '2025-06-25', 'mshafaqh': '2025-06-24',
    'thetupuf': '2025-06-23', 'petheka': '2025-06-25', 'kishbaig': '2025-07-02',
    'ozadrana': '2025-06-24', 'jamcorma': '2025-10-03', 'tfilipkr': '2025-08-15',
    'asgkobra': '2026-03-27', 'skamaaum': '2025-06-26', 'swsamals': '2026-03-22',
    'smjordai': '2025-07-17', 'ferokhal': '2025-06-26', 'slovkaur': '2025-06-26',
    'ahaidern': '2025-06-26', 'sabirnow': '2025-06-26', 'mehalmod': '2026-01-16',
    'wamansor': '2025-06-26', 'mohadisa': '2026-01-23', 'sanchayr': '2026-03-14',
    'natdrata': '2026-06-09', 'pushapds': '2025-07-10', 'nammande': '2025-12-28',
    'nunekcat': '2025-07-09', 'mlogagra': '2025-07-09', 'lmaramgr': '2025-12-08',
    'hormnarv': '2025-07-04', 'yussimus': '2025-10-19', 'saattaie': '2025-07-04',
    'ypsunilk': '2025-10-03', 'mirzaeim': '2025-07-04', 'kavtapas': '2025-07-17',
    'vatamich': '2025-07-17', 'mccashne': '2025-07-10', 'camortim': '2025-07-10',
    'muddasda': '2025-07-09', 'bhavbood': '2025-07-10', 'bsyurong': '2026-03-22',
    'panestar': '2026-01-23', 'kunnaung': '2025-08-25', 'pawandlk': '2026-01-23',
    'qumbriir': '2025-08-25', 'prasalkr': '2026-05-07', 'nasibamo': '2026-01-23',
    'rahueame': '2026-02-06', 'nandakrj': '2025-10-11', 'azamkhod': '2025-09-22',
    'marimolc': '2025-10-31', 'patvhard': '2025-11-16', 'prahishe': '2025-12-15',
    'nawrozis': '2026-06-21', 'fayafari': '2025-09-26', 'mbintomp': '2025-11-05',
    'yagtipen': '2026-05-07', 'margmehr': '2025-12-28', 'shojaebi': '2026-01-23',
    'tsmitjor': '2026-02-03', 'fsafdari': '2026-05-07', 'ufizaidi': '2026-05-07',
    'doamandc': '2025-10-04', 'dansmilz': '2025-11-04', 'mormattz': '2026-06-21',
    'ehhazrat': '2026-01-03', 'roymusta': '2025-11-05', 'baldersi': '2026-06-06',
    'weechriv': '2025-09-24', 'voigtzab': '2025-09-24', 'penarroj': '2025-11-07',
    'saimhahm': '2025-11-07', 'laurmaye': '2025-10-12', 'dhazrupi': '2026-03-22',
    'mandikoi': '2026-06-09', 'wsantoas': '2025-10-04', 'pumercyl': '2026-01-23',
    'yvetteno': '2026-01-03', 'kkaswaln': '2025-10-12', 'lmorroro': '2025-10-07',
    'salimmun': '2025-11-08', 'krysinga': '2025-12-28', 'rezaiemj': '2026-05-07',
    'karifabb': '2025-12-30', 'guaricat': '2025-10-14', 'micjessm': '2026-05-07',
    'gibkylie': '2026-02-07', 'fahnasin': '2025-10-31', 'simagusu': '2025-11-08',
    'bucktlac': '2025-10-24', 'mursalgh': '2025-10-14', 'kapigoun': '2025-10-07',
    'nasqzaka': '2026-01-23', 'somaial': '2026-05-23', 'mahmpmin': '2026-01-23',
    'uzahrajo': '2026-04-02', 'arinangu': '2026-02-13', 'jamilimc': '2026-01-23',
    'milsamad': '2026-01-23', 'irsibrah': '2026-01-23', 'sajitelq': '2026-05-07',
    'gwijenay': '2026-05-26', 'aalimish': '2026-01-11', 'shivaulo': '2026-03-27',
    'zdfayazi': '2026-05-26', 'qstemars': '2026-06-09', 'bhreejan': '2026-02-03',
    'xausafah': '2026-01-03', 'hugnoori': '2026-01-14', 'joelwith': '2026-05-23',
    'abrahkme': '2026-01-14', 'robihaid': '2026-05-23', 'jmomuh': '2026-05-23',
    'samiqasi': '2026-05-23', 'keocharl': '2026-01-16', 'saryakh': '2026-01-16',
    'maoaliza': '2026-05-23', 'aruzxehs': '2026-02-10', 'tekattyr': '2026-06-09',
    'sunhlee': '2026-06-09', 'hanntiai': '2026-06-09', 'richclai': '2026-06-09',
    'harnekse': '2026-05-07', 'repfatem': '2026-01-23', 'rahisuml': '2025-10-07',
    'mahrukba': '2025-10-14', 'hazarama': '2025-10-14', 'sebatooi': '2025-10-31',
    'josetung': '2026-01-23', 'mmozafad': '2026-02-03', 'wperafiq': '2026-01-16',
    'mrzpzabi': '2025-10-04', 'kumbunis': '2026-01-23', 'obaijafw': '2026-01-23',
    'nithlamw': '2026-02-07', 'sauelese': '2025-07-07', 'rsitaro': '2026-01-23',
    'zubrezay': '2026-01-23', 'ysheenhu': '2025-10-14', 'ylaisoli': '2025-10-08',
    'tubaoreh': '2026-03-14', 'wlewjade': '2025-06-30', 'pemmanud': '2025-06-24',
    'faqurban': '2025-06-21', 'bhypatel': '2026-06-21', 'conbular': '2025-06-21',
    'alitupay': '2025-06-24', 'sanhohar': '2025-10-03', 'ynesharm': '2025-07-09',
    'basrezae': '2025-07-07', 'fcrmaang': '2025-07-15', 'hoenaome': '2025-08-15',
}

auto_slam_data = {
    'oldaker': '2026-04-06', 'browjoa': '2025-07-14', 'garclint': '2025-07-14',
    'gidluong': '2025-06-01', 'heatayla': '2025-09-23', 'guilalla': '2025-07-26',
    'longik': '2025-07-14', 'vadsreel': '2025-09-23', 'eeuchhen': '2025-11-16',
    'pachangh': '2026-01-28', 'laritait': '2025-07-16', 'bhaushar': '2025-07-16',
    'wasibtai': '2025-09-23', 'mingqzha': '2025-07-16', 'mounikep': '2025-07-16',
    'basrezae': '2026-02-12', 'kkeawill': '2025-09-23', 'chhunlen': '2025-11-16',
    'saattaie': '2025-09-23', 'nithlamw': '2026-02-12', 'nauvcski': '2026-01-28',
    'bucktlac': '2026-01-28', 'hakdshah': '2026-02-25', 'keocharl': '2026-02-25',
}

jam_data = {
    'oldaker': '2025-07-14', 'browjoa': '2025-07-14', 'garclint': '2025-07-14',
    'elimaris': '2026-05-13', 'longik': '2025-07-14', 'vadsreel': '2026-04-28',
    'eeuchhen': '2025-11-16', 'bhaushar': '2025-07-16', 'laritait': '2025-07-16',
    'ciftikha': '2026-05-06', 'gtruphin': '2026-05-06', 'pierakif': '2026-05-06',
    'nagaradt': '2025-09-26', 'patelura': '2025-09-26', 'trssorav': '2025-09-26',
    'ryzdana': '2025-09-26', 'mlogagra': '2026-05-06', 'casgropp': '2026-05-13',
    'mounikep': '2025-07-16', 'mingqzha': '2025-07-16', 'eleedoan': '2026-05-14',
    'vaisilii': '2025-09-10', 'petheka': '2025-09-10', 'yusrsarf': '2025-09-06',
    'swsamals': '2025-09-06', 'pmealani': '2026-06-10', 'uadityap': '2026-02-11',
    'marybuol': '2026-02-11', 'vhettiwe': '2026-02-11', 'cazsimio': '2026-02-11',
    'khacahma': '2026-06-11', 'mormattz': '2026-05-13', 'wsantoas': '2026-05-13',
    'buianth': '2026-05-13', 'nargeshu': '2026-06-10', 'nrosetam': '2026-06-10',
    'rezaiemj': '2026-06-10', 'crebekaj': '2026-04-28', 'mrzpzabi': '2026-05-14',
    'marimolc': '2026-05-14', 'mortezka': '2026-06-11', 'arinangu': '2026-02-18',
    'sullailu': '2026-02-18', 'nithlamw': '2026-02-18', 'basrezae': '2026-02-18',
    'hakdshah': '2026-02-25', 'keocharl': '2026-02-25', 'mmadanag': '2026-06-10',
}

vacuum_data = {
    'wimals': '2025-06-21', 'zamsyed': '2026-01-25', 'omatther': '2025-06-21',
    'randollw': '2025-06-21', 'edwarfif': '2025-08-16', 'uadityap': '2025-06-25',
    'lukfeng': '2026-06-22', 'haferoza': '2025-06-21', 'nellyvw': '2025-06-20',
    'djoaolay': '2025-06-21', 'kertapar': '2025-06-23', 'kishbaig': '2025-06-23',
    'falleyla': '2025-06-23', 'eformarc': '2025-06-21', 'camortim': '2026-01-25',
    'naduw': '2026-01-15', 'farhuhus': '2026-01-13', 'wlewjade': '2026-01-16',
    'okojdenn': '2026-01-16', 'mhamsami': '2026-01-16', 'qstemars': '2026-01-16',
    'baldersi': '2026-06-06',
}

destuff_data = {
    'gidluong': '2026-05-05',
}

def add_days(date_str, days):
    d = datetime.strptime(date_str, '%Y-%m-%d')
    new_d = d + timedelta(days=days)
    return new_d.strftime('%Y-%m-%d')

def training_id_exists_in_line(line, training_id):
    """
    Robust check: does this training_id key already exist in this line's records?
    We look for patterns like:
      N: { completed:  (where N is the training_id as a standalone number key)
    This handles both formats:
      { 7: { completed: ... }, 10: { completed: ... } }
      { 10: { ... } , 7: { ... } }
    """
    # Match training_id as a dictionary key - preceded by { or , or whitespace
    # and followed by : and then {
    pattern = rf'(?:{{|,)\s*{training_id}\s*:\s*\{{'
    return bool(re.search(pattern, line))

# Parse all associate logins from the file
login_pattern = re.compile(r"login:\s*'([^']+)'")
all_logins = set(login_pattern.findall(content))
print(f"Found {len(all_logins)} logins in file")

# Now process - but first, let's strip out any duplicates from the first run
# The duplicates are where records appear OUTSIDE the records: {} block
# Pattern: `} }` followed by ` , N: { completed...`
# Actually, let me just strip duplicates by looking for the malformed pattern
# The bad pattern is: `records: { ... } } , 7: { ... }` - the record got added outside
# Let's fix by finding lines with content after the final `} }`

# Better approach: rebuild from scratch. Remove any record that appears after `} }` at end
# The correct format should be: records: { ... } },  (with the line ending in `},`)
# If there's content between the last `}` of records and the `},` at end, it's a duplicate

# Actually the simplest fix: for any line with a login that has duplicates,
# let's just remove the extra content that was appended after `} }`

# Let me take a different, cleaner approach:
# 1. First remove all the bad additions (content after `} }` before the line-end ` },`)
# 2. Then re-add properly

lines = content.split('\n')
cleaned_lines = []

for line in lines:
    login_match = re.search(r"login:\s*'([^']+)'", line)
    if login_match:
        # Check if this line has the bad pattern: `} } , N: {` (duplicate outside records)
        # The correct end of a record line should be: `records: { ... } },`
        # or `records: {} },`
        # Bad pattern: after `} }` there's more content like `, 7: { ... }`
        # Let's find where records end and clean up
        
        # Find "records: {" 
        records_start = line.find('records: {')
        if records_start != -1:
            # From records_start, find the matching close
            # The structure is: records: { <content> } }
            # Where content can have nested { }
            # After the records object close, there should only be ` },` or ` }`
            
            # Count braces from records_start
            brace_depth = 0
            records_end = -1
            in_records = False
            i = records_start + len('records: ')
            
            for idx in range(i, len(line)):
                if line[idx] == '{':
                    brace_depth += 1
                    in_records = True
                elif line[idx] == '}':
                    brace_depth -= 1
                    if brace_depth == 0 and in_records:
                        records_end = idx
                        break
            
            if records_end != -1:
                # Everything after records_end should just be ` },` or ` }`
                after_records = line[records_end+1:].rstrip()
                if after_records.rstrip().rstrip(',').strip() not in ['', '}', '},']:
                    # There's extra content - likely duplicates from first run
                    # Get the proper line ending
                    line_end = ' },'  # standard ending for array items
                    if line.rstrip().endswith('}'):
                        line_end = ' }'
                    line = line[:records_end+1] + line_end
    
    cleaned_lines.append(line)

content = '\n'.join(cleaned_lines)

# Now do the proper insertion
lines = content.split('\n')
new_lines = []
updates_count = 0
skipped_count = 0
not_found_count = 0

training_sets = [
    (vrc_data, 7, 365),
    (auto_slam_data, 2, 365),
    (jam_data, 4, 365),
    (vacuum_data, 6, 365),
    (destuff_data, 3, 365),
]

for line in lines:
    login_match = re.search(r"login:\s*'([^']+)'", line)
    if not login_match:
        new_lines.append(line)
        continue
    
    login = login_match.group(1)
    
    # Collect new records to add
    new_records = []
    
    for data, training_id, validity_days in training_sets:
        if login not in data:
            continue
        
        # Check if this training_id already exists in the line
        if training_id_exists_in_line(line, training_id):
            skipped_count += 1
            continue
        
        completed = data[login]
        expiry = add_days(completed, validity_days)
        new_record = f"{training_id}: {{ completed: '{completed}', expiry: '{expiry}', trainer: 'AVV2 Safety' }}"
        new_records.append(new_record)
        updates_count += 1
    
    if new_records:
        # Find the records section and insert
        # Look for 'records: {}' (empty) or 'records: { ... }' (has content)
        records_start = line.find('records: {')
        if records_start != -1:
            # Find the closing brace of the records object
            brace_depth = 0
            in_records = False
            records_obj_end = -1
            i = records_start + len('records: ')
            
            for idx in range(i, len(line)):
                if line[idx] == '{':
                    brace_depth += 1
                    in_records = True
                elif line[idx] == '}':
                    brace_depth -= 1
                    if brace_depth == 0 and in_records:
                        records_obj_end = idx
                        break
            
            if records_obj_end != -1:
                # Check if records are empty
                records_inner = line[i:records_obj_end].strip()
                # Remove the opening brace from records_inner
                if records_inner.startswith('{'):
                    records_inner = records_inner[1:].strip()
                
                # Actually, let me recount. records: { ... }
                # i points to the first { after "records: "
                # The inner content is between the first { and the matching }
                inner_start = line.index('{', records_start + len('records:')) + 1
                inner_content = line[inner_start:records_obj_end].strip()
                
                new_records_str = ', '.join(new_records)
                
                if inner_content == '':
                    # Empty records: insert content
                    new_inner = ' ' + new_records_str + ' '
                else:
                    # Has content: append with comma
                    new_inner = inner_content + ', ' + new_records_str + ' '
                    # Ensure proper spacing
                    if not new_inner.startswith(' '):
                        new_inner = ' ' + new_inner
                
                # Rebuild the line
                line = line[:inner_start] + new_inner + line[records_obj_end:]
    
    new_lines.append(line)

# Write the updated file
new_content = '\n'.join(new_lines)
with open(r'c:\Users\nellyvw\Documents\Kora\Badge Tracker\training-tracker\preview\associates-data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Added {updates_count} new training records")
print(f"Skipped {skipped_count} records (already existed)")
print("File updated successfully!")

# Verify no duplicates
with open(r'c:\Users\nellyvw\Documents\Kora\Badge Tracker\training-tracker\preview\associates-data.js', 'r', encoding='utf-8') as f:
    verify_content = f.read()

# Check for any line with duplicate training IDs
dup_count = 0
for line in verify_content.split('\n'):
    login_m = re.search(r"login:\s*'([^']+)'", line)
    if login_m:
        # Find all training ID keys in this line
        id_keys = re.findall(r'(?:{{|,)\s*(\d+)\s*:\s*\{{', line)
        if len(id_keys) != len(set(id_keys)):
            dup_count += 1
            print(f"  DUPLICATE found in {login_m.group(1)}: {id_keys}")

if dup_count == 0:
    print("✓ No duplicate training IDs found - all clean!")
else:
    print(f"✗ Found {dup_count} lines with duplicate IDs")
