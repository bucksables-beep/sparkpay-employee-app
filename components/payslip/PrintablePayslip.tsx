import React from "react";
import type { PayslipDetail as PayslipDetailType } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface PrintablePayslipProps {
  payslip: PayslipDetailType;
}

export const PrintablePayslip = React.forwardRef<
  HTMLDivElement,
  PrintablePayslipProps
>(({ payslip }, ref) => (
  <div
    ref={ref}
    className="bg-white text-[#111318] p-8 font-display"
    style={{ width: "210mm", minHeight: "297mm" }}
  >
    <header className="flex justify-between items-center pb-4 border-b border-gray-300">
      <h1 className="text-3xl font-bold text-[#0D39B6]">
        {payslip.organization}
      </h1>
      <div className="text-right">
        <h2 className="text-2xl font-semibold">Payslip</h2>
        <p className="text-gray-600">{payslip.monthYear}</p>
      </div>
    </header>

    <section className="grid grid-cols-2 gap-x-8 gap-y-4 mt-8 text-sm">
      <div>
        <strong className="font-semibold text-gray-700">Employee Name:</strong>{" "}
        {payslip.employeeName}
      </div>
      <div>
        <strong className="font-semibold text-gray-700">Employee ID:</strong>{" "}
        {payslip.employeeId}
      </div>
      <div>
        <strong className="font-semibold text-gray-700">Department:</strong>{" "}
        {payslip.department}
      </div>
      <div>
        <strong className="font-semibold text-gray-700">Pay Period:</strong>{" "}
        {payslip.payPeriod}
      </div>
    </section>

    <section className="grid grid-cols-2 gap-x-12 mt-10 text-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-2">
          Earnings
        </h3>
        {payslip.earnings.map((item) => (
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
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2 mb-2">
          Deductions
        </h3>
        {payslip.deductions.map((item) => (
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
        <span className="text-3xl font-bold text-[#0D39B6]">
          {formatCurrency(payslip.netSalary)}
        </span>
      </div>
    </section>

    <footer className="text-center text-xs text-gray-500 mt-16 pt-4 border-t border-gray-300 absolute bottom-8 left-8 right-8">
      <p>
        This is a computer-generated document and does not require a signature.
      </p>
      <p>{payslip.organization} | Nigeria</p>
    </footer>
  </div>
));
