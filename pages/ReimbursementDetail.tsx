import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Reimbursement } from '../types';
import { getFirestoreDoc } from '../services/api';

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

const statusStyles: { [key: string]: string } = {
    Pending: 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    Approved: 'bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark',
    Rejected: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

const Header: React.FC<{ title: string; onBack?: () => void }> = ({ title, onBack }) => (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                {onBack ? (
                    <button onClick={onBack} className="p-2 text-text-light dark:text-text-dark interactive-scale" aria-label="Go back">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                ) : <div className="w-8"></div>}
                <h1 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h1>
                <div className="w-8"></div>
            </div>
        </div>
    </header>
);

const ReimbursementDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReimbursement = async () => {
            if (!id) return;
            try {
                const reimbursementData = await getFirestoreDoc<Reimbursement>('reimbursements', id);
                if (reimbursementData) {
                    setReimbursement(reimbursementData);
                } else {
                    setError('Reimbursement not found.');
                }
            } catch (err) {
                setError('Failed to fetch reimbursement details.');
            }
            setLoading(false);
        };

        fetchReimbursement();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <span className="material-symbols-outlined text-7xl text-red-500">error</span>
                <h2 className="mt-4 text-2xl font-bold">An Error Occurred</h2>
                <p className="mt-2 text-subtext-light dark:text-subtext-dark">{error}</p>
                <button
                    onClick={() => navigate('/reimbursements')}
                    className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-lg interactive-scale"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!reimbursement) return null;

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header title="Reimbursement Details" onBack={() => navigate('/reimbursements')} />
            <main className="flex-1 p-4">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-subtext-light dark:text-subtext-dark">Amount</p>
                            <p className="text-3xl font-bold text-text-light dark:text-text-dark mt-1">{formatCurrency(reimbursement.amount)}</p>
                        </div>
                        <p className={`text-sm font-medium px-3 py-1 rounded-full ${statusStyles[reimbursement.status]}`}>
                            {reimbursement.status}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-subtext-light dark:text-subtext-dark">Expense Type</span>
                            <span className="font-semibold text-text-light dark:text-text-dark">{reimbursement.type}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-subtext-light dark:text-subtext-dark">Date of Expense</span>
                            <span className="font-semibold text-text-light dark:text-text-dark">{reimbursement.expenseDate}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-subtext-light dark:text-subtext-dark">Submission Date</span>
                            <span className="font-semibold text-text-light dark:text-text-dark">{new Date(reimbursement.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <p className="text-subtext-light dark:text-subtext-dark mb-1">Description</p>
                            <p className="text-text-light dark:text-text-dark">{reimbursement.description}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6">
                     <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">Receipt</h3>
                     <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {/* Replace with actual image rendering logic */}
                         <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">image</span>
                     </div>
                </div>
            </main>
        </div>
    );
};

export default ReimbursementDetail;
