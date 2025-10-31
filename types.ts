
export interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  isDefault: boolean;
}

export interface Payment {
  id:string;
  amount: string;
  date: string;
  status: 'Paid';
}

export interface Notification {
  id: string;
  icon: string;
  title: string;
  time: string;
  isRead: boolean;
  category: 'Today' | 'Yesterday';
}

export interface Payslip {
    id: string;
    monthYear: string;
    amount: string;
}

export interface PayslipDetail {
  id:string;
  monthYear: string;
  employeeName: string;
  employeeId: string;
  department: string;
  payPeriod: string;
  earnings: { description: string; amount: number }[];
  deductions: { description: string; amount: number }[];
  grossEarnings: number;
  totalDeductions: number;
  netSalary: number;
}

export interface Reimbursement {
  id: string;
  type: 'Travel' | 'Meals' | 'Supplies' | 'Other';
  amount: number;
  date: string; // Date of request
  expenseDate: string;
  description: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptUrl?: string;
}
