import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Reimbursement } from '../types';
import { getFirestoreData } from '../services/api';

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const statusStyles = {
    Pending: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    Approved: 'bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark',
    Rejected: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

const iconMap: { [key in Reimbursement['type']]: string } = {
    Travel: 'commute',
    Meals: 'restaurant',
    Supplies: 'construction',
    Other: 'receipt_long'
};

const ReimbursementItem: React.FC<{ item: Reimbursement }> = ({ item }) => (
    <Link to={`/app/reimbursements/${item.id}`} className="block p-4 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 dark:bg-accent-blue/20 text-primary dark:text-accent-blue">
                <span className="material-symbols-outlined">{iconMap[item.type]}</span>
            </div>
            <div className="flex-1">
                <p className="font-semibold text-text-light dark:text-text-dark">{item.description}</p>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">{item.expenseDate}</p>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-text-light dark:text-text-dark">{formatCurrency(item.amount)}</p>
                <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${statusStyles[item.status]}`}>{item.status}</p>
            </div>
        </div>
    </Link>
);

const Reimbursements: React.FC = () => {
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
        <div className="p-4 sm:p-6 lg:p-8">
             <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Reimbursements</h1>
                    <p className="text-subtext-light dark:text-subtext-dark mt-1">Manage and track your expense requests.</p>
                </div>
                <Link to="/app/reimbursements/new" className="mt-4 sm:mt-0 w-full sm:w-auto h-12 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center px-6 gap-2 interactive-scale">
                    <span className="material-symbols-outlined">add_circle</span>
                    New Request
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters - Right column on desktop, first on mobile */}
                <aside className="lg:col-span-1 lg:order-last">
                     <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 sticky top-8">
                        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Filter by Date</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Start Date</label>
                                <input
                                    type="date"
                                    id="start-date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark h-12 px-4 text-base focus:ring-primary focus:border-primary"
                                    max={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">End Date</label>
                                <input
                                    type="date"
                                    id="end-date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark h-12 px-4 text-base focus:ring-primary focus:border-primary"
                                    min={startDate}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                        </div>
                        {(startDate || endDate) && (
                            <button
                                onClick={handleClearFilter}
                                className="w-full h-11 mt-6 bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue font-bold rounded-lg text-sm flex items-center justify-center gap-2 interactive-scale"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                                Clear Filter
                            </button>
                        )}
                    </div>
                </aside>

                {/* Reimbursements List - Left column on desktop */}
                <main className="lg:col-span-3">
                     <div className="space-y-4">
                        {filteredReimbursements.length > 0 ? (
                            filteredReimbursements.map(item => <ReimbursementItem key={item.id} item={item} />)
                        ) : (
                            <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm">
                                <span className="material-symbols-outlined text-6xl text-subtext-light dark:text-subtext-dark" aria-hidden="true">search_off</span>
                                <p className="mt-4 text-xl font-semibold">No Results Found</p>
                                <p className="text-subtext-light dark:text-subtext-dark mt-2">Try adjusting your date range.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Reimbursements;
