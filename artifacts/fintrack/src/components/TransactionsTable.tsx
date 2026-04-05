import { useState } from 'react';
import { useApp, SortKey } from '../context/AppContext';
import { CAT_COLORS, CAT_ICONS } from '../data/transactions';

function fmt(n: number) { return '₹' + Math.abs(n).toLocaleString('en-IN'); }

interface TransactionsTableProps {
  onEdit: (id: number) => void;
}

function getMonthLabel(dateStr: string) {
  const [y, m] = dateStr.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString('en-IN', { month: 'short', year: 'numeric' });
}

export default function TransactionsTable({ onEdit }: TransactionsTableProps) {
  const {
    transactions, role,
    sortKey, sortDir, setSortKey, setSortDir,
    filterType, setFilterType,
    filterCat, setFilterCat,
    filterMonth, setFilterMonth,
    searchQuery, setSearchQuery,
    deleteTransaction,
  } = useApp();

  const categories = [...new Set(transactions.map(t => t.category))].sort();
  const months = [...new Set(transactions.map(t => t.date.substring(0, 7)))].sort().reverse();

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const filtered = transactions
    .filter(t => {
      if (filterType && t.type !== filterType) return false;
      if (filterCat && t.category !== filterCat) return false;
      if (filterMonth && !t.date.startsWith(filterMonth)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!t.desc.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'amount') return (a.amount - b.amount) * dir;
      if (sortKey === 'date') return a.date.localeCompare(b.date) * dir;
      return a.category.localeCompare(b.category) * dir;
    });

  const isAdmin = role === 'admin';

  return (
    <div>
      <div className="filters-bar">
        <div className="search-wrap">
          <i className="fas fa-search"></i>
          <input
            className="search-input"
            placeholder="Search transactions…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {months.map(m => <option key={m} value={m}>{getMonthLabel(m + '-01')}</option>)}
        </select>
        <span className="tx-count">{filtered.length} of {transactions.length} transactions</span>
      </div>

      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className={sortKey === 'date' ? 'sorted' : ''}>
                Date <i className="fas fa-sort sort-icon"></i>
              </th>
              <th>Description</th>
              <th onClick={() => handleSort('category')} className={sortKey === 'category' ? 'sorted' : ''}>
                Category <i className="fas fa-sort sort-icon"></i>
              </th>
              <th>Type</th>
              <th onClick={() => handleSort('amount')} style={{textAlign:'right'}} className={sortKey === 'amount' ? 'sorted' : ''}>
                Amount <i className="fas fa-sort sort-icon"></i>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-text">No transactions match your filters.</div>
                  </div>
                </td>
              </tr>
            ) : filtered.map(tx => {
              const catColor = CAT_COLORS[tx.category] || '#6b7280';
              const icon = CAT_ICONS[tx.category] || '💰';
              return (
                <tr key={tx.id}>
                  <td style={{color:'var(--muted2)',fontSize:'12px',whiteSpace:'nowrap'}}>{tx.date}</td>
                  <td style={{fontWeight:500}}>{tx.desc}</td>
                  <td>
                    <span className="cat-pill" style={{background:`${catColor}18`,color:catColor,border:`1px solid ${catColor}30`}}>
                      {icon} {tx.category}
                    </span>
                  </td>
                  <td>
                    <span className={`type-pill type-${tx.type}`}>
                      <i className={`fas fa-arrow-${tx.type === 'income' ? 'up' : 'down'}`} style={{fontSize:'9px'}}></i>
                      {' '}{tx.type}
                    </span>
                  </td>
                  <td className={`tx-amount amount-${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                  <td>
                    <div className="tx-actions">
                      {isAdmin && (
                        <>
                          <button className="tx-act-btn edit" onClick={() => onEdit(tx.id)} title="Edit">
                            <i className="fas fa-pen"></i>
                          </button>
                          <button className="tx-act-btn del" onClick={() => {
                            if (window.confirm('Delete this transaction?')) deleteTransaction(tx.id);
                          }} title="Delete">
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
