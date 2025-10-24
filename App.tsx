import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Payslips from "./pages/Payslips";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Accounts from "./pages/Accounts";
import PayslipDetail from "./pages/PayslipDetail";
import SalaryAdvance from "./pages/SalaryAdvance";
import Reimbursements from "./pages/Reimbursements";
import NewReimbursement from "./pages/NewReimbursement";
import ReimbursementDetail from "./pages/ReimbursementDetail";
import { ThemeProvider } from "./contexts/ThemeContext";
import AcceptInvite from "./pages/AcceptInvite";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          
          <Route path="/app" element={<DefaultLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="payslip/:payslipId" element={<PayslipDetail />} />
            <Route path="reimbursements" element={<Reimbursements />} />
            <Route path="reimbursements/new" element={<NewReimbursement />} />
            <Route path="reimbursements/:id" element={<ReimbursementDetail />} />
            <Route path="salary-advance" element={<SalaryAdvance />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="accounts" element={<Accounts />} />
          </Route>

          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
