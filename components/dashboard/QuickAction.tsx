import React from "react";
import { Link } from "react-router-dom";

type ActionColor = "blue" | "green" | "orange" | "purple";

const colorSchemes: Record<
  ActionColor,
  {
    containerBg: string;
    iconText: string;
    labelText: string;
    hoverBg: string;
  }
> = {
  orange: {
    containerBg: "bg-orange-100 dark:bg-orange-900/40",
    iconText: "text-orange-600 dark:text-orange-300",
    labelText: "text-orange-800 dark:text-orange-200",
    hoverBg: "hover:bg-orange-200/70 dark:hover:bg-orange-900/60",
  },
  green: {
    containerBg: "bg-green-100 dark:bg-green-900/40",
    iconText: "text-green-600 dark:text-green-300",
    labelText: "text-green-800 dark:text-green-200",
    hoverBg: "hover:bg-green-200/70 dark:hover:bg-green-900/60",
  },
  blue: {
    containerBg: "bg-blue-100 dark:bg-blue-900/40",
    iconText: "text-blue-600 dark:text-blue-300",
    labelText: "text-blue-800 dark:text-blue-200",
    hoverBg: "hover:bg-blue-200/70 dark:hover:bg-blue-900/60",
  },
  purple: {
    containerBg: "bg-purple-100 dark:bg-purple-900/40",
    iconText: "text-purple-600 dark:text-purple-300",
    labelText: "text-purple-800 dark:text-purple-200",
    hoverBg: "hover:bg-purple-200/70 dark:hover:bg-purple-900/60",
  },
};

interface QuickActionProps {
  to: string;
  icon: string;
  label: string;
  color: ActionColor;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  to,
  icon,
  label,
  color,
}) => {
  const scheme = colorSchemes[color];

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-center transition-colors shadow-sm interactive-scale ${scheme.containerBg} ${scheme.hoverBg}`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full bg-white/60 dark:bg-black/20 ${scheme.iconText}`}
      >
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <p className={`text-sm font-semibold ${scheme.labelText}`}>{label}</p>
    </Link>
  );
};
