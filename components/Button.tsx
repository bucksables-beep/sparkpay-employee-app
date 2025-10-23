import classNames from "classnames";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
};

const Spinner: React.FC = () => (
  <svg
    className="animate-spin h-5 w-5 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const isDisabled = disabled || isLoading;

  const baseClasses =
    "font-bold h-14 rounded-lg text-lg transition-colors duration-300 interactive-scale focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary";

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    ghost: "bg-transparent border-none text-primary hover:underline",
  };

  const disabledClasses = isDisabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classNames(
        baseClasses,
        variantClasses[variant],
        disabledClasses,
        className
      )}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && <Spinner />}
        {children}
      </div>
    </button>
  );
};
