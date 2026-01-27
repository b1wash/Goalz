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
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// CREACION DEL CONTENEDOR DEL CONTEXTO
const AppContext = createContext<AppContextType | undefined>(undefined);

// COMPONENTE PROVEEDOR (PROVIDER) QUE ENVOLVERA LA APLICACION
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // ESTADO QUE ALMACENA LA INFORMACION DEL PERFIL IDENTIFICADO
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // FUNCION PARA INICIAR SESION
  const login = async (email: string, password: string) => {
    try {
      // OBTENER TODOS LOS USUARIOS
      const usuarios = await userService.getAll();

      // BUSCAR USUARIO POR EMAIL
      const usuario = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!usuario) {
        throw new Error("No existe ninguna cuenta con ese email.");
      }

      // VALIDAR CONTRASEÑA
      if (usuario.password !== password) {
        throw new Error("Contraseña incorrecta.");
      }

      // GUARDAR USUARIO EN ESTADO Y LOCALSTORAGE
      setUsuarioActual(usuario);
      localStorage.setItem("goalz_user_id", usuario.id);
    } catch (error) {
      throw error;
    }
  };

  // FUNCION PARA REGISTRAR NUEVO USUARIO
  const register = async (nombre: string, email: string, password: string) => {
    try {
      // VERIFICAR QUE EL EMAIL NO EXISTA YA
      const usuarios = await userService.getAll();
      const emailExiste = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (emailExiste) {
        throw new Error("Ya existe una cuenta con ese email.");
      }

      // CREAR NUEVO USUARIO
      const nuevoUsuario: Omit<Usuario, "id"> = {
        name: nombre,
        nombre: nombre,
        email: email.toLowerCase(),
        password: password,
        role: "user", // Por defecto todos son usuarios normales
        totalPoints: 0,
        puntosTotal: 0,
        correctPredictions: 0,
        totalPredictions: 0,
      };

      // GUARDAR EN LA API
      const usuarioCreado = await userService.create(nuevoUsuario);

      // INICIAR SESION AUTOMATICAMENTE
      setUsuarioActual(usuarioCreado);
      localStorage.setItem("goalz_user_id", usuarioCreado.id);
    } catch (error) {
      throw error;
    }
  };

  // FUNCION PARA CERRAR SESION
  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem("goalz_user_id");
  };

  // LOGICA PARA SINCRONIZAR LOS DATOS DEL PERFIL CON EL SERVIDOR
  const recargarUsuario = async () => {
    try {
      if (usuarioActual) {
        const user = await userService.getById(usuarioActual.id);
        setUsuarioActual(user);
      }
    } catch (err) {
      console.error("Error al recargar el perfil del usuario:", err);
    }
  };

  // VERIFICAR SI HAY UN USUARIO EN LOCALSTORAGE AL CARGAR LA APP
  useEffect(() => {
    const cargarUsuarioGuardado = async () => {
      try {
        const userId = localStorage.getItem("goalz_user_id");
        if (userId) {
          const user = await userService.getById(userId);
          setUsuarioActual(user);
        }
      } catch (err) {
        console.error("Error al cargar sesión guardada:", err);
        localStorage.removeItem("goalz_user_id");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarioGuardado();
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
        login,
        register,
        logout,
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
