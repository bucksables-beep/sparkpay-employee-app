import { useState, useEffect, useCallback, useRef } from "react";
import { $api } from "@/services/api";
import useStore from "@/store";
import type { Bank } from "@/types";

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const BANKS_PER_PAGE = 20;

export const useBanks = () => {
  const user = useStore((state) => state.user);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch banks function
  const fetchBanks = useCallback(
    async (search: string = "", page: number = 1) => {
      if (!user?.country?.id) return;

      setIsLoading(true);
      try {
        const params: Record<string, string> = {
          page: page.toString(),
          limit: BANKS_PER_PAGE.toString(),
        };

        if (search) {
          params.search = search;
        }

        const response = await $api.get<Bank[]>(
          `payouts/${user.country.id}/banks`,
          { params }
        );

        if (page === 1) {
          setBanks(response.data);
        } else {
          setBanks((prev) => [...prev, ...response.data]);
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [user?.country?.id]
  );

  // Debounced search function
  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      fetchBanks(query, 1);
    }, 300)
  );

  useEffect(() => {
    debouncedSearchRef.current = debounce((query: string) => {
      fetchBanks(query, 1);
    }, 300);
  }, [fetchBanks]);

  // Load initial banks on mount
  useEffect(() => {
    if (user?.country?.id) {
      fetchBanks("", 1);
    }
  }, [user?.country?.id]); // Only depend on country ID

  // Handle search query changes
  useEffect(() => {
    if (searchQuery) {
      debouncedSearchRef.current(searchQuery);
    } else {
      // Reset to initial banks when search is cleared
      fetchBanks("", 1);
    }
  }, [searchQuery, fetchBanks]);

  return {
    banks,
    isLoading,
    searchQuery,
    setSearchQuery,
  };
};
