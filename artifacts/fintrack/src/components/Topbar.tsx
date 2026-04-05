import { useApp, Role } from '../context/AppContext';

interface TopbarProps {
  onToggleSidebar: () => void;
  onAddTransaction: () => void;
  onExportCSV: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  budgets: 'Budgets',
  insights: 'Insights',
};

export default function Topbar({ onToggleSidebar, onAddTransaction, onExportCSV }: TopbarProps) {
  const { activeTab, role, setRole, theme, toggleTheme } = useApp();

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="icon-btn hamburger" onClick={onToggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
        <h2 className="page-title">{PAGE_TITLES[activeTab] ?? activeTab}</h2>
      </div>
      <div className="topbar-right">
        <div className="role-toggle">
          <button
            className={`role-btn${role === 'viewer' ? ' active' : ''}`}
            onClick={() => setRole('viewer' as Role)}
          >
            Viewer
          </button>
          <button
            className={`role-btn${role === 'admin' ? ' active' : ''}`}
            onClick={() => setRole('admin' as Role)}
          >
            Admin
          </button>
        </div>
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
        </button>
        <button className="action-btn btn-ghost" onClick={onExportCSV}>
          <i className="fas fa-download"></i>
          <span className="hide-sm">Export</span>
        </button>
        {role === 'admin' && (
          <button className="action-btn btn-primary" onClick={onAddTransaction}>
            <i className="fas fa-plus"></i>
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
}
