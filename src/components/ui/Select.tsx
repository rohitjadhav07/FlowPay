'use client';

import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function Select({ 
  value, 
  onChange, 
  children, 
  className = '', 
  placeholder = 'Select an option',
  disabled = false 
}: SelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 pr-10 
          border border-gray-300 dark:border-gray-600 
          rounded-lg 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-800
          disabled:text-gray-500 dark:disabled:text-gray-400
          disabled:cursor-not-allowed
          appearance-none
          transition-colors
          ${className}
        `}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
}

interface OptionProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export function Option({ value, children, disabled = false }: OptionProps) {
  return (
    <option value={value} disabled={disabled}>
      {children}
    </option>
  );
}