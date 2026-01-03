import React from "react";
import { BankSelect } from "../components/BankSelect";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AccountItem } from "../components/accounts/AccountItem";
import { useAccounts } from "../hooks/useAccounts";

const Accounts: React.FC = () => {
  const {
    form,
    accounts,
    isResolvingAccount,
    isFormValid,
    handleSetDefault,
    handleBack,
    handleBankChange,
    getAccountNumberHelperText,
  } = useAccounts();

  return (
    <>
      <header className="bg-surface-light dark:bg-surface-dark sticky top-0 z-10 flex items-center p-4">
        <button
          className="text-text-light dark:text-text-dark p-2 rounded-full interactive-scale"
          onClick={handleBack}
          aria-label="Go back"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold pr-8">
          Bank Accounts
        </h1>
      </header>
      <main className="p-4 space-y-8">
        <section className="bg-surface-light dark:bg-surface-dark p-4 rounded-lg space-y-4">
          <h2 className="text-lg font-bold">Add New Account</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit}>
            <BankSelect
              id="bank-name"
              name="bankId"
              label="Bank Name"
              value={form.values.bankId}
              onChange={handleBankChange}
              error={form.errors.bankId}
              touched={form.touched.bankId}
            />
            <Input
              id="account-number"
              name="accountNumber"
              label="Account Number"
              type="text"
              placeholder="Enter Account Number"
              value={form.values.accountNumber}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.accountNumber}
              touched={form.touched.accountNumber}
              helperText={getAccountNumberHelperText()}
            />
            <Input
              id="account-name"
              name="accountName"
              label="Account Name"
              type="text"
              placeholder="Autofilled when number is entered"
              value={form.values.accountName}
              readonly
              error={form.errors.accountName}
              touched={form.touched.accountName}
            />
            <Button
              type="submit"
              isLoading={form.isSubmitting}
              disabled={!isFormValid || isResolvingAccount}
              className="w-full h-12 text-base"
            >
              Add Account
            </Button>
          </form>
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-bold">My Accounts</h2>
          <div className="space-y-3">
            {accounts.map((acc) => (
              <AccountItem
                key={acc.id}
                account={acc}
                onToggle={handleSetDefault}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default Accounts;
