import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type BadgeType = 'TAX FREE' | 'TAX SAVER' | 'VIP TAX FREE' | 'TAX CHAMP';

interface BadgeInfo {
    icon: string;
    title: BadgeType;
    colorClasses: string;
    progressText: string;
}

const badgeConfig: Record<BadgeType, BadgeInfo> = {
    'TAX FREE': {
        icon: 'shield',
        title: 'TAX FREE',
        colorClasses: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
        progressText: '6 months streak for VIP badge',
    },
    'TAX SAVER': {
        icon: 'star',
        title: 'TAX SAVER',
        colorClasses: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
        progressText: '6 months streak for VIP badge',
    },
    'VIP TAX FREE': {
        icon: 'workspace_premium',
        title: 'VIP TAX FREE',
        colorClasses: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
        progressText: '12 months streak for CHAMP badge',
    },
    'TAX CHAMP': {
        icon: 'trophy',
        title: 'TAX CHAMP',
        colorClasses: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
        progressText: 'You are a Tax Champion!',
    },
};

const monthlyFlow = [
    { month: 'Jan', message: "You’re officially TAX FREE this year!", action: { label: 'Share Badge', type: 'share' } },
    { month: 'Feb', message: "Still zero tax. Keep it up!", action: { label: 'View Savings', type: 'view' } },
    { month: 'Mar', message: "+₦40K saved with rent relief!", action: { label: 'Upgrade Pro', type: 'upgrade' } },
    { month: 'Apr', message: "Raise detected! Still tax-free.", action: { label: 'Recalculate', type: 'recalculate' } },
    { month: 'May', message: "5 months tax-free! Unlock VIP badge", action: { label: 'Claim VIP', type: 'claim' } },
    { month: 'Jun', message: "You’re a Tax Hero. Share your streak!", action: { label: 'Share', type: 'share' } },
    { month: 'Jul', message: "Halfway: ₦0 tax paid. Proud?", action: { label: 'Export Report', type: 'export' } },
    { month: 'Aug', message: "Invite 3 friends → ₦500 advance free", action: { label: 'Invite', type: 'invite' } },
    { month: 'Sep', message: "File in 3 months. Auto-file with Pro?", action: { label: 'Go Pro', type: 'upgrade' } },
    { month: 'Oct', message: "Docs ready. One tap to file.", action: { label: 'File Now', type: 'file' } },
    { month: 'Nov', message: "You saved ₦0 tax in 2026. Legend!", action: { label: 'Share Year', type: 'share' } },
    { month: 'Dec', message: "You paid ₦0 all year. Claim your crown!", action: { label: 'Download Certificate', type: 'download' } },
];

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

const MonthItem: React.FC<{
    month: string;
    message: string;
    action: { label: string; type: string };
    isComplete: boolean;
    isCurrent: boolean;
}> = ({ month, message, action, isComplete, isCurrent }) => {
    
    const handleAction = () => {
        alert(`Action: ${action.label}`);
    }

    const stateClasses = isCurrent
        ? 'border-primary dark:border-accent-blue bg-primary/5 dark:bg-accent-blue/10'
        : isComplete
        ? 'border-green-500/30 bg-green-500/5'
        : 'border-border-light dark:border-border-dark opacity-60';

    return (
        <div className={`p-4 rounded-xl border-2 ${stateClasses} flex items-center gap-4`}>
            {isComplete && !isCurrent ? (
                 <div className="flex items-center justify-center size-10 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300">
                    <span className="material-symbols-outlined">check</span>
                </div>
            ) : (
                <div className={`flex items-center justify-center size-10 rounded-full font-bold ${isCurrent ? 'bg-primary text-white' : 'bg-surface-light dark:bg-surface-dark'}`}>
                    {month}
                </div>
            )}
            <div className="flex-1">
                <p className="font-semibold text-text-light dark:text-text-dark">{message}</p>
                 {isCurrent && (
                     <button onClick={handleAction} className="text-sm font-bold text-primary dark:text-accent-blue mt-1 interactive-scale">
                        {action.label}
                    </button>
                 )}
            </div>
        </div>
    );
};


const TaxBadges: React.FC = () => {
    const navigate = useNavigate();
    // Simulate current state: June, 6 months streak
    const [currentMonthIndex, setCurrentMonthIndex] = useState(5);
    const streak = currentMonthIndex + 1;

    const currentBadge = useMemo((): BadgeType => {
        if (streak === 12) return 'TAX CHAMP';
        if (streak >= 6) return 'VIP TAX FREE';
        return 'TAX FREE';
    }, [streak]);

    const badge = badgeConfig[currentBadge];
    
    const progressPercentage = useMemo(() => {
        if (currentBadge === 'TAX FREE') return (streak / 6) * 100;
        if (currentBadge === 'VIP TAX FREE') return (streak / 12) * 100;
        return 100;
    }, [currentBadge, streak]);
    
    const handleShare = () => {
         alert(`Sharing my ${badge.title} badge! I'm on a ${streak}-month streak!`);
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header title="Your Tax Badge" onBack={() => navigate(-1)} />
            <main className="p-4 space-y-6">
                <section className={`${badge.colorClasses} p-6 rounded-2xl text-center shadow-lg`}>
                    <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {badge.icon}
                    </span>
                    <h2 className="text-3xl font-bold mt-2">{badge.title}</h2>
                    <p className="font-medium opacity-80">2026 Edition</p>
                    <button onClick={handleShare} className="mt-4 h-10 px-6 bg-white/30 dark:bg-black/20 font-bold rounded-full text-sm interactive-scale">
                        Share Your Flex
                    </button>
                </section>

                <section className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-text-light dark:text-text-dark">Next Up: {badge.progressText}</p>
                        <p className="text-sm font-bold text-primary dark:text-accent-blue">{streak} / {currentBadge.includes('VIP') ? 12 : 6}</p>
                    </div>
                    <div className="w-full bg-background-light dark:bg-background-dark rounded-full h-2.5">
                        <div className="bg-primary dark:bg-accent-blue h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-3">Your 2026 Journey</h3>
                    <div className="space-y-3">
                        {monthlyFlow.map((item, index) => (
                            <MonthItem 
                                key={item.month}
                                {...item}
                                isComplete={index <= currentMonthIndex}
                                isCurrent={index === currentMonthIndex}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default TaxBadges;