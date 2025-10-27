import { useState, useEffect } from "react";
import type { Payment } from "@/types";
import useStore from "@/store";
import { $api } from "@/services/api";

interface DashboardData {
  amountEarnedThisMonth: number;
  daysLeftInMonth: number;
  totalSalary: number;
  lastSixMonthsSalaries: { month: string; earnings: number }[];
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [payments, setPayments] = useState<Payment[]>([]);
  const user = useStore((state) => state.user);

  useEffect(() => {
    Promise.all([
      $api.get<DashboardData>("dashboards/employees"),
      $api.get<Payment[]>("employee-payrolls/payroll-history", {
        params: { limit: "5" },
      }),
    ])
      .then(([{ data: dashboardData }, { data: payments }]) => {
        setDashboardData(dashboardData);
        setPayments(payments);
      })
      .catch((err) => console.error(err));
  }, []);

  const hasEarningsData =
    dashboardData?.lastSixMonthsSalaries.length > 0 &&
    dashboardData?.lastSixMonthsSalaries.some((month) => month.earnings > 0);

  return { payments, user, dashboardData, hasEarningsData };
};
