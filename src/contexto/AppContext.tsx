// CONTEXTO GLOBAL PARA MANEJAR EL ESTADO DE LA APLICACION
import { createContext, useContext, type ReactNode } from "react";
import type { Prediccion, Usuario } from "../tipos";
import { usePredicciones } from "../hooks/usePredicciones";

// DEFINIR LA FORMA DEL CONTEXTO
interface AppContextType {
  usuarioActual: Usuario;
  predicciones: Prediccion[];
  agregarPrediccion: (prediccion: Omit<Prediccion, "id">) => Prediccion;
  eliminarPrediccion: (id: string) => void;
  obtenerPrediccionesUsuario: (idUsuario: string) => Prediccion[];
}

// CREAR EL CONTEXTO
const AppContext = createContext<AppContextType | undefined>(undefined);

// PROVEEDOR DEL CONTEXTO
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // USUARIO ACTUAL (DESPUES VENDRA DE AUTENTICACION)
  const usuarioActual: Usuario = {
    id: "1",
    name: "Biwash Shrestha",
    nombre: "Biwash Shrestha",
    email: "biwash@goalz.com",
    totalPoints: 245,
    puntosTotal: 245,
    correctPredictions: 12,
    totalPredictions: 25,
  };

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
      }}
    >
      {children}
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
