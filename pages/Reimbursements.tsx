import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Reimbursement } from '../types';
import { getFirestoreData } from '../services/api';

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const statusStyles = {
    Pending: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    Approved: 'bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark',
    Rejected: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

const iconMap = {
    Travel: 'commute',
    Meals: 'restaurant',
    Supplies: 'construction',
    Other: 'receipt_long'
};

const ReimbursementItem: React.FC<{ item: Reimbursement }> = ({ item }) => (
    <div className="flex items-center gap-4 py-4">
        <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 dark:bg-accent-blue/20 text-primary dark:text-accent-blue">
            <span className="material-symbols-outlined">{iconMap[item.type]}</span>
        </div>
        <div className="flex-1">
            <p className="font-semibold text-text-light dark:text-text-dark">{item.description}</p>
            <p className="text-sm text-subtext-light dark:text-subtext-dark">{item.expenseDate}</p>
        </div>
        <div className="text-right">
             <p className="font-bold text-text-light dark:text-text-dark">{formatCurrency(item.amount)}</p>
             <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${statusStyles[item.status]}`}>{item.status}</p>
        </div>
    </div>
);

const Reimbursements: React.FC = () => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);

    useEffect(() => {
        const fetchReimbursements = async () => {
            const reimbursementsData = await getFirestoreData<Reimbursement>("reimbursements");
            setReimbursements(reimbursementsData);
        };

        fetchReimbursements();
    }, []);

    const filteredReimbursements = useMemo(() => {
        return reimbursements.filter(item => {
            if (!startDate && !endDate) return true;

            const itemDate = item.expenseDate;
            const isAfterStartDate = startDate ? itemDate >= startDate : true;
            const isBeforeEndDate = endDate ? itemDate <= endDate : true;

            return isAfterStartDate && isBeforeEndDate;
        });
    }, [startDate, endDate, reimbursements]);

    const handleClearFilter = () => {
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-16">
                        <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Reimbursements</h1>
                    </div>
                </div>
            </header>
            <main className="flex-1 p-4">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-4 mb-4">
                    <h3 className="text-base font-semibold text-text-light dark:text-text-dark mb-3">Filter by Date Range</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="start-date" className="block text-xs font-medium text-subtext-light dark:text-subtext-dark mb-1">Start Date</label>
                            <input
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark h-12 px-3 text-sm focus:ring-primary focus:border-primary"
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-xs font-medium text-subtext-light dark:text-subtext-dark mb-1">End Date</label>
                            <input
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark h-12 px-3 text-sm focus:ring-primary focus:border-primary"
                                min={startDate}
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                    </div>
                    {(startDate || endDate) && (
                         <button
                            onClick={handleClearFilter}
                            className="w-full h-11 mt-4 bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue font-bold rounded-lg text-sm flex items-center justify-center gap-2 interactive-scale"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                            Clear Filter
                        </button>
                    )}
                </div>
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm">
                    <div className="p-4 flex flex-col divide-y divide-border-light dark:divide-border-dark">
                        {filteredReimbursements.length > 0 ? (
                            filteredReimbursements.map(item => <ReimbursementItem key={item.id} item={item} />)
                        ) : (
                             <div className="text-center py-10">
                                <span className="material-symbols-outlined text-5xl text-subtext-light dark:text-subtext-dark" aria-hidden="true">search_off</span>
                                <p className="mt-2 font-semibold">No Results Found</p>
                                <p className="text-sm text-subtext-light dark:text-subtext-dark">Try adjusting your date range.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
             <footer className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-t border-border-light dark:border-border-dark">
                <Link to="/reimbursements/new" className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2 interactive-scale">
                    <span className="material-symbols-outlined">add_circle</span>
                    New Request
                </Link>
            </footer>
        </div>
    );
};

export default Reimbursements;