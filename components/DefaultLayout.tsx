
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import BottomNav from './BottomNav';

const DefaultLayout: React.FC = () => {
  const isAuthenticated = true; // Replace with actual auth check

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col" style={{ minHeight: '100dvh' }}>
      <main className="flex-1 pb-24 min-h-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default DefaultLayout;