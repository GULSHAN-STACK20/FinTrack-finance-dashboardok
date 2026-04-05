import { useApp } from '../context/AppContext';
import { CAT_ICONS } from '../data/transactions';

function fmt(n: number) { return '₹' + Math.abs(n).toLocaleString('en-IN'); }

export default function BudgetMini() {
  const { budgets, transactions } = useApp();
  const expenses = transactions.filter(t => t.type === 'expense');
  const cats = Object.keys(budgets).slice(0, 6);

  if (!cats.length) return <p style={{color:'var(--muted)',fontSize:'13px'}}>No budgets set.</p>;

  return (
    <div className="budget-grid stagger">
      {cats.map(cat => {
        const spent = expenses.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);
        const budget = budgets[cat];
        const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
        const cls = pct > 90 ? 'pct-danger' : pct > 70 ? 'pct-warn' : 'pct-good';
        const barColor = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warn)' : 'var(--accent)';
        const icon = CAT_ICONS[cat] || '💰';
        return (
          <div className="budget-mini" key={cat}>
            <div className="budget-row">
              <div className="budget-name">{icon} {cat}</div>
              <div className={`budget-pct ${cls}`}>{pct}%</div>
            </div>
            <div className="budget-amounts">{fmt(spent)} of {fmt(budget)}</div>
            <div className="progress-track">
              <div className="progress-fill" style={{width:`${pct}%`, background:barColor}}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
