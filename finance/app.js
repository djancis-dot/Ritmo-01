// ---- State ----
let currentCompanyId = COMPANIES[0].id;
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;
let isViewMode = false;

// ---- Helpers ----
function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—';
  return new Intl.NumberFormat('lt-LT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' €';
}

function fmtShort(n) {
  if (!n) return '0 €';
  return new Intl.NumberFormat('lt-LT', { maximumFractionDigits: 0 }).format(n) + ' €';
}

function monthName(month, year) {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString('lt-LT', { month: 'long', year: 'numeric' });
}

function dueUrgency(dueDay) {
  const today = new Date().getDate();
  const daysLeft = dueDay - today;
  if (daysLeft < 0) return 'overdue';
  if (daysLeft <= 3) return 'urgent';
  if (daysLeft <= 7) return 'soon';
  return 'ok';
}

function toast(msg, type = 'ok') {
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function company() { return COMPANIES.find(c => c.id === currentCompanyId); }

// ---- Render ----
function render() {
  const co = company();
  const data = Store.getMonth(currentCompanyId, currentYear, currentMonth);
  const totals = Store.getTotals(currentCompanyId, currentYear, currentMonth);

  document.documentElement.style.setProperty('--accent-color', co.color);

  renderCompanyTabs();
  renderMonthBar();
  renderSummary(totals, data);
  renderBalances(co, data);
  renderProjection(data, totals);
  renderRevenues(co, data);
  renderExpenses(data);
}

function renderCompanyTabs() {
  const container = document.getElementById('company-tabs');
  container.innerHTML = COMPANIES.map(c => `
    <div class="company-tab ${c.id === currentCompanyId ? 'active' : ''}"
         style="${c.id === currentCompanyId ? '--accent-color:' + c.color : ''}"
         onclick="selectCompany('${c.id}')">
      ${c.shortName}
    </div>
  `).join('');
}

function renderMonthBar() {
  document.getElementById('month-label').textContent = monthName(currentMonth, currentYear);
}

function renderSummary(totals, data) {
  const endClass = totals.projectedEndBalance >= 0 ? 'green' : 'red';
  document.getElementById('summary').innerHTML = `
    <div class="summary-item">
      <div class="summary-label">Esami pinigai (suma)</div>
      <div class="summary-value ${totals.currentFunds >= 0 ? 'green' : 'red'}">${fmtShort(totals.currentFunds)}</div>
      <div class="summary-sub">sąskaitos + kasos</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Faktinės pajamos</div>
      <div class="summary-value">${fmtShort(totals.actualRevenue)}</div>
      <div class="summary-sub">iš ${data.revenues.length} čekių</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Likusios projekcijos</div>
      <div class="summary-value yellow">${fmtShort(totals.remainingProjection)}</div>
      <div class="summary-sub">dar neuždirbta</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Neapmokėtos išlaidos</div>
      <div class="summary-value red">${fmtShort(totals.unpaidExpenses)}</div>
      <div class="summary-sub">iš ${Store.getMonth(currentCompanyId, currentYear, currentMonth).expenses.filter(e=>!e.paid).length} pozicijų</div>
    </div>
    <div class="summary-item" style="border-color: var(--accent-color);">
      <div class="summary-label">Projekcija mėnesio gale</div>
      <div class="summary-value ${endClass}">${fmtShort(totals.projectedEndBalance)}</div>
      <div class="summary-sub">esami + likusios – neapmokėtos</div>
    </div>
  `;
}

function renderBalances(co, data) {
  const readonly = isViewMode ? 'readonly' : '';
  const accounts = co.accounts.map(a => `
    <div class="balance-item">
      <label>${a.label}</label>
      <input type="number" step="0.01" value="${data.balances[a.id] || ''}" placeholder="0.00"
             ${readonly}
             onchange="Store.updateBalance('${currentCompanyId}', ${currentYear}, ${currentMonth}, '${a.id}', this.value); renderSummary(Store.getTotals('${currentCompanyId}', ${currentYear}, ${currentMonth}), Store.getMonth('${currentCompanyId}', ${currentYear}, ${currentMonth}))">
    </div>
  `).join('');
  const registers = co.cashRegisters.map(r => `
    <div class="balance-item">
      <label>${r.label}</label>
      <input type="number" step="0.01" value="${data.balances[r.id] || ''}" placeholder="0.00"
             ${readonly}
             onchange="Store.updateBalance('${currentCompanyId}', ${currentYear}, ${currentMonth}, '${r.id}', this.value); renderSummary(Store.getTotals('${currentCompanyId}', ${currentYear}, ${currentMonth}), Store.getMonth('${currentCompanyId}', ${currentYear}, ${currentMonth}))">
    </div>
  `).join('');
  document.getElementById('balances').innerHTML = accounts + registers;
}

function renderProjection(data, totals) {
  const pct = data.projection > 0 ? Math.min(100, (totals.actualRevenue / data.projection) * 100) : 0;
  const readonly = isViewMode ? 'readonly' : '';
  document.getElementById('projection').innerHTML = `
    <div class="projection-row">
      <div class="projection-block">
        <label>Mėnesio projekcija</label>
        <input class="input" type="number" step="100" value="${data.projection || ''}" placeholder="0"
               ${readonly}
               onchange="Store.updateProjection('${currentCompanyId}', ${currentYear}, ${currentMonth}, this.value); render()">
      </div>
      <div class="projection-block">
        <label>Faktinė apyvarta</label>
        <input class="input" type="number" value="${totals.actualRevenue.toFixed(2)}" readonly>
      </div>
      <div class="projection-block">
        <label>Dar neuždirbta</label>
        <input class="input" type="number" value="${totals.remainingProjection.toFixed(2)}" readonly>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-label">
          <span>Progesas</span>
          <span>${pct.toFixed(1)}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>
  `;
}

function renderRevenues(co, data) {
  const rows = data.revenues.length === 0
    ? '<div class="empty">Čekių nėra. Pridėk pirmą čekį arba palauk automatinio importo.</div>'
    : `
      <div class="revenue-row header">
        <span>Data</span><span>Fiskalinis</span>
        <span class="revenue-cash">Grynai</span>
        <span class="revenue-card">Kortele</span>
        <span class="revenue-total">Viso</span>
        ${!isViewMode ? '<span></span>' : ''}
      </div>
      ${data.revenues.slice().reverse().map(r => `
        <div class="revenue-row">
          <span>${r.date}</span>
          <span class="revenue-location">${r.location || ''} ${r.fiscalNr ? '#' + r.fiscalNr : ''}</span>
          <span class="revenue-cash">${fmt(r.cash)}</span>
          <span class="revenue-card">${fmt(r.card)}</span>
          <span class="revenue-total">${fmt(r.total)}</span>
          ${!isViewMode ? `<button class="delete-btn" onclick="deleteRevenue(${r.id})" title="Ištrinti">✕</button>` : ''}
        </div>
      `).join('')}
    `;

  const addForm = isViewMode ? '' : `
    <div class="add-revenue-form" id="revenue-form">
      <div>
        <label>Data</label>
        <input class="input" type="date" id="r-date" value="${new Date().toISOString().slice(0,10)}">
      </div>
      <div>
        <label>Filialas</label>
        <select id="r-location">
          ${co.locations.map(l => `<option>${l}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Grynai €</label>
        <input class="input" type="number" step="0.01" id="r-cash" placeholder="0.00">
      </div>
      <div>
        <label>Kortele €</label>
        <input class="input" type="number" step="0.01" id="r-card" placeholder="0.00">
      </div>
      <div>
        <label>Fiskalinis nr.</label>
        <input class="input" type="text" id="r-fiscal" placeholder="00011607">
      </div>
      <div style="padding-top:18px">
        <button class="btn btn-primary" onclick="addRevenue()">+ Pridėti</button>
      </div>
    </div>
  `;

  document.getElementById('revenues').innerHTML = `
    <div class="revenue-list">${rows}</div>
    ${addForm}
  `;
}

function renderExpenses(data) {
  const today = new Date().getDate();
  const sorted = [...data.expenses].sort((a, b) => (a.due_day || 99) - (b.due_day || 99));

  const rows = sorted.length === 0
    ? '<div class="empty">Išlaidų nėra. Pridėk nuomą, algas, mokesčius ir kt.</div>'
    : `
      <div class="expense-row header">
        <span>Pavadinimas</span>
        <span style="text-align:right">Suma</span>
        <span>Terminas</span>
        <span>${!isViewMode ? 'Veiksmai' : 'Statusas'}</span>
        ${!isViewMode ? '<span></span>' : ''}
      </div>
      ${sorted.map(e => {
        const urgency = e.paid ? 'ok' : dueUrgency(e.due_day || 99);
        const cat = EXPENSE_CATEGORIES.find(c => c.id === e.category);
        const dueLabel = e.due_day ? `iki ${e.due_day} d.` : '—';
        return `
          <div class="expense-row ${e.paid ? 'paid' : ''}">
            <div class="expense-name">
              ${e.name}
              <div class="cat">${cat ? cat.icon + ' ' + cat.label : ''}</div>
            </div>
            <div class="expense-amount">${fmt(e.amount)}</div>
            <div class="expense-due ${urgency}">${dueLabel}${urgency === 'overdue' ? ' ⚠️' : ''}</div>
            <div style="display:flex;gap:6px;align-items:center">
              <button class="check-btn ${e.paid ? 'done' : ''}"
                      ${isViewMode ? 'disabled' : `onclick="togglePaid(${e.id})"`}
                      title="${e.paid ? 'Apmokėta' : 'Pažymėti kaip apmokėta'}">
                ${e.paid ? '✓' : ''}
              </button>
              <span style="font-size:11px;color:var(--text3)">${e.paid ? 'Apmokėta' : 'Laukia'}</span>
            </div>
            ${!isViewMode ? `<button class="delete-btn" onclick="deleteExpense(${e.id})" title="Ištrinti">✕</button>` : ''}
          </div>
        `;
      }).join('')}
    `;

  const addForm = isViewMode ? '' : `
    <div class="add-expense-form" id="expense-form">
      <div>
        <label>Pavadinimas</label>
        <input class="input" type="text" id="e-name" placeholder="pvz. Nuoma Vilnius">
      </div>
      <div>
        <label>Kategorija</label>
        <select id="e-cat">
          ${EXPENSE_CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Suma (su PVM) €</label>
        <input class="input" type="number" step="0.01" id="e-amount" placeholder="-3050">
      </div>
      <div>
        <label>Terminas (diena)</label>
        <input class="input" type="number" min="1" max="31" id="e-due" placeholder="15">
      </div>
      <div>
        <label>Pastaba</label>
        <input class="input" type="text" id="e-note" placeholder="nebūtina">
      </div>
      <div style="padding-top:18px">
        <button class="btn btn-primary" onclick="addExpense()">+ Pridėti</button>
      </div>
    </div>
  `;

  document.getElementById('expenses').innerHTML = `
    <div class="expense-list">${rows}</div>
    ${addForm}
  `;
}

// ---- Actions ----
function selectCompany(id) {
  currentCompanyId = id;
  render();
}

function prevMonth() {
  currentMonth--;
  if (currentMonth < 1) { currentMonth = 12; currentYear--; }
  render();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 12) { currentMonth = 1; currentYear++; }
  render();
}

function addRevenue() {
  const date = document.getElementById('r-date').value;
  const location = document.getElementById('r-location').value;
  const cash = parseFloat(document.getElementById('r-cash').value) || 0;
  const card = parseFloat(document.getElementById('r-card').value) || 0;
  const fiscalNr = document.getElementById('r-fiscal').value.trim();
  if (!date) { toast('Pasirink datą', 'error'); return; }
  if (cash + card === 0) { toast('Įvesk sumą', 'error'); return; }
  Store.addRevenue(currentCompanyId, currentYear, currentMonth, {
    date, location, cash, card, total: cash + card, fiscalNr,
    source: 'manual'
  });
  document.getElementById('r-cash').value = '';
  document.getElementById('r-card').value = '';
  document.getElementById('r-fiscal').value = '';
  toast(`Čekis pridėtas: ${fmt(cash + card)}`);
  render();
}

function deleteRevenue(id) {
  if (!confirm('Ištrinti čekį?')) return;
  Store.deleteRevenue(currentCompanyId, currentYear, currentMonth, id);
  render();
}

function addExpense() {
  const name = document.getElementById('e-name').value.trim();
  const category = document.getElementById('e-cat').value;
  let amount = parseFloat(document.getElementById('e-amount').value) || 0;
  const due_day = parseInt(document.getElementById('e-due').value) || null;
  const note = document.getElementById('e-note').value.trim();
  if (!name) { toast('Įvesk pavadinimą', 'error'); return; }
  if (amount === 0) { toast('Įvesk sumą', 'error'); return; }
  if (amount > 0) amount = -amount; // ensure negative
  Store.addExpense(currentCompanyId, currentYear, currentMonth, {
    name, category, amount, due_day, note, paid: false
  });
  document.getElementById('e-name').value = '';
  document.getElementById('e-amount').value = '';
  document.getElementById('e-due').value = '';
  document.getElementById('e-note').value = '';
  toast(`Išlaida pridėta: ${name}`);
  render();
}

function deleteExpense(id) {
  if (!confirm('Ištrinti išlaidą?')) return;
  Store.deleteExpense(currentCompanyId, currentYear, currentMonth, id);
  render();
}

function togglePaid(id) {
  const data = Store.getMonth(currentCompanyId, currentYear, currentMonth);
  const e = data.expenses.find(ex => ex.id === id);
  if (!e) return;
  Store.updateExpense(currentCompanyId, currentYear, currentMonth, id, { paid: !e.paid });
  render();
}

// ---- Make.com / Webhook endpoint ----
// This function is called by the Make.com HTTP request module
// Paste parsed receipt JSON here for testing
function importReceiptJSON(json) {
  try {
    const r = typeof json === 'string' ? JSON.parse(json) : json;
    // Expected format:
    // { companyId, year, month, date, location, cash, card, total, fiscalNr }
    const revenue = Store.addRevenue(
      r.companyId || currentCompanyId,
      r.year || currentYear,
      r.month || currentMonth,
      {
        date: r.date,
        location: r.location,
        cash: parseFloat(r.cash) || 0,
        card: parseFloat(r.card) || 0,
        total: parseFloat(r.total) || 0,
        fiscalNr: r.fiscalNr || '',
        source: 'make_com',
      }
    );
    toast(`Čekis importuotas: ${fmt(revenue.total)}`);
    render();
    return { status: 'ok', id: revenue.id };
  } catch (err) {
    toast('Importo klaida: ' + err.message, 'error');
    return { status: 'error', error: err.message };
  }
}

// Expose for Make.com testing via browser console
window.importReceipt = importReceiptJSON;

// ---- Copy share link ----
function copyViewLink() {
  const url = new URL(window.location.href);
  url.searchParams.set('mode', 'view');
  navigator.clipboard.writeText(url.toString()).then(() => {
    toast('View link nukopijuotas!');
  });
}

// ---- Init ----
function init() {
  const params = new URLSearchParams(window.location.search);
  isViewMode = params.get('mode') === 'view';
  if (isViewMode) {
    document.body.classList.add('view-mode');
  }

  Store.load();

  // Seed demo data for Darts August 2026 if empty
  const demoData = Store.getMonth('darts', 2026, 8);
  if (demoData.revenues.length === 0 && demoData.expenses.length === 0) {
    seedDemo();
  }

  render();
}

function seedDemo() {
  Store.updateBalance('darts', 2026, 8, 'eu', 786);
  Store.updateBalance('darts', 2026, 8, 'vilnius', 1400);
  Store.updateBalance('darts', 2026, 8, 'palanga', 1853);
  Store.updateBalance('darts', 2026, 8, 'vilnius_cash', 376);
  Store.updateBalance('darts', 2026, 8, 'palanga_cash', 1390);
  Store.updateProjection('darts', 2026, 8, 23800);

  Store.addRevenue('darts', 2026, 8, { date: '2026-08-10', location: 'Palanga', cash: 101.50, card: 419.19, total: 520.69, fiscalNr: '00011607', source: 'demo' });

  const expenses = [
    { name: 'Nuoma Vilnius', category: 'rent', amount: -3050, due_day: 15, note: '-3965.46 EUR iš viso' },
    { name: 'Komunaliniai Vilnius', category: 'utilities', amount: -2000, due_day: 31, note: '-3225.79 EUR, dalis' },
    { name: 'Ogmios internetas', category: 'internet', amount: -100.43, due_day: 31 },
    { name: 'Ogmios internetas SKOLA (liepa)', category: 'internet', amount: -100.43, due_day: 31 },
    { name: 'Nuoma Palanga', category: 'rent', amount: -3267, due_day: 18, note: '2.7k + PVM + komunaliniai' },
    { name: 'Komunaliniai Palanga', category: 'utilities', amount: -1304, due_day: 31 },
    { name: 'Maistas / Rockenroll (rugpjūtis)', category: 'food', amount: -950, due_day: 31 },
    { name: 'Algos SODRA ir VMI', category: 'tax', amount: -3372, due_day: 15 },
    { name: 'Tiekėjai (planuota)', category: 'suppliers', amount: -4200, due_day: 31 },
    { name: 'Tridens LT', category: 'suppliers', amount: -371.77, due_day: 31 },
    { name: 'Švyturys-Utenos alus (1)', category: 'suppliers', amount: -765.57, due_day: 1 },
    { name: 'Švyturys-Utenos alus (2)', category: 'suppliers', amount: -1010.09, due_day: 5 },
    { name: 'Einamos', category: 'other', amount: -2000, due_day: 31 },
    { name: 'Einamos SKOLA (liepa)', category: 'other', amount: -273, due_day: 31 },
    { name: 'PVM', category: 'tax', amount: -3500, due_day: 25 },
    { name: 'Skolininkai pagal grafikus', category: 'bank', amount: -1976, due_day: 31 },
    { name: 'Bankas + palūkanos', category: 'bank', amount: -1884, due_day: 31 },
    { name: 'Marketingas Facebook', category: 'marketing', amount: -500, due_day: 31 },
  ];

  expenses.forEach(e => Store.addExpense('darts', 2026, 8, { ...e, paid: false }));
}

init();
