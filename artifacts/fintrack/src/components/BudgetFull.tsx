import { useApp } from '../context/AppContext';
import { CAT_ICONS } from '../data/transactions';

function fmt(n: number) { return '₹' + Math.abs(n).toLocaleString('en-IN'); }

export default function BudgetFull() {
  const { budgets, transactions } = useApp();
  const expenses = transactions.filter(t => t.type === 'expense');
  const cats = Object.keys(budgets);

  if (!cats.length) return <p style={{color:'var(--muted)',fontSize:'13px'}}>No budgets configured.</p>;

  return (
    <div className="budget-full-grid stagger">
      {cats.map(cat => {
        const spent = expenses.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);
        const budget = budgets[cat];
        const remaining = budget - spent;
        const pct = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
        const cls = pct > 90 ? 'pct-danger' : pct > 70 ? 'pct-warn' : 'pct-good';
        const barColor = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warn)' : 'var(--accent)';
        const spentColor = pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warn)' : 'var(--text)';
        const icon = CAT_ICONS[cat] || '💰';
        return (
          <div className="budget-full-card" key={cat}>
            <div className="budget-full-header">
              <div>
                <div className="budget-full-name">{icon} {cat}</div>
                <div className={`budget-full-meta ${cls}`}>
                  {pct}% used • {remaining >= 0 ? `${fmt(remaining)} left` : `${fmt(Math.abs(remaining))} over budget`}
                </div>
              </div>
              <div className="budget-full-nums">
                <div className="budget-spent" style={{color:spentColor}}>{fmt(spent)}</div>
                <div className="budget-limit">of {fmt(budget)}</div>
              </div>
            </div>
            <div className="progress-track" style={{height:'8px'}}>
              <div className="progress-fill" style={{width:`${pct}%`, background:barColor}}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
