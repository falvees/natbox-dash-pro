export interface SaleEntry {
  id: string;
  date: string; // YYYY-MM-DD
  cash: number;
  card: number;
  ifood: number;
  total: number;
}

const STORAGE_KEY = "natbox-sales";

function load(): SaleEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(entries: SaleEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getSales(): SaleEntry[] {
  return load().sort((a, b) => a.date.localeCompare(b.date));
}

export function upsertSale(entry: Omit<SaleEntry, "id" | "total">): SaleEntry {
  const entries = load();
  const existing = entries.find((e) => e.date === entry.date);
  const total = entry.cash + entry.card + entry.ifood;

  if (existing) {
    existing.cash = entry.cash;
    existing.card = entry.card;
    existing.ifood = entry.ifood;
    existing.total = total;
    save(entries);
    return existing;
  }

  const newEntry: SaleEntry = {
    id: crypto.randomUUID(),
    ...entry,
    total,
  };
  entries.push(newEntry);
  save(entries);
  return newEntry;
}

export function deleteSale(id: string) {
  save(load().filter((e) => e.id !== id));
}

export function getSalesForMonth(year: number, month: number): SaleEntry[] {
  return getSales().filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
