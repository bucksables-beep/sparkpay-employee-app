import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const TaxCompanionFeature: React.FC<{ title: string; description: string; to: string; icon: string; }> = ({ title, description, to, icon }) => (
    <Link to={to} className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl flex items-center gap-4 hover:bg-primary/10 dark:hover:bg-accent-blue/20 transition-colors interactive-scale shadow-sm">
        <div className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent-blue flex items-center justify-center rounded-lg shrink-0 size-12">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
            <h3 className="font-semibold text-text-light dark:text-text-dark">{title}</h3>
            <p className="text-sm text-subtext-light dark:text-subtext-dark">{description}</p>
        </div>
        <span className="material-symbols-outlined text-subtext-light dark:text-subtext-dark ml-auto">chevron_right</span>
    </Link>
);


const TaxCompanion: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-16">
                        <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Tax Companion</h1>
                    </div>
                </div>
            </header>
            <main className="p-4 space-y-4">
                 <div className="bg-primary/10 dark:bg-accent-blue/20 p-4 rounded-xl text-center">
                    <p className="text-primary dark:text-accent-blue font-medium text-sm">Your smart assistant for managing taxes efficiently.</p>
                </div>
                <div className="space-y-3">
                    <TaxCompanionFeature 
                        title="PAYE Calculator" 
                        description="Estimate your Pay-As-You-Earn tax deductions." 
                        to="/app/tax-companion/paye-calculator" 
                        icon="calculate"
                    />
                    <TaxCompanionFeature 
                        title="AI Tax Chat" 
                        description="Get personalized advice from our AI assistant." 
                        to="/app/tax-companion/chatbot" 
                        icon="chat"
                    />
                     <TaxCompanionFeature 
                        title="Rent Relief" 
                        description="Learn about and apply for rent tax relief." 
                        to="/app/tax-companion/rent-relief"
                        icon="real_estate_agent"
                    />
                     <TaxCompanionFeature 
                        title="Tax Badges" 
                        description="View your tax compliance achievements." 
                        to="/app/tax-companion/tax-badges"
                        icon="shield_person"
                    />
                </div>
            </main>
        </div>
    );
};

export default TaxCompanion;