import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types';

const initialAccounts: Account[] = [
    { id: '1', bankName: 'GTBank', accountNumber: '**** **** **** 1234', isDefault: true },
    { id: '2', bankName: 'Kuda Bank', accountNumber: '**** **** **** 5678', isDefault: false },
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

const AccountItem: React.FC<{
    account: Account;
    onSetDefault: (id: string) => void;
    onRemove: (id: string) => void;
}> = ({ account, onSetDefault, onRemove }) => {
    return (
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 dark:bg-accent-blue/20 text-primary dark:text-accent-blue">
                <span className="material-symbols-outlined">account_balance</span>
            </div>
            <div className="flex-1">
                <p className="font-semibold text-text-light dark:text-text-dark">{account.bankName}</p>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">{account.accountNumber}</p>
                {account.isDefault && (
                     <p className="text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark">Default</p>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                 {!account.isDefault && (
                    <button onClick={() => onSetDefault(account.id)} className="text-xs font-bold text-primary dark:text-accent-blue interactive-scale">
                        Set as Default
                    </button>
                )}
                <button onClick={() => onRemove(account.id)} className="text-xs font-medium text-red-600 dark:text-red-400 interactive-scale">
                    Remove
                </button>
            </div>
        </div>
    );
};

const Accounts: React.FC = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState(initialAccounts);

    const handleSetDefault = (id: string) => {
        setAccounts(prevAccounts => 
            prevAccounts.map(acc => ({
                ...acc,
                isDefault: acc.id === id
            }))
        );
    };

    const handleRemove = (id: string) => {
        if (accounts.find(acc => acc.id === id)?.isDefault) {
            alert("Cannot remove the default account. Please set another account as default first.");
            return;
        }
        setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== id));
    };

    const handleAddNew = () => {
        // In a real app, this would open a form/modal.
        alert("Add new account functionality is not implemented in this demo.");
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
            <Header title="Bank Accounts" onBack={() => navigate(-1)} />
            <main className="flex-1 p-4 space-y-4">
                {accounts.map(account => (
                    <AccountItem 
                        key={account.id} 
                        account={account} 
                        onSetDefault={handleSetDefault} 
                        onRemove={handleRemove} 
                    />
                ))}
            </main>
             <footer className="sticky bottom-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-t border-border-light dark:border-border-dark">
                <button onClick={handleAddNew} className="w-full h-14 bg-primary text-white font-bold rounded-lg text-lg hover:bg-primary/90 transition-colors duration-300 flex items-center justify-center gap-2 interactive-scale">
                    <span className="material-symbols-outlined">add_circle</span>
                    Add New Account
                </button>
            </footer>
        </div>
    );
};

export default Accounts;