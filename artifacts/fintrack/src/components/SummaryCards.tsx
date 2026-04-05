import { useApp } from '../context/AppContext';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

function fmt(n: number) { return '₹' + Math.abs(n).toLocaleString('en-IN'); }
function fmtFull(n: number) { return '₹' + n.toLocaleString('en-IN'); }

function AnimatedValue({ value, signed }: { value: number; signed?: boolean }) {
  const animated = useAnimatedNumber(Math.abs(value));
  const prefix = signed ? (value >= 0 ? '+' : '-') : '';
  return <>{prefix}₹{animated.toLocaleString('en-IN')}</>;
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  return (
    <div className="cards-grid stagger" id="summary-cards">
      <div className="summary-card card-balance">
        <div className="card-icon"><i className="fas fa-wallet"></i></div>
        <div className="card-label">Total Balance</div>
        <div className="card-value">
          <AnimatedValue value={balance} />
        </div>
        <div className="card-sub">Net across all transactions</div>
      </div>
      <div className="summary-card card-income">
        <div className="card-icon"><i className="fas fa-arrow-trend-up"></i></div>
        <div className="card-label">Total Income</div>
        <div className="card-value">
          <AnimatedValue value={totalIncome} />
        </div>
        <div className="card-sub">{incomes.length} income entries recorded</div>
      </div>
      <div className="summary-card card-expense">
        <div className="card-icon"><i className="fas fa-arrow-trend-down"></i></div>
        <div className="card-label">Total Expenses</div>
        <div className="card-value">
          <AnimatedValue value={totalExpense} />
        </div>
        <div className="card-sub">
          {expenses.length} expenses • <span>{savingsRate}% savings rate</span>
        </div>
      </div>
    </div>
  );
}
