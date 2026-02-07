// CONTEXTO GLOBAL DE LA APLICACION
// GESTIONA: AUTENTICACION DE USUARIOS, ESTADO DE SESION Y PREDICCIONES
// ESTE COMPONENTE UTILIZA CONTEXT API DE REACT PARA COMPARTIR DATOS ENTRE COMPONENTES

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

// INTERFAZ QUE DEFINE TODOS LOS METODOS Y PROPIEDADES DISPONIBLES EN EL CONTEXTO
interface AppContextType {
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
// RECIBE <TIPO | UNDEFINED> PARA VALIDAR QUE SE USE DENTRO DEL PROVIDER
const AppContext = createContext<AppContextType | undefined>(undefined);

// COMPONENTE PROVIDER: ENVUELVE LA APP Y PROPORCIONA EL CONTEXTO A TODOS LOS HIJOS
export const AppProvider = ({ children }: { children: ReactNode }) => {
  // ESTADO: ALMACENA EL USUARIO LOGUEADO
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);

  // ESTADO: CONTROLA SI ESTA CARGANDO LA SESION GUARDADA
  const [loading, setLoading] = useState(true);

  // FUNCION: INICIAR SESION
  // VALIDA EMAIL Y CONTRASEÑA CONTRA LA BASE DE DATOS
  const login = async (email: string, password: string) => {
    try {
      // 1. OBTENER TODOS LOS USUARIOS DE LA API
      const usuarios = await userService.getAll();

      // 2. BUSCAR USUARIO POR EMAIL (CASE INSENSITIVE)
      const usuario = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      // 3. VALIDAR QUE EL USUARIO EXISTA
      if (!usuario) {
        throw new Error("No existe ninguna cuenta con ese email.");
      }

      // 4. VALIDAR QUE LA CONTRASEÑA SEA CORRECTA
      if (usuario.password !== password) {
        throw new Error("Contraseña incorrecta.");
      }

      // 5. GUARDAR USUARIO EN ESTADO Y LOCALSTORAGE PARA PERSISTENCIA
      setUsuarioActual(usuario);
      localStorage.setItem("goalz_user_id", usuario.id);
    } catch (error) {
      // PROPAGAR EL ERROR PARA QUE EL COMPONENTE LO MANEJE
      throw error;
    }
  };

  // FUNCION: REGISTRAR NUEVO USUARIO
  // CREA UNA CUENTA NUEVA Y INICIA SESION AUTOMATICAMENTE
  const register = async (nombre: string, email: string, password: string) => {
    try {
      // 1. VERIFICAR QUE EL EMAIL NO ESTE YA REGISTRADO
      const usuarios = await userService.getAll();
      const emailExiste = usuarios.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (emailExiste) {
        throw new Error("Ya existe una cuenta con ese email.");
      }

      // 2. CREAR OBJETO DE NUEVO USUARIO CON VALORES INICIALES
      const nuevoUsuario: Omit<Usuario, "id"> = {
        name: nombre,
        nombre: nombre,
        email: email.toLowerCase(),
        password: password,
        role: "user",
        totalPoints: 0,
        puntosTotal: 0,
        correctPredictions: 0,
        totalPredictions: 0,
      };

      // 3. GUARDAR EN LA API VIA JSON SERVER
      const usuarioCreado = await userService.create(nuevoUsuario);

      // 4. INICIAR SESION AUTOMATICAMENTE TRAS REGISTRO EXITOSO
      setUsuarioActual(usuarioCreado);
      localStorage.setItem("goalz_user_id", usuarioCreado.id);
    } catch (error) {
      throw error;
    }
  };

  // FUNCION: CERRAR SESION
  // LIMPIA EL ESTADO Y EL LOCALSTORAGE
  const logout = () => {
    setUsuarioActual(null);
    localStorage.removeItem("goalz_user_id");
  };

  // FUNCION: RECARGAR DATOS DEL USUARIO DESDE LA API
  // UTIL PARA ACTUALIZAR PUNTOS DESPUES DE CALCULAR RESULTADOS
  const recargarUsuario = async () => {
    try {
      if (usuarioActual) {
        // OBTENER VERSION ACTUALIZADA DEL USUARIO DESDE LA API
        const user = await userService.getById(usuarioActual.id);
        setUsuarioActual(user);
      }
    } catch (err) {
      console.error("Error al recargar el perfil del usuario:", err);
    }
  };

  // EFFECT: RESTAURAR SESION AL CARGAR LA APP
  // SE EJECUTA UNA SOLA VEZ AL MONTAR EL COMPONENTE (DEPENDENCIAS = [])
  useEffect(() => {
    const cargarUsuarioGuardado = async () => {
      try {
        // 1. BUSCAR ID DE USUARIO EN LOCALSTORAGE
        const userId = localStorage.getItem("goalz_user_id");

        // 2. SI EXISTE, CARGAR SUS DATOS COMPLETOS DESDE LA API
        if (userId) {
          const user = await userService.getById(userId);
          setUsuarioActual(user);
        }
      } catch (err) {
        // SI HAY ERROR (USUARIO BORRADO, API CAIDA, ETC), LIMPIAR LOCALSTORAGE
        console.error("Error al cargar sesión guardada:", err);
        localStorage.removeItem("goalz_user_id");
      } finally {
        // SIEMPRE MARCAMOS COMO NO LOADING AL FINALIZAR
        setLoading(false);
      }
    };

    cargarUsuarioGuardado();
  }, []); // DEPENDENCIAS VACIAS = SOLO SE EJECUTA AL MONTAR

  // CUSTOM HOOK: GESTIONA TODAS LAS PREDICCIONES
  // DEVUELVE: LISTA DE PREDICCIONES Y FUNCIONES PARA MANIPULARLAS
  const {
    predicciones,
    agregarPrediccion,
    eliminarPrediccion,
    obtenerPrediccionesUsuario,
  } = usePredicciones();

  return (
    <AppContext.Provider
      value={{
        // VALORES Y FUNCIONES QUE ESTARAN DISPONIBLES EN TODA LA APP
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
      {/* PANTALLA DE CARGA: EVITA PARPADEO MIENTRAS VERIFICA SESION GUARDADA */}
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

// CUSTOM HOOK: CONSUMIR EL CONTEXTO DE FORMA SEGURA
// USO: const { usuarioActual, login, logout } = useApp();
export const useApp = () => {
  const context = useContext(AppContext);

  // VALIDAR QUE SE USE DENTRO DEL PROVIDER
  if (!context) {
    throw new Error("useApp debe utilizarse dentro de un AppProvider");
  }

  return context;
};
