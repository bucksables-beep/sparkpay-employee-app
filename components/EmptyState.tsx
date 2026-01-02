import React from "react";

interface EmptyStateProps {
  message: string;
  icon?: string;
  title?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = "inbox",
  title,
}) => {
  return (
    <div className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm">
      <span
        className="material-symbols-outlined text-6xl text-subtext-light dark:text-subtext-dark"
        aria-hidden="true"
      >
        {icon}
      </span>
      {title && (
        <p className="mt-4 text-xl font-semibold text-text-light dark:text-text-dark">
          {title}
        </p>
      )}
      <p className="text-subtext-light dark:text-subtext-dark mt-2">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
