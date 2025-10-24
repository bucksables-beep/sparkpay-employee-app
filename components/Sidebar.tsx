
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const activeClass = 'bg-primary/10 dark:bg-accent-blue/20 text-primary dark:text-accent-blue';
  const inactiveClass = 'text-subtext-light dark:text-subtext-dark hover:bg-black/5 dark:hover:bg-white/5';

  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${isActive ? activeClass : inactiveClass}`
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-semibold">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-light dark:text-text-dark px-4">Paymogo</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <NavItem to="/app/dashboard" icon="home" label="Dashboard" />
        <NavItem to="/app/payslips" icon="receipt_long" label="Payslips" />
        <NavItem to="/app/reimbursements" icon="receipt" label="Reimbursements" />
        <NavItem to="/app/notifications" icon="notifications" label="Notifications" />
        <NavItem to="/app/settings" icon="settings" label="Settings" />
      </nav>
    </aside>
  );
};

export default Sidebar;
