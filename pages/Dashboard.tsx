import React from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { PaymentItem } from "../components/dashboard/PaymentItem";
import { EarningsChart } from "../components/dashboard/EarningsChart";
import { QuickAction } from "../components/dashboard/QuickAction";
import { useDashboard } from "../hooks/useDashboard";

const Dashboard: React.FC = () => {
  const { payments, user, dashboardData, hasEarningsData } = useDashboard();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
          Welcome, {user?.firstname}!
        </h1>
        <p className="text-subtext-light dark:text-subtext-dark mt-1">
          Here is a summary of your activities
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
              <QuickAction
                to="/app/salary-advance"
                icon="request_quote"
                label="Salary Advance"
                color="orange"
              />
              <QuickAction
                to="/app/reimbursements"
                icon="receipt"
                label="Reimbursements"
                color="green"
              />
              <QuickAction
                to="/app/payslips"
                icon="receipt_long"
                label="View Payslips"
                color="blue"
              />
              <QuickAction
                to="/app/accounts"
                icon="account_balance"
                label="Bank Accounts"
                color="purple"
              />
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
              <p className="text-sm font-medium opacity-80">
                Earned this month
              </p>
              <p className="text-3xl font-bold mt-1">
                {(dashboardData?.amountEarnedThisMonth || 0).toLocaleString()} /{" "}
                {(dashboardData?.totalSalary || 0).toLocaleString()}
              </p>
              <div className="w-full bg-white/20 rounded-full h-2.5 mt-4">
                <div
                  className="bg-white rounded-full h-2.5"
                  style={{
                    width: `${
                      ((dashboardData?.amountEarnedThisMonth || 0) /
                        Math.max(dashboardData?.totalSalary || 0, 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-end mt-6">
              <div>
                <p className="text-lg font-bold">
                  {dashboardData?.daysLeftInMonth || 0} days
                </p>
                <p className="text-sm opacity-80">until payday</p>
              </div>
              <Link
                to="/app/payslips"
                className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2 px-4 rounded-full interactive-scale"
              >
                View Details
              </Link>
            </div>
          </div>

          <div className="rounded-lg bg-surface-light dark:bg-surface-dark p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
              Earnings Chart
            </h2>
            {hasEarningsData ? (
              <EarningsChart
                data={dashboardData?.lastSixMonthsSalaries || []}
                currency={user?.country?.currency}
              />
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
