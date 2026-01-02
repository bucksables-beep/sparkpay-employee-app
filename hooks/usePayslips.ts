import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Payslip } from "@/types";
import { $api } from "@/services/api";
import type { PaginationMeta } from "@/components/Pagination";

const ITEMS_PER_PAGE = 10;

// Helper function to format date to monthYear
const formatMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

// Helper function to format amount with commas and 2 decimal places
const formatAmount = (amount: string | number | undefined): string => {
  if (!amount) return "";

  // Convert to number if it's a string
  const numAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[₦,]/g, ""))
      : amount;

  if (isNaN(numAmount)) return "";

  // Round to 2 decimal places and format with commas
  return numAmount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Helper function to map API response to Payslip
const mapApiResponseToPayslip = (item: Payslip): Payslip => {
  const rawAmount = item.amount || item.netSalary;
  const formattedAmount = formatAmount(rawAmount);

  return {
    id: item.id,
    monthYear:
      item.monthYear || (item.createdAt ? formatMonthYear(item.createdAt) : ""),
    amount: formattedAmount,
    organization: item.organization || item.employee?.company?.name || "N/A",
    status: item.status || item.payoutStatus || "Paid",
    netSalary: item.netSalary,
    createdAt: item.createdAt,
    payoutStatus: item.payoutStatus,
    employee: item.employee,
  };
};

export const usePayslips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Get current page from URL, default to 1
  const currentPage = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  useEffect(() => {
    const fetchPayslips = async () => {
      setIsLoading(true);
      try {
        const response = await $api.get<Payslip[]>(
          "employee-payrolls/payroll-history",
          {
            params: {
              page: currentPage.toString(),
              limit: ITEMS_PER_PAGE.toString(),
            },
          }
        );

        // Map API response to Payslip format
        const mappedPayslips = response.data.map(mapApiResponseToPayslip);
        setPayslips(mappedPayslips);

        // Use API meta if available, otherwise create from response
        if (response.meta) {
          setPaginationMeta(response.meta);
        } else {
          // Fallback: create meta from data length (assuming all data is returned)
          const totalPages = Math.ceil(mappedPayslips.length / ITEMS_PER_PAGE);
          const pagingCounter = (currentPage - 1) * ITEMS_PER_PAGE + 1;
          setPaginationMeta({
            total: mappedPayslips.length,
            perPage: ITEMS_PER_PAGE,
            pageCount: totalPages,
            page: currentPage,
            pagingCounter,
            hasPrevPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
            previousPage: currentPage > 1 ? currentPage - 1 : null,
            nextPage: currentPage < totalPages ? currentPage + 1 : null,
          });
        }
      } catch (error) {
        console.error("Failed to fetch payslips:", error);
        setPayslips([]);
        setPaginationMeta({
          total: 0,
          perPage: ITEMS_PER_PAGE,
          pageCount: 0,
          page: currentPage,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          previousPage: null,
          nextPage: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayslips();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  // Return default pagination meta if not set yet
  const meta: PaginationMeta = paginationMeta || {
    total: 0,
    perPage: ITEMS_PER_PAGE,
    pageCount: 0,
    page: currentPage,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    previousPage: null,
    nextPage: null,
  };

  return {
    payslips,
    paginationMeta: meta,
    handlePageChange,
    isLoading,
  };
};
