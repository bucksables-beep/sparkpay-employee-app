import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PayslipDetail as PayslipDetailType } from '../types';

// Mock data for a single payslip
const payslipData: { [key: string]: PayslipDetailType } = {
  '1': {
    id: '1',
    monthYear: 'January 2024',
    employeeName: 'Aisha Adebayo',
    employeeId: 'SP-00123',
    department: 'Account Management',
    payPeriod: '01/01/2024 - 31/01/2024',
    earnings: [
      { description: 'Basic Salary', amount: 100000 },
      { description: 'Housing Allowance', amount: 30000 },
      { description: 'Transport Allowance', amount: 15000 },
    ],
    deductions: [
      { description: 'PAYE Tax', amount: 18750 },
      { description: 'Pension Contribution', amount: 6250 },
    ],
    grossEarnings: 145000,
    totalDeductions: 25000,
    netSalary: 120000,
  },
};

const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG')}.00`;
}

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <p className="text-subtext-light dark:text-subtext-dark">{label}</p>
        <p className="font-medium text-text-light dark:text-text-dark">{value}</p>
    </div>
);

const BreakdownRow: React.FC<{ description: string; amount: number }> = ({ description, amount }) => (
     <div className="flex justify-between items-center py-3">
        <p className="text-text-light dark:text-text-dark">{description}</p>
        <p className="font-medium text-text-light dark:text-text-dark">{formatCurrency(amount)}</p>
    </div>
);

const PrintablePayslip = React.forwardRef<HTMLDivElement, { payslip: PayslipDetailType }>(({ payslip }, ref) => (
    <div ref={ref} className="bg-white text-[#111318] p-8 font-display" style={{ width: '210mm', minHeight: '297mm' }}>
      <header className="flex justify-between items-center pb-4 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-[#0D39B6]">Sparkpay Inc.</h1>
        <div className="text-right">
          <h2 className="text-2xl font-semibold">Payslip</h2>
          <p className="text-gray-600">{payslip.monthYear}</p>
        </div>
      </header>
  
      <section className="grid grid-cols-2 gap-x-8 gap-y-4 mt-8 text-sm">
        <div><strong className="font-semibold text-gray-700">Employee Name:</strong> {payslip.employeeName}</div>
        <div><strong className="font-semibold text-gray-700">Employee ID:</strong> {payslip.employeeId}</div>
        <div><strong className="font-semibold text-gray-700">Department:</strong> {payslip.department}</div>
        <div><strong className="font-semibold text-gray-700">Pay Period:</strong> {payslip.payPeriod}</div>
      </section>
  
      <section className="grid grid-cols-2 gap-x-12 mt-10 text-sm">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-2">Earnings</h3>
          {payslip.earnings.map(item => (
            <div key={item.description} className="flex justify-between py-1.5">
              <span>{item.description}</span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-gray-300 mt-2 pt-2">
            <span>Gross Earnings</span>
            <span>{formatCurrency(payslip.grossEarnings)}</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-2">Deductions</h3>
          {payslip.deductions.map(item => (
            <div key={item.description} className="flex justify-between py-1.5">
              <span>{item.description}</span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold border-t border-gray-300 mt-2 pt-2">
            <span>Total Deductions</span>
            <span>{formatCurrency(payslip.totalDeductions)}</span>
          </div>
        </div>
      </section>
  
      <section className="mt-10 bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-800">NET SALARY</span>
          <span className="text-3xl font-bold text-[#0D39B6]">{formatCurrency(payslip.netSalary)}</span>
        </div>
      </section>
  
      <footer className="text-center text-xs text-gray-500 mt-16 pt-4 border-t border-gray-300 absolute bottom-8 left-8 right-8">
        <p>This is a computer-generated document and does not require a signature.</p>
        <p>Sparkpay Inc. | 123 Finance Avenue, Lagos, Nigeria</p>
      </footer>
    </div>
  ));

const PayslipDetail: React.FC = () => {
    const { payslipId } = useParams<{ payslipId: string }>();
    const navigate = useNavigate();
    const payslip = payslipId ? (payslipData[payslipId] || payslipData['1']) : payslipData['1']; // Fallback to first payslip for demo
    const printableRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const element = printableRef.current;
        if (!element || typeof (window as any).html2pdf === 'undefined') {
            alert("Could not generate PDF. Please try again later.");
            return;
        }

        const options = {
          margin: 0,
          filename: `Payslip-${payslip.monthYear.replace(/\s+/g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        (window as any).html2pdf().set(options).from(element).save();
    };

    const handleShare = () => {
        alert("Share functionality is not yet implemented.");
    };

    if (!payslip) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                 <header className="fixed top-0 left-0 right-0 z-10 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            <button onClick={() => navigate(-1)} className="p-2 text-text-light dark:text-text-dark interactive-scale" aria-label="Go back">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Payslip Not Found</h1>
                            <div className="w-8"></div> 
                        </div>
                    </div>
                </header>
                <p>The requested payslip could not be found.</p>
                <button onClick={() => navigate('/app/payslips')} className="mt-4 text-primary interactive-scale">Go to Payslips</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
             <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={() => navigate(-1)} className="p-2 text-text-light dark:text-text-dark interactive-scale" aria-label="Go back">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h1 className="text-lg font-bold text-text-light dark:text-text-dark">Payslip Details</h1>
                        <div className="w-8"></div> 
                    </div>
                </div>
            </header>
            
            <main className="flex-grow p-4 space-y-6 pb-24">
                <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm space-y-4">
                    <div className="text-center pb-4 border-b border-border-light dark:border-border-dark">
                         <h2 className="text-2xl font-bold text-primary dark:text-accent-blue">Sparkpay Inc.</h2>
                         <p className="text-sm text-subtext-light dark:text-subtext-dark">Pay statement for {payslip.monthYear}</p>
                    </div>
                    <div className="space-y-2">
                        <InfoRow label="Employee Name" value={payslip.employeeName} />
                        <InfoRow label="Employee ID" value={payslip.employeeId} />
                        <InfoRow label="Department" value={payslip.department} />
                        <InfoRow label="Pay Period" value={payslip.payPeriod} />
                    </div>
                </section>

                <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark pb-2 border-b border-border-light dark:border-border-dark">Earnings</h3>
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                        {payslip.earnings.map(item => <BreakdownRow key={item.description} {...item} />)}
                    </div>
                    <div className="flex justify-between items-center pt-3 mt-2 font-bold text-text-light dark:text-text-dark">
                        <p>Gross Earnings</p>
                        <p>{formatCurrency(payslip.grossEarnings)}</p>
                    </div>
                </section>

                <section className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark pb-2 border-b border-border-light dark:border-border-dark">Deductions</h3>
                    <div className="divide-y divide-border-light dark:divide-border-dark">
                         {payslip.deductions.map(item => <BreakdownRow key={item.description} {...item} />)}
                    </div>
                     <div className="flex justify-between items-center pt-3 mt-2 font-bold text-text-light dark:text-text-dark">
                        <p>Total Deductions</p>
                        <p>{formatCurrency(payslip.totalDeductions)}</p>
                    </div>
                </section>
                
                <section className="bg-primary text-white rounded-xl p-5 shadow-lg">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold">Net Salary</p>
                        <p className="text-2xl font-bold">{formatCurrency(payslip.netSalary)}</p>
                    </div>
                </section>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-t border-border-light dark:border-border-dark">
                <div className="flex gap-4">
                    <button onClick={handleDownload} className="flex-1 h-12 px-5 bg-primary/20 text-primary dark:bg-accent-blue/30 dark:text-accent-blue text-base font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/30 dark:hover:bg-accent-blue/40 transition interactive-scale">
                       <span className="material-symbols-outlined">download</span>
                        Download
                    </button>
                     <button onClick={handleShare} className="flex-1 h-12 px-5 bg-primary text-white text-base font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:bg-opacity-90 transition interactive-scale">
                       <span className="material-symbols-outlined">share</span>
                        Share
                    </button>
                </div>
            </footer>
            <div className="absolute left-[-9999px] top-0" aria-hidden="true">
              <PrintablePayslip ref={printableRef} payslip={payslip} />
            </div>
        </div>
    );
};

export default PayslipDetail;