import { Navigate, Link } from "react-router-dom";
import { useApp } from "../../hooks/useApp";
import { Button } from "../ui";
import type { ReactNode } from "react";
//DEFINIMOS QUE ESTE COMPONENTE RECIBA UN PROPS DE TIPO REACTNODE
interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  //OBTENEMOS EL USUARIO ACTUAL DESDE EL CONTEXT APPCONTEXT
  const { usuarioActual } = useApp();

  // SI NO HAY USUARIO AUTENTICADO, REDIRIGIR A LOGIN
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // SI EL USUARIO NO ES ADMIN, REDIRIGIR A INICIO CON MENSAJE
  if (usuarioActual.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
          <div className="text-8xl mb-6 filter drop-shadow-2xl">🔐</div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            ACCESO RESTRINGIDO
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-8">
            Lo sentimos, esta sección es exclusiva para el equipo de
            administración de GOALZ.
          </p>
          <Link to="/">
            <Button className="px-8 py-3 text-lg font-black group">
              <span>🏠</span>
              <span className="ml-2">VOLVER A INICIO</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // SI ES ADMIN, MOSTRAR LA PAGINA
  return <>{children}</>;
};
