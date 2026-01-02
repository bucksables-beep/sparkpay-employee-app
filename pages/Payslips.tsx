import React from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { Pagination } from "../components/Pagination";
import { usePayslips } from "../hooks/usePayslips";

const TableSkeleton: React.FC = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-5 bg-background-light dark:bg-background-dark rounded w-24"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-background-light dark:bg-background-dark rounded w-32"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-background-light dark:bg-background-dark rounded w-40"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-6 bg-background-light dark:bg-background-dark rounded-full w-16"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-background-light dark:bg-background-dark rounded w-24"></div>
        </td>
      </tr>
    ))}
  </>
);

const Payslips: React.FC = () => {
  const { payslips, paginationMeta, handlePageChange, isLoading } =
    usePayslips();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
          Payslips
        </h1>
        <p className="text-subtext-light dark:text-subtext-dark mt-1">
          Review your payslip history.
        </p>
      </header>

      {isLoading && payslips.length === 0 ? (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                    View Payslip
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                <TableSkeleton />
              </tbody>
            </table>
          </div>
        </div>
      ) : paginationMeta.total > 0 ? (
        <>
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                      Organization
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-subtext-light dark:text-subtext-dark">
                      View Payslip
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {payslips.map((payslip) => (
                    <tr
                      key={payslip.id}
                      className="hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-lg font-semibold text-text-light dark:text-text-dark">
                          {payslip.amount}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-base text-text-light dark:text-text-dark">
                          {payslip.monthYear}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-base text-subtext-light dark:text-subtext-dark">
                          {payslip.organization || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center text-sm font-semibold px-2.5 py-0.5 rounded-full bg-success-light/10 text-success-light dark:bg-success-dark/20 dark:text-success-dark">
                          {payslip.status || "Paid"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/app/payslip/${payslip.id}`}
                          className="inline-flex items-center text-sm font-semibold text-primary dark:text-accent-blue hover:underline group"
                        >
                          View Payslip
                          <span className="material-symbols-outlined ml-2 transform-gpu transition-transform group-hover:translate-x-1">
                            arrow_forward
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            meta={paginationMeta}
            onPageChange={handlePageChange}
            itemName="payslips"
          />
        </>
      ) : (
        <EmptyState
          icon="receipt_long"
          title="No Payslips Available"
          message="Your payslips will appear here as soon as they are ready."
        />
      )}
    </div>
  );
};

export default Payslips;
