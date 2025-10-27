import React from "react";

interface EarningsChartProps {
  data: { month: string; earnings: number }[];
  currency: string;
}

const formatCurrency = (amount: number | undefined, currency: string) =>
  `${currency} ${(amount || 0).toLocaleString("en-NG")}`;

export const EarningsChart: React.FC<EarningsChartProps> = ({
  data,
  currency,
}) => {
  const maxEarning = Math.max(...data.map((d) => d.earnings), 1); // Avoid division by zero

  return (
    <div className="mt-6 grid grid-cols-6 gap-x-4 items-end justify-items-center h-40">
      {data.map(({ month, earnings }) => (
        <div
          key={month}
          className="flex flex-col items-center w-full h-full justify-end group"
        >
          <div className="relative w-full h-full flex items-end">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-dark dark:bg-surface-light text-text-dark dark:text-text-light text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {formatCurrency(earnings, currency)}
            </div>
            <div
              className="w-full bg-primary/20 dark:bg-accent-blue/30 rounded-t-md hover:bg-primary dark:hover:bg-accent-blue transition-colors"
              style={{ height: `${(earnings / maxEarning) * 100}%` }}
              aria-label={`Earnings for ${month}: ${formatCurrency(
                earnings,
                currency
              )}`}
            ></div>
          </div>
          <p className="text-xs font-medium text-subtext-light dark:text-subtext-dark mt-2 text-center">
            {month}
          </p>
        </div>
      ))}
    </div>
  );
};
