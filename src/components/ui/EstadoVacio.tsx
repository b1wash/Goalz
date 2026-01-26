// COMPONENTE REUTILIZABLE PARA ESTADOS VACÍOS
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";

export interface EstadoVacioProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  children?: ReactNode;
}

export const EstadoVacio = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
  children,
}: EstadoVacioProps) => {
  return (
    <div className="col-span-full py-20 bg-slate-50 dark:bg-dark-card/20 border-2 border-dashed border-slate-200 dark:border-primary/10 rounded-3xl text-center">
      <div className="text-7xl mb-6">{icon}</div>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
        {description}
      </p>
      {actionLink && actionLabel && (
        <Link to={actionLink}>
          <Button className="px-12 py-5 text-xl">{actionLabel}</Button>
        </Link>
      )}
      {children}
    </div>
  );
};
