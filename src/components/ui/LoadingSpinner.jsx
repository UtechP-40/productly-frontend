"use client";

import React from 'react';
import { cn } from '../../lib/utils';

/**
 * LoadingSpinner component
 * Displays a loading spinner with customizable size and color
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size="md"] - Size of the spinner (sm, md, lg, xl)
 * @param {string} [props.color="primary"] - Color of the spinner (primary, secondary, accent, etc.)
 * @param {string} [props.className] - Additional CSS classes
 * @returns {React.ReactNode} Loading spinner component
 */
export default function LoadingSpinner({ 
  size = "md", 
  color = "primary", 
  className 
}) {
  // Size mappings
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  // Color mappings
  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
    destructive: "text-destructive",
    muted: "text-muted-foreground",
    white: "text-white"
  };

  return (
    <div className="flex items-center justify-center">
      <svg
        className={cn(
          "animate-spin",
          sizeClasses[size] || sizeClasses.md,
          colorClasses[color] || colorClasses.primary,
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}