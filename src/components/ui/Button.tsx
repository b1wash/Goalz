// COMPONENTE BOTON REUTILIZABLE
import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-primary to-emerald-600 text-white dark:text-dark-bg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    secondary:
      "bg-slate-100 dark:bg-dark-card text-slate-900 dark:text-white border border-slate-300 dark:border-primary/20 hover:border-primary dark:hover:border-primary/40 hover:bg-slate-200 dark:hover:bg-dark-hover",
    danger:
      "bg-gradient-to-r from-danger to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
