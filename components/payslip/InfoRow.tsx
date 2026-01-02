import React from "react";

interface InfoRowProps {
  label: string;
  value: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-subtext-light dark:text-subtext-dark">{label}</p>
    <p className="font-medium text-text-light dark:text-text-dark">{value}</p>
  </div>
);
