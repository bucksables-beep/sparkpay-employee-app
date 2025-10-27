import React from "react";
import type { Payment } from "@/types";

interface PaymentItemProps {
  payment: Payment;
}

export const PaymentItem: React.FC<PaymentItemProps> = ({ payment }) => (
  <div className="py-4">
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent-blue/20 flex items-center justify-center">
          <span
            className="material-symbols-outlined text-primary dark:text-accent-blue"
            aria-hidden="true"
          >
            check_circle
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-text-light dark:text-text-dark truncate">
          {payment.netSalary.toLocaleString()}
        </p>
        <p className="text-sm text-subtext-light dark:text-subtext-dark">
          {payment.createdAt.split("T")[0]}
        </p>
      </div>
      <div className="inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark">
        {payment.payoutStatus}
      </div>
    </div>
  </div>
);
