import React, { useState, useEffect } from "react";
import type { Payment } from "../types";
import { Link } from "react-router-dom";
import { getFirestoreData } from "../services/api";
import useStore from "../store";
import EmptyState from "../components/EmptyState";

const monthlyEarningsData: { month: string; earnings: number }[] = [];

const formatCurrency = (amount: number) => `₦${amount.toLocaleString("en-NG")}`;

const PaymentItem: React.FC<{ payment: Payment }> = ({ payment }) => (
  <li className="py-4">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent-blue/20 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary dark:text-accent-blue"
            aria-hidden="true"
          >
            check_circle
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-text-light dark:text-text-dark truncate">
          {payment.amount}
        </p>
        <p className="text-sm text-subtext-light dark:text-subtext-dark">
          {payment.date}
        </p>
      </div>
      <div className="inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark">
        {payment.status}
      </div>
    </div>
  </li>
);

const EarningsChart: React.FC<{
  data: { month: string; earnings: number }[];
}> = ({ data }) => {
  const maxEarning = Math.max(...data.map((d) => d.earnings), 1); // Avoid division by zero

  return (
    <div className="mt-6 grid grid-cols-6 gap-x-4 items-end justify-items-center h-40">
      {data.map(({ month, earnings }) => (
        <div
          key={month}
          className="flex flex-col items-center w-full h-full justify-end group"
        >
          <div className="relative w-full h-full flex items-end">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-dark dark:bg-surface-light text-text-dark dark:text-text-light text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {formatCurrency(earnings)}
            </div>
            <div
              className="w-full bg-primary/20 dark:bg-accent-blue/30 rounded-t-md hover:bg-primary dark:hover:bg-accent-blue transition-colors"
              style={{ height: `${(earnings / maxEarning) * 100}%` }}
              aria-label={`Earnings for ${month}: ${formatCurrency(earnings)}`}
            ></div>
          </div>
          <p className="text-xs font-medium text-subtext-light dark:text-subtext-dark mt-2 text-center">
            {month}
          </p>
        </div>
      ))}
    </div>
  );
};

type ActionColor = "blue" | "green" | "orange" | "purple";

const colorSchemes: Record<
  ActionColor,
  {
    containerBg: string;
    iconText: string;
    labelText: string;
    hoverBg: string;
  }
> = {
  orange: {
    containerBg: "bg-orange-100 dark:bg-orange-900/40",
    iconText: "text-orange-600 dark:text-orange-300",
    labelText: "text-orange-800 dark:text-orange-200",
    hoverBg: "hover:bg-orange-200/70 dark:hover:bg-orange-900/60",
  },
  green: {
    containerBg: "bg-green-100 dark:bg-green-900/40",
    iconText: "text-green-600 dark:text-green-300",
    labelText: "text-green-800 dark:text-green-200",
    hoverBg: "hover:bg-green-200/70 dark:hover:bg-green-900/60",
  },
  blue: {
    containerBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-300",
    labelText: "text-blue-800 dark:text-blue-200",
    hoverBg: "hover:bg-blue-200/70 dark:hover:bg-blue-900/60",
  },
  purple: {
    containerBg: "bg-purple-100 dark:bg-purple-900/40",
    iconText: "text-purple-600 dark:text-purple-300",
    labelText: "text-purple-800 dark:text-purple-200",
    hoverBg: "hover:bg-purple-200/70 dark:hover:bg-purple-900/60",
  },
};

const QuickAction: React.FC<{
  to: string;
  icon: string;
  label: string;
  color: ActionColor;
}> = ({ to, icon, label, color }) => {
  const scheme = colorSchemes[color];

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-colors shadow-sm interactive-scale ${scheme.containerBg} ${scheme.hoverBg}`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/60 dark:bg-black/20 ${scheme.iconText}`}
      >
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <p className={`text-sm font-semibold ${scheme.labelText}`}>{label}</p>
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { user, setUser } = useStore();

  useEffect(() => {
    // Mock user for demonstration
    if (!user) {
      setUser({
        uid: "12345",
        email: "test@example.com",
        displayName: "Test User",
        photoURL: "",
      });
    }

    const fetchPayments = async () => {
      const paymentsData = await getFirestoreData<Payment>("employees");
      setPayments(paymentsData);
    };
    // fetchPayments(); // Currently disabled
  }, [user, setUser]);

  const currentMonthEarning = 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
          Welcome, {user?.displayName || "User"}!
        </h1>
        <p className="text-subtext-light dark:text-subtext-dark mt-1">
          Here is a summary of your activities.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction to="/app/salary-advance" icon="request_quote" label="Salary Advance" color="orange" />
              <QuickAction to="/app/reimbursements" icon="receipt" label="Reimbursements" color="green" />
              <QuickAction to="/app/payslips" icon="receipt_long" label="View Payslips" color="blue" />
              <QuickAction to="/app/accounts" icon="account_balance" label="Bank Accounts" color="purple" />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
              Recent Payments
            </h2>
            {payments.length > 0 ? (
              <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm">
                <ul className="divide-y divide-border-light dark:divide-border-dark">
                  {payments.map((payment) => (
                    <li key={payment.id} className="px-6">
                      <PaymentItem payment={payment} />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EmptyState message="You have no recent payments." />
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
           <div className="rounded-lg bg-primary text-white p-6 shadow-sm flex flex-col h-full">
              <div className="flex-grow">
                <p className="text-sm font-medium opacity-80">Earned this month</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(currentMonthEarning)} / ₦250,000</p>
                <div className="w-full bg-white/20 rounded-full h-2.5 mt-4">
                  <div className="bg-white rounded-full h-2.5" style={{ width: `${(currentMonthEarning / 250000) * 100}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between items-end mt-6">
                 <div>
                    <p className="text-lg font-bold">15 days</p>
                    <p className="text-sm opacity-80">until payday</p>
                  </div>
                <Link to="/app/payslips" className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2 px-4 rounded-full interactive-scale">
                  View Details
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-surface-light dark:bg-surface-dark p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
                Earnings Chart
              </h2>
              {monthlyEarningsData.length > 0 ? (
                <EarningsChart data={monthlyEarningsData} />
              ) : (
                <EmptyState message="No earnings data available yet." />
              )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
