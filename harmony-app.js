// --- Fetch latest data from GitHub on page load ---
async function loadFromGitHub() {
  const token = localStorage.getItem('badgeTracker_githubToken') || 'REDACTED_TOKEN';
  if (!token) return null;
  try {
    const resp = await fetch('https://api.github.com/repos/nellyvw/badge-tracker/contents/associates-data.js?ref=main', {
      headers: { 'Authorization': 'token ' + token }
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const content = atob(data.content);
    const fn = new Function(content + '; return ASSOCIATES_DATA;');
    return fn();
  } catch(e) { console.log('GitHub fetch failed, using local data', e.message); }
  return null;
}

async function loadProcessTrainingFromGitHub() {
  const token = localStorage.getItem('badgeTracker_githubToken') || 'REDACTED_TOKEN';
  if (!token) return null;
  try {
    const resp = await fetch('https://api.github.com/repos/nellyvw/badge-tracker/contents/process-training-data.js?ref=main', {
      headers: { 'Authorization': 'token ' + token }
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const content = atob(data.content);
    const fn = new Function(content + '; return PROCESS_TRAINING_DATA;');
    return fn();
  } catch(e) { console.log('GitHub process training fetch failed', e.message); }
  return null;
}

(async function() {
  if (sessionStorage.getItem("_ghLoaded")) return;
  sessionStorage.setItem("_ghLoaded", "1");
  const ghAssociates = await loadFromGitHub();
  if (ghAssociates) {
    localStorage.setItem('badgeTracker_associatesData', JSON.stringify(ghAssociates));
    console.log('Loaded associates data from GitHub (' + ghAssociates.length + ' entries)');
  }
  const ghProcess = await loadProcessTrainingFromGitHub();
  if (ghProcess) {
    localStorage.setItem('badgeTracker_processData', JSON.stringify(ghProcess));
    console.log('Loaded process training data from GitHub');
  }
  if (ghAssociates || ghProcess) { location.reload(); }
})();

// ── Trainings ────────────────────────────────────────────────────────────────
const TRAININGS = [
  { id:1,  name:'Auto Pallet Wrapper',       category:'Annual',  days:365 },
  { id:2,  name:'Auto Slam',                 category:'Annual',  days:365 },
  { id:3,  name:'Destuff-IT',                category:'Annual',  days:365 },
  { id:4,  name:'Jam Clear',                 category:'Annual',  days:365 },
  { id:5,  name:'Robotic Pallet Wrapper',    category:'Annual',  days:365 },
  { id:6,  name:'Vacuum Lift',               category:'Annual',  days:365 },
  { id:7,  name:'VRC',                       category:'Annual',  days:365 },
  { id:8,  name:'TDR/GTDR',                  category:'Annual',  days:365 },
  { id:9,  name:'Yard',                      category:'Annual',  days:365 },
  { id:10, name:'PIT 101',                   category:'Annual',  days:365 },
  { id:11, name:'Fall Protection',           category:'Annual',  days:365 },
  { id:12, name:'Tugger (PTOW)',             category:'3-Year',  days:1095 },
  { id:13, name:'Electric Pallet Jack (EPJ)',category:'3-Year',  days:1095 },
  { id:14, name:'Order Picker (LO)',         category:'3-Year',  days:1095 },
  { id:15, name:'Sit Down (LF)',             category:'3-Year',  days:1095 },
  { id:16, name:'Stand Up (LF)',             category:'3-Year',  days:1095 },
  { id:17, name:'High Reach (LF)',           category:'3-Year',  days:1095 },
  { id:18, name:'Centre Rider',              category:'3-Year',  days:1095 },
  { id:19, name:'Turret Truck',              category:'3-Year',  days:1095 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}
function avatarColor(type) {
  return type === '3PTY' ? 'from-green-400 to-green-600' : 'from-blue-500 to-blue-700';
}
function avatarHtml(login, fullName, type, size = 'md') {
  const sizeMap = { sm: ['w-9 h-9','text-xs'], md: ['w-16 h-16','text-xl'] };
  const [sizeClass, textClass] = sizeMap[size] || sizeMap.md;
  const initials = getInitials(fullName);
  const color = avatarColor(type);
  // Try local photo first, then corp badge photo, then initials
  const localPhoto = `photos/${login}.jpg`;
  const corpPhoto = `https://badgephotos.corp.amazon.com/?uid=${login.trim()}`;
  return `<div class="${sizeClass} rounded-full flex-shrink-0 overflow-hidden">
    <img src="${localPhoto}" alt="${fullName}"
      class="${sizeClass} rounded-full object-cover"
      onerror="this.src='${corpPhoto}';this.onerror=function(){this.style.display='none';this.nextElementSibling.style.display='flex'}"
    /><div class="${sizeClass} rounded-full bg-gradient-to-br ${color} items-center justify-center text-white ${textClass} font-bold" style="display:none">${initials}</div>
  </div>`;
}
function getStatus(expiryDate) {
  const today = new Date(); today.setHours(0,0,0,0);
  const expiry = new Date(expiryDate); expiry.setHours(0,0,0,0);
  const diff = Math.ceil((expiry - today) / 86400000);
  if (diff < 0)   return { status:'expired',       days: diff };
  if (diff <= 30) return { status:'expiring_soon', days: diff };
  return               { status:'active',          days: diff };
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-CA');
}
function fmtStart(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-AU', {day:'2-digit', month:'short', year:'numeric'});
}
function buildAssocData(a) {
  const trainings = TRAININGS.map(t => {
    const rec = a.records[t.id];
    if (!rec) return { ...t, status:'not_trained', days:null, completed:null, expiry:null, trainer:null };
    const { status, days } = getStatus(rec.expiry);
    return { ...t, status, days, completed: rec.completed, expiry: rec.expiry, trainer: rec.trainer };
  });
  const summary = {
    active:        trainings.filter(t => t.status==='active').length,
    expiring_soon: trainings.filter(t => t.status==='expiring_soon').length,
    expired:       trainings.filter(t => t.status==='expired').length,
    not_trained:   trainings.filter(t => t.status==='not_trained').length,
  };
  return { ...a, trainings, summary, initials: getInitials(a.full_name), color: avatarColor(a.employment_type) };
}

// Load data — use localStorage if available (from CSV uploads), otherwise use file data
let _associatesSource = ASSOCIATES_DATA;
let _processTrainingSource = (typeof PROCESS_TRAINING_DATA !== 'undefined') ? PROCESS_TRAINING_DATA : {};

try {
  const savedAssociates = localStorage.getItem('badgeTracker_associatesData');
  if (savedAssociates) {
    _associatesSource = JSON.parse(savedAssociates);
    console.log('Loaded associates data from localStorage (' + _associatesSource.length + ' entries)');
  }
} catch(e) { /* use file data */ }

try {
  const savedProcess = localStorage.getItem('badgeTracker_processData');
  if (savedProcess) {
    const parsed = JSON.parse(savedProcess);
    Object.assign(_processTrainingSource, parsed);
    console.log('Loaded process training data from localStorage');
  }
} catch(e) { /* use file data */ }

// Make PROCESS_TRAINING_DATA mutable and use the loaded source
if (typeof PROCESS_TRAINING_DATA !== 'undefined') {
  for (const [k, v] of Object.entries(_processTrainingSource)) {
    PROCESS_TRAINING_DATA[k] = v;
  }
}

// Add sequential IDs to associates
const ASSOCIATES = _associatesSource.map((a, i) => ({ ...a, id: i + 1 }));

// ── Status badge ──────────────────────────────────────────────────────────────
function statusBadgeHtml(status) {
  const map = {
    active:        ['bg-green-100 text-green-800 border-green-300', '✓ Active'],
    expiring_soon: ['bg-amber-100 text-amber-800 border-amber-300', '⚠ Expiring'],
    expired:       ['bg-red-100 text-red-800 border-red-300',       '✕ Expired'],
    not_trained:   ['bg-gray-100 text-gray-500 border-gray-300',    '— Not Trained'],
  };
  const [cls, label] = map[status] || map.not_trained;
  return `<span class="text-xs font-semibold px-2 py-0.5 rounded-full border ${cls} whitespace-nowrap">${label}</span>`;
}

// ── Training card ─────────────────────────────────────────────────────────────
function trainingCardHtml(t) {
  const border = { active:'border-green-200', expiring_soon:'border-amber-300', expired:'border-red-300', not_trained:'border-gray-200' }[t.status];
  const bg     = { active:'bg-white', expiring_soon:'bg-amber-50', expired:'bg-red-50', not_trained:'bg-gray-50' }[t.status];
  let daysHtml = '';
  if (t.status === 'not_trained') {
    daysHtml = `<p class="text-xs text-gray-400 mt-1">No record on file</p>`;
  } else {
    let dl = t.days < 0
      ? `<span class="text-red-600 font-semibold">${Math.abs(t.days)} days overdue</span>`
      : t.days === 0 ? `<span class="text-red-600 font-semibold">Expires today!</span>`
      : `<span class="text-gray-500">${t.days} days remaining</span>`;
    daysHtml = `<p class="text-xs text-gray-500"><span class="font-medium">Expires:</span> ${fmtDate(t.expiry)}</p><p class="text-xs mt-0.5">${dl}</p>`;
  }
  return `<div class="rounded-xl border-2 p-3 ${border} ${bg} card-hover">
    <div class="flex items-start justify-between gap-2 mb-1">
      <h3 class="font-semibold text-gray-800 text-sm leading-tight">${t.name}</h3>
      ${statusBadgeHtml(t.status)}
    </div>${daysHtml}</div>`;
}


// ── Badge Page ────────────────────────────────────────────────────────────────

// Process training categories for grouping
const PROCESS_CATEGORIES = {
  'ICQA': ['SBC', 'CC', 'SRC'],
  'Inbound': ['RSR', 'Dock', 'Receive', 'Stow', 'IB PS'],
  'Outbound': ['Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack'],
  'PIT': ['Order Picker', 'Turret Truck', 'Sit Down', 'Stand Up', 'High Reach', 'Electric Pallet Jack', 'TOW Tugger', 'Ride On Tugger', 'Centre Rider'],
  'Other': ['VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap', 'Prep', 'Cubiscan', 'Waterspider']
};

function renderProcessTrainingTab(login) {
  const pd = (typeof PROCESS_TRAINING_DATA !== 'undefined') && PROCESS_TRAINING_DATA[login];
  
  if (!pd || pd.processes.length === 0) {
    return `<div class="text-center py-12">
      <div class="text-4xl mb-3">📋</div>
      <p class="text-gray-400 text-base">No process training recorded</p>
    </div>`;
  }

  const totalProcesses = Object.values(PROCESS_CATEGORIES).flat().length;
  const percentage = Math.round((pd.processes.length / totalProcesses) * 100);

  let html = '';
  html += `<div class="text-center mb-6">
    <h2 class="text-lg font-bold text-gray-700 uppercase tracking-wider bg-gray-200 border border-gray-300 py-2 rounded-xl">Process Training</h2>
  </div>`;

  html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';

  const categoryIcons = { 'ICQA': '🔍', 'Inbound': '📦', 'Outbound': '🚚', 'PIT': '🚜', 'Other': '⚙️' };
  const categoryColors = {
    'ICQA': { bg: 'bg-blue-50', border: 'border-blue-200', header: 'bg-blue-100 text-blue-800', chip: 'bg-blue-100 text-blue-700 border-blue-300' },
    'Inbound': { bg: 'bg-teal-50', border: 'border-teal-200', header: 'bg-teal-100 text-teal-800', chip: 'bg-teal-100 text-teal-700 border-teal-300' },
    'Outbound': { bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-100 text-orange-800', chip: 'bg-orange-100 text-orange-700 border-orange-300' },
    'PIT': { bg: 'bg-yellow-50', border: 'border-yellow-200', header: 'bg-yellow-100 text-yellow-800', chip: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    'Other': { bg: 'bg-violet-50', border: 'border-violet-200', header: 'bg-violet-100 text-violet-800', chip: 'bg-violet-100 text-violet-700 border-violet-300' }
  };

  for (const [category, procs] of Object.entries(PROCESS_CATEGORIES)) {
    const trained = procs.filter(p => pd.processes.includes(p) || (pd.pitProcesses && pd.pitProcesses.includes(p)));
    const colors = categoryColors[category];
    const icon = categoryIcons[category];
    const catPct = procs.length > 0 ? Math.round((trained.length / procs.length) * 100) : 0;

    html += `<div class="${colors.bg} border ${colors.border} rounded-2xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-base font-bold ${colors.header} px-3 py-1 rounded-lg">${icon} ${category}</h3>
      </div>
      <div class="flex flex-wrap gap-2">`;

    for (const proc of procs) {
      const isTrained = trained.includes(proc);
      if (isTrained) {
        html += `<span class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold ${colors.chip} border shadow-sm">
          <span>✓</span> ${proc}
        </span>`;
      } else {
        html += `<span class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 border border-gray-200">
          ${proc}
        </span>`;
      }
    }

    html += `</div>
    </div>`;
  }

  html += '</div>';
  return html;
}

function switchBadgeTab(tab) {
  const certsTab = document.getElementById('badge-tab-certs');
  const procsTab = document.getElementById('badge-tab-processes');
  const certsContent = document.getElementById('badge-content-certs');
  const procsContent = document.getElementById('badge-content-processes');
  if (!certsTab || !procsTab || !certsContent || !procsContent) return;

  if (tab === 'certs') {
    certsTab.className = 'px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 border border-indigo-300 text-indigo-700 shadow-sm';
    procsTab.className = 'px-4 py-2 rounded-lg text-sm font-semibold bg-white/40 border border-gray-300 text-gray-500';
    certsContent.classList.remove('hidden');
    procsContent.classList.add('hidden');
  } else {
    procsTab.className = 'px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 border border-indigo-300 text-indigo-700 shadow-sm';
    certsTab.className = 'px-4 py-2 rounded-lg text-sm font-semibold bg-white/40 border border-gray-300 text-gray-500';
    procsContent.classList.remove('hidden');
    certsContent.classList.add('hidden');
  }
}

function renderBadgePage(a) {
  const d = buildAssocData(a);
  const allTrainings = d.trainings;
  const overall = d.summary.expired > 0 ? 'expired' : d.summary.expiring_soon > 0 ? 'expiring_soon' : 'active';
  const statusGlow = { expired: 'shadow-red-500/20', expiring_soon: 'shadow-amber-500/20', active: 'shadow-green-500/20' }[overall];
  const statusRing = { expired: 'ring-red-400', expiring_soon: 'ring-amber-400', active: 'ring-green-400' }[overall];
  const ringGlow = { expired: 'ring-glow-red', expiring_soon: 'ring-glow-amber', active: 'ring-glow-green' }[overall];
  const typeBadge = d.employment_type === '3PTY'
    ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">Casual</span>`
    : `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-300">Full-Time</span>`;
  const pill = (n, lbl, cls) => n > 0 ? `<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cls}"><span class="text-base font-bold">${n}</span>${lbl}</span>` : '';
  const avatarEl = avatarHtml(d.login, d.full_name, d.employment_type, 'md');

  // Build training items for scroll wheel
  // Split trainings into annual and 3-year
  const annualTrainings = allTrainings.filter(t => t.category === 'Annual');
  const threeYearTrainings = allTrainings.filter(t => t.category !== 'Annual');

  const buildCard = (t, idx) => {
    const statusColors = {
      active: { bg: 'bg-green-50', border: 'border-green-400', icon: '✓', iconColor: 'text-green-600', label: 'Active' },
      expiring_soon: { bg: 'bg-amber-50', border: 'border-amber-300', icon: '⚠', iconColor: 'text-amber-600', label: 'Expiring' },
      expired: { bg: 'bg-red-50', border: 'border-red-400', icon: '✕', iconColor: 'text-red-600', label: 'Expired' },
      not_trained: { bg: 'bg-gray-50', border: 'border-gray-200', icon: '—', iconColor: 'text-gray-400', label: 'Not Trained' }
    };
    const s = statusColors[t.status];
    const expiryInfo = t.status === 'not_trained' ? 'No record on file'
      : t.days < 0 ? `${Math.abs(t.days)} days overdue`
      : t.days === 0 ? 'Expires today'
      : `${t.days} days remaining`;
    const pulseClass = t.status === 'expired' ? 'expired-pulse' : '';
    const shimmerClass = t.status === 'active' ? 'active-shimmer' : '';
    return `<div class="wheel-item ${s.bg} border ${s.border} rounded-2xl p-5 shadow-sm transition-all duration-300 ${pulseClass} ${shimmerClass}" data-index="${idx}">
      <div class="flex items-center gap-2 mb-2">
        ${t.status !== 'not_trained' ? `<span class="${s.iconColor} text-xl">${s.icon}</span>` : ''}
        <h3 class="font-bold text-gray-900 text-lg leading-tight">${t.name}</h3>
      </div>
      <p class="text-sm font-medium ${s.iconColor} mb-2">${expiryInfo}</p>
      <div class="text-sm text-gray-500 space-y-1">
        ${t.status !== 'not_trained' ? `<div>Completed: <span class="font-medium">${fmtDate(t.completed)}</span></div>
        <div>Expires: <span class="font-semibold">${fmtDate(t.expiry)}</span></div>` : `<div>&nbsp;</div>
        <div>&nbsp;</div>`}
      </div>
    </div>`;
  };

  const annualItems = annualTrainings.map((t, idx) => buildCard(t, idx)).join('');
  const threeYearItems = threeYearTrainings.map((t, idx) => buildCard(t, idx + annualTrainings.length)).join('');

  return `<div class="min-h-screen badge-page-bg relative overflow-hidden">

    <!-- Animated gradient background -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="gradient-blob blob-1"></div>
      <div class="gradient-blob blob-2"></div>
      <div class="gradient-blob blob-3"></div>
      <div class="gradient-blob blob-4"></div>
    </div>

    ${d.login === 'basrezae' ? `
    <!-- basrezae wallpaper background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <img src="photos/basrezae-bg.png" alt="" class="w-full h-full object-contain opacity-25" style="object-position: center 70%;">
    </div>
    ` : ''}
    ${d.login === 'celischr' ? `
    <!-- Sad hamster tiled background -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-20" style="background-image: url('photos/sad-hamster.jpg'); background-size: 150px; background-repeat: repeat;"></div>
    ` : ''}
    ${d.login === 'nellyvw' || d.login === 'gidluong' ? `
    <!-- nellyvw/gidluong wallpaper background -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <img src="photos/nellyvw-bg.png" alt="" class="w-full h-full object-contain opacity-25" style="object-position: center 70%;">
    </div>
    ` : ''}

    <div class="relative z-10 max-w-7xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="text-center mb-2">
        <p class="text-xs text-gray-500 uppercase tracking-widest">Certification Status</p>
      </div>

      <!-- Profile Card -->
      <div class="profile-enter bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 mb-6 shadow-xl ${statusGlow}">
        <div class="flex flex-col items-center text-center">
          <div class="ring-2 ${statusRing} ring-offset-2 ring-offset-transparent rounded-full mb-3 ${ringGlow}">
            ${avatarEl}
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mb-1">${d.full_name}</h1>
          <p class="text-gray-500 text-base font-mono mb-2">${d.login}</p>
          <div class="flex items-center gap-2 mb-2">
            ${typeBadge}
            ${d.manager_name ? `<span class="text-sm text-gray-500">· ${d.manager_name}</span>` : ''}
          </div>
          ${d.start_date ? `<p class="text-sm text-gray-500 mb-3">Started: ${fmtStart(d.start_date)}</p>` : ''}
          ${d.login === 'basrezae' ? `<p class="text-xs italic text-gray-400 mb-2">"Sexy Beast from the Middle East"</p>` : ''}
          <div class="flex flex-wrap justify-center gap-2">
            ${pill(d.summary.active,'Active','bg-green-100 text-green-700 border border-green-300')}
            ${pill(d.summary.expiring_soon,'Expiring','bg-amber-100 text-amber-700 border border-amber-300')}
            ${pill(d.summary.expired,'Expired','bg-red-100 text-red-700 border border-red-300')}
            ${pill(d.summary.not_trained,'Untrained','bg-gray-100 text-gray-500 border border-gray-300')}
          </div>

        </div>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center gap-2 mb-4">
        <button onclick="switchBadgeTab('certs')" id="badge-tab-certs" class="px-4 py-2 rounded-lg text-sm font-semibold bg-white/80 border border-indigo-300 text-indigo-700 shadow-sm">Certifications</button>
        <button onclick="switchBadgeTab('processes')" id="badge-tab-processes" class="px-4 py-2 rounded-lg text-sm font-semibold bg-white/40 border border-gray-300 text-gray-500">Process Training</button>
      </div>

      <!-- Tab: Certifications -->
      <div id="badge-content-certs">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Annual Certs Column -->
        <div>
          <h2 class="text-lg font-bold text-gray-700 uppercase tracking-wider mb-4 text-center bg-gray-200 border border-gray-300 py-2 rounded-xl">Annual Certifications</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${annualItems}
          </div>
        </div>
        <!-- 3-Year Certs Column -->
        <div>
          <h2 class="text-lg font-bold text-gray-700 uppercase tracking-wider mb-4 text-center bg-gray-200 border border-gray-300 py-2 rounded-xl">3-Year Certifications</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${threeYearItems}
          </div>
        </div>
      </div>
      </div>

      <!-- Tab: Process Training -->
      <div id="badge-content-processes" class="hidden">
        ${renderProcessTrainingTab(d.login)}
      </div>

      <p class="text-center text-[10px] text-gray-400 pt-4 pb-6 relative z-30">Amazon Training Tracker</p>
    </div>
  </div>`;
}


// ── Admin view ────────────────────────────────────────────────────────────────
let filterText = '';
let filterType = 'all';
let filterStatus = 'all'; // 'all', 'expired', 'expiring_soon'
let filterTraining = ''; // training ID to filter by
let filterManager = ''; // manager name to filter by
let filterOnsite = ''; // 'yes', 'no', or ''
let filterProcess = ''; // process path name to filter by
let sortColumn = 'name'; // 'name', 'manager', 'start_date'
let sortDir = 1; // 1 = asc, -1 = desc

function renderAdminView() {
  const total3pty = ASSOCIATES.filter(a => a.employment_type === '3PTY').length;
  const totalAmzn = ASSOCIATES.filter(a => a.employment_type === 'AMZN').length;
  const totalExpired = ASSOCIATES.filter(a => getAssociateStatus(a) === 'expired').length;
  const totalExpiring = ASSOCIATES.filter(a => getAssociateStatus(a) === 'expiring_soon').length;

  return `<div class="min-h-screen bg-gray-50 flex"><div id="sb-panel" class="w-60 min-h-screen bg-white border-r border-gray-200 flex-shrink-0 flex flex-col" style="display:none"><div class="px-5 py-5 border-b border-gray-100"><div class="flex items-center gap-3"><div class="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-md text-white text-xs font-bold">P</div><div><p class="font-bold text-gray-900 text-sm">Training Tracker</p><p class="text-[10px] text-gray-400">AVV2 Fulfilment</p></div></div></div><nav class="flex-1 px-3 py-4 space-y-1"><a onclick="window.location.hash=''" class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-indigo-600 bg-indigo-50 text-sm font-medium"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>Dashboard</a><a onclick="window.location.hash='update'" class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-50 text-sm"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload CSV</a><a onclick="window.location.hash='process-paths'" class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-gray-500 hover:bg-gray-50 text-sm"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>Process Paths</a></nav></div><div class="flex-1">
    <nav class="bg-gray-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <button onclick="var sb=document.getElementById('sb-panel');if(sb.style.display==='none'){sb.style.display='flex'}else{sb.style.display='none'}" class="p-1.5 rounded-lg hover:bg-gray-700 flex-shrink-0"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg></button><div class="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        <span class="font-bold tracking-wide text-lg truncate">Training Tracker</span>
        
      </div>
      <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span class="text-xs font-medium text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded hidden sm:inline">${localStorage.getItem('badgeTracker_lastUpdate') ? 'Updated: ' + new Date(localStorage.getItem('badgeTracker_lastUpdate')).toLocaleDateString('en-AU', {day:'numeric',month:'short',year:'numeric'}) : 'Last updated: 18 Jul 2026'}</span>
        ${localStorage.getItem('badgeTracker_associatesData') ? '<button onclick="if(confirm(\'Reset to original file data? This clears all CSV uploads from this browser.\')){localStorage.removeItem(\'badgeTracker_associatesData\');localStorage.removeItem(\'badgeTracker_processData\');localStorage.removeItem(\'badgeTracker_lastUpdate\');location.reload();}" class="text-gray-500 hover:text-red-400 p-1 rounded text-xs hidden sm:inline" title="Reset to file data">✕</button>' : ''}
        
        <div class="relative">
          <button onclick="toggleDarkMode()" class="text-gray-400 hover:text-white p-1 rounded" title="Toggle dark mode">
            <svg id="dark-icon" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          </button>
          ${localStorage.getItem('darkModeHintDismissed') === 'true' || localStorage.getItem('darkMode') === 'true' ? '' : `<div id="dark-mode-hint" class="absolute top-full right-0 mt-2 z-50 animate-bounce">
            <div class="relative bg-indigo-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
              <span>Try dark mode ✨</span>
              <button onclick="event.stopPropagation(); document.getElementById('dark-mode-hint').remove(); localStorage.setItem('darkModeHintDismissed','true');" class="text-indigo-200 hover:text-white ml-1 font-bold text-sm leading-none">&times;</button>
              <div class="absolute -top-1.5 right-3 w-3 h-3 bg-indigo-600 rotate-45"></div>
            </div>
          </div>`}
        </div>
      </div>
    </nav>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="stat-card bg-gray-50 rounded-xl border-l-4 border-gray-700 shadow-sm p-4 cursor-pointer" onclick="clearAllFilters()">
          <p class="text-xs font-medium text-gray-500 uppercase">Total Associates</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">${ASSOCIATES.length}</p>
          <p class="text-xs text-gray-400 mt-0.5">Click to reset</p>
        </div>
        <div class="stat-card bg-red-50 rounded-xl border-l-4 border-red-500 shadow-sm p-4 cursor-pointer" onclick="setStatusFilter('expired')">
          <p class="text-xs font-medium text-gray-500 uppercase">Expired Certs</p>
          <p class="text-3xl font-bold text-red-700 mt-1">${totalExpired}</p>
          <p class="text-xs text-gray-400 mt-0.5">Click to filter</p>
        </div>
        <div class="stat-card bg-amber-50 rounded-xl border-l-4 border-amber-500 shadow-sm p-4 cursor-pointer" onclick="setStatusFilter('expiring_soon')">
          <p class="text-xs font-medium text-gray-500 uppercase">Expiring Soon</p>
          <p class="text-3xl font-bold text-amber-700 mt-1">${totalExpiring}</p>
          <p class="text-xs text-gray-400 mt-0.5">Within 30 days</p>
        </div>
        <div class="stat-card bg-green-50 rounded-xl border-l-4 border-green-500 shadow-sm p-4 cursor-pointer" onclick="setTypeFilter('3PTY')">
          <p class="text-xs font-medium text-gray-500 uppercase">Casual (3PTY)</p>
          <p class="text-3xl font-bold text-green-700 mt-1">${total3pty}</p>
          <p class="text-xs text-gray-400 mt-0.5">Click to filter</p>
        </div>
        <div class="stat-card bg-blue-50 rounded-xl border-l-4 border-blue-500 shadow-sm p-4 cursor-pointer" onclick="setTypeFilter('AMZN')">
          <p class="text-xs font-medium text-gray-500 uppercase">Full-Time (AMZN)</p>
          <p class="text-3xl font-bold text-blue-700 mt-1">${totalAmzn}</p>
          <p class="text-xs text-gray-400 mt-0.5">Click to filter</p>
        </div>
      </div>

      <!-- Search + filter bar -->
      <div class="flex flex-col gap-3 mb-4">
        <div class="flex gap-2">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input id="search-input" type="text" placeholder="Search by name, login or manager..."
              oninput="filterText=this.value; renderTable()"
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onclick="toggleFilterPanel()" id="filter-toggle-btn" class="sm:hidden px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            <span class="text-xs">Filters</span>
          </button>
        </div>
        <div id="filter-panel" class="hidden sm:flex flex-col sm:flex-row gap-3">
          <select id="filter-training" onchange="filterTraining=this.value; renderTable()" class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
            <option value="">All Certifications</option>
            ${TRAININGS.map(t => '<option value="' + t.id + '">' + t.name + '</option>').join('')}
          </select>
          <select id="filter-process" onchange="filterProcess=this.value; renderTable()" class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
            <option value="">All Process Paths</option>
            ${MATRIX_PROCESSES.map(p => '<option value="' + p + '">' + p + '</option>').join('')}
          </select>
          <select id="filter-manager" onchange="filterManager=this.value; renderTable()" class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
            <option value="">All Shifts</option>
            <option value="Day">Day Shift</option>
            <option value="Night">Night Shift</option>
          </select>
          <select id="filter-onsite" onchange="filterOnsite=this.value; renderTable()" class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700">
            <option value="">All Associates</option>
            <option value="yes">Onsite</option>
            <option value="no">Not Onsite</option>
          </select>
          <div class="flex gap-2 flex-wrap">
            <button onclick="setTypeFilter('all')" id="filter-all" class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-blue-600 text-white">All</button>
            <button onclick="setTypeFilter('3PTY')" id="filter-3pty" class="px-4 py-2 rounded-lg text-sm font-medium border border-green-300 bg-white text-green-700 hover:bg-green-50">Casual</button>
            <button onclick="setTypeFilter('AMZN')" id="filter-amzn" class="px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 bg-white text-blue-700 hover:bg-blue-50">Full-Time</button>
            <span class="border-l border-gray-300 mx-1 hidden sm:block"></span>
            <button onclick="setStatusFilter('expired')" id="filter-expired" class="px-4 py-2 rounded-lg text-sm font-medium border border-red-300 bg-white text-red-700 hover:bg-red-50">Expired</button>
            <button onclick="setStatusFilter('expiring_soon')" id="filter-expiring" class="px-4 py-2 rounded-lg text-sm font-medium border border-amber-300 bg-white text-amber-700 hover:bg-amber-50">Expiring Soon</button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div id="expand-all-container" class="flex items-center gap-3 mb-2 ${filterStatus === 'expired' || filterStatus === 'expiring_soon' ? '' : 'hidden'}">
        <button onclick="expandAllAlerts()" id="expand-all-btn" class="px-4 py-2 rounded-lg border-2 border-indigo-500 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md flex items-center gap-2 transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
          <span id="expand-all-text">Expand All</span>
        </button>
        <button onclick="clearAllCompleted()" class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5 transition-all">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Clear Ticks
        </button>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead id="assoc-thead" class="bg-gray-50 border-b border-gray-200">
            </thead>
            <tbody id="assoc-tbody"></tbody>
          </table>
        </div>
        <div id="table-footer" class="px-4 py-2 text-xs text-gray-400 border-t border-gray-100"></div>
      </div>
    </div>
  </div>`;
}

function setTypeFilter(type) {
  filterType = type;
  ['all','3pty','amzn'].forEach(t => {
    const btn = document.getElementById('filter-' + t);
    if (!btn) return;
    btn.className = 'px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';
  });
  const activeId = type === 'all' ? 'filter-all' : type === '3PTY' ? 'filter-3pty' : 'filter-amzn';
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) {
    if (type === 'all') {
      activeBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-gray-700 text-white';
    } else if (type === '3PTY') {
      activeBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium border border-green-300 bg-green-600 text-white';
    } else {
      activeBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 bg-blue-600 text-white';
    }
  }
  renderTable();
}

function setStatusFilter(status) {
  // Toggle: if already active, reset to 'all'
  if (filterStatus === status) {
    filterStatus = 'all';
  } else {
    filterStatus = status;
  }
  // Update button styles
  const expiredBtn = document.getElementById('filter-expired');
  const expiringBtn = document.getElementById('filter-expiring');
  if (expiredBtn) {
    expiredBtn.className = filterStatus === 'expired'
      ? 'px-4 py-2 rounded-lg text-sm font-medium border border-red-300 bg-red-600 text-white'
      : 'px-4 py-2 rounded-lg text-sm font-medium border border-red-300 bg-white text-red-700 hover:bg-red-50';
  }
  if (expiringBtn) {
    expiringBtn.className = filterStatus === 'expiring_soon'
      ? 'px-4 py-2 rounded-lg text-sm font-medium border border-amber-300 bg-amber-500 text-white'
      : 'px-4 py-2 rounded-lg text-sm font-medium border border-amber-300 bg-white text-amber-700 hover:bg-amber-50';
  }
  renderTable();
}

function clearAllFilters() {
  filterText = '';
  filterType = 'all';
  filterStatus = 'all';
  filterTraining = '';
  filterManager = '';
  filterOnsite = '';
  filterProcess = '';
  sortColumn = 'name';
  sortDir = 1;
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  const trainingSelect = document.getElementById('filter-training');
  if (trainingSelect) trainingSelect.value = '';
  const processSelect = document.getElementById('filter-process');
  if (processSelect) processSelect.value = '';
  const managerSelect = document.getElementById('filter-manager');
  if (managerSelect) managerSelect.value = '';
  const onsiteSelect = document.getElementById('filter-onsite');
  if (onsiteSelect) onsiteSelect.value = '';
  const expiredBtn = document.getElementById('filter-expired');
  const expiringBtn = document.getElementById('filter-expiring');
  if (expiredBtn) expiredBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium border border-red-300 bg-white text-red-700 hover:bg-red-50';
  if (expiringBtn) expiringBtn.className = 'px-4 py-2 rounded-lg text-sm font-medium border border-amber-300 bg-white text-amber-700 hover:bg-amber-50';
  setTypeFilter('all');
}

function getAssociateStatus(a) {
  const today = new Date(); today.setHours(0,0,0,0);
  const records = a.records || {};
  let hasExpired = false;
  let hasExpiringSoon = false;
  for (const id of Object.keys(records)) {
    const rec = records[id];
    if (!rec.expiry) continue;
    const expiry = new Date(rec.expiry); expiry.setHours(0,0,0,0);
    const diff = Math.ceil((expiry - today) / 86400000);
    if (diff < 0) hasExpired = true;
    else if (diff <= 30) hasExpiringSoon = true;
  }
  if (hasExpired) return 'expired';
  if (hasExpiringSoon) return 'expiring_soon';
  return 'active';
}

function renderTable() {
  const tbody = document.getElementById('assoc-tbody');
  const footer = document.getElementById('table-footer');
  if (!tbody) return;

  // Reset expand all state
  allExpanded = false;
  const expandBtn = document.getElementById('expand-all-text');
  if (expandBtn) expandBtn.textContent = 'Expand All';
  // Show/hide expand all button based on filter
  const expandContainer = document.getElementById('expand-all-container');
  if (expandContainer) {
    if (filterStatus === 'expired' || filterStatus === 'expiring_soon') {
      expandContainer.classList.remove('hidden');
    } else {
      expandContainer.classList.add('hidden');
    }
  }

  // Update thead to show/hide Completed column
  const thead = document.getElementById('assoc-thead');
  if (thead) {
    const showCol = (filterStatus === 'expired' || filterStatus === 'expiring_soon');
    thead.innerHTML = `<tr>
      ${showCol ? '<th class="px-3 py-3 font-semibold text-gray-600 text-center text-xs">Updated?</th>' : ''}
      <th class="text-left px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:text-blue-600 select-none" onclick="sortBy('name')">Associate ${sortColumn==='name' ? (sortDir===1?'↑':'↓') : ''}</th>
      <th class="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
      <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell cursor-pointer hover:text-blue-600 select-none" onclick="sortBy('manager')">Manager ${sortColumn==='manager' ? (sortDir===1?'↑':'↓') : ''}</th>
      <th class="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell cursor-pointer hover:text-blue-600 select-none" onclick="sortBy('start_date')">Start Date ${sortColumn==='start_date' ? (sortDir===1?'↑':'↓') : ''}</th>
      <th class="text-right px-4 py-3 font-semibold text-gray-600"></th>
    </tr>`;
  }

  const q = filterText.toLowerCase();
  const filtered = ASSOCIATES.filter(a => {
    const matchType = filterType === 'all' || a.employment_type === filterType;
    const matchQ = !q || a.full_name.toLowerCase().includes(q)
      || a.login.toLowerCase().includes(q)
      || (a.manager_name || '').toLowerCase().includes(q);
    const matchManager = !filterManager || a.shift === filterManager;
    const matchOnsite = !filterOnsite || (function() {
      const pd = (typeof PROCESS_TRAINING_DATA !== 'undefined') && PROCESS_TRAINING_DATA[a.login];
      if (filterOnsite === 'yes') return pd && pd.onsite === true;
      if (filterOnsite === 'no') return !pd || pd.onsite === false;
      return true;
    })();
    const matchProcess = !filterProcess || (function() {
      const pd = (typeof PROCESS_TRAINING_DATA !== 'undefined') && PROCESS_TRAINING_DATA[a.login];
      if (!pd) return false;
      return pd.processes.includes(filterProcess);
    })();

    // When both training and status filters are active, check that specific training's status
    let matchStatus = true;
    let matchTraining = true;
    if (filterTraining && filterStatus !== 'all') {
      const rec = a.records && a.records[filterTraining];
      if (!rec || !rec.expiry) {
        matchTraining = false;
      } else {
        const today = new Date(); today.setHours(0,0,0,0);
        const expiry = new Date(rec.expiry); expiry.setHours(0,0,0,0);
        const diff = Math.ceil((expiry - today) / 86400000);
        const trainingStatus = diff < 0 ? 'expired' : diff <= 30 ? 'expiring_soon' : 'active';
        if (trainingStatus !== filterStatus) matchStatus = false;
      }
    } else {
      matchStatus = filterStatus === 'all' || getAssociateStatus(a) === filterStatus;
      matchTraining = !filterTraining || (a.records && a.records[filterTraining]);
    }

    return matchType && matchQ && matchStatus && matchTraining && matchManager && matchOnsite && matchProcess;
  });

  // Sort
  filtered.sort((a, b) => {
    let valA, valB;
    if (sortColumn === 'name') { valA = a.full_name.toLowerCase(); valB = b.full_name.toLowerCase(); }
    else if (sortColumn === 'manager') { valA = (a.manager_name || '').toLowerCase(); valB = (b.manager_name || '').toLowerCase(); }
    else if (sortColumn === 'start_date') { valA = a.start_date || ''; valB = b.start_date || ''; }
    else { valA = a.full_name.toLowerCase(); valB = b.full_name.toLowerCase(); }
    if (valA < valB) return -1 * sortDir;
    if (valA > valB) return 1 * sortDir;
    return 0;
  });

  // Show "Completed" checkbox column only on expired/expiring filters
  const showCompletedCol = (filterStatus === 'expired' || filterStatus === 'expiring_soon');

  tbody.innerHTML = filtered.map((a, idx) => {
    const typeBadge = a.employment_type === '3PTY'
      ? `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">Casual</span>`
      : `<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Full-Time</span>`;
    const color = avatarColor(a.employment_type);
    const initials = getInitials(a.full_name);
    const rowBg = idx % 2 === 0 ? '' : (document.body.classList.contains('dark') ? 'background-color: #162032;' : 'background-color: #f8fafc;');

    // Build alert certs (expired or expiring within 30 days)
    const alertCerts = [];
    const today = new Date(); today.setHours(0,0,0,0);
    for (const [tid, rec] of Object.entries(a.records || {})) {
      if (!rec.expiry) continue;
      const exp = new Date(rec.expiry); exp.setHours(0,0,0,0);
      const diff = Math.ceil((exp - today) / 86400000);
      const tName = TRAININGS.find(t => t.id == tid)?.name || 'ID ' + tid;
      if (diff < 0) {
        alertCerts.push({ name: tName, expiry: rec.expiry, diff, type: 'expired' });
      } else if (diff <= 30) {
        alertCerts.push({ name: tName, expiry: rec.expiry, diff, type: 'expiring' });
      }
    }

    const hasAlerts = alertCerts.length > 0;
    const isRowCompleted = getCompleted(a.login);
    const expandBtn = (hasAlerts && !isRowCompleted) ? `<button onclick="event.stopPropagation();toggleRow('row-${a.id}')" class="text-xs px-2 py-1 rounded-lg border ${alertCerts.some(c=>c.type==='expired') ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}">
        ${alertCerts.some(c=>c.type==='expired') ? '⚠️' : '⏳'} ${alertCerts.length}
        <svg class="w-3 h-3 inline ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>` : (hasAlerts && isRowCompleted) ? `<span class="text-xs px-2 py-1 rounded-lg border bg-green-50 text-green-700 border-green-200">✓ Done</span>` : '';

    const alertRow = hasAlerts ? `<tr id="row-${a.id}" class="hidden" style="${rowBg}">
      <td colspan="${showCompletedCol ? 6 : 5}" class="px-4 pb-3 pt-0">
        <div class="ml-12 flex flex-wrap gap-2">
          ${alertCerts.map(c => {
            const pillClass = c.type === 'expired'
              ? 'bg-red-100 text-red-800 border-red-300'
              : 'bg-amber-100 text-amber-800 border-amber-300';
            const label = c.type === 'expired'
              ? 'Expired ' + Math.abs(c.diff) + 'd ago'
              : c.diff + 'd left';
            return '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ' + pillClass + '">'
              + '<span class="font-semibold">' + c.name + '</span>'
              + '<span class="opacity-75">· ' + label + '</span>'
              + '</span>';
          }).join('')}
        </div>
      </td>
    </tr>` : '';

    // Completed checkbox (only when expired/expiring filter is active)
    const isChecked = getCompleted(a.login);
    const checkboxCell = showCompletedCol ? `<td class="px-3 py-3 text-center" onclick="event.stopPropagation()">
      <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCompleted('${a.login}', this.checked)"
        class="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" />
    </td>` : '';
    const strikeClass = (showCompletedCol && isChecked) ? 'opacity-50 line-through' : '';

    return `<tr style="${rowBg}" onclick="showBadge(${a.id})" class="${strikeClass}">
      ${checkboxCell}
      <td class="px-4 py-3">
        <div class="flex items-center gap-3">
          ${avatarHtml(a.login, a.full_name, a.employment_type, 'sm')}
          <div>
            <div class="font-semibold text-gray-900">${a.full_name}</div>
            <div class="text-gray-400 text-xs font-mono">${a.login}</div>
          </div>
        </div>
      </td>
      <td class="px-4 py-3">${typeBadge}</td>
      <td class="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">${a.manager_name || '—'}</td>
      <td class="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">${fmtStart(a.start_date)}</td>
      <td class="px-4 py-3 text-right flex gap-2 justify-end">
        ${expandBtn}
        <button onclick="event.stopPropagation();showBadge(${a.id})" class="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-100">View Badge</button>
      </td>
    </tr>${alertRow}`;
  }).join('');

  footer.textContent = `Showing ${filtered.length} of ${ASSOCIATES.length} associates`;
}

function toggleRow(id) {
  const row = document.getElementById(id);
  if (row) row.classList.toggle('hidden');
}

// ── Completed checkboxes (persisted in localStorage) ──────────────────────────
function getCompletedMap() {
  try { return JSON.parse(localStorage.getItem('completedAssociates') || '{}'); }
  catch { return {}; }
}
function getCompleted(login) {
  return !!getCompletedMap()[login];
}
function toggleCompleted(login, checked) {
  const map = getCompletedMap();
  if (checked) { map[login] = true; }
  else { delete map[login]; }
  localStorage.setItem('completedAssociates', JSON.stringify(map));
  renderTable();
}
function clearAllCompleted() {
  localStorage.removeItem('completedAssociates');
  renderTable();
}

let allExpanded = false;
function expandAllAlerts() {
  const alertRows = document.querySelectorAll('#assoc-tbody tr[id^="row-"]');
  allExpanded = !allExpanded;
  alertRows.forEach(row => {
    if (allExpanded) {
      row.classList.remove('hidden');
    } else {
      row.classList.add('hidden');
    }
  });
  const btnText = document.getElementById('expand-all-text');
  if (btnText) btnText.textContent = allExpanded ? 'Collapse All' : 'Expand All';
}

function sortBy(col) {
  if (sortColumn === col) { sortDir *= -1; }
  else { sortColumn = col; sortDir = 1; }
  // Re-render admin view to update header arrows
  const app = document.getElementById('app');
  app.innerHTML = renderAdminView();
  document.getElementById('search-input').value = filterText;
  const trainingSelect = document.getElementById('filter-training');
  if (trainingSelect) trainingSelect.value = filterTraining;
  const processSelect = document.getElementById('filter-process');
  if (processSelect) processSelect.value = filterProcess;
  const managerSelect = document.getElementById('filter-manager');
  if (managerSelect) managerSelect.value = filterManager;
  const onsiteSelect = document.getElementById('filter-onsite');
  if (onsiteSelect) onsiteSelect.value = filterOnsite;
  renderTable();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
  // Dismiss the dark mode hint
  const hint = document.getElementById('dark-mode-hint');
  if (hint) hint.remove();
  localStorage.setItem('darkModeHintDismissed', 'true');
  // Re-render to update row colors
  const app = document.getElementById('app');
  if (!window.location.hash.startsWith('#badge/')) {
    app.innerHTML = renderAdminView();
    document.getElementById('search-input').value = filterText;
    const trainingSelect = document.getElementById('filter-training');
    if (trainingSelect) trainingSelect.value = filterTraining;
    const processSelect = document.getElementById('filter-process');
    if (processSelect) processSelect.value = filterProcess;
    const managerSelect = document.getElementById('filter-manager');
    if (managerSelect) managerSelect.value = filterManager;
    const onsiteSelect = document.getElementById('filter-onsite');
    if (onsiteSelect) onsiteSelect.value = filterOnsite;
    renderTable();
  }
}
// Restore dark mode on load
if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');
// Hide dark mode hint if already dismissed or already in dark mode
if (localStorage.getItem('darkModeHintDismissed') === 'true' || localStorage.getItem('darkMode') === 'true') {
  const hint = document.getElementById('dark-mode-hint');
  if (hint) hint.remove();
}

function toggleFilterPanel() {
  const panel = document.getElementById('filter-panel');
  if (panel) {
    panel.classList.toggle('hidden');
    panel.classList.toggle('flex');
  }
}

// ── Routing ───────────────────────────────────────────────────────────────────
function showBadge(id) {
  const assoc = ASSOCIATES.find(a => a.id === id);
  if (!assoc) return;
  window.location.hash = 'badge/' + assoc.login;
}

function showBadgeByLogin(login) {
  const assoc = ASSOCIATES.find(a => a.login === login);
  if (!assoc) return;
  const app = document.getElementById('app');
  app.innerHTML = renderBadgePage(assoc);

  // Initialize scroll wheel effect
  setTimeout(initScrollWheel, 100);



  // Only show admin buttons if manager is logged in
  if (isManagerLoggedIn()) {
    const bar = document.createElement('div');
    bar.className = 'fixed top-3 right-4 z-50 flex gap-2';
    bar.innerHTML = `
      <button onclick="generateQR('${assoc.login}','${assoc.full_name}')" class="bg-blue-600 border border-blue-700 text-white text-xs px-3 py-1.5 rounded-lg shadow-md hover:bg-blue-700 flex items-center gap-1">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>
        QR
      </button>
      <button onclick="window.location.hash=''" class="bg-gray-700 border border-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-800">← Back</button>
    `;
    app.appendChild(bar);
  }
}

function initScrollWheel() {
  const wheel = document.getElementById('scroll-wheel');
  if (!wheel) return;
  const items = wheel.querySelectorAll('.wheel-item');
  let mouseY = window.innerHeight / 2; // Default to center
  
  function updateWheel() {
    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height / 2;
      const distance = Math.abs(mouseY - itemCenter);
      
      item.classList.remove('wheel-active', 'wheel-near');
      
      if (distance < 50) {
        item.classList.add('wheel-active');
      } else if (distance < 140) {
        item.classList.add('wheel-near');
      }
    });
  }
  
  // Follow mouse position
  document.addEventListener('mousemove', (e) => {
    mouseY = e.clientY;
    updateWheel();
  });
  
  // Also follow touch on mobile
  document.addEventListener('touchmove', (e) => {
    mouseY = e.touches[0].clientY;
    updateWheel();
  });
  
  wheel.addEventListener('scroll', updateWheel);
  updateWheel();
}



function generateQR(login, fullName) {
  // Use the live GitHub Pages URL so QR codes work on any device
  const siteBase = 'https://nellyvw.github.io/badge-tracker/';
  const baseUrl = siteBase + '#badge/' + login;
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
      <h3 class="text-lg font-bold text-gray-900 mb-1">QR Code Badge</h3>
      <p class="text-sm text-gray-500 mb-4">Scan to view ${fullName}'s certifications</p>
      <div id="qr-container" class="flex justify-center mb-3"></div>
      <p class="text-xs text-gray-400 mb-4 break-all">${baseUrl}</p>
      <div class="flex gap-3">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm">Close</button>
        <button onclick="downloadQR('${login}')" class="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold">Download PNG</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Generate QR code
  const container = document.getElementById('qr-container');
  new QRCode(container, {
    text: baseUrl,
    width: 256,
    height: 256,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

function downloadQR(login) {
  const container = document.getElementById('qr-container');
  const img = container.querySelector('img');
  const canvas = container.querySelector('canvas');
  const src = img ? img.src : (canvas ? canvas.toDataURL('image/png') : null);
  if (!src) return;
  const link = document.createElement('a');
  link.download = `qr-badge-${login}.png`;
  link.href = src;
  link.click();
}

function showAdmin() {
  window.location.hash = '';
}

// ── Manager Authentication ────────────────────────────────────────────────────
const MANAGER_PIN = '2468'; // Change this to your preferred PIN

function isManagerLoggedIn() {
  return sessionStorage.getItem('manager_auth') === 'true';
}

function showLoginScreen() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-sm w-full p-8 text-center border border-white/60" style="animation: slideUp 0.5s ease forwards;">
        <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Manager Access</h2>
        <p class="text-sm text-gray-500 mb-6">Enter PIN to access the admin dashboard</p>
        <input id="pin-input" type="password" maxlength="10" placeholder="Enter PIN"
          class="w-full text-center text-2xl tracking-widest border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          onkeydown="if(event.key==='Enter')attemptLogin()" autofocus />
        <button onclick="attemptLogin()"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.02]">
          Unlock
        </button>
        <p id="login-error" class="text-red-500 text-sm mt-3 hidden">Incorrect PIN</p>
      </div>
    </div>
  `;
}

function attemptLogin() {
  const pin = document.getElementById('pin-input').value;
  if (pin === MANAGER_PIN) {
    sessionStorage.setItem('manager_auth', 'true');
    handleRoute();
  } else {
    const err = document.getElementById('login-error');
    err.classList.remove('hidden');
    document.getElementById('pin-input').value = '';
    document.getElementById('pin-input').focus();
    setTimeout(() => err.classList.add('hidden'), 2000);
  }
}

// ── CSV Update Panel ──────────────────────────────────────────────────────────

const CSV_PROTECTED_LOGINS = new Set(['nellyvw', 'edwarfif', 'camortim', 'gidluong', 'naduw', 'bhattilw']);
const CSV_EXCLUDED_LOGINS = new Set(['dunhacat', 'hamiltcq']);

const CSV_COURSE_MAP = {
  'AUSG_CF_TS Auto SLAM': 2,
  'AUSG_CF_TS Jam Buster': 4,
  'AUSG_CF_TS Vertical Reciprocating Conveyor (VRC)': 7,
  'AUSG_CF_TS Vacuum Lifter': 6,
  'AUSG_ALL_ILT_Destuff_IT': 3,
};
const CSV_PIT_MAP = {
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
const CSV_YARD_MAP = {
  '01. Yard Access': 9,
  '02. TDR': 8,
  '02. GTDR': 8,
};
const CSV_ANNUAL_IDS = new Set([2,3,4,6,7,8,9,10,11]);
const CSV_THREE_YEAR_IDS = new Set([12,13,14,15,16,17,18,19]);

function parseCSVText(text) {
  const lines = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') { inQuotes = !inQuotes; current += ch; }
    else if (ch === '\n' && !inQuotes) { lines.push(current); current = ''; }
    else if (ch === '\r' && !inQuotes) { /* skip */ }
    else { current += ch; }
  }
  if (current) lines.push(current);

  if (lines.length < 2) return [];
  // Parse header
  const header = parseCSVRow(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = parseCSVRow(lines[i]);
    const obj = {};
    for (let j = 0; j < header.length; j++) obj[header[j]] = vals[j] || '';
    rows.push(obj);
  }
  return rows;
}

function parseCSVRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i+1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function addYears(dateStr, years) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

function subtractYears(dateStr, years) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCFullYear(d.getUTCFullYear() - years);
  return d.toISOString().slice(0, 10);
}

function extractDate(str) {
  if (!str) return null;
  const m = str.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function detectCSVType(rows) {
  if (!rows || rows.length === 0) return 'unknown';
  const keys = Object.keys(rows[0]);
  if (keys.includes('courseTitle') || keys.includes('closedDateTimeUtc')) return 'course_learning';
  if (keys.includes('Topic') && keys.includes('NOBA Cert. Date')) return 'pit_safety';
  if (keys.includes('Topic') && keys.includes('Expiry Date') && keys.some(k => k.includes('Side Audit'))) return 'yard_safety';
  if (keys.includes('Employee ID') && keys.includes('Badge Barcode ID')) return 'roster';
  if (keys.includes('Employee ID') && keys.includes('Punch Type')) return 'roster';
  if (keys.includes('Employee ID') && keys.includes('Employee Name') && keys.includes('Manager')) return 'roster';
  if (keys.includes('Login') && keys.includes('Home') && (keys.includes('SBC') || keys.includes('Pick') || keys.includes('Pack'))) return 'matrix';
  return 'unknown';
}

function processCourseCSV(rows, data, loginIndex) {
  const latest = {};
  for (const row of rows) {
    if ((row.status || '').trim() !== 'completed') continue;
    const login = (row.login || '').trim().toLowerCase();
    const course = (row.courseTitle || '').trim();
    const closed = (row.closedDateTimeUtc || '').trim();
    if (!login || !course || !closed) continue;
    const tid = CSV_COURSE_MAP[course];
    if (tid === undefined) continue;
    if (!latest[login]) latest[login] = {};
    if (!latest[login][tid] || closed > latest[login][tid]) latest[login][tid] = closed;
  }

  let updates = 0;
  for (const [login, tids] of Object.entries(latest)) {
    if (CSV_PROTECTED_LOGINS.has(login)) continue;
    if (CSV_EXCLUDED_LOGINS.has(login)) continue;
    if (!(login in loginIndex)) continue;
    const assoc = data[loginIndex[login]];
    for (const [tidStr, closed] of Object.entries(tids)) {
      const tid = parseInt(tidStr);
      const completed = extractDate(closed);
      if (!completed) continue;
      const expiry = addYears(completed, 1);
      const existing = assoc.records[tid];
      if (!existing || expiry > existing.expiry) {
        assoc.records[tid] = { completed, expiry, trainer: 'AVV2 Safety' };
        updates++;
      }
    }
  }
  return updates;
}

function processPitCSV(rows, data, loginIndex) {
  let updates = 0;
  for (const row of rows) {
    if ((row['Compliant Yes/No'] || '').trim() !== 'Yes') continue;
    const topic = (row['Topic'] || '').trim();
    const login = (row['Emp Login'] || '').trim().toLowerCase();
    if (!login || !topic) continue;
    const tid = CSV_PIT_MAP[topic];
    if (tid === undefined) continue;
    if (CSV_PROTECTED_LOGINS.has(login)) continue;
    if (CSV_EXCLUDED_LOGINS.has(login)) continue;
    if (!(login in loginIndex)) continue;

    const expiry = extractDate(row['Theory Expiry Date'] || '');
    if (!expiry) continue;

    let completed;
    if (CSV_ANNUAL_IDS.has(tid)) {
      completed = subtractYears(expiry, 1);
    } else if (CSV_THREE_YEAR_IDS.has(tid)) {
      const noba = extractDate(row['NOBA Cert. Date'] || '');
      completed = noba || subtractYears(expiry, 3);
    } else continue;

    const assoc = data[loginIndex[login]];
    const existing = assoc.records[tid];
    if (!existing || expiry > existing.expiry) {
      assoc.records[tid] = { completed, expiry, trainer: 'AVV2 Safety' };
      updates++;
    }
  }
  return updates;
}

function processYardCSV(rows, data, loginIndex) {
  let updates = 0;
  for (const row of rows) {
    if ((row['Compliant Yes/No'] || '').trim() !== 'Yes') continue;
    const topic = (row['Topic'] || '').trim();
    const login = (row['Emp Login'] || '').trim().toLowerCase();
    if (!login || !topic) continue;
    const tid = CSV_YARD_MAP[topic];
    if (tid === undefined) continue;
    if (CSV_PROTECTED_LOGINS.has(login)) continue;
    if (CSV_EXCLUDED_LOGINS.has(login)) continue;
    if (!(login in loginIndex)) continue;

    let expiry;
    if (tid === 9) expiry = extractDate(row['Expiry Date'] || '');
    else if (tid === 8) expiry = extractDate(row['Theory Expiry Date'] || '');
    if (!expiry) continue;

    const completed = subtractYears(expiry, 1);
    const assoc = data[loginIndex[login]];
    const existing = assoc.records[tid];
    if (!existing || expiry > existing.expiry) {
      assoc.records[tid] = { completed, expiry, trainer: 'AVV2 Safety' };
      updates++;
    }
  }
  return updates;
}

function generateAssociatesJS(data) {
  let lines = ['const ASSOCIATES_DATA = ['];
  for (const a of data) {
    const sorted = Object.keys(a.records).map(Number).sort((x,y) => x-y);
    const recParts = sorted.map(tid => {
      const r = a.records[tid];
      return `${tid}: { completed: '${r.completed}', expiry: '${r.expiry}', trainer: '${r.trainer}' }`;
    });
    const name = a.full_name.replace(/'/g, "\\'");
    const mgr = (a.manager_name || '').replace(/'/g, "\\'");
    lines.push(`  { login: '${a.login}', full_name: '${name}', start_date: '${a.start_date}', employment_type: '${a.employment_type}', manager_name: '${mgr}', shift: '${a.shift}', records: { ${recParts.join(', ')} } },`);
  }
  lines.push('];');
  return lines.join('\n') + '\n';
}

function cloneAssociatesData() {
  return ASSOCIATES_DATA.map(a => ({
    login: a.login,
    full_name: a.full_name,
    start_date: a.start_date,
    employment_type: a.employment_type,
    manager_name: a.manager_name,
    shift: a.shift,
    records: {...(a.records || {})}
  }));
}

let updatePanelFiles = {};
let updatePanelLog = [];

function renderUpdatePanel() {
  return `
  <div class="min-h-screen bg-gray-900 text-white">
    <nav class="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="font-bold text-sm">📤 CSV Update Tool</span>
      </div>
      <button onclick="window.location.hash=''" class="text-gray-400 hover:text-white text-sm px-3 py-1 border border-gray-600 rounded-lg hover:bg-gray-700">← Back to Dashboard</button>
    </nav>
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">Update Training Data</h1>
        <p class="text-gray-400 text-sm">Drop your CSV exports below. The site will update automatically for everyone.</p>
      </div>

      <!-- GitHub Token -->
      <div class="mb-6 max-w-md mx-auto">
        <div class="flex items-center gap-2">
          <input id="github-token-input" type="password" placeholder="GitHub token (ghp_...)" value="${getGitHubToken() || ''}"
            class="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500">
          <button onclick="setGitHubToken(document.getElementById('github-token-input').value); this.textContent='Saved ✓'; setTimeout(()=>this.textContent='Save',1500)" class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">Save</button>
        </div>
        <p class="text-xs text-gray-500 mt-1 text-center">${getGitHubToken() ? '🟢 Token set — updates will push to GitHub automatically' : '⚪ Set token to enable auto-push for everyone'}</p>
      </div>

      <!-- Drop Zones -->
      <div class="grid gap-4 mb-6">
        <div id="drop-course" class="drop-zone border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800/50 transition-all" ondragover="event.preventDefault(); this.classList.add('border-indigo-400','bg-indigo-900/20')" ondragleave="this.classList.remove('border-indigo-400','bg-indigo-900/20')" ondrop="handleDrop(event, 'course')" onclick="document.getElementById('file-course').click()">
          <input type="file" id="file-course" accept=".csv" class="hidden" onchange="handleFileSelect(event, 'course')">
          <div id="drop-course-content">
            <div class="text-3xl mb-2">📋</div>
            <p class="font-medium text-gray-300">Course Learning Report</p>
            <p class="text-xs text-gray-500 mt-1">Training IDs 2, 3, 4, 6, 7 (Auto Slam, Destuff-IT, Jam Clear, Vacuum Lift, VRC)</p>
          </div>
        </div>
        <div id="drop-pit" class="drop-zone border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500 hover:bg-gray-800/50 transition-all" ondragover="event.preventDefault(); this.classList.add('border-amber-400','bg-amber-900/20')" ondragleave="this.classList.remove('border-amber-400','bg-amber-900/20')" ondrop="handleDrop(event, 'pit')" onclick="document.getElementById('file-pit').click()">
          <input type="file" id="file-pit" accept=".csv" class="hidden" onchange="handleFileSelect(event, 'pit')">
          <div id="drop-pit-content">
            <div class="text-3xl mb-2">🚜</div>
            <p class="font-medium text-gray-300">PIT Safety Compliance</p>
            <p class="text-xs text-gray-500 mt-1">Training IDs 10–19 (PIT 101, Fall Protection, EPJ, Tugger, etc.)</p>
          </div>
        </div>
        <div id="drop-yard" class="drop-zone border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-green-500 hover:bg-gray-800/50 transition-all" ondragover="event.preventDefault(); this.classList.add('border-green-400','bg-green-900/20')" ondragleave="this.classList.remove('border-green-400','bg-green-900/20')" ondrop="handleDrop(event, 'yard')" onclick="document.getElementById('file-yard').click()">
          <input type="file" id="file-yard" accept=".csv" class="hidden" onchange="handleFileSelect(event, 'yard')">
          <div id="drop-yard-content">
            <div class="text-3xl mb-2">🚛</div>
            <p class="font-medium text-gray-300">Yard Safety Compliance</p>
            <p class="text-xs text-gray-500 mt-1">Training IDs 8–9 (TDR/GTDR, Yard Access)</p>
          </div>
        </div>
        <div id="drop-roster" class="drop-zone border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500 hover:bg-gray-800/50 transition-all" ondragover="event.preventDefault(); this.classList.add('border-cyan-400','bg-cyan-900/20')" ondragleave="this.classList.remove('border-cyan-400','bg-cyan-900/20')" ondrop="handleDrop(event, 'roster')" onclick="document.getElementById('file-roster').click()">
          <input type="file" id="file-roster" accept=".csv" class="hidden" onchange="handleFileSelect(event, 'roster')">
          <div id="drop-roster-content">
            <div class="text-3xl mb-2">👥</div>
            <p class="font-medium text-gray-300">Employee Roster</p>
            <p class="text-xs text-gray-500 mt-1">Updates who is onsite (Attendance / FCLM roster export)</p>
          </div>
        </div>
        <div id="drop-pit-matrix" class="drop-zone border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-yellow-500 hover:bg-gray-800/50 transition-all" ondragover="event.preventDefault(); this.classList.add('border-yellow-400','bg-yellow-900/20')" ondragleave="this.classList.remove('border-yellow-400','bg-yellow-900/20')" ondrop="handleDrop(event, 'pit_matrix')" onclick="document.getElementById('file-pit-matrix').click()"><input type="file" id="file-pit-matrix" accept=".csv" class="hidden" onchange="handleFileSelect(event, 'pit_matrix')"><div id="drop-pit-matrix-content"><div class="text-3xl mb-2">🚜</div><p class="font-medium text-gray-300">PIT Training Matrix</p><p class="text-xs text-gray-500 mt-1">Updates PIT process training (EPJ, Tugger, Centre Rider, etc.)</p></div></div>
        <div id="drop-matrix" class="drop-zone border-2 border-dashed border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-gray-800/50 transition-all" ondragover="event.preventDefault(); this.classList.add('border-purple-400','bg-purple-900/20')" ondragleave="this.classList.remove('border-purple-400','bg-purple-900/20')" ondrop="handleDrop(event, 'matrix')" onclick="document.getElementById('file-matrix').click()">
          <input type="file" id="file-matrix" accept=".csv" class="hidden" onchange="handleFileSelect(event, 'matrix')">
          <div id="drop-matrix-content">
            <div class="text-3xl mb-2">📊</div>
            <p class="font-medium text-gray-300">Training Matrix</p>
            <p class="text-xs text-gray-500 mt-1">Updates process training (Pick, Pack, Stow, Ship, etc.)</p>
          </div>
        </div>
      </div>

      <!-- Process Button -->
      <div class="text-center mb-6">
        <button onclick="runUpdate()" id="btn-process" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all" disabled>
          ⚡ Process & Generate File
        </button>
      </div>

      <!-- Log Output -->
      <div id="update-log" class="hidden bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6 font-mono text-xs max-h-64 overflow-y-auto">
      </div>

      <!-- Download Button -->
      <div id="download-section" class="hidden text-center space-y-3">
        <a id="download-link" class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Download associates-data.js
        </a>
        <p class="text-gray-500 text-xs mt-3">Replace the file(s) in your repo and push to update the live site.</p>
      </div>
    </div>
  </div>`;
}

function initUpdatePanel() {
  updatePanelFiles = {};
  updatePanelLog = [];
  // Pre-set token if not already saved
  if (!getGitHubToken()) {
    setGitHubToken('REDACTED_TOKEN');
  }
}

function handleDrop(event, type) {
  event.preventDefault();
  event.currentTarget.classList.remove('border-indigo-400','bg-indigo-900/20','border-amber-400','bg-amber-900/20','border-green-400','bg-green-900/20');
  const file = event.dataTransfer.files[0];
  if (file) loadCSVFile(file, type);
}

function handleFileSelect(event, type) {
  const file = event.target.files[0];
  if (file) loadCSVFile(file, type);
}

function loadCSVFile(file, type) {
  const reader = new FileReader();
  reader.onload = function(e) {
    let text = e.target.result;
    // Remove BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    let rows = parseCSVText(text);

    // Auto-detect type if needed
    const detected = detectCSVType(rows);
    let actualType = type;
    if (detected !== 'unknown' && detected !== type) {
      // Auto-correct the type
      actualType = detected;
    }

    if (actualType === 'pit_matrix') { window._pitMatrixRawText = text; }
    if (type === 'matrix' || actualType === 'matrix') {
      // Strip title and merge headers - Login row has col 0-4 names, next row has col 5+ names
      const matLines = text.split(/\r?\n/);
      let loginRowIdx = -1;
      for (let i = 0; i < Math.min(matLines.length, 5); i++) {
        if (matLines[i].match(/^Login,/i)) { loginRowIdx = i; break; }
      }
      if (loginRowIdx >= 0) {
        // Merge: take Login,Employee Name,Manager,Type,Home from login row
        // and SBC,CC,SRC,... from the process names row
        const loginCols = parseCSVRow(matLines[loginRowIdx]);
        const procCols = parseCSVRow(matLines[loginRowIdx + 1]);
        const mergedHeader = [];
        for (let i = 0; i < Math.max(loginCols.length, procCols.length); i++) {
          mergedHeader.push(procCols[i] || loginCols[i] || '');
        }
        const dataRows = matLines.slice(loginRowIdx + 2);
        const newCsv = mergedHeader.join(',') + '\n' + dataRows.join('\n');
        rows = parseCSVText(newCsv);
      }
    }
    
    
    updatePanelFiles[actualType] = { name: file.name, rows: rows };

    // Update UI
    const zoneMap = { course_learning: 'drop-course', pit_safety: 'drop-pit', yard_safety: 'drop-yard', roster: 'drop-roster', pit_matrix: 'drop-pit-matrix', matrix: 'drop-matrix' };
    const zoneId = zoneMap[actualType] || 'drop-course';
    const contentId = zoneId + '-content';
    const zone = document.getElementById(zoneId);
    const content = document.getElementById(contentId);
    if (zone && content) {
      zone.classList.remove('border-dashed', 'border-gray-600');
      zone.classList.add('border-solid', 'border-green-500', 'bg-green-900/10');
      content.innerHTML = `<div class="text-2xl mb-1">✅</div><p class="font-medium text-green-400">${file.name}</p><p class="text-xs text-gray-400">${rows.length} rows loaded</p>`;
    }

    // Enable process button if at least one file loaded
    const btn = document.getElementById('btn-process');
    if (btn) btn.disabled = Object.keys(updatePanelFiles).length === 0;
  };
  reader.readAsText(file);
}

function processRosterCSV(rows) {
  // Roster/Attendance CSV may have different formats:
  // - "User ID" / "login" column (direct login)
  // - "Employee ID" + "Employee Name" (attendance format, name as "Last,First")
  // We build a name-to-login lookup from ASSOCIATES to match attendance format
  const nameLookup = {};
  for (const a of ASSOCIATES) {
    // Store by lowercase full_name
    nameLookup[a.full_name.toLowerCase()] = a.login;
    // Also store reversed "Last,First" -> login
    const parts = a.full_name.split(' ');
    if (parts.length >= 2) {
      const reversed = parts.slice(-1)[0] + ',' + parts.slice(0, -1).join(' ');
      nameLookup[reversed.toLowerCase()] = a.login;
    }
  }

  const onsiteLogins = new Set();
  for (const row of rows) {
    // Try direct login field first
    const punchType = (row['Punch Type'] || '').trim().toLowerCase();
    if (punchType === 'out') continue;
    const login = (row['User ID'] || row['login'] || row['Login'] || row['Emp Login'] || '').trim().toLowerCase();
    if (login) {
      onsiteLogins.add(login);
      continue;
    }
    // Try matching by Employee Name (format: "Last,First")
    const name = (row['Employee Name'] || row['Full Name'] || '').trim().toLowerCase();
    if (name && nameLookup[name]) {
      onsiteLogins.add(nameLookup[name]);
    }
  }
  return onsiteLogins;
}

const PIT_MATRIX_PROCESSES = ['Order Picker', 'Turret Truck', 'Sit Down', 'Stand Up', 'High Reach', 'Electric Pallet Jack', 'TOW Tugger', 'Ride On Tugger', 'Centre Rider'];
const MATRIX_PROCESSES = ['SBC', 'CC', 'SRC', 'RSR', 'Dock', 'Receive', 'Stow', 'IB PS', 'Pick', 'Pack', 'Sort', 'Ship', 'OB PS', 'VRET Pack', 'VRC', 'KPP', 'Manual Slam', 'Auto Slam', 'Gift Wrap', 'Prep', 'Cubiscan', 'Waterspider'];

function processPitMatrixCSV(rows, onsiteLogins) {
  // The browser CSV parser mangles this file due to empty headers.
  // Instead, we use the raw file text stored during upload.
  // Access the raw text from the uploaded file
  const rawText = window._pitMatrixRawText || '';
  if (!rawText) return { data: {}, count: 0 };
  
  const associateLogins = new Set(ASSOCIATES.map(a => a.login));
  const result = {};
  let count = 0;
  const lines = rawText.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    const cols = line.split(',');
    const login = (cols[0] || '').trim().toLowerCase();
    if (!login || !associateLogins.has(login)) continue;
    
    const trained = [];
    // Columns 5-13 are: Order Picker, Turret Truck, Sit Down, Stand Up, High Reach, Electric Pallet Jack, TOW Tugger, Ride On Tugger, Centre Rider
    for (let i = 0; i < PIT_MATRIX_PROCESSES.length; i++) {
      const val = (cols[5 + i] || '').trim().toLowerCase();
      if (val === 'pass') trained.push(PIT_MATRIX_PROCESSES[i]);
    }
    
    const onsite = onsiteLogins ? onsiteLogins.has(login) : false;
    result[login] = { pitProcesses: trained, onsite: onsite };
    count++;
  }
  return { data: result, count: count };
}

function processMatrixCSV(rows, onsiteLogins) {
  // Training Matrix CSV: Login, Employee Name, Manager, Type, Home, then process columns
  // Values are 'Pass' or empty
  // Note: If exported from Excel with merged header rows, first rows might not have 'Login'
  // Try to find the correct header row
  const result = {};
  let count = 0;

  // Check if the rows already have proper column headers
  const hasLoginKey = rows.length > 0 && ('Login' in rows[0] || 'login' in rows[0]);

  if (hasLoginKey) {
    // Standard CSV with proper headers
    for (const row of rows) {
      const login = (row['Login'] || row['login'] || '').trim().toLowerCase();
      if (!login || login === 'login') continue;
      const trained = [];
      for (const proc of MATRIX_PROCESSES) {
        const val = (row[proc] || '').trim().toLowerCase();
        if (val === 'pass') trained.push(proc);
      }
      const onsite = onsiteLogins ? onsiteLogins.has(login) : false;
      result[login] = { processes: trained, onsite: onsite };
      count++;
    }
  } else {
    // Might have extra header rows — look for a row that starts with something loginish
    // Try parsing by position: col 0=Login, 1=Name, 2=Manager, 3=Type, 4=Home, 5+=processes
    for (const row of rows) {
      const keys = Object.keys(row);
      const firstVal = (row[keys[0]] || '').trim().toLowerCase();
      // Skip header-like rows
      if (!firstVal || firstVal === 'login' || firstVal === 'associate information' || firstVal.includes('training matrix')) continue;
      // Check if it looks like a login (alphanumeric, no spaces)
      if (/^[a-z0-9]+$/.test(firstVal)) {
        const login = firstVal;
        const trained = [];
        // Process columns start at index 5
        for (let i = 0; i < MATRIX_PROCESSES.length; i++) {
          const val = (row[keys[5 + i]] || '').trim().toLowerCase();
          if (val === 'pass') trained.push(MATRIX_PROCESSES[i]);
        }
        const onsite = onsiteLogins ? onsiteLogins.has(login) : false;
        result[login] = { processes: trained, onsite: onsite };
        count++;
      }
    }
  }
  return { data: result, count: count };
}

function generateProcessTrainingJS(data) {
  let lines = ['const PROCESS_TRAINING_DATA = {'];
  for (const [login, info] of Object.entries(data)) {
    const procs = info.processes.map(p => "'" + p + "'").join(', ');
    const pits = info.pitProcesses ? info.pitProcesses.map(p => "'" + p + "'").join(', ') : '';
    lines.push("  '" + login + "': { processes: [" + procs + "], pitProcesses: [" + pits + "], onsite: " + (info.onsite ? 'true' : 'false') + " },");
  }
  lines.push('};');
  return lines.join('\n') + '\n';
}

function runUpdate() {
  const logEl = document.getElementById('update-log');
  logEl.classList.remove('hidden');
  logEl.innerHTML = '';
  const log = (msg, color) => {
    logEl.innerHTML += `<div class="${color || 'text-gray-300'}">${msg}</div>`;
    logEl.scrollTop = logEl.scrollHeight;
  };

  log('Starting update...', 'text-indigo-400');
  log(`Loaded files: ${Object.keys(updatePanelFiles).join(', ')}`, 'text-gray-400');

  // Clone current data
  const data = cloneAssociatesData();
  const loginIndex = {};
  data.forEach((a, i) => { loginIndex[a.login] = i; });
  log(`Current associates: ${data.length}`, 'text-gray-400');

  let totalUpdates = 0;
  let hasAssociatesUpdate = false;
  let hasProcessUpdate = false;

  // Process Course Learning
  if (updatePanelFiles.course_learning) {
    const n = processCourseCSV(updatePanelFiles.course_learning.rows, data, loginIndex);
    log(`✓ Course Learning Report: ${n} updates`, 'text-green-400');
    totalUpdates += n;
    hasAssociatesUpdate = true;
  }

  // Process PIT Safety
  if (updatePanelFiles.pit_safety) {
    const n = processPitCSV(updatePanelFiles.pit_safety.rows, data, loginIndex);
    log(`✓ PIT Safety: ${n} updates`, 'text-amber-400');
    totalUpdates += n;
    hasAssociatesUpdate = true;
  }

  // Process Yard Safety
  if (updatePanelFiles.yard_safety) {
    const n = processYardCSV(updatePanelFiles.yard_safety.rows, data, loginIndex);
    log(`✓ Yard Safety: ${n} updates`, 'text-green-400');
    totalUpdates += n;
    hasAssociatesUpdate = true;
  }

  // Process Roster + Matrix
  let onsiteLogins = null;
  if (updatePanelFiles.roster) {
    onsiteLogins = processRosterCSV(updatePanelFiles.roster.rows);
    log(`✓ Employee Roster: ${onsiteLogins.size} associates onsite`, 'text-cyan-400');
  }

  if (updatePanelFiles.matrix) {
    const matrixResult = processMatrixCSV(updatePanelFiles.matrix.rows, onsiteLogins);
    log(`✓ Training Matrix: ${matrixResult.count} associates processed`, 'text-purple-400');
    hasProcessUpdate = true;

    // Generate process-training-data.js
    const processOutput = generateProcessTrainingJS(matrixResult.data);
    const processBlob = new Blob([processOutput], { type: 'text/javascript' });
    const processUrl = URL.createObjectURL(processBlob);

    // Show process training download
    const section = document.getElementById('download-section');
    section.classList.remove('hidden');
    let processLink = document.getElementById('download-process-link');
    if (!processLink) {
      const container = document.getElementById('download-section');
      container.insertAdjacentHTML('beforeend', `
        <a id="download-process-link" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all mt-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Download process-training-data.js
        </a>
      `);
      processLink = document.getElementById('download-process-link');
    }
    processLink.href = processUrl;
    processLink.download = 'process-training-data.js';
  } else if (updatePanelFiles.pit_matrix && !updatePanelFiles.matrix) {
    // PIT matrix only - update pit data in existing process training data
    if (typeof PROCESS_TRAINING_DATA !== 'undefined') {
      const processOutput = generateProcessTrainingJS(PROCESS_TRAINING_DATA);
      const processBlob = new Blob([processOutput], { type: 'text/javascript' });
      const processUrl = URL.createObjectURL(processBlob);
      hasProcessUpdate = true;
      const section = document.getElementById('download-section');
      section.classList.remove('hidden');
      let processLink = document.getElementById('download-process-link');
      if (!processLink) {
        section.insertAdjacentHTML('beforeend', '<a id="download-process-link" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all mt-3"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>Download process-training-data.js</a>');
        processLink = document.getElementById('download-process-link');
      }
      processLink.href = processUrl;
      processLink.download = 'process-training-data.js';
      log('\u2713 Process training data generated with PIT updates', 'text-purple-300');
    }
  } else if (updatePanelFiles.roster && !updatePanelFiles.matrix) {
    // Roster only — update onsite status in existing process training data
    if (typeof PROCESS_TRAINING_DATA !== 'undefined') {
      const updated = {};
      for (const [login, info] of Object.entries(PROCESS_TRAINING_DATA)) {
        updated[login] = { processes: [...info.processes], onsite: onsiteLogins.has(login) };
      }
      const processOutput = generateProcessTrainingJS(updated);
      const processBlob = new Blob([processOutput], { type: 'text/javascript' });
      const processUrl = URL.createObjectURL(processBlob);
      hasProcessUpdate = true;

      const section = document.getElementById('download-section');
      section.classList.remove('hidden');
      let processLink = document.getElementById('download-process-link');
      if (!processLink) {
        const container = document.getElementById('download-section');
        container.insertAdjacentHTML('beforeend', `
          <a id="download-process-link" class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all mt-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Download process-training-data.js
          </a>
        `);
        processLink = document.getElementById('download-process-link');
      }
      processLink.href = processUrl;
      processLink.download = 'process-training-data.js';
      log(`✓ Onsite status updated for ${onsiteLogins.size} logins`, 'text-cyan-400');
    }
  }

  if (hasAssociatesUpdate) {
    log(`\nCert updates total: ${totalUpdates}`, 'text-white font-bold');
  }
  if (updatePanelFiles.pit_matrix) {
    const pitResult = processPitMatrixCSV(updatePanelFiles.pit_matrix.rows, onsiteLogins);
    log('✓ PIT Training Matrix: ' + pitResult.count + ' associates processed', 'text-yellow-400');
    hasProcessUpdate = true;
    for (const [login, info] of Object.entries(pitResult.data)) {
      if (typeof PROCESS_TRAINING_DATA !== 'undefined') {
        if (!PROCESS_TRAINING_DATA[login]) PROCESS_TRAINING_DATA[login] = { processes: [], onsite: false };
        PROCESS_TRAINING_DATA[login].pitProcesses = info.pitProcesses;
      }
    }
  }

  log('Protected logins preserved: ' + [...CSV_PROTECTED_LOGINS].join(', '), 'text-gray-500');

  // Generate associates-data.js if cert CSVs were provided
  if (hasAssociatesUpdate) {
    const output = generateAssociatesJS(data);
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    const section = document.getElementById('download-section');
    const link = document.getElementById('download-link');
    section.classList.remove('hidden');
    link.href = url;
    link.download = 'associates-data.js';
  } else {
    // Hide the associates download if no cert CSVs
    const link = document.getElementById('download-link');
    if (link) link.style.display = hasAssociatesUpdate ? '' : 'none';
  }

  log('\n✅ Done! Download your files below.', 'text-green-300 font-bold');

  // ── Live session update ──────────────────────────────────────────────────
  // Apply changes to the in-memory data so the dashboard reflects them immediately
  if (hasAssociatesUpdate) {
    // Update ASSOCIATES array in place
    for (let i = 0; i < data.length; i++) {
      const assoc = ASSOCIATES.find(a => a.login === data[i].login);
      if (assoc) {
        assoc.records = data[i].records;
      }
    }
    // Save to localStorage for persistence across refreshes
    try {
      localStorage.setItem('badgeTracker_associatesData', JSON.stringify(data));
      localStorage.setItem('badgeTracker_lastUpdate', new Date().toISOString());
    } catch(e) { log('⚠ Could not save to localStorage (storage full?)', 'text-amber-400'); }
    log('⚡ Training data saved — persists across refreshes', 'text-indigo-300');
  }

  if (updatePanelFiles.matrix) {
    // Update PROCESS_TRAINING_DATA in place
    const matrixResult2 = processMatrixCSV(updatePanelFiles.matrix.rows, onsiteLogins);
    for (const [login, info] of Object.entries(matrixResult2.data)) {
      if (PROCESS_TRAINING_DATA[login] && PROCESS_TRAINING_DATA[login].pitProcesses) {
        info.pitProcesses = PROCESS_TRAINING_DATA[login].pitProcesses;
      }
      PROCESS_TRAINING_DATA[login] = info;
    }
    // Save to localStorage
    try {
      localStorage.setItem('badgeTracker_processData', JSON.stringify(matrixResult2.data));
    } catch(e) { /* storage full */ }
    log('⚡ Process training data saved — persists across refreshes', 'text-purple-300');
  } else if (updatePanelFiles.roster && !updatePanelFiles.matrix) {
    // Update onsite status in PROCESS_TRAINING_DATA
    if (typeof PROCESS_TRAINING_DATA !== 'undefined') {
      for (const login of Object.keys(PROCESS_TRAINING_DATA)) {
        PROCESS_TRAINING_DATA[login].onsite = onsiteLogins.has(login);
      }
      // Save to localStorage
      try {
        localStorage.setItem('badgeTracker_processData', JSON.stringify(PROCESS_TRAINING_DATA));
      } catch(e) { /* storage full */ }
      log('⚡ Onsite status saved — persists across refreshes', 'text-cyan-300');
    }
  }

  log('\n💡 Changes are live and will persist on this browser. Download files to update the repo for everyone.', 'text-gray-400');

  // ── Auto-push to GitHub ──────────────────────────────────────────────────
  const token = getGitHubToken();
  if (token) {
    log('\n🚀 Pushing to GitHub...', 'text-indigo-400');
    pushToGitHub(token, hasAssociatesUpdate ? generateAssociatesJS(data) : null, hasProcessUpdate || updatePanelFiles.roster ? (updatePanelFiles.matrix ? generateProcessTrainingJS(processMatrixCSV(updatePanelFiles.matrix.rows, onsiteLogins).data) : (updatePanelFiles.roster && typeof PROCESS_TRAINING_DATA !== 'undefined' ? generateProcessTrainingJS(PROCESS_TRAINING_DATA) : null)) : null, log);
  } else {
    log('\n⚠ No GitHub token set — changes saved locally only. Set token to auto-push for everyone.', 'text-amber-400');
  }
}

// ── GitHub Auto-Push ───────────────────────────────────────────────────────────

const GITHUB_REPO = 'nellyvw/badge-tracker';
const GITHUB_BRANCH = 'main';

function getGitHubToken() {
  return localStorage.getItem('badgeTracker_githubToken') || null;
}

function setGitHubToken(token) {
  localStorage.setItem('badgeTracker_githubToken', token);
}

async function getFileSHA(token, path) {
  try {
    const resp = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
      headers: { 'Authorization': `token ${token}` }
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.sha;
    }
  } catch(e) {}
  return null;
}

async function pushFile(token, path, content, message) {
  const sha = await getFileSHA(token, path);
  const body = {
    message: message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: GITHUB_BRANCH
  };
  if (sha) body.sha = sha;

  const resp = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return resp.ok;
}

async function pushToGitHub(token, associatesContent, processContent, log) {
  let success = true;
  const now = new Date().toLocaleDateString('en-AU', {day:'numeric',month:'short',year:'numeric'});

  if (associatesContent) {
    const ok = await pushFile(token, 'associates-data.js', associatesContent, `Update training data - ${now}`);
    if (ok) {
      log('✅ associates-data.js pushed to GitHub', 'text-green-400');
    } else {
      log('❌ Failed to push associates-data.js — check token permissions', 'text-red-400');
      success = false;
    }
  }

  if (processContent) {
    const ok = await pushFile(token, 'process-training-data.js', processContent, `Update process training data - ${now}`);
    if (ok) {
      log('✅ process-training-data.js pushed to GitHub', 'text-green-400');
    } else {
      log('❌ Failed to push process-training-data.js — check token permissions', 'text-red-400');
      success = false;
    }
  }

  if (success && (associatesContent || processContent)) {
    log('\n🎉 Site updated for everyone! Changes are now live.', 'text-green-300 font-bold');
  }
}

function renderProcessPathsView() {
  const pd = (typeof PROCESS_TRAINING_DATA !== 'undefined') ? PROCESS_TRAINING_DATA : {};
  const assocs = ASSOCIATES.filter(a => pd[a.login]);
  let rows = '';
  assocs.slice(0,100).forEach((a,idx) => {
    const d = pd[a.login];
    const initials = getInitials(a.full_name);
    const color = a.employment_type === '3PTY' ? 'from-green-400 to-green-600' : 'from-blue-500 to-blue-700';
    const procCount = d.processes ? d.processes.length : 0;
    const pitCount = d.pitProcesses ? d.pitProcesses.length : 0;
    const onsiteBadge = d.onsite ? '<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">Yes</span>' : '<span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">No</span>';
    const rowBg = idx % 2 === 0 ? '' : 'background:#f8fafc';
    rows += '<tr style="'+rowBg+'" class="cursor-pointer hover:bg-blue-50" onclick="showBadge('+a.id+')"><td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gradient-to-br '+color+' flex items-center justify-center text-white text-xs font-bold">'+initials+'</div><div><p class="text-sm font-semibold text-gray-900">'+a.full_name+'</p><p class="text-xs text-gray-400 font-mono">'+a.login+'</p></div></div></td><td class="px-4 py-3 text-sm font-medium text-gray-700">'+procCount+'</td><td class="px-4 py-3 text-sm font-medium text-gray-700">'+pitCount+'</td><td class="px-4 py-3">'+onsiteBadge+'</td></tr>';
  });
  return '<div class="min-h-screen bg-gray-50"><nav class="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow"><div class="flex items-center gap-3"><button onclick="window.location.hash=\'\';" class="p-1.5 rounded-lg hover:bg-gray-700"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></button><span class="font-bold tracking-wide text-lg">Process Paths</span></div></nav><div class="max-w-7xl mx-auto px-4 sm:px-6 py-6"><div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><table class="w-full text-sm"><thead class="bg-gray-50 border-b border-gray-200"><tr><th class="text-left px-4 py-3 font-semibold text-gray-600">Associate</th><th class="text-left px-4 py-3 font-semibold text-gray-600 w-24">Processes</th><th class="text-left px-4 py-3 font-semibold text-gray-600 w-24">PIT</th><th class="text-left px-4 py-3 font-semibold text-gray-600 w-24">Onsite</th></tr></thead><tbody>' + rows + '</tbody></table><div class="px-4 py-2 text-xs text-gray-400 border-t">Showing ' + Math.min(assocs.length,100) + ' of ' + assocs.length + ' associates with process data</div></div></div></div>';
}

function handleRoute() {
  const hash = window.location.hash.slice(1); // remove #
  const app = document.getElementById('app');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (hash === 'process-paths') {
    if (!isManagerLoggedIn()) { showLoginScreen(); }
    else { app.innerHTML = renderProcessPathsView(); }
  } else if (hash === 'update') {
    // CSV Update tool — requires manager login
    if (!isManagerLoggedIn()) {
      showLoginScreen();
    } else {
      app.innerHTML = renderUpdatePanel();
      initUpdatePanel();
    }
  } else if (hash.startsWith('badge/')) {
    // Badge pages are public — no auth needed
    const login = hash.replace('badge/', '');
    showBadgeByLogin(login);
  } else {
    // Admin page requires manager PIN
    if (!isManagerLoggedIn()) {
      showLoginScreen();
    } else {
      app.innerHTML = renderAdminView();
      document.getElementById('search-input').value = filterText;
      renderTable();
    }
  }
}

// Esc key to go back from profile to main table
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && window.location.hash.startsWith('#badge/')) {
    window.location.hash = '';
  }
});

window.addEventListener('DOMContentLoaded', handleRoute);
window.addEventListener('hashchange', handleRoute);
