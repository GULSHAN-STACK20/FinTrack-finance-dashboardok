import { useApp } from '../context/AppContext';
import { CAT_COLORS, CAT_ICONS } from '../data/transactions';

function fmtFull(n: number) { return '₹' + n.toLocaleString('en-IN'); }
function fmt(n: number) { return '₹' + Math.abs(n).toLocaleString('en-IN'); }

export default function Insights() {
  const { transactions } = useApp();
  const expenses = transactions.filter(t => t.type === 'expense');
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const catTotals: Record<string, number> = {};
  expenses.forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const topCat = sortedCats[0];
  const maxCatAmt = topCat ? topCat[1] : 1;

  const getMonthTotal = (prefix: string, type: 'income' | 'expense') =>
    transactions.filter(t => t.type === type && t.date.startsWith(prefix)).reduce((s, t) => s + t.amount, 0);

  const aprIncome = getMonthTotal('2026-04', 'income');
  const marIncome = getMonthTotal('2026-03', 'income');
  const aprExp = getMonthTotal('2026-04', 'expense');
  const marExp = getMonthTotal('2026-03', 'expense');
  const expDiff = aprExp - marExp;
  const incDiff = aprIncome - marIncome;

  return (
    <div className="insights-grid stagger">
      <div className="insight-card">
        <div className="insight-label">Top Spending Category</div>
        <div className="insight-value" style={{color: topCat ? CAT_COLORS[topCat[0]] : 'var(--text)'}}>
          {topCat ? `${CAT_ICONS[topCat[0]] || ''} ${topCat[0]}` : '—'}
        </div>
        <div className="insight-sub">
          {topCat ? `${fmtFull(topCat[1])} total spent` : 'No expenses recorded'}
        </div>
      </div>

      <div className="insight-card">
        <div className="insight-label">Savings Rate</div>
        <div className="insight-value" style={{color: savingsRate >= 30 ? 'var(--accent)' : savingsRate >= 15 ? 'var(--warn)' : 'var(--danger)'}}>
          {savingsRate}%
        </div>
        <div className="insight-sub">{fmtFull(balance)} saved of {fmtFull(totalIncome)} earned</div>
        <div className={`insight-trend ${savingsRate >= 20 ? 'trend-up' : 'trend-down'}`}>
          <i className={`fas fa-arrow-${savingsRate >= 20 ? 'up' : 'down'}`}></i>
          {' '}{savingsRate >= 20 ? 'Healthy savings' : 'Below 20% target'}
        </div>
      </div>

      <div className="insight-card wide">
        <div className="insight-label">Month-over-Month Comparison • Mar vs Apr 2026</div>
        <div className="month-compare">
          <div className="month-col">
            <div className="month-name">March 2026</div>
            <div className="month-stat">
              <span className="month-stat-label">Income</span>
              <span className="month-stat-val" style={{color:'#22d3ee'}}>{fmtFull(marIncome)}</span>
            </div>
            <div className="month-stat">
              <span className="month-stat-label">Expenses</span>
              <span className="month-stat-val" style={{color:'var(--danger)'}}>{fmtFull(marExp)}</span>
            </div>
            <div className="month-stat">
              <span className="month-stat-label">Net</span>
              <span className="month-stat-val" style={{color: marIncome-marExp >= 0 ? 'var(--accent)' : 'var(--danger)'}}>{fmtFull(marIncome - marExp)}</span>
            </div>
          </div>
          <div className="month-col">
            <div className="month-name">April 2026</div>
            <div className="month-stat">
              <span className="month-stat-label">Income</span>
              <span className="month-stat-val" style={{color:'#22d3ee'}}>{fmtFull(aprIncome)}</span>
            </div>
            <div className="month-stat">
              <span className="month-stat-label">Expenses</span>
              <span className="month-stat-val" style={{color:'var(--danger)'}}>{fmtFull(aprExp)}</span>
            </div>
            <div className="month-stat">
              <span className="month-stat-label">Net</span>
              <span className="month-stat-val" style={{color: aprIncome-aprExp >= 0 ? 'var(--accent)' : 'var(--danger)'}}>{fmtFull(aprIncome - aprExp)}</span>
            </div>
          </div>
        </div>
        <div style={{marginTop:'16px',paddingTop:'16px',borderTop:'1px solid var(--border)',display:'flex',gap:'20px',flexWrap:'wrap'}}>
          <div style={{fontSize:'13px',color:'var(--muted2)'}}>
            <span style={{fontWeight:600,color: expDiff > 0 ? 'var(--danger)' : 'var(--accent)'}}>
              <i className={`fas fa-arrow-${expDiff > 0 ? 'up' : 'down'}`}></i> {fmt(Math.abs(expDiff))}
            </span>
            {' '}expenses {expDiff > 0 ? 'higher' : 'lower'} than last month
          </div>
          <div style={{fontSize:'13px',color:'var(--muted2)'}}>
            <span style={{fontWeight:600,color: incDiff > 0 ? 'var(--accent)' : 'var(--danger)'}}>
              <i className={`fas fa-arrow-${incDiff > 0 ? 'up' : 'down'}`}></i> {fmt(Math.abs(incDiff))}
            </span>
            {' '}income {incDiff > 0 ? 'more' : 'less'} than last month
          </div>
        </div>
      </div>

      <div className="insight-card wide">
        <div className="insight-label">Top Spending Categories (All Time)</div>
        <div className="cat-rank">
          {sortedCats.slice(0, 6).map(([cat, amt], i) => (
            <div className="cat-rank-item" key={cat}>
              <div className="cat-rank-pos">#{i + 1}</div>
              <div className="cat-rank-bar-wrap">
                <div className="cat-rank-label">{CAT_ICONS[cat] || ''} {cat}</div>
                <div className="cat-rank-bar">
                  <div className="cat-rank-fill" style={{width:`${Math.round(amt / maxCatAmt * 100)}%`, background: CAT_COLORS[cat] || 'var(--accent)'}}></div>
                </div>
              </div>
              <div className="cat-rank-amount">{fmtFull(amt)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
