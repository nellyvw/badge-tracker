/**
 * Badge Tracker Data Update Script
 * 
 * This script reads CSV exports from the compliance system and the employee roster,
 * then generates an updated associates-data.js file for the badge tracker website.
 * 
 * Expected CSV files (place in same directory as this script):
 *   - pit-safety.csv    (PIT Safety Compliance export)
 *   - yard-safety.csv   (Yard Safety Compliance export)
 *   - employee-list.csv (Employee List export from AVV2)
 * 
 * Usage:
 *   node update-data.js
 * 
 * Training ID Mapping:
 *   1: Auto Pallet Wrapper (Annual)
 *   2: Auto Slam (Annual)
 *   3: Destuff-IT (Annual)
 *   4: Jam Clear (Annual)
 *   5: Robotic Pallet Wrapper (Annual)
 *   6: Vacuum Lift (Annual)
 *   7: VRC (Annual)
 *   8: TDR/GTDR (Annual)
 *   9: Yard (Annual)
 *   10: PIT 101 (Annual)
 *   11: Fall Protection (Annual)
 *   12: Tugger (PTOW) (3-Year)
 *   13: Electric Pallet Jack (EPJ) (3-Year)
 *   14: Order Picker (LO) (3-Year)
 *   15: Sit Down (LF) (3-Year)
 *   16: Stand Up (LF) (3-Year)
 *   17: High Reach (LF) (3-Year)
 *   18: Centre Rider (3-Year)
 *   19: Turret Truck (3-Year)
 */

const fs = require('fs');
const path = require('path');

// --- Configuration ---

const SCRIPT_DIR = __dirname;
const PIT_CSV_PATH = path.join(SCRIPT_DIR, 'pit-safety.csv');
const YARD_CSV_PATH = path.join(SCRIPT_DIR, 'yard-safety.csv');
const EMPLOYEE_CSV_PATH = path.join(SCRIPT_DIR, 'employee-list.csv');
const OUTPUT_PATH = path.join(SCRIPT_DIR, 'associates-data.js');
const EXISTING_DATA_PATH = path.join(SCRIPT_DIR, 'associates-data.js');

// Training IDs covered by the PIT CSV
const PIT_TOPIC_MAP = {
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
};

// Training IDs covered by the Yard CSV
const YARD_TOPIC_MAP = {
  '01. Yard Access': 9,
  '02. GTDR': 8,
  '02. TDR': 8,
};

// Training duration in days for calculating completed date from expiry
const TRAINING_DURATION_DAYS = {
  8: 365,   // TDR/GTDR (Annual)
  9: 365,   // Yard (Annual)
  10: 365,  // PIT 101 (Annual)
  11: 365,  // Fall Protection (Annual)
  12: 1095, // Tugger (PTOW) (3-Year)
  13: 1095, // EPJ (3-Year)
  14: 1095, // Order Picker (3-Year)
  15: 1095, // Sit Down (3-Year)
  16: 1095, // Stand Up (3-Year)
  17: 1095, // High Reach (3-Year)
  18: 1095, // Centre Rider (3-Year)
  19: 1095, // Turret Truck (3-Year)
};

// IDs that come from the new CSVs (will be replaced)
const CSV_COVERED_IDS = new Set([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

// IDs that are NOT covered by these CSVs (preserve from existing data)
const PRESERVED_IDS = new Set([1, 2, 3, 4, 5, 6, 7]);

// --- CSV Parsing ---

/**
 * Parse a CSV string into an array of objects using header row as keys.
 * Handles quoted fields containing commas and newlines.
 */
function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (inQuotes) {
      if (char === '"') {
        // Check for escaped quote (double quote)
        if (i + 1 < content.length && content[i + 1] === '"') {
          currentField += '"';
          i += 2;
        } else {
          // End of quoted field
          inQuotes = false;
          i++;
        }
      } else {
        currentField += char;
        i++;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
        i++;
      } else if (char === '\n' || (char === '\r' && content[i + 1] === '\n')) {
        currentRow.push(currentField.trim());
        currentField = '';
        if (currentRow.length > 1 || currentRow[0] !== '') {
          rows.push(currentRow);
        }
        currentRow = [];
        i += (char === '\r') ? 2 : 1;
      } else {
        currentField += char;
        i++;
      }
    }
  }

  // Don't forget the last field/row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 1 || currentRow[0] !== '') {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  // First row is headers
  const headers = rows[0];
  const data = [];

  for (let r = 1; r < rows.length; r++) {
    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      obj[headers[c]] = (c < rows[r].length) ? rows[r][c] : '';
    }
    data.push(obj);
  }

  return data;
}

// --- Date Utilities ---

/**
 * Parse a date string in various formats and return YYYY-MM-DD.
 * Supports: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, D/M/YYYY
 */
function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  dateStr = dateStr.trim();

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // DD/MM/YYYY or D/M/YYYY format (Australian date format - day first)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('/');
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  // Try native Date parsing as fallback
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  return null;
}

/**
 * Subtract days from a date string and return YYYY-MM-DD.
 */
function subtractDays(dateStr, days) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

// --- Manager Name Formatting ---

/**
 * Convert "Last,First" or "Last, First" format to "First Last".
 * If already in "First Last" format, return as-is.
 */
function formatManagerName(name) {
  if (!name || name.trim() === '') return '';
  name = name.trim();

  if (name.includes(',')) {
    const parts = name.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      return `${parts[1]} ${parts[0]}`;
    }
  }

  return name;
}

// --- Extract Existing Data ---

/**
 * Parse the existing associates-data.js to extract current records.
 * Returns a map of login -> associate object.
 */
function parseExistingData(filePath) {
  const existingMap = new Map();

  if (!fs.existsSync(filePath)) {
    console.log('No existing associates-data.js found. Starting fresh.');
    return existingMap;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    // Use a function constructor to evaluate the JS and get the data
    const fn = new Function(content + '\nreturn ASSOCIATES_DATA;');
    const data = fn();

    for (const assoc of data) {
      existingMap.set(assoc.login, assoc);
    }

    console.log(`Loaded ${existingMap.size} existing associate records.`);
  } catch (err) {
    console.error('Warning: Could not parse existing data file:', err.message);
    console.log('Will proceed without preserving existing records for IDs 1-7.');
  }

  return existingMap;
}

// --- Main Processing ---

function main() {
  console.log('=== Badge Tracker Data Update ===\n');

  // Check for required CSV files
  const missingFiles = [];
  if (!fs.existsSync(PIT_CSV_PATH)) missingFiles.push('pit-safety.csv');
  if (!fs.existsSync(YARD_CSV_PATH)) missingFiles.push('yard-safety.csv');
  if (!fs.existsSync(EMPLOYEE_CSV_PATH)) missingFiles.push('employee-list.csv');

  if (missingFiles.length > 0) {
    console.error('ERROR: Missing required CSV files:');
    missingFiles.forEach(f => console.error(`  - ${f}`));
    console.error(`\nPlease place the CSV files in: ${SCRIPT_DIR}`);
    console.error('\nExpected files:');
    console.error('  - pit-safety.csv    (PIT Safety Compliance export)');
    console.error('  - yard-safety.csv   (Yard Safety Compliance export)');
    console.error('  - employee-list.csv (Employee List / Roster export)');
    process.exit(1);
  }

  // Load existing data for preserving IDs 1-7
  const existingData = parseExistingData(EXISTING_DATA_PATH);

  // Parse CSV files
  console.log('Parsing CSV files...');

  const pitContent = fs.readFileSync(PIT_CSV_PATH, 'utf-8');
  const pitRows = parseCSV(pitContent);
  console.log(`  PIT Safety CSV: ${pitRows.length} rows`);

  const yardContent = fs.readFileSync(YARD_CSV_PATH, 'utf-8');
  const yardRows = parseCSV(yardContent);
  console.log(`  Yard Safety CSV: ${yardRows.length} rows`);

  const empContent = fs.readFileSync(EMPLOYEE_CSV_PATH, 'utf-8');
  const empRows = parseCSV(empContent);
  console.log(`  Employee List CSV: ${empRows.length} rows`);

  // Build employee base roster
  console.log('\nBuilding employee roster...');
  const associates = new Map(); // login -> associate object

  for (const emp of empRows) {
    const login = (emp['User ID'] || '').trim().toLowerCase();
    if (!login) continue;

    const fullName = (emp['Employee Name'] || '').trim();
    const startDate = parseDate(emp['Employment Start Date'] || '');
    const managerName = formatManagerName(emp['Manager Name'] || '');
    const tempAgencyCode = (emp['Temp Agency Code'] || '').trim();
    const employmentType = tempAgencyCode ? '3PTY' : 'AMZN';
    const status = (emp['Employee Status'] || '').trim().toLowerCase();

    // Only include active employees
    if (status && status !== 'active' && status !== '') {
      continue;
    }

    associates.set(login, {
      login,
      full_name: fullName,
      start_date: startDate || '',
      employment_type: employmentType,
      manager_name: managerName,
      records: {},
    });
  }

  console.log(`  ${associates.size} active employees in roster.`);

  // Preserve existing records for IDs 1-7 (not covered by new CSVs)
  console.log('\nPreserving existing records for training IDs 1-7...');
  let preservedCount = 0;

  for (const [login, assoc] of associates) {
    const existing = existingData.get(login);
    if (existing && existing.records) {
      for (const [idStr, record] of Object.entries(existing.records)) {
        const id = parseInt(idStr);
        if (PRESERVED_IDS.has(id)) {
          assoc.records[id] = record;
          preservedCount++;
        }
      }
    }
  }

  console.log(`  Preserved ${preservedCount} records.`);

  // Process PIT Safety CSV
  console.log('\nProcessing PIT Safety compliance data...');
  let pitRecords = 0;

  for (const row of pitRows) {
    const compliant = (row['Compliant Yes/No'] || '').trim();
    if (compliant !== 'Yes') continue;

    const topic = (row['Topic'] || '').trim();
    const login = (row['Emp Login'] || '').trim().toLowerCase();

    if (!login || !topic) continue;

    // Find matching training ID
    let trainingId = null;
    for (const [topicPrefix, id] of Object.entries(PIT_TOPIC_MAP)) {
      if (topic === topicPrefix || topic.startsWith(topicPrefix)) {
        trainingId = id;
        break;
      }
    }

    if (trainingId === null) continue;

    // Get expiry date from "Theory Expiry Date" column
    const expiryStr = parseDate(row['Theory Expiry Date'] || '');
    if (!expiryStr) continue;

    // Calculate completed date (expiry - duration)
    const duration = TRAINING_DURATION_DAYS[trainingId];
    const completedStr = subtractDays(expiryStr, duration);

    if (!completedStr) continue;

    // Add/update record for this associate
    let assoc = associates.get(login);
    if (!assoc) {
      // Associate not in employee list but has compliance record
      // Create entry using data from PIT CSV
      const fullName = (row['Full Name'] || '').trim();
      assoc = {
        login,
        full_name: fullName,
        start_date: parseDate(row['Last Hire Date'] || '') || '',
        employment_type: (row['Regular / Temp'] || '').includes('Temp') ? '3PTY' : 'AMZN',
        manager_name: '',
        records: {},
      };

      // Try to get preserved records from existing data
      const existing = existingData.get(login);
      if (existing && existing.records) {
        for (const [idStr, record] of Object.entries(existing.records)) {
          const id = parseInt(idStr);
          if (PRESERVED_IDS.has(id)) {
            assoc.records[id] = record;
          }
        }
      }

      associates.set(login, assoc);
    }

    assoc.records[trainingId] = {
      completed: completedStr,
      expiry: expiryStr,
      trainer: 'AVV2 Safety',
    };
    pitRecords++;
  }

  console.log(`  Added ${pitRecords} PIT training records.`);

  // Process Yard Safety CSV
  console.log('\nProcessing Yard Safety compliance data...');
  let yardRecords = 0;

  for (const row of yardRows) {
    const compliant = (row['Compliant Yes/No'] || '').trim();
    if (compliant !== 'Yes') continue;

    const topic = (row['Topic'] || '').trim();
    const login = (row['Emp Login'] || '').trim().toLowerCase();

    if (!login || !topic) continue;

    // Find matching training ID
    let trainingId = null;
    for (const [topicPrefix, id] of Object.entries(YARD_TOPIC_MAP)) {
      if (topic === topicPrefix || topic.startsWith(topicPrefix)) {
        trainingId = id;
        break;
      }
    }

    if (trainingId === null) continue;

    // Determine which expiry column to use based on topic
    let expiryStr = null;
    if (trainingId === 9) {
      // Yard Access: use "Expiry Date" column
      expiryStr = parseDate(row['Expiry Date'] || '');
    } else if (trainingId === 8) {
      // TDR/GTDR: use "Theory Expiry Date" column
      expiryStr = parseDate(row['Theory Expiry Date'] || '');
    }

    if (!expiryStr) continue;

    // Calculate completed date (expiry - 365 days for both)
    const duration = TRAINING_DURATION_DAYS[trainingId];
    const completedStr = subtractDays(expiryStr, duration);

    if (!completedStr) continue;

    // Add/update record for this associate
    let assoc = associates.get(login);
    if (!assoc) {
      // Associate not in employee list but has compliance record
      const fullName = (row['Full Name'] || '').trim();
      assoc = {
        login,
        full_name: fullName,
        start_date: parseDate(row['Last Hire Date'] || '') || '',
        employment_type: (row['Regular / Temp'] || '').includes('Temp') ? '3PTY' : 'AMZN',
        manager_name: '',
        records: {},
      };

      // Try to get preserved records from existing data
      const existing = existingData.get(login);
      if (existing && existing.records) {
        for (const [idStr, record] of Object.entries(existing.records)) {
          const id = parseInt(idStr);
          if (PRESERVED_IDS.has(id)) {
            assoc.records[id] = record;
          }
        }
      }

      associates.set(login, assoc);
    }

    assoc.records[trainingId] = {
      completed: completedStr,
      expiry: expiryStr,
      trainer: 'AVV2 Safety',
    };
    yardRecords++;
  }

  console.log(`  Added ${yardRecords} Yard training records.`);

  // Generate output
  console.log('\nGenerating associates-data.js...');

  const associatesList = Array.from(associates.values());

  // Sort by login for consistency
  associatesList.sort((a, b) => a.login.localeCompare(b.login));

  // Build output string
  let output = 'const ASSOCIATES_DATA = [\n';

  for (const assoc of associatesList) {
    // Sort records by training ID
    const sortedRecords = {};
    const recordKeys = Object.keys(assoc.records).map(Number).sort((a, b) => a - b);
    for (const key of recordKeys) {
      sortedRecords[key] = assoc.records[key];
    }

    // Build records string
    let recordsStr = '{ ';
    const recordParts = [];
    for (const [id, rec] of Object.entries(sortedRecords)) {
      recordParts.push(
        `${id}: { completed: '${rec.completed}', expiry: '${rec.expiry}', trainer: '${rec.trainer}' }`
      );
    }
    recordsStr += recordParts.join(', ');
    recordsStr += ' }';

    // Escape single quotes in strings
    const escapedName = assoc.full_name.replace(/'/g, "\\'");
    const escapedManager = assoc.manager_name.replace(/'/g, "\\'");

    output += `  { login: '${assoc.login}', full_name: '${escapedName}', start_date: '${assoc.start_date}', employment_type: '${assoc.employment_type}', manager_name: '${escapedManager}', records: ${recordsStr} },\n`;
  }

  output += '];\n';

  // Write output file
  fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');

  console.log(`\nDone! Updated ${OUTPUT_PATH}`);
  console.log(`  Total associates: ${associatesList.length}`);
  console.log(`  Associates with training records: ${associatesList.filter(a => Object.keys(a.records).length > 0).length}`);
  console.log(`  Total training records: ${associatesList.reduce((sum, a) => sum + Object.keys(a.records).length, 0)}`);
}

// Run
main();
