import React from "react";

export interface PaginationMeta {
  total: number;
  perPage: number;
  pageCount: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  itemName?: string; // Optional: defaults to "items"
}

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
  itemName = "items",
}) => {
  const {
    total,
    perPage,
    pageCount,
    page,
    pagingCounter,
    hasPrevPage,
    hasNextPage,
    previousPage,
    nextPage,
  } = meta;

  // Don't render if there's only one page or no pages
  if (pageCount <= 1) {
    return null;
  }

  const startItem = pagingCounter;
  const endItem = Math.min(pagingCounter + perPage - 1, total);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      onPageChange(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (pageCount <= maxVisible) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(pageCount - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < pageCount - 2) {
        pages.push("...");
      }

      // Always show last page
      pages.push(pageCount);
    }

    return pages;
  };

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-subtext-light dark:text-subtext-dark">
        Showing {startItem} to {endItem} of {total} {itemName}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => previousPage && handlePageChange(previousPage)}
          disabled={!hasPrevPage}
          className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-light dark:hover:bg-background-dark transition-colors"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {getPageNumbers().map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-4 py-2 text-subtext-light dark:text-subtext-dark"
                >
                  ...
                </span>
              );
            }

            const pageNumber = pageNum as number;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  page === pageNumber
                    ? "bg-primary text-white dark:bg-accent-blue"
                    : "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => nextPage && handlePageChange(nextPage)}
          disabled={!hasNextPage}
          className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-light dark:hover:bg-background-dark transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
