// COMPONENTE CARD REUTILIZABLE
import type { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({
  children,
  className = "",
  hover = false,
}: CardProps) => {
  const baseStyles =
    "bg-white dark:bg-dark-card/50 backdrop-blur-sm border border-slate-200 dark:border-primary/20 rounded-2xl p-4 shadow-lg transition-colors duration-300";
  const hoverStyles = hover
    ? "hover:border-primary/40 hover:shadow-xl transition-all duration-300"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
