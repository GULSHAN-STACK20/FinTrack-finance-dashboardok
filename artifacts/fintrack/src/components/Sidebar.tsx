import { useApp, TabId } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: TabId; icon: string; label: string }[] = [
  { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
  { id: 'transactions', icon: 'fa-receipt', label: 'Transactions' },
  { id: 'budgets', icon: 'fa-wallet', label: 'Budgets' },
  { id: 'insights', icon: 'fa-lightbulb', label: 'Insights' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { activeTab, setActiveTab, transactions, role } = useApp();

  function handleNav(tab: TabId) {
    setActiveTab(tab);
    onClose();
  }

  return (
    <>
      <div
        className={`sidebar-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">₹</div>
          <span className="logo-text">FinTrack</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <i className={`fas ${item.icon} nav-icon`}></i>
              {item.label}
              {item.id === 'transactions' && (
                <span className="nav-badge">{transactions.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="avatar">GK</div>
            <div>
              <div className="user-name">Gulshan Kumar</div>
              <div className="user-sub">Bengaluru • Apr 2026</div>
            </div>
            <div className={`role-badge ${role}`}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
