import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from './components/DefaultLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Payslips from './pages/Payslips';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import PayslipDetail from './pages/PayslipDetail';
import SalaryAdvance from './pages/SalaryAdvance';
import Reimbursements from './pages/Reimbursements';
import NewReimbursement from './pages/NewReimbursement';
import { ThemeProvider } from './contexts/ThemeContext';
import AcceptInvite from './pages/AcceptInvite';
import AIAssistant from './pages/AIAssistant';
import PAYECalculator from './pages/PAYECalculator';
import TaxBadges from './pages/TaxBadges';
import RentRelief from './pages/RentRelief';
import TaxChatbot from './pages/TaxChatbot';
import Accounts from './pages/Accounts';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/accept-invite" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/accept-invite" element={<AcceptInvite />} />
          <Route path="/payslip/:payslipId" element={<PayslipDetail />} />
          <Route path="/salary-advance" element={<SalaryAdvance />} />
          <Route path="/reimbursements/new" element={<NewReimbursement />} />
          <Route path="/app" element={<DefaultLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="payslips" element={<Payslips />} />
              <Route path="reimbursements" element={<Reimbursements />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="tax-companion/paye-calculator" element={<PAYECalculator />} />
              <Route path="tax-companion/tax-badges" element={<TaxBadges />} />
              <Route path="tax-companion/rent-relief" element={<RentRelief />} />
              <Route path="tax-companion/chatbot" element={<TaxChatbot />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
              <Route path="settings/accounts" element={<Accounts />} />
          </Route>
          <Route path="*" element={<Navigate to="/accept-invite" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;