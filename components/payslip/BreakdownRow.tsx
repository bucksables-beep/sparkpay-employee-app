import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";

interface BreakdownRowProps {
  description: string;
  amount: number;
}

export const BreakdownRow: React.FC<BreakdownRowProps> = ({
  description,
  amount,
}) => (
  <div className="flex justify-between items-center py-3">
    <p className="text-text-light dark:text-text-dark">{description}</p>
    <p className="font-medium text-text-light dark:text-text-dark">
      {formatCurrency(amount)}
    </p>
  </div>
);
