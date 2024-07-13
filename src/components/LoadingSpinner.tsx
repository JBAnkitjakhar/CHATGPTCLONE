// src/components/LoadingSpinner.tsx

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16",
    large: "h-32 w-32",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-white`}
    ></div>
  );
};

export default LoadingSpinner;
