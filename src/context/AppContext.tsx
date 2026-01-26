// CONTEXTO GLOBAL PARA MANEJAR EL ESTADO DE LA APLICACION (SESION, PREDICCIONES)
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Prediccion, Usuario } from "../types";
import { usePredicciones } from "../hooks/usePredicciones";
import { userService } from "../services/userService";

// INTERFAZ QUE DEFINE LA ESTRUCTURA DEL VALOR DEL CONTEXTO
interface AppContextType {
  usuarioActual: Usuario | null;
  predicciones: Prediccion[];
  agregarPrediccion: (prediccion: Omit<Prediccion, "id">) => Prediccion;
  eliminarPrediccion: (id: string) => void;
  obtenerPrediccionesUsuario: (idUsuario: string) => Prediccion[];
  recargarUsuario: () => Promise<void>;
}

// CREACION DEL CONTENEDOR DEL CONTEXTO
const AppContext = createContext<AppContextType | undefined>(undefined);

// COMPONENTE PROVEEDOR (PROVIDER) QUE ENVOLVERA LA APLICACION
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // ESTADO QUE ALMACENA LA INFORMACION DEL PERFIL IDENTIFICADO
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // LOGICA PARA SINCRONIZAR LOS DATOS DEL PERFIL CON EL SERVIDOR
  const recargarUsuario = async () => {
    try {
      // NOTA: USAMOS UN USUARIO FIJO POR AHORA PARA LA DEMOSTRACION
      const user = await userService.getById("user1");
      setUsuarioActual(user);
    } catch (err) {
      console.error("Error al cargar el perfil del usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  // DISPARAR LA CARGA INICIAL AL MONTAR EL PROVIDER
  useEffect(() => {
    recargarUsuario();
  }, []);

  // INTEGRACION CON EL CUSTOM HOOK DE GESTION DE PREDICCIONES
  const {
    predicciones,
    agregarPrediccion,
    eliminarPrediccion,
    obtenerPrediccionesUsuario,
  } = usePredicciones();

  return (
    <AppContext.Provider
      value={{
        usuarioActual,
        predicciones,
        agregarPrediccion,
        eliminarPrediccion,
        obtenerPrediccionesUsuario,
        recargarUsuario,
      }}
    >
      {/* EVITAR PARPADEO DURANTE EL PROCESO DE IDENTIFICACION */}
      {!loading && children}
      {loading && (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg flex items-center justify-center">
          <div className="text-primary text-3xl animate-pulse font-black tracking-widest">
            GOALZ
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

// CONSUMIDOR DEL CONTEXTO (CUSTOM HOOK AGIL)
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe utilizarse dentro de un AppProvider");
  }
  return context;
};
