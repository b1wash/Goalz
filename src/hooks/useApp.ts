import { useContext } from "react";
import { AppContext } from "../context/AppContext";

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
