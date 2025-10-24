import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Reimbursement } from '../types';
import { addFirestoreData } from '../services/api';
import useStore from '../store';

type ReimbursementFormData = Omit<Reimbursement, 'id' | 'status' | 'date'>;

const formatCurrency = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

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


const NewReimbursement: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useStore();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<ReimbursementFormData>>({
        type: 'Travel',
        amount: 0,
        expenseDate: new Date().toISOString().split('T')[0],
        description: '',
    });
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!isStep1Valid || !isStep2Valid || !user) return;

        setIsSubmitting(true);
        setSubmissionError(null);

        try {
            const newReimbursement: Omit<Reimbursement, 'id'> = {
                ...(formData as ReimbursementFormData),
                amount: Number(formData.amount),
                status: 'Pending',
                date: new Date().toISOString(),
                userId: user.uid,
            };

            const result = await addFirestoreData('reimbursements', newReimbursement);
            if (result) {
                setStep(4);
            } else {
                throw new Error("Submission failed. Please try again.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            setSubmissionError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isStep1Valid = formData.amount && Number(formData.amount) > 0 && formData.expenseDate && formData.description;
    const isStep2Valid = !!receiptFile;

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <Header title="New Reimbursement" onBack={() => navigate('/reimbursements')} />
                        <main className="flex-grow p-4 space-y-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Expense Type</label>
                                <select id="type" name="type" value={formData.type} onChange={handleChange} className="form-select w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 px-4">
                                    <option>Travel</option>
                                    <option>Meals</option>
                                    <option>Supplies</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Amount</label>
                                <input type="number" id="amount" name="amount" value={formData.amount || ''} onChange={handleChange} className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 px-4" placeholder="0.00" />
                            </div>
                            <div>
                                <label htmlFor="expenseDate" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Date of Expense</label>
                                <input type="date" id="expenseDate" name="expenseDate" value={formData.expenseDate} onChange={handleChange} className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 px-4" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Description</label>
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-textarea w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark p-4" rows={3}></textarea>
                            </div>
                        </main>
                        <footer className="p-4">
                            <button onClick={() => setStep(2)} disabled={!isStep1Valid} className="w-full h-14 bg-primary text-white font-bold rounded-lg disabled:bg-primary/40 interactive-scale">Continue</button>
                        </footer>
                    </>
                );
            case 2:
                return (
                    <>
                        <Header title="Upload Receipt" onBack={() => setStep(1)} />
                        <main className="flex-grow p-4 flex flex-col justify-center items-center">
                            <label htmlFor="receipt-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:bg-primary/10 transition-colors interactive-scale">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="material-symbols-outlined text-5xl text-subtext-light dark:text-subtext-dark">cloud_upload</span>
                                    <p className="mb-2 text-sm text-subtext-light dark:text-subtext-dark"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-subtext-light dark:text-subtext-dark">PNG, JPG or PDF (MAX. 5MB)</p>
                                </div>
                                <input id="receipt-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
                            </label>
                            {receiptFile && <p className="mt-4 text-sm font-medium text-text-light dark:text-text-dark">File: {receiptFile.name}</p>}
                        </main>
                        <footer className="p-4">
                            <button onClick={() => setStep(3)} disabled={!isStep2Valid} className="w-full h-14 bg-primary text-white font-bold rounded-lg disabled:bg-primary/40 interactive-scale">Continue</button>
                        </footer>
                    </>
                );
            case 3:
                return (
                    <>
                        <Header title="Review Request" onBack={() => setStep(2)} />
                        <main className="flex-grow p-4">
                            <h2 className="text-xl font-bold text-center mb-4">Confirm Details</h2>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 space-y-3">
                                <div className="flex justify-between"><span className="text-subtext-light dark:text-subtext-dark">Type</span><span className="font-semibold">{formData.type}</span></div>
                                <div className="flex justify-between"><span className="text-subtext-light dark:text-subtext-dark">Amount</span><span className="font-semibold">{formatCurrency(Number(formData.amount))}</span></div>
                                <div className="flex justify-between"><span className="text-subtext-light dark:text-subtext-dark">Expense Date</span><span className="font-semibold">{formData.expenseDate}</span></div>
                                <div className="flex justify-between"><span className="text-subtext-light dark:text-subtext-dark">Description</span><span className="font-semibold text-right max-w-[60%] truncate">{formData.description}</span></div>
                                <div className="flex justify-between"><span className="text-subtext-light dark:text-subtext-dark">Receipt</span><span className="font-semibold text-primary dark:text-accent-blue truncate max-w-[60%]">{receiptFile?.name}</span></div>
                            </div>
                        </main>
                        <footer className="p-4">
                            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-14 bg-primary text-white font-bold rounded-lg interactive-scale disabled:opacity-50">
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                            {submissionError && (
                                <p className="text-red-500 text-sm text-center mt-2">{submissionError}</p>
                            )}
                        </footer>
                    </>
                );
            case 4:
                return (
                    <>
                        <Header title="Success" />
                        <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 rounded-full bg-success-light/10 dark:bg-success-dark/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-5xl text-success-light dark:text-success-dark">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Request Submitted!</h2>
                            <p className="text-subtext-light dark:text-subtext-dark mt-2 max-w-sm">
                               Your reimbursement request for <span className="font-bold text-text-light dark:text-text-dark">{formatCurrency(Number(formData.amount))}</span> has been submitted for review.
                            </p>
                            <button
                                onClick={() => navigate('/reimbursements')}
                                className="w-full max-w-xs h-14 mt-12 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale"
                            >
                                Done
                            </button>
                        </main>
                    </>
                );
            default: return null;
        }
    };


    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
            {renderStepContent()}
        </div>
    );
};

export default NewReimbursement;
