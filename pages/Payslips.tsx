import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Payslip } from '../types';

const payslipsData: Payslip[] = [
    { id: '1', monthYear: 'January 2024', amount: '₦120,000.00' },
    { id: '2', monthYear: 'December 2023', amount: '₦150,000.00' },
    { id: '3', monthYear: 'November 2023', amount: '₦110,000.00' },
    { id: '4', monthYear: 'October 2023', amount: '₦125,000.00' },
    { id: '5', monthYear: 'September 2023', amount: '₦180,000.00' },
    { id: '6', monthYear: 'August 2023', amount: '₦95,000.00' },
];

const PayslipItem: React.FC<{ payslip: Payslip }> = ({ payslip }) => (
    <Link to={`/payslip/${payslip.id}`} className="flex items-center justify-between py-4 group">
        <div>
            <p className="text-base font-medium text-text-light dark:text-text-dark">{payslip.monthYear}</p>
            <p className="text-sm text-subtext-light dark:text-subtext-dark">{payslip.amount}</p>
        </div>
        <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold text-white bg-primary py-1 px-3 rounded-full hidden group-hover:inline">View</span>
            <span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark group-hover:text-accent-blue" aria-hidden="true">chevron_right</span>
        </div>
    </Link>
);

const parseAmount = (amountStr: string) => parseFloat(amountStr.replace(/[₦,]/g, ''));

const Payslips: React.FC = () => {
    const navigate = useNavigate();
    const [sortOrder, setSortOrder] = useState<'date-desc' | 'amount-asc' | 'amount-desc'>('date-desc');

    const sortedPayslips = useMemo(() => {
        const sorted = [...payslipsData];
        if (sortOrder === 'amount-asc') {
            return sorted.sort((a, b) => parseAmount(a.amount) - parseAmount(b.amount));
        }
        if (sortOrder === 'amount-desc') {
            return sorted.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
        }
        // 'date-desc' is the original order, so return the copy
        return sorted;
    }, [sortOrder]);


    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-16">
                        <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Payslips</h1>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-4 py-4">
                     <div className="flex justify-end mb-4">
                        <div className="relative">
                            <label htmlFor="sort-payslips" className="sr-only">Sort payslips</label>
                            <select
                                id="sort-payslips"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                                className="form-select w-full appearance-none rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:ring-primary focus:border-primary h-12 pl-4 pr-10 text-base"
                            >
                                <option value="date-desc">Sort by Date (Newest)</option>
                                <option value="amount-asc">Sort by Amount (Low to High)</option>
                                <option value="amount-desc">Sort by Amount (High to Low)</option>
                            </select>
                             <span className="material-symbols-outlined absolute top-1/2 right-3 -translate-y-1/2 text-subtext-light dark:text-subtext-dark pointer-events-none" aria-hidden="true">
                                expand_more
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark">
                        {sortedPayslips.map(payslip => <PayslipItem key={payslip.id} payslip={payslip} />)}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Payslips;