// CONTEXTO GLOBAL PARA MANEJAR EL ESTADO DE LA APLICACION
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Prediccion, Usuario } from "../tipos";
import { usePredicciones } from "../hooks/usePredicciones";
import { userService } from "../servicios/userService";

// DEFINIR LA FORMA DEL CONTEXTO
interface AppContextType {
  usuarioActual: Usuario | null;
  predicciones: Prediccion[];
  agregarPrediccion: (prediccion: Omit<Prediccion, "id">) => Prediccion;
  eliminarPrediccion: (id: string) => void;
  obtenerPrediccionesUsuario: (idUsuario: string) => Prediccion[];
  recargarUsuario: () => Promise<void>;
}

// CREAR EL CONTEXTO
const AppContext = createContext<AppContextType | undefined>(undefined);

// PROVEEDOR DEL CONTEXTO
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // ESTADO PARA EL USUARIO ACTUAL
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // FUNCION PARA CARGAR LOS DATOS DEL USUARIO DESDE LA API
  const recargarUsuario = async () => {
    try {
      const user = await userService.getById("user1");
      setUsuarioActual(user);
    } catch (err) {
      console.error("Error al cargar el usuario actual:", err);
    } finally {
      setLoading(false);
    }
  };

  // CARGAR AL INICIAR
  useEffect(() => {
    recargarUsuario();
  }, []);

  // USAR EL HOOK DE PREDICCIONES
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
      {!loading && children}
      {loading && (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
          <div className="text-primary text-2xl animate-pulse font-black">
            GOALZ
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

// HOOK PARA USAR EL CONTEXTO
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp debe usarse dentro de AppProvider");
  }
  return context;
};
