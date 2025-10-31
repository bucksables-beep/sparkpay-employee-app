import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (amount: number, options: Intl.NumberFormatOptions = {}) => {
    return `₦${amount.toLocaleString('en-NG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        ...options,
    })}`;
};

const Header: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
    <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
                <button onClick={onBack} className="p-2 text-text-light dark:text-text-dark interactive-scale" aria-label="Go back">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-lg font-bold text-text-light dark:text-text-dark">{title}</h1>
                <div className="w-8"></div>
            </div>
        </div>
    </header>
);

const PAYECalculator: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [monthlySalary, setMonthlySalary] = useState('300000');
    const [annualRent, setAnnualRent] = useState('240000');
    const [freelanceIncome, setFreelanceIncome] = useState('');
    const [showFreelance, setShowFreelance] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isUpgradeSuccess, setIsUpgradeSuccess] = useState(false);


    const grossAnnual = useMemo(() => {
        const salary = (Number(monthlySalary) || 0) * 12;
        const freelance = Number(freelanceIncome) || 0;
        return salary + freelance;
    }, [monthlySalary, freelanceIncome]);

    const rentRelief = useMemo(() => Number(annualRent) || 0, [annualRent]);

    const oldTax = useMemo(() => grossAnnual * 0.135, [grossAnnual]);
    const newTax = useMemo(() => {
        if (grossAnnual < 800000) return 0;
        const taxable = grossAnnual - rentRelief;
        return taxable > 0 ? taxable * 0.125 : 0;
    }, [grossAnnual, rentRelief]);
    
    const savings = useMemo(() => (oldTax - newTax), [oldTax, newTax]);

    const handleShowResult = () => {
        if (grossAnnual > 0) {
            setStep(2);
        }
    };
    
    const handleShare = () => {
        const message = `Sparkpay says I’m saving ${formatCurrency(savings)} in 2026 tax!`;
        alert(message);
    }
    
    const handleUpgrade = () => {
        setIsUpgradeModalOpen(true);
    };

    const confirmUpgrade = () => {
        setIsUpgradeModalOpen(false);
        setIsUpgradeSuccess(true);
        setTimeout(() => {
            setIsUpgradeSuccess(false);
        }, 4000);
    };

    if (step === 2) {
        return (
            <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
                <Header title="2026 Salary Result" onBack={() => setStep(1)} />
                <main className="flex-grow p-6 flex flex-col items-center text-center">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">🎉 Great News, Daniel!</h2>
                        
                        {grossAnnual < 800000 ? (
                            <div className="mt-8">
                                <div className="bg-green-100 dark:bg-green-900/40 p-6 rounded-xl">
                                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">You’re TAX FREE in 2026!</h3>
                                    <p className="mt-2 text-green-700 dark:text-green-300">Under the new law, your income is below the tax threshold.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mt-8 space-y-4 bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm">
                                    <div>
                                        <p className="text-subtext-light dark:text-subtext-dark">Old Tax (2025):</p>
                                        <p className="text-2xl font-semibold line-through">{formatCurrency(oldTax)}</p>
                                    </div>
                                    <div>
                                        <p className="text-subtext-light dark:text-subtext-dark">New Tax (2026):</p>
                                        <p className="text-3xl font-bold text-primary dark:text-accent-blue">{formatCurrency(newTax)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 bg-green-100 dark:bg-green-900/40 p-6 rounded-xl">
                                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">You save {formatCurrency(savings)}/year</h3>
                                    <p className="mt-1 text-green-700 dark:text-green-300">(That's an extra {formatCurrency(savings / 12)}/month)</p>
                                </div>
                            </>
                        )}
                        
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                             <button onClick={handleShare} className="flex-1 h-12 px-5 bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue text-base font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/30 dark:hover:bg-accent-blue/40 transition interactive-scale">
                                Share Result
                            </button>
                             <button onClick={handleUpgrade} className="flex-1 h-12 px-5 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-opacity-90 transition interactive-scale">
                                Upgrade to File
                            </button>
                        </div>
                        <p className="text-xs text-subtext-light dark:text-subtext-dark mt-4">ⓘ Want to auto-file with NRS? Pro: ₦500/month</p>
                    </div>
                </main>
                
                {isUpgradeModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsUpgradeModalOpen(false)}>
                        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center transform transition-all" onClick={e => e.stopPropagation()}>
                            <span className="material-symbols-outlined text-4xl text-primary dark:text-accent-blue mb-3">workspace_premium</span>
                            <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Upgrade to Sparkpay Pro</h3>
                            <p className="text-subtext-light dark:text-subtext-dark mt-2 mb-6">Automate your tax filing and unlock powerful features.</p>
                            
                            <ul className="space-y-3 text-left mb-8">
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                    <span className="text-text-light dark:text-text-dark">Auto-file with NRS</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                    <span className="text-text-light dark:text-text-dark">Download PDF tax reports</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                    <span className="text-text-light dark:text-text-dark">Advanced salary forecasting</span>
                                </li>
                            </ul>

                            <button onClick={confirmUpgrade} className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 interactive-scale">
                                Upgrade Now for {formatCurrency(500)}/month
                            </button>
                            <button onClick={() => setIsUpgradeModalOpen(false)} className="w-full h-14 mt-3 text-subtext-light dark:text-subtext-dark font-bold rounded-lg hover:bg-primary/10 transition-colors duration-300 interactive-scale">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                )}
                
                {isUpgradeSuccess && (
                    <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-success-light text-white font-bold py-3 px-6 rounded-full shadow-lg z-50 flex items-center gap-2">
                        <span className="material-symbols-outlined">check_circle</span>
                        <span>Upgraded to Pro successfully!</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header title="Salary Preview" onBack={() => navigate(-1)} />
            <main className="flex-grow p-6 flex flex-col">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="monthly-salary" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">💰 Your Monthly Salary</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark font-medium">₦</span>
                            <input
                                id="monthly-salary"
                                type="text"
                                inputMode="numeric"
                                value={Number(monthlySalary).toLocaleString('en-NG')}
                                onChange={(e) => setMonthlySalary(e.target.value.replace(/[^0-9]/g, ''))}
                                className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 pl-8 pr-4 text-lg font-medium"
                            />
                        </div>
                         <p className="mt-1 text-xs text-subtext-light dark:text-subtext-dark">Auto-detected from payslips</p>
                    </div>
                     <div>
                        <label htmlFor="annual-rent" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">🏠 Rent Relief (optional)</label>
                         <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark font-medium">₦</span>
                            <input
                                id="annual-rent"
                                type="text"
                                inputMode="numeric"
                                value={Number(annualRent).toLocaleString('en-NG')}
                                onChange={(e) => setAnnualRent(e.target.value.replace(/[^0-9]/g, ''))}
                                className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 pl-8 pr-4 text-lg font-medium"
                            />
                        </div>
                        <p className="mt-1 text-xs text-subtext-light dark:text-subtext-dark">Enter your total annual rent.</p>
                    </div>
                    
                    {showFreelance && (
                        <div>
                            <label htmlFor="freelance-income" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">💸 Annual Freelance Income (optional)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark font-medium">₦</span>
                                <input
                                    id="freelance-income"
                                    type="text"
                                    inputMode="numeric"
                                    value={Number(freelanceIncome).toLocaleString('en-NG')}
                                    onChange={(e) => setFreelanceIncome(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 pl-8 pr-4 text-lg font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {!showFreelance && (
                        <button onClick={() => setShowFreelance(true)} className="w-full text-sm font-semibold text-primary dark:text-accent-blue text-left interactive-scale py-2">
                            + Add freelance income
                        </button>
                    )}
                </div>
                <div className="mt-auto pt-6">
                    <button
                        onClick={handleShowResult}
                        disabled={!monthlySalary || Number(monthlySalary) <= 0}
                        className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 disabled:bg-primary/40 disabled:cursor-not-allowed interactive-scale"
                    >
                        Show My 2026 Pay
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PAYECalculator;