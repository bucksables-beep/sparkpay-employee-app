import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

const SalaryAdvance: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState('');

    const maxAdvance = 75000;
    const processingFeeRate = 0.025; // 2.5%

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const numValue = Number(value);
        if (numValue <= maxAdvance) {
            setAmount(value);
        } else {
            setAmount(String(maxAdvance));
        }
    };
    
    const numericAmount = Number(amount) || 0;
    const processingFee = numericAmount * processingFeeRate;
    const totalRepayment = numericAmount + processingFee;

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <Header title="Salary Advance" onBack={() => navigate('/app/dashboard')} />
                        <main className="flex-grow p-6 flex flex-col">
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-text-light dark:text-text-dark">How much do you need?</h2>
                                <p className="text-subtext-light dark:text-subtext-dark mt-2">Enter an amount up to your available limit.</p>
                            </div>
                            <div className="my-auto flex flex-col items-center">
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl font-bold text-subtext-light dark:text-subtext-dark">₦</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={numericAmount > 0 ? numericAmount.toLocaleString('en-NG') : ''}
                                        onChange={handleAmountChange}
                                        placeholder="0"
                                        className="form-input w-full bg-transparent border-0 text-center text-5xl font-bold p-4 pl-12 text-text-light dark:text-text-dark focus:ring-0"
                                        aria-label="Salary advance amount"
                                    />
                                </div>
                                <p className="text-sm text-subtext-light dark:text-subtext-dark mt-2">Maximum available: {formatCurrency(maxAdvance)}</p>
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={numericAmount <= 0}
                                className="w-full h-14 mt-auto bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 disabled:bg-primary/40 disabled:cursor-not-allowed interactive-scale"
                            >
                                Continue
                            </button>
                        </main>
                    </>
                );
            case 2:
                return (
                    <>
                        <Header title="Confirm Request" onBack={() => setStep(1)} />
                        <main className="flex-grow p-6 flex flex-col">
                            <h2 className="text-xl font-bold text-text-light dark:text-text-dark text-center">Review your request</h2>
                            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-4 my-8">
                                <div className="flex justify-between items-center text-base">
                                    <p className="text-subtext-light dark:text-subtext-dark">Requested Amount</p>
                                    <p className="font-medium text-text-light dark:text-text-dark">{formatCurrency(numericAmount)}</p>
                                </div>
                                <div className="flex justify-between items-center text-base">
                                    <p className="text-subtext-light dark:text-subtext-dark">Processing Fee (2.5%)</p>
                                    <p className="font-medium text-text-light dark:text-text-dark">{formatCurrency(processingFee)}</p>
                                </div>
                                <div className="border-t border-border-light dark:border-border-dark my-3"></div>
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <p className="text-text-light dark:text-text-dark">Total Repayment</p>
                                    <p className="text-primary dark:text-accent-blue">{formatCurrency(totalRepayment)}</p>
                                </div>
                                <div className="flex justify-between items-center text-base pt-2">
                                    <p className="text-subtext-light dark:text-subtext-dark">Repayment Date</p>
                                    <p className="font-medium text-text-light dark:text-text-dark">January 31, 2024</p>
                                </div>
                            </div>
                            <p className="text-xs text-subtext-light dark:text-subtext-dark text-center">
                                By confirming, you agree to repay the total amount from your next salary.
                            </p>
                             <button
                                onClick={() => setStep(3)}
                                className="w-full h-14 mt-auto bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale"
                            >
                                Confirm Request
                            </button>
                        </main>
                    </>
                );
            case 3:
                return (
                     <>
                        <Header title="Success" />
                        <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 rounded-full bg-success-light/10 dark:bg-success-dark/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-5xl text-success-light dark:text-success-dark">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Request Submitted!</h2>
                            <p className="text-subtext-light dark:text-subtext-dark mt-2 max-w-sm">
                                Your request for a salary advance of <span className="font-bold text-text-light dark:text-text-dark">{formatCurrency(numericAmount)}</span> is being processed. It will be disbursed within 24 hours.
                            </p>
                            <button
                                onClick={() => navigate('/app/dashboard')}
                                className="w-full max-w-xs h-14 mt-12 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale"
                            >
                                Done
                            </button>
                        </main>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
            {renderStepContent()}
        </div>
    );
};

export default SalaryAdvance;