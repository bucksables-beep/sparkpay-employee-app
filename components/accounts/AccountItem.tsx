import React from "react";
import type { Account } from "@/types";

interface AccountItemProps {
  account: Account;
  onToggle: (id: string) => void;
}

export const AccountItem: React.FC<AccountItemProps> = ({
  account,
  onToggle,
}) => (
  <div
    className={`bg-surface-light dark:bg-surface-dark p-3 rounded-lg flex items-center justify-between ${
      !account.isDefault ? "opacity-60" : ""
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center rounded-lg shrink-0 size-12">
        <span className="material-symbols-outlined" aria-hidden="true">
          account_balance
        </span>
      </div>
      <div>
        <p className="font-semibold text-text-light dark:text-text-dark">
          {account.bankName}
        </p>
        <p className="text-sm text-subtext-light dark:text-subtext-dark">
          {account.accountNumber}
        </p>
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
