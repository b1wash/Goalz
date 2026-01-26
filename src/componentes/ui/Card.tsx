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
    "bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-lg";
  const hoverStyles = hover
    ? "hover:border-primary/40 hover:shadow-xl transition-all duration-300"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};
