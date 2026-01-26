// COMPONENTE BADGE REUTILIZABLE
export interface BadgeProps {
  text: string;
  variant: "success" | "danger" | "warning" | "info";
  className?: string;
}

export const Badge = ({ text, variant, className = "" }: BadgeProps) => {
  const variantStyles = {
    success: "bg-primary/20 text-primary border-primary/40",
    danger: "bg-danger/20 text-danger border-danger/40",
    warning: "bg-warning/20 text-warning border-warning/40",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${variantStyles[variant]} ${className}`}
    >
      {text}
    </span>
  );
};
