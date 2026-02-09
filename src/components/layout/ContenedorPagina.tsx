// COMPONENTE CONTENEDOR PARA PÁGINAS CON ESTILOS CONSISTENTES
import type { ReactNode } from "react";

export interface ContenedorPaginaProps {
  children: ReactNode;
  className?: string;
}

export const ContenedorPagina = ({
  children,
  className = "",
}: ContenedorPaginaProps) => {
  return (
    <div
      className={`min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150 ${className}`}
    >
      {children}
    </div>
  );
};
