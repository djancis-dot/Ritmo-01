// Data persistence layer — localStorage now, Google Sheets later

const STORAGE_KEY = 'ritmo_finance_v1';

function getDefaultMonth(companyId, year, month) {
  const company = COMPANIES.find(c => c.id === companyId);
  const balances = {};
  company.accounts.forEach(a => balances[a.id] = 0);
  company.cashRegisters.forEach(r => balances[r.id] = 0);

  return {
    balances,
    projection: 0,
    revenues: [],
    expenses: [],
  };
}

function monthKey(companyId, year, month) {
  return `${companyId}-${year}-${String(month).padStart(2, '0')}`;
}

const Store = {
  _data: null,

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this._data = raw ? JSON.parse(raw) : { months: {}, settings: {} };
    } catch {
      this._data = { months: {}, settings: {} };
    }
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  },

  getMonth(companyId, year, month) {
    const key = monthKey(companyId, year, month);
    if (!this._data.months[key]) {
      this._data.months[key] = getDefaultMonth(companyId, year, month);
    }
    return this._data.months[key];
  },

  setMonth(companyId, year, month, data) {
    const key = monthKey(companyId, year, month);
    this._data.months[key] = data;
    this.save();
  },

  updateBalance(companyId, year, month, accountId, value) {
    const m = this.getMonth(companyId, year, month);
    m.balances[accountId] = parseFloat(value) || 0;
    this.setMonth(companyId, year, month, m);
  },

  updateProjection(companyId, year, month, value) {
    const m = this.getMonth(companyId, year, month);
    m.projection = parseFloat(value) || 0;
    this.setMonth(companyId, year, month, m);
  },

  addRevenue(companyId, year, month, revenue) {
    const m = this.getMonth(companyId, year, month);
    revenue.id = Date.now();
    revenue.createdAt = new Date().toISOString();
    m.revenues.push(revenue);
    this.setMonth(companyId, year, month, m);
    return revenue;
  },

  deleteRevenue(companyId, year, month, revenueId) {
    const m = this.getMonth(companyId, year, month);
    m.revenues = m.revenues.filter(r => r.id !== revenueId);
    this.setMonth(companyId, year, month, m);
  },

  addExpense(companyId, year, month, expense) {
    const m = this.getMonth(companyId, year, month);
    expense.id = Date.now();
    m.expenses.push(expense);
    this.setMonth(companyId, year, month, m);
    return expense;
  },

  updateExpense(companyId, year, month, expenseId, updates) {
    const m = this.getMonth(companyId, year, month);
    const idx = m.expenses.findIndex(e => e.id === expenseId);
    if (idx >= 0) {
      m.expenses[idx] = { ...m.expenses[idx], ...updates };
      this.setMonth(companyId, year, month, m);
    }
  },

  deleteExpense(companyId, year, month, expenseId) {
    const m = this.getMonth(companyId, year, month);
    m.expenses = m.expenses.filter(e => e.id !== expenseId);
    this.setMonth(companyId, year, month, m);
  },

  // Computed values
  getTotals(companyId, year, month) {
    const m = this.getMonth(companyId, year, month);
    const company = COMPANIES.find(c => c.id === companyId);

    const currentFunds = Object.values(m.balances).reduce((s, v) => s + (v || 0), 0);
    const actualRevenue = m.revenues.reduce((s, r) => s + (r.total || 0), 0);
    const remainingProjection = Math.max(0, m.projection - actualRevenue);
    const totalExpenses = m.expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const paidExpenses = m.expenses.filter(e => e.paid).reduce((s, e) => s + (e.amount || 0), 0);
    const unpaidExpenses = m.expenses.filter(e => !e.paid).reduce((s, e) => s + (e.amount || 0), 0);

    const projectedEndBalance = currentFunds + remainingProjection + unpaidExpenses; // unpaid are negative

    return {
      currentFunds,
      actualRevenue,
      remainingProjection,
      totalExpenses,
      paidExpenses,
      unpaidExpenses,
      projectedEndBalance,
    };
  },

  exportJSON(companyId, year, month) {
    return JSON.stringify(this.getMonth(companyId, year, month), null, 2);
  },

  importRevenue(companyId, year, month, revenueData) {
    // Called by Make.com webhook proxy or manual paste
    return this.addRevenue(companyId, year, month, revenueData);
  },
};
