import React from "react";
import { useNavigate } from "react-router-dom";
import { usePayslipDetail } from "../hooks/usePayslipDetail";
import { InfoRow } from "../components/payslip/InfoRow";
import { BreakdownRow } from "../components/payslip/BreakdownRow";
import { PrintablePayslip } from "../components/payslip/PrintablePayslip";
import { formatCurrency } from "../utils/formatCurrency";
import { Button } from "../components/Button";

const PayslipDetail: React.FC = () => {
  const navigate = useNavigate();
  const { payslip, isLoading, printableRef, handleDownload, handleShare } =
    usePayslipDetail();

  if (isLoading) {
    return (
      <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-text-light dark:text-text-dark interactive-scale"
                aria-label="Go back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-text-light dark:text-text-dark">
                Payslip Details
              </h1>
              <div className="w-8"></div>
            </div>
          </div>
        </header>
        <div className="flex flex-grow items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!payslip) {
    return (
      <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
        <header className="sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-text-light dark:text-text-dark interactive-scale"
                aria-label="Go back"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-lg font-bold text-text-light dark:text-text-dark">
                Payslip Not Found
              </h1>
              <div className="w-8"></div>
            </div>
          </div>
        </header>
        <div className="flex flex-grow flex-col items-center justify-center p-4">
          <p className="text-text-light dark:text-text-dark mb-4">
            The requested payslip could not be found.
          </p>
          <Button onClick={() => navigate("/app/payslips")} variant="primary">
            Go to Payslips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-text-light dark:text-text-dark interactive-scale"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-text-light dark:text-text-dark">
              Payslip Details
            </h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 space-y-6 pb-24">
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-4">
          <div className="text-center pb-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-2xl font-bold text-primary dark:text-accent-blue">
              {payslip.organization}
            </h2>
            <p className="text-sm text-subtext-light dark:text-subtext-dark">
              Pay statement for {payslip.monthYear}
            </p>
          </div>
          <div className="space-y-2">
            <InfoRow label="Employee Name" value={payslip.employeeName} />
            <InfoRow label="Employee ID" value={payslip.employeeId} />
            <InfoRow label="Department" value={payslip.department} />
            <InfoRow label="Pay Period" value={payslip.payPeriod} />
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark pb-2 border-b border-border-light dark:border-border-dark">
            Earnings
          </h3>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {payslip.earnings.map((item) => (
              <BreakdownRow key={item.description} {...item} />
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 mt-2 font-bold text-text-light dark:text-text-dark">
            <p>Gross Earnings</p>
            <p>{formatCurrency(payslip.grossEarnings)}</p>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-text-light dark:text-text-dark pb-2 border-b border-border-light dark:border-border-dark">
            Deductions
          </h3>
          <div className="divide-y divide-border-light dark:divide-border-dark">
            {payslip.deductions.map((item) => (
              <BreakdownRow key={item.description} {...item} />
            ))}
          </div>
          <div className="flex justify-between items-center pt-3 mt-2 font-bold text-text-light dark:text-text-dark">
            <p>Total Deductions</p>
            <p>{formatCurrency(payslip.totalDeductions)}</p>
          </div>
        </section>

        <section className="bg-primary text-white rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Net Salary</p>
            <p className="text-2xl font-bold">
              {formatCurrency(payslip.netSalary)}
            </p>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-t border-border-light dark:border-border-dark">
        <div className="flex gap-4">
          <Button
            onClick={handleDownload}
            className="flex-1 h-12 text-base bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue hover:bg-primary/30 dark:hover:bg-accent-blue/40"
          >
            <span className="material-symbols-outlined">download</span>
            Download
          </Button>
          <Button
            onClick={handleShare}
            variant="primary"
            className="flex-1 h-12 text-base shadow-lg shadow-primary/30"
          >
            <span className="material-symbols-outlined">share</span>
            Share
          </Button>
        </div>
      </footer>
      <div className="absolute left-[-9999px] top-0" aria-hidden="true">
        <PrintablePayslip ref={printableRef} payslip={payslip} />
      </div>
    </div>
  );
};

export default PayslipDetail;
