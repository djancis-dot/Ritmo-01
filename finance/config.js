const COMPANIES = [
  {
    id: 'darts',
    name: 'UAB Smiginis ir Biliardas',
    shortName: 'Darts & Billiards',
    color: '#22c55e',
    accounts: [
      { id: 'eu', label: 'EU sąskaita' },
      { id: 'vilnius', label: 'Sąskaita Vilnius' },
      { id: 'palanga', label: 'Sąskaita Palanga' },
    ],
    cashRegisters: [
      { id: 'vilnius_cash', label: 'Kasa Vilnius' },
      { id: 'palanga_cash', label: 'Kasa Palanga' },
    ],
    locations: ['Vilnius', 'Palanga'],
  },
  {
    id: 'offline',
    name: 'UAB Naujamiesčio biliardine',
    shortName: 'Offline / Biliardas',
    color: '#3b82f6',
    accounts: [
      { id: 'main', label: 'Pagrindinė sąskaita' },
    ],
    cashRegisters: [
      { id: 'main_cash', label: 'Kasa' },
    ],
    locations: ['Vilnius'],
  },
  {
    id: 'events',
    name: 'UAB Ritmo renginiai',
    shortName: 'Ritmo renginiai',
    color: '#f97316',
    accounts: [
      { id: 'main', label: 'Pagrindinė sąskaita' },
    ],
    cashRegisters: [
      { id: 'main_cash', label: 'Kasa' },
    ],
    locations: ['Vilnius'],
  },
];

const EXPENSE_CATEGORIES = [
  { id: 'rent', label: 'Nuoma', icon: '🏠' },
  { id: 'utilities', label: 'Komunaliniai', icon: '💡' },
  { id: 'salaries', label: 'Algos', icon: '👥' },
  { id: 'tax', label: 'Mokesčiai (VMI/Sodra)', icon: '🏛️' },
  { id: 'suppliers', label: 'Tiekėjai', icon: '🚚' },
  { id: 'bank', label: 'Bankas / Lizingas', icon: '🏦' },
  { id: 'marketing', label: 'Marketingas', icon: '📣' },
  { id: 'internet', label: 'Internetas / IT', icon: '📡' },
  { id: 'food', label: 'Maistas / Prekės', icon: '🍺' },
  { id: 'other', label: 'Kita', icon: '📋' },
];

// Google Sheets integration config (fill in after setup)
const GOOGLE_SHEETS_CONFIG = {
  enabled: false,
  scriptUrl: '', // Google Apps Script web app URL
  sheetId: '',   // Google Sheet ID for read-only published data
};
