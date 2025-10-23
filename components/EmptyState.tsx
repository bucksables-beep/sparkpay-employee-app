import React from 'react';

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
