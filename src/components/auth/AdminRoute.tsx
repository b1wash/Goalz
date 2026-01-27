import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import type { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { usuarioActual } = useApp();

  // SI NO HAY USUARIO AUTENTICADO, REDIRIGIR A LOGIN
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // SI EL USUARIO NO ES ADMIN, REDIRIGIR A INICIO CON MENSAJE
  if (usuarioActual.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="text-8xl mb-4">🔒</div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold">
            Solo los administradores pueden acceder a esta sección.
          </p>
        </div>
      </div>
    );
  }

  // SI ES ADMIN, MOSTRAR LA PAGINA
  return <>{children}</>;
};
