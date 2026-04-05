import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import SummaryCards from './components/SummaryCards';
import BalanceChart from './components/BalanceChart';
import PieChart from './components/PieChart';
import BudgetMini from './components/BudgetMini';
import TransactionsTable from './components/TransactionsTable';
import BudgetFull from './components/BudgetFull';
import Insights from './components/Insights';
import TransactionModal from './components/TransactionModal';
import Toast from './components/Toast';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  const { activeTab, transactions, role } = useApp();

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type });
  }

  function openAddModal() {
    if (role !== 'admin') { showToast('Viewers cannot add transactions', 'error'); return; }
    setEditId(null);
    setModalOpen(true);
  }

  function openEditModal(id: number) {
    setEditId(id);
    setModalOpen(true);
  }

  function exportCSV() {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount']];
    transactions.forEach(t => rows.push([t.date, t.desc, t.category, t.type, String(t.amount)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'fintrack-export.csv';
    a.click();
    showToast('CSV exported!', 'success');
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openAddModal(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [role]);

  return (
    <div className="app">
      <div className="mesh-glow g1"></div>
      <div className="mesh-glow g2"></div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          onAddTransaction={openAddModal}
          onExportCSV={exportCSV}
        />

        <div className="content">
          <div className={`tab-panel${activeTab === 'dashboard' ? ' active' : ''}`}>
            <SummaryCards />
            <div className="charts-row" style={{marginTop:'16px'}}>
              <BalanceChart />
              <PieChart />
            </div>
            <div style={{marginTop:'20px'}}>
              <div className="section-header">
                <div className="section-title">Budget Status • April 2026</div>
              </div>
              <BudgetMini />
            </div>
          </div>

          <div className={`tab-panel${activeTab === 'transactions' ? ' active' : ''}`}>
            <TransactionsTable onEdit={openEditModal} />
          </div>

          <div className={`tab-panel${activeTab === 'budgets' ? ' active' : ''}`}>
            <div className="section-header">
              <div className="section-title">Monthly Budgets • April 2026</div>
            </div>
            <BudgetFull />
          </div>

          <div className={`tab-panel${activeTab === 'insights' ? ' active' : ''}`}>
            <Insights />
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        editId={editId}
        onClose={() => setModalOpen(false)}
        onSaved={msg => showToast(msg, msg.includes('Please') ? 'error' : 'success')}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ message: '', type: null })}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
