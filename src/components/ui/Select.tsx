// COMPONENTE SELECT REUTILIZABLE
import type { ChangeEvent, ReactNode } from "react";

export interface SelectProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  error?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Select = ({
  value,
  onChange,
  children,
  error = "",
  label = "",
  className = "",
  disabled = false,
}: SelectProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white font-bold mb-2">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-dark-bg border ${
          error ? "border-danger" : "border-primary/20"
        } rounded-lg text-white font-semibold focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {children}
      </select>
      {error && (
        <p className="mt-2 text-danger text-sm font-semibold flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};
