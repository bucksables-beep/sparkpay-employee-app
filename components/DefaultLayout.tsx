import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { useDefaultLayout } from "../hooks/useDefaultLayout";

const DefaultLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useDefaultLayout();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar for medium screens and up */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <Outlet />
        </main>

        {/* BottomNav for small screens */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
