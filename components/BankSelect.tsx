import React, { useState, useRef, useEffect } from "react";
import { useBanks } from "../hooks/useBanks";
import useStore from "@/store";

interface BankSelectProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
  touched?: boolean;
}

export const BankSelect: React.FC<BankSelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  error,
  touched,
}) => {
  const { banks, isLoading, searchQuery, setSearchQuery } = useBanks();
  const user = useStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [selectedBankName, setSelectedBankName] = useState<string>("");
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find selected bank name from banks array, user.bank, or stored name
  useEffect(() => {
    if (value) {
      // First, check if it matches user's bank
      if (user?.bank?.id === value && user.bank.name) {
        setDisplayValue(user.bank.name);
        setSelectedBankName(user.bank.name);
        return;
      }

      // Then check banks array
      const selectedBank = banks.find((bank) => bank.id === value);
      if (selectedBank) {
        setDisplayValue(selectedBank.name);
        setSelectedBankName(selectedBank.name);
      } else if (selectedBankName) {
        // Use stored name if bank not in current array
        setDisplayValue(selectedBankName);
      } else {
        setDisplayValue("");
      }
    } else {
      setDisplayValue("");
      setSelectedBankName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, banks, selectedBankName, user?.bank]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Clear search when closing dropdown
        setTimeout(() => setSearchQuery(""), 100);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setSearchQuery]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (bank: { id: string; name: string }) => {
    // Store the selected bank name immediately
    setSelectedBankName(bank.name);
    setDisplayValue(bank.name);

    // Create a proper synthetic event that Formik can handle
    const syntheticEvent = {
      target: {
        name,
        value: bank.id,
      },
      currentTarget: {
        name,
        value: bank.id,
      },
      preventDefault: () => {},
      stopPropagation: () => {},
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Use banks directly from API (already filtered by search query)
  const filteredBanks = banks;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-subtext-light dark:text-subtext-dark mb-2"
      >
        {label}
      </label>
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`form-select w-full appearance-none rounded-lg bg-background-light dark:bg-background-dark border-0 focus:ring-2 focus:ring-inset focus:ring-primary h-14 pl-4 pr-10 text-base text-left ${
            error && touched ? "border-red-500" : ""
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={
              value
                ? "text-text-light dark:text-text-dark"
                : "text-subtext-light dark:text-subtext-dark"
            }
          >
            {displayValue || "Select Bank"}
          </span>
        </button>
        <span
          className="material-symbols-outlined absolute top-1/2 right-4 -translate-y-1/2 text-subtext-light dark:text-subtext-dark pointer-events-none"
          aria-hidden="true"
        >
          {isOpen ? "expand_less" : "expand_more"}
        </span>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2 sticky top-0 bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search banks..."
                  className="w-full px-3 py-2 pr-10 rounded-lg bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
            <ul className="py-1" role="listbox">
              {isLoading && banks.length === 0 ? (
                <li className="px-4 py-2 text-subtext-light dark:text-subtext-dark text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                    <span>Loading banks...</span>
                  </div>
                </li>
              ) : isLoading && searchQuery ? (
                <li className="px-4 py-2 text-subtext-light dark:text-subtext-dark text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                    <span>Searching...</span>
                  </div>
                </li>
              ) : filteredBanks.length === 0 ? (
                <li className="px-4 py-2 text-subtext-light dark:text-subtext-dark text-center">
                  No banks found
                </li>
              ) : (
                filteredBanks.map((bank) => (
                  <li
                    key={bank.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(bank);
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-surface-light dark:hover:bg-surface-dark ${
                      value === bank.id
                        ? "bg-primary/10 dark:bg-accent-blue/20 text-primary dark:text-accent-blue"
                        : "text-text-light dark:text-text-dark"
                    }`}
                    role="option"
                    aria-selected={value === bank.id}
                  >
                    {bank.name}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="sr-only"
        aria-hidden="true"
      >
        <option value="">Select Bank</option>
        {banks.map((bank) => (
          <option key={bank.id} value={bank.id}>
            {bank.name}
          </option>
        ))}
      </select>
    </div>
  );
};
