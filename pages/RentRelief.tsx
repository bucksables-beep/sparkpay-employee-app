import React, { useState, useRef } from 'react';
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

const RentRelief: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [upgraded, setUpgraded] = useState(false);

    const [formData, setFormData] = useState({
        annualRent: '1200000',
        landlordName: 'Mr. John Doe',
        paymentDate: '2025-11-15',
    });

    const annualRentNumber = Number(formData.annualRent) || 0;
    const deduction = Math.min(500000, 0.2 * annualRentNumber);
    const taxSavings = deduction * 0.20; // 20% assumed tax rate on deduction

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileName(event.target.files[0].name);
            setIsLoading(true);
            // Simulate OCR processing
            setTimeout(() => {
                setIsLoading(false);
                setStep(2);
            }, 1500);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = name === 'annualRent' ? value.replace(/[^0-9]/g, '') : value;
        setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <Header title="Claim Rent Relief" onBack={() => navigate(-1)} />
                        <main className="flex-grow p-6 flex flex-col items-center text-center">
                             <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Upload your Tenancy Document</h2>
                             <p className="text-subtext-light dark:text-subtext-dark mt-2 max-w-sm">Snap a photo or upload your rent receipt or tenancy agreement.</p>

                            <div className="w-full max-w-sm my-auto">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="sr-only"
                                    accept="image/*,application/pdf"
                                />
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center h-48">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-accent-blue"></div>
                                        <p className="mt-4 font-semibold text-primary dark:text-accent-blue">Scanning document...</p>
                                    </div>
                                ) : (
                                    <button onClick={triggerFileSelect} className="w-full flex flex-col items-center justify-center h-48 border-2 border-dashed border-border-light dark:border-border-dark rounded-xl hover:bg-primary/5 dark:hover:bg-accent-blue/10 transition-colors interactive-scale">
                                        <span className="material-symbols-outlined text-5xl text-subtext-light dark:text-subtext-dark">cloud_upload</span>
                                        <p className="mt-2 font-semibold">Tap to upload a file</p>
                                        <p className="text-xs text-subtext-light dark:text-subtext-dark">PNG, JPG, or PDF</p>
                                    </button>
                                )}
                                
                                <div className="relative flex py-5 items-center">
                                    <div className="flex-grow border-t border-border-light dark:border-border-dark"></div>
                                    <span className="flex-shrink mx-4 text-subtext-light dark:text-subtext-dark text-sm font-medium">OR</span>
                                    <div className="flex-grow border-t border-border-light dark:border-border-dark"></div>
                                </div>

                                <button onClick={triggerFileSelect} className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg flex items-center justify-center gap-2 interactive-scale">
                                    <span className="material-symbols-outlined">photo_camera</span>
                                    Use Camera
                                </button>
                            </div>
                        </main>
                    </>
                );
            case 2:
                return (
                     <>
                        <Header title="Confirm Details" onBack={() => { setStep(1); setFileName(null); }} />
                        <main className="flex-grow p-6 flex flex-col">
                             <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Review Extracted Info</h2>
                             <p className="text-subtext-light dark:text-subtext-dark mt-1 mb-6">We've auto-filled the details from your document. Please review and edit if needed.</p>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="annualRent" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Annual Rent Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark font-medium">₦</span>
                                        <input id="annualRent" name="annualRent" type="text" inputMode="numeric" value={Number(formData.annualRent).toLocaleString('en-NG')} onChange={handleInputChange} className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 pl-8 pr-4 text-lg font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="landlordName" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Landlord's Name</label>
                                    <input id="landlordName" name="landlordName" type="text" value={formData.landlordName} onChange={handleInputChange} className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 px-4" />
                                </div>
                                <div>
                                    <label htmlFor="paymentDate" className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2">Payment Date</label>
                                    <input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleInputChange} className="form-input w-full rounded-lg bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark h-14 px-4" />
                                </div>
                            </div>
                             <div className="mt-6 bg-primary/10 dark:bg-accent-blue/20 p-4 rounded-xl text-center">
                                <p className="text-sm text-primary dark:text-accent-blue">Tax Deduction Calculated</p>
                                <p className="text-2xl font-bold text-primary dark:text-accent-blue mt-1">{formatCurrency(deduction)}</p>
                            </div>
                            <button onClick={() => setStep(3)} className="w-full h-14 mt-auto bg-primary text-white font-bold rounded-lg text-lg interactive-scale">Confirm & Save</button>
                        </main>
                    </>
                );
            case 3:
                return (
                     <>
                        <Header title="Lock In Your Savings" onBack={() => setStep(2)} />
                        <main className="flex-grow p-6 flex flex-col items-center text-center">
                            <span className="material-symbols-outlined text-5xl text-primary dark:text-accent-blue mb-4">workspace_premium</span>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">You're about to save big!</h2>
                            <p className="text-subtext-light dark:text-subtext-dark mt-2 max-w-sm">
                                To guarantee your <span className="font-bold text-text-light dark:text-text-dark">{formatCurrency(taxSavings)}</span> savings, you need to file with NRS. Let Sparkpay Pro handle it for you.
                            </p>

                            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl w-full max-w-sm shadow-lg my-auto">
                                <h3 className="font-bold text-lg text-primary dark:text-accent-blue">Sparkpay Pro</h3>
                                 <ul className="space-y-3 text-left my-4">
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                        <span className="text-text-light dark:text-text-dark text-sm">Auto-file with NRS to lock in savings</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                        <span className="text-text-light dark:text-text-dark text-sm">Get audit-proof PDF reports</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-success-light dark:text-success-dark">check_circle</span>
                                        <span className="text-text-light dark:text-text-dark text-sm">Automated landlord verification</span>
                                    </li>
                                </ul>
                                <p className="text-xs text-subtext-light dark:text-subtext-dark">Only ₦300/month. Cancel anytime.</p>
                            </div>

                            <div className="w-full max-w-sm">
                                <button onClick={() => { setUpgraded(true); setStep(4); }} className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg interactive-scale">
                                    Upgrade & Save {formatCurrency(taxSavings)}
                                </button>
                                <button onClick={() => { setUpgraded(false); setStep(4); }} className="w-full h-14 mt-3 text-subtext-light dark:text-subtext-dark font-bold rounded-lg hover:bg-primary/10 transition-colors duration-300 interactive-scale">
                                    Skip for Now
                                </button>
                            </div>
                        </main>
                    </>
                );
            case 4:
                if (upgraded) {
                    return (
                        <>
                            <Header title="Success" onBack={() => navigate('/app/ai-assistant')} />
                            <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 rounded-full bg-success-light/10 dark:bg-success-dark/20 flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-5xl text-success-light dark:text-success-dark">verified</span>
                                </div>
                                <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Upgrade Complete!</h2>
                                
                                <div className="my-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl w-full max-w-xs shadow-lg">
                                     <p className="text-sm text-subtext-light dark:text-subtext-dark">You'll save an estimated</p>
                                     <p className="text-4xl font-bold text-success-light dark:text-success-dark my-2">{formatCurrency(taxSavings)}</p>
                                     <p className="font-semibold">in 2026 tax!</p>
                                     <div className="mt-4 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 font-bold py-1 px-3 rounded-full inline-flex items-center gap-1">
                                        <span className="material-symbols-outlined text-base">real_estate_agent</span>
                                        <span>RENT RELIEF 2026</span>
                                     </div>
                                </div>
                                
                                <p className="text-subtext-light dark:text-subtext-dark max-w-sm">
                                    As a Pro member, we'll auto-file this for you to ensure you get your savings.
                                </p>

                                <div className="mt-8 flex w-full max-w-sm gap-4">
                                    <button onClick={() => alert("Sharing...")} className="flex-1 h-12 px-5 bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue font-bold rounded-lg flex items-center justify-center gap-2 interactive-scale">
                                        Share
                                    </button>
                                    <button
                                        onClick={() => navigate('/app/ai-assistant')}
                                        className="flex-1 h-12 bg-primary text-white font-bold rounded-lg interactive-scale"
                                    >
                                        Done
                                    </button>
                                </div>
                            </main>
                        </>
                    );
                }
                // Skipped upgrade
                return (
                     <>
                        <Header title="Deduction Saved" onBack={() => navigate('/app/ai-assistant')} />
                        <main className="flex-grow p-6 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-5xl text-blue-600 dark:text-blue-300">task_alt</span>
                            </div>
                            <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Your Deduction is Calculated!</h2>
                            
                             <div className="my-6 bg-surface-light dark:bg-surface-dark p-6 rounded-2xl w-full max-w-xs shadow-lg">
                                 <p className="text-sm text-subtext-light dark:text-subtext-dark">Potential tax saving:</p>
                                 <p className="text-4xl font-bold text-primary dark:text-accent-blue my-2">{formatCurrency(taxSavings)}</p>
                                 <p className="font-semibold">in 2026 tax</p>
                            </div>
                            
                            <p className="text-subtext-light dark:text-subtext-dark max-w-sm">
                                To lock in your savings, upgrade to Pro and we'll file this for you automatically.
                            </p>

                            <div className="mt-8 flex w-full max-w-sm gap-4">
                                <button onClick={() => navigate('/app/ai-assistant')} className="flex-1 h-12 px-5 bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue font-bold rounded-lg flex items-center justify-center gap-2 interactive-scale">
                                    Done
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 h-12 bg-primary text-white font-bold rounded-lg interactive-scale"
                                >
                                    Upgrade Now
                                </button>
                            </div>
                        </main>
                    </>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            {renderStepContent()}
        </div>
    );
};

export default RentRelief;