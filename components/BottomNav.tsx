
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const activeClass = 'text-primary dark:text-accent-blue';
  const inactiveClass = 'text-subtext-light dark:text-subtext-dark';

  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center gap-1 transition-colors ${isActive ? activeClass : inactiveClass}`
      }
    >
      {({ isActive }) => (
        <>
          <span 
            className="material-symbols-outlined"
            style={ isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            aria-hidden="true"
          >
            {icon}
          </span>
          <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark">
      <nav className="flex justify-around items-center h-20">
        <NavItem to="/app/dashboard" icon="home" label="Dashboard" />
        <NavItem to="/app/payslips" icon="receipt_long" label="Payslips" />
        <NavItem to="/app/notifications" icon="notifications" label="Notifications" />
        <NavItem to="/app/settings" icon="settings" label="Settings" />
      </nav>
      <div className="h-safe-area-bottom bg-surface-light/80 dark:bg-surface-dark/80"></div>
    </footer>
  );
};

export default BottomNav;