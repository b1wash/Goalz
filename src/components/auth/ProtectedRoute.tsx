import { Navigate } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { usuarioActual } = useApp();

  // SI NO HAY USUARIO AUTENTICADO, REDIRIGIR A LOGIN
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // SI HAY USUARIO, MOSTRAR LA PAGINA PROTEGIDA
  return <>{children}</>;
};
