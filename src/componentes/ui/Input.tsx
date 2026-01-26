// COMPONENTE INPUT REUTILIZABLE
import type { ChangeEvent } from "react";

export interface InputProps {
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  className?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const Input = ({
  type,
  value,
  onChange,
  placeholder = "",
  error = "",
  label = "",
  className = "",
  min,
  max,
  disabled = false,
}: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-white font-bold mb-2">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-dark-bg border ${
          error ? "border-danger" : "border-primary/20"
        } rounded-lg text-white font-semibold focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
      {error && (
        <p className="mt-2 text-danger text-sm font-semibold flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};
