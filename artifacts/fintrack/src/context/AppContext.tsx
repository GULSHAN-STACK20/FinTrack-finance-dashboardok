import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Transaction,
  SEED_TRANSACTIONS,
  DEFAULT_BUDGETS,
} from '../data/transactions';

export type Role = 'admin' | 'viewer';
export type Theme = 'dark' | 'light';
export type SortKey = 'date' | 'amount' | 'category';
export type SortDir = 'asc' | 'desc';
export type TabId = 'dashboard' | 'transactions' | 'budgets' | 'insights';

interface AppState {
  transactions: Transaction[];
  budgets: Record<string, number>;
  role: Role;
  theme: Theme;
  activeTab: TabId;
  sortKey: SortKey;
  sortDir: SortDir;
  filterType: string;
  filterCat: string;
  filterMonth: string;
  searchQuery: string;
}

interface AppContextValue extends AppState {
  setTransactions: (t: Transaction[]) => void;
  setBudgets: (b: Record<string, number>) => void;
  setRole: (r: Role) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: TabId) => void;
  setSortKey: (k: SortKey) => void;
  setSortDir: (d: SortDir) => void;
  setFilterType: (v: string) => void;
  setFilterCat: (v: string) => void;
  setFilterMonth: (v: string) => void;
  setSearchQuery: (v: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: number, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'fintrack_v2';

function loadFromStorage(): Partial<AppState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

export function AppProvider({ children }: { children: ReactNode }) {
  const saved = loadFromStorage();

  const [transactions, setTransactions] = useState<Transaction[]>(
    saved.transactions ?? [...SEED_TRANSACTIONS]
  );
  const [budgets, setBudgets] = useState<Record<string, number>>(
    saved.budgets ?? { ...DEFAULT_BUDGETS }
  );
  const [role, setRoleState] = useState<Role>(saved.role ?? 'admin');
  const [theme, setTheme] = useState<Theme>(saved.theme ?? 'dark');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterType, setFilterType] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const persist = useCallback(
    (t: Transaction[], b: Record<string, number>, r: Role, th: Theme) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions: t, budgets: b, role: r, theme: th }));
    },
    []
  );

  const setRole = (r: Role) => {
    setRoleState(r);
    persist(transactions, budgets, r, theme);
  };

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    persist(transactions, budgets, role, next);
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...tx, id: Date.now() };
    const next = [newTx, ...transactions];
    setTransactions(next);
    persist(next, budgets, role, theme);
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    const next = transactions.map(t => t.id === id ? { ...t, ...updates } : t);
    setTransactions(next);
    persist(next, budgets, role, theme);
  };

  const deleteTransaction = (id: number) => {
    const next = transactions.filter(t => t.id !== id);
    setTransactions(next);
    persist(next, budgets, role, theme);
  };

  return (
    <AppContext.Provider value={{
      transactions, budgets, role, theme, activeTab, sortKey, sortDir,
      filterType, filterCat, filterMonth, searchQuery,
      setTransactions, setBudgets,
      setRole, toggleTheme, setActiveTab,
      setSortKey, setSortDir,
      setFilterType, setFilterCat, setFilterMonth, setSearchQuery,
      addTransaction, updateTransaction, deleteTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
