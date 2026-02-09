import { createContext } from "react";
import type { Prediccion, Usuario } from "../types";

// INTERFAZ QUE DEFINE TODOS LOS METODOS Y PROPIEDADES DISPONIBLES EN EL CONTEXTO
export interface AppContextType {
  usuarioActual: Usuario | null; // USUARIO AUTENTICADO (NULL SI NO HAY SESION)
  predicciones: Prediccion[]; // LISTADO COMPLETO DE PREDICCIONES
  agregarPrediccion: (prediccion: Omit<Prediccion, "id">) => Prediccion;
  eliminarPrediccion: (id: string) => void;
  obtenerPrediccionesUsuario: (idUsuario: string) => Prediccion[];
  recargarUsuario: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// CREACION DEL CONTEXTO
// SE EXPORTA DESDE UN ARCHIVO .TS PARA CUMPLIR CON LAS REGLAS DE FAST REFRESH
export const AppContext = createContext<AppContextType | undefined>(undefined);
