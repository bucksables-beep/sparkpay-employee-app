import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types';

const initialAccounts: Account[] = [
    { id: '1', bankName: 'First Bank of Nigeria', accountNumber: '1234567890', isDefault: true },
    { id: '2', bankName: 'United Bank for Africa', accountNumber: '0987654321', isDefault: false },
];

const AccountItem: React.FC<{ account: Account; onToggle: (id: string) => void }> = ({ account, onToggle }) => (
    <div className={`bg-surface-light dark:bg-surface-dark p-3 rounded-lg flex items-center justify-between ${!account.isDefault ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center rounded-lg shrink-0 size-12">
                <span className="material-symbols-outlined" aria-hidden="true">account_balance</span>
            </div>
            <div>
                <p className="font-semibold text-text-light dark:text-text-dark">{account.bankName}</p>
                <p className="text-sm text-subtext-light dark:text-subtext-dark">{account.accountNumber}</p>
            </div>
        </div>
        <label className="relative inline-flex cursor-pointer items-center">
            <input 
                checked={account.isDefault}
                onChange={() => onToggle(account.id)}
                className="sr-only peer" 
                type="checkbox" 
                value=""
                aria-label={`Set ${account.bankName} as default account`}
            />
            <div className="w-11 h-6 bg-border-light peer-focus:outline-none rounded-full peer dark:bg-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
    </div>
);

const Accounts: React.FC = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState(initialAccounts);

    const handleToggleDefault = (id: string) => {
        setAccounts(accounts.map(acc => ({
            ...acc,
            isDefault: acc.id === id
        })));
    };

    return (
        <>
            <header className="bg-surface-light dark:bg-surface-dark sticky top-0 z-10 flex items-center p-4">
                <button className="text-text-light dark:text-text-dark p-2 rounded-full interactive-scale" onClick={() => navigate(-1)} aria-label="Go back">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="flex-1 text-center text-lg font-bold pr-8">Bank Accounts</h1>
            </header>
            <main className="p-4 space-y-8">
                <section className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg space-y-4">
                    <h2 className="text-lg font-bold">Add New Account</h2>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2" htmlFor="bank-name">Bank Name</label>
                            <div className="relative">
                                <select className="form-select w-full appearance-none rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark focus:ring-primary focus:border-primary h-14 pl-4 pr-10 text-base" id="bank-name">
                                    <option>Select Bank</option>
                                    <option>First Bank of Nigeria</option>
                                    <option>United Bank for Africa</option>
                                    <option>Guaranty Trust Bank</option>
                                </select>
                                <span className="material-symbols-outlined absolute top-1/2 right-4 -translate-y-1/2 text-subtext-light dark:text-subtext-dark pointer-events-none" aria-hidden="true">expand_more</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2" htmlFor="account-number">Account Number</label>
                            <input className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark focus:ring-primary focus:border-primary h-14 p-4 text-base placeholder:text-subtext-light dark:placeholder:text-subtext-dark" id="account-number" placeholder="Enter Account Number" type="text"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2" htmlFor="account-name">Account Name</label>
                            <input className="form-input w-full rounded-lg bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark focus:ring-primary focus:border-primary h-14 p-4 text-base placeholder:text-subtext-light dark:placeholder:text-subtext-dark" id="account-name" placeholder="Autofilled when number is entered" readOnly type="text"/>
                        </div>
                        <button className="w-full bg-primary text-white font-bold rounded-lg h-12 flex items-center justify-center text-base interactive-scale" type="submit">
                            Add Account
                        </button>
                    </form>
                </section>
                <section className="space-y-4">
                    <h2 className="text-lg font-bold">My Accounts</h2>
                    <div className="space-y-3">
                       {accounts.map(acc => <AccountItem key={acc.id} account={acc} onToggle={handleToggleDefault} />)}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Accounts;