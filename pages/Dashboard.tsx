import React from 'react';
import type { Payment } from '../types';
import { Link } from 'react-router-dom';

const paymentsData: Payment[] = [
    { id: '1', amount: '₦30,000.00', date: '2023-11-15', status: 'Paid' },
    { id: '2', amount: '₦30,000.00', date: '2023-10-15', status: 'Paid' },
    { id: '3', amount: '₦30,000.00', date: '2023-09-15', status: 'Paid' },
];

const monthlyEarningsData = [
    { month: 'Jul', earnings: 185000 },
    { month: 'Aug', earnings: 210000 },
    { month: 'Sep', earnings: 195000 },
    { month: 'Oct', earnings: 220000 },
    { month: 'Nov', earnings: 205000 },
    { month: 'Dec', earnings: 230000 },
];

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const PaymentItem: React.FC<{ payment: Payment }> = ({ payment }) => (
    <li className="pb-4">
        <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent-blue/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary dark:text-accent-blue" aria-hidden="true"> check_circle </span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-text-light dark:text-text-dark truncate">{payment.amount}</p>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">{payment.date}</p>
            </div>
            <div className="inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark">
                {payment.status}
            </div>
        </div>
    </li>
);

const EarningsChart: React.FC<{ data: { month: string; earnings: number }[] }> = ({ data }) => {
    const maxEarning = Math.max(...data.map(d => d.earnings), 1); // Avoid division by zero
    
    return (
        <div className="mt-6 grid grid-cols-6 gap-x-4 items-end justify-items-center h-40">
            {data.map(({ month, earnings }) => (
                <div key={month} className="flex flex-col items-center w-full h-full justify-end group">
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
                    <p className="text-xs font-medium text-subtext-light dark:text-subtext-dark mt-2 text-center">{month}</p>
                </div>
            ))}
        </div>
    );
};

type ActionColor = 'blue' | 'green' | 'orange' | 'purple';

const colorSchemes: Record<ActionColor, {
    containerBg: string;
    iconText: string;
    labelText: string;
    hoverBg: string;
}> = {
    orange: {
        containerBg: 'bg-orange-100 dark:bg-orange-900/40',
        iconText: 'text-orange-600 dark:text-orange-300',
        labelText: 'text-orange-800 dark:text-orange-200',
        hoverBg: 'hover:bg-orange-200/70 dark:hover:bg-orange-900/60'
    },
    green: {
        containerBg: 'bg-green-100 dark:bg-green-900/40',
        iconText: 'text-green-600 dark:text-green-300',
        labelText: 'text-green-800 dark:text-green-200',
        hoverBg: 'hover:bg-green-200/70 dark:hover:bg-green-900/60'
    },
    blue: {
        containerBg: 'bg-blue-100 dark:bg-blue-900/40',
        iconText: 'text-blue-600 dark:text-blue-300',
        labelText: 'text-blue-800 dark:text-blue-200',
        hoverBg: 'hover:bg-blue-200/70 dark:hover:bg-blue-900/60'
    },
    purple: {
        containerBg: 'bg-purple-100 dark:bg-purple-900/40',
        iconText: 'text-purple-600 dark:text-purple-300',
        labelText: 'text-purple-800 dark:text-purple-200',
        hoverBg: 'hover:bg-purple-200/70 dark:hover:bg-purple-900/60'
    },
};

const QuickAction: React.FC<{ to: string; icon: string; label: string; color: ActionColor }> = ({ to, icon, label, color }) => {
    const scheme = colorSchemes[color];
    
    return (
        <Link 
            to={to} 
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-colors shadow-sm interactive-scale ${scheme.containerBg} ${scheme.hoverBg}`}
        >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/60 dark:bg-black/20 ${scheme.iconText}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <p className={`text-sm font-semibold ${scheme.labelText}`}>{label}</p>
        </Link>
    );
};

const Dashboard: React.FC = () => {
    const currentMonthEarning = monthlyEarningsData[monthlyEarningsData.length - 1].earnings;
    const previousMonthEarning = monthlyEarningsData[monthlyEarningsData.length - 2].earnings;
    const percentageChange = ((currentMonthEarning - previousMonthEarning) / previousMonthEarning) * 100;

    return (
        <>
            <header className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark">
                <button className="text-text-light dark:text-text-dark" aria-label="Open menu">
                    <span className="material-symbols-outlined text-3xl"> menu </span>
                </button>
                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">Dashboard</h1>
                <div className="w-8"></div>
            </header>
            <main className="p-4 space-y-6">
                 <div className="rounded-lg bg-surface-light dark:bg-surface-dark p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">Monthly Earnings</h2>
                    <p className="text-sm text-subtext-light dark:text-subtext-dark">Total this month</p>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-4xl font-bold text-text-light dark:text-text-dark">{formatCurrency(currentMonthEarning)}</p>
                        <div className={`flex items-center gap-1 ${percentageChange >= 0 ? 'text-success-light dark:text-success-dark' : 'text-red-500'}`}>
                            <span className="material-symbols-outlined text-base" aria-hidden="true">
                                {percentageChange >= 0 ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                            <p className="text-sm font-medium">{Math.abs(percentageChange).toFixed(1)}%</p>
                        </div>
                    </div>
                    <EarningsChart data={monthlyEarningsData} />
                </div>
                
                <section>
                    <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <QuickAction to="/salary-advance" icon="request_quote" label="Salary Advance" color="orange" />
                        <QuickAction to="/reimbursements" icon="receipt" label="Reimbursements" color="green" />
                        <QuickAction to="/app/payslips" icon="receipt_long" label="View Payslips" color="blue" />
                        <QuickAction to="/app/accounts" icon="account_balance" label="Bank Accounts" color="purple" />
                    </div>
                </section>

                <div className="rounded-lg bg-primary text-white p-6 shadow-sm flex flex-col">
                    <div className="flex-grow">
                        <p className="text-sm font-medium opacity-80">Earned this month</p>
                        <p className="text-2xl font-bold mt-1">{formatCurrency(currentMonthEarning)} / ₦250,000</p>
                        <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                            <div className="bg-white rounded-full h-2" style={{ width: `${(currentMonthEarning / 250000) * 100}%` }}></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-sm font-medium">15 days</p>
                            <p className="text-xs opacity-80">until payday</p>
                        </div>
                        <Link to="/app/payslips" className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2 px-4 rounded-full interactive-scale">
                            View Details
                        </Link>
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Recent Payments</h2>
                    <div className="flow-root">
                        <ul className="-mb-4" role="list">
                            {paymentsData.map(payment => <PaymentItem key={payment.id} payment={payment} />)}
                        </ul>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;