export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  date: string;
  desc: string;
  category: string;
  type: TransactionType;
  amount: number;
}

export const EXPENSE_CATS = ["Food","Transport","Shopping","Bills","Entertainment","Health","Housing","Utilities","Education","Travel"];
export const INCOME_CATS  = ["Salary","Freelance","Investment","Other Income"];
export const ALL_CATS = [...INCOME_CATS, ...EXPENSE_CATS];

export const CAT_COLORS: Record<string, string> = {
  Food:'#f87171', Transport:'#fb923c', Shopping:'#fbbf24', Bills:'#a3e635',
  Entertainment:'#34d399', Health:'#22d3ee', Housing:'#60a5fa', Utilities:'#818cf8',
  Education:'#c084fc', Travel:'#f472b6', Salary:'#00e5a0', Freelance:'#67e8f9',
  Investment:'#86efac', 'Other Income':'#fca5a5'
};

export const CAT_ICONS: Record<string, string> = {
  Food:'🍜', Transport:'🚗', Shopping:'🛍️', Bills:'💡', Entertainment:'🎮',
  Health:'💊', Housing:'🏠', Utilities:'⚡', Education:'📚', Travel:'✈️',
  Salary:'💼', Freelance:'💻', Investment:'📈', 'Other Income':'💰'
};

export const DEFAULT_BUDGETS: Record<string, number> = {
  Food:15000, Transport:8000, Shopping:12000, Bills:10000,
  Entertainment:5000, Health:6000, Housing:20000, Utilities:4000,
  Education:3000, Travel:8000
};

export const SEED_TRANSACTIONS: Transaction[] = [
  {id:1, date:"2026-04-01", desc:"Salary April", category:"Salary", type:"income", amount:125000},
  {id:2, date:"2026-04-02", desc:"Swiggy Dinner", category:"Food", type:"expense", amount:1240},
  {id:3, date:"2026-04-02", desc:"Uber Ride to Office", category:"Transport", type:"expense", amount:380},
  {id:4, date:"2026-04-03", desc:"Amazon Shopping", category:"Shopping", type:"expense", amount:3299},
  {id:5, date:"2026-04-03", desc:"Electricity Bill", category:"Bills", type:"expense", amount:2400},
  {id:6, date:"2026-04-04", desc:"Freelance Project", category:"Freelance", type:"income", amount:35000},
  {id:7, date:"2026-04-05", desc:"Zomato Lunch", category:"Food", type:"expense", amount:640},
  {id:8, date:"2026-04-06", desc:"Gym Membership", category:"Health", type:"expense", amount:2500},
  {id:9, date:"2026-04-07", desc:"Netflix + Hotstar", category:"Entertainment", type:"expense", amount:1299},
  {id:10, date:"2026-04-08", desc:"Ola Outstation", category:"Transport", type:"expense", amount:1800},
  {id:11, date:"2026-03-01", desc:"Salary March", category:"Salary", type:"income", amount:125000},
  {id:12, date:"2026-03-02", desc:"Freelance Design", category:"Freelance", type:"income", amount:28000},
  {id:13, date:"2026-03-05", desc:"Blinkit Groceries", category:"Food", type:"expense", amount:2800},
  {id:14, date:"2026-03-08", desc:"House Rent", category:"Housing", type:"expense", amount:18000},
  {id:15, date:"2026-03-10", desc:"BigBasket Order", category:"Food", type:"expense", amount:1650},
  {id:16, date:"2026-03-12", desc:"Internet Bill", category:"Bills", type:"expense", amount:999},
  {id:17, date:"2026-03-15", desc:"Clothes - Myntra", category:"Shopping", type:"expense", amount:4200},
  {id:18, date:"2026-03-18", desc:"Doctor Visit", category:"Health", type:"expense", amount:1200},
  {id:19, date:"2026-03-22", desc:"Weekend Trip Goa", category:"Travel", type:"expense", amount:12000},
  {id:20, date:"2026-03-25", desc:"Udemy Course", category:"Education", type:"expense", amount:999},
  {id:21, date:"2026-02-01", desc:"Salary Feb", category:"Salary", type:"income", amount:125000},
  {id:22, date:"2026-02-03", desc:"Swiggy Weekend", category:"Food", type:"expense", amount:1800},
  {id:23, date:"2026-02-05", desc:"Investment Return", category:"Investment", type:"income", amount:8500},
  {id:24, date:"2026-02-07", desc:"House Rent", category:"Housing", type:"expense", amount:18000},
  {id:25, date:"2026-02-10", desc:"Phone Bill", category:"Bills", type:"expense", amount:599},
  {id:26, date:"2026-02-14", desc:"Valentine Dinner", category:"Food", type:"expense", amount:3200},
  {id:27, date:"2026-02-18", desc:"Rapido Rides", category:"Transport", type:"expense", amount:1200},
  {id:28, date:"2026-02-22", desc:"Pharmacy", category:"Health", type:"expense", amount:850},
  {id:29, date:"2026-02-25", desc:"Prime + Spotify", category:"Entertainment", type:"expense", amount:749},
  {id:30, date:"2026-01-01", desc:"Salary Jan", category:"Salary", type:"income", amount:125000},
  {id:31, date:"2026-01-05", desc:"New Year Shopping", category:"Shopping", type:"expense", amount:6500},
  {id:32, date:"2026-01-08", desc:"Freelance Jan", category:"Freelance", type:"income", amount:22000},
  {id:33, date:"2026-01-10", desc:"House Rent", category:"Housing", type:"expense", amount:18000},
  {id:34, date:"2026-01-15", desc:"Food Delivery", category:"Food", type:"expense", amount:2100},
  {id:35, date:"2026-01-20", desc:"Books & Courses", category:"Education", type:"expense", amount:1500},
];
