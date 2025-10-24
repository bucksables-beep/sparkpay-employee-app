import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Payslip } from '../types';
import { getFirestoreData } from '../services/api';

const PayslipItem: React.FC<{ payslip: Payslip }> = ({ payslip }) => (
    <Link to={`/app/payslip/${payslip.id}`} className="block bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 group">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-lg font-bold text-text-light dark:text-text-dark">{payslip.monthYear}</p>
                <p className="text-2xl font-light text-subtext-light dark:text-subtext-dark mt-1">{payslip.amount}</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-subtext-light dark:text-subtext-dark">Status</p>
                <p className="text-sm font-semibold text-success-light dark:text-success-dark mt-1">Paid</p>
            </div>
        </div>
        <div className="mt-6 flex justify-end items-center">
            <span className="text-sm font-semibold text-primary dark:text-accent-blue group-hover:underline">View Payslip</span>
            <span className="material-symbols-outlined text-primary dark:text-accent-blue ml-2 transform-gpu transition-transform group-hover:translate-x-1">arrow_forward</span>
        </div>
    </Link>
);

const parseAmount = (amountStr: string) => parseFloat(amountStr.replace(/[₦,]/g, ''));

const Payslips: React.FC = () => {
    const [sortOrder, setSortOrder] = useState<'date-desc' | 'amount-asc' | 'amount-desc'>('date-desc');
    const [payslips, setPayslips] = useState<Payslip[]>([]);

    useEffect(() => {
        const fetchPayslips = async () => {
            const payslipsData = await getFirestoreData<Payslip>("payslips");
            setPayslips(payslipsData);
        };

        fetchPayslips();
    }, []);

    const sortedPayslips = useMemo(() => {
        const sorted = [...payslips];
        if (sortOrder === 'amount-asc') {
            return sorted.sort((a, b) => parseAmount(a.amount) - parseAmount(b.amount));
        }
        if (sortOrder === 'amount-desc') {
            return sorted.sort((a, b) => parseAmount(b.amount) - parseAmount(a.amount));
        }
        // Default to date-desc
        return sorted.sort((a, b) => new Date(b.monthYear).getTime() - new Date(a.monthYear).getTime());
    }, [sortOrder, payslips]);


    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Payslips</h1>
                <p className="text-subtext-light dark:text-subtext-dark mt-1">Review your payslip history.</p>
            </header>

            <div className="mb-6 flex justify-end">
                 <div className="relative">
                    <label htmlFor="sort-payslips" className="sr-only">Sort payslips</label>
                    <select
                        id="sort-payslips"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                        className="form-select appearance-none rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark focus:ring-primary focus:border-primary h-12 pl-4 pr-10 text-base"
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

            {sortedPayslips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedPayslips.map(payslip => <PayslipItem key={payslip.id} payslip={payslip} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-subtext-light dark:text-subtext-dark" aria-hidden="true">receipt_long</span>
                    <p className="mt-4 text-xl font-semibold">No Payslips Available</p>
                    <p className="text-subtext-light dark:text-subtext-dark mt-2">Your payslips will appear here as soon as they are ready.</p>
                </div>
            )}
        </div>
    );
};

export default Payslips;
