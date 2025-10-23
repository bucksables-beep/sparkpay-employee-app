import classNames from "classnames";
import React from "react";

type InputProps = {
  id: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  touched?: boolean;
  helperText?: string;
  icon?: string;
  hideLabel?: boolean;
};

export const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required = false,
  value,
  onChange,
  onBlur,
  error,
  touched,
  helperText,
  icon,
  hideLabel = false,
}) => {
  return (
    <div>
      {label && !hideLabel && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-subtext-light dark:text-subtext-dark"
        >
          {label}
        </label>
      )}
      {hideLabel && (
        <label htmlFor={id} className="sr-only">
          {label || placeholder}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-subtext-light dark:text-subtext-dark"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className={classNames(
            "form-input w-full rounded-lg border-0 bg-background-light dark:bg-surface-dark h-14 placeholder:text-subtext-light dark:placeholder:text-subtext-dark focus:ring-2 focus:ring-inset focus:ring-primary",
            {
              "pl-12": icon,
              "px-4": !icon,
              "pr-4": true,
              "border-red-500": error && touched,
            }
          )}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
      {error && touched && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-xs text-subtext-light dark:text-subtext-dark">
          {helperText}
        </p>
      )}
    </div>
  );
};
