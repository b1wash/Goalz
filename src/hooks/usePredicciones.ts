// HOOK PERSONALIZADO PARA MANEJAR PREDICCIONES
import { useState, useEffect } from "react";
import type { Prediccion } from "../types";
import { prediccionesMock } from "../utils/mockData";

export const usePredicciones = () => {
  // CARGAR PREDICCIONES DESDE LOCALSTORAGE O USAR LAS DE EJEMPLO
  const [predicciones, setPredicciones] = useState<Prediccion[]>(() => {
    const guardadas = localStorage.getItem("goalz_predicciones");
    return guardadas ? JSON.parse(guardadas) : prediccionesMock;
  });

  // GUARDAR EN LOCALSTORAGE CADA VEZ QUE CAMBIEN LAS PREDICCIONES
  useEffect(() => {
    localStorage.setItem("goalz_predicciones", JSON.stringify(predicciones));
  }, [predicciones]);

  // FUNCION PARA AÑADIR UNA NUEVA PREDICCION
  const agregarPrediccion = (nuevaPrediccion: Omit<Prediccion, "id">) => {
    const prediccion: Prediccion = {
      ...nuevaPrediccion,
      id: Date.now().toString(), // GENERAR ID UNICO
    };
    setPredicciones([...predicciones, prediccion]);
    return prediccion;
  };

  // FUNCION PARA ELIMINAR UNA PREDICCION
  const eliminarPrediccion = (id: string) => {
    setPredicciones(predicciones.filter((p) => p.id !== id));
  };

  // FUNCION PARA OBTENER PREDICCIONES DE UN USUARIO
  const obtenerPrediccionesUsuario = (idUsuario: string) => {
    return predicciones.filter(
      (p) => p.userId === idUsuario || p.idUsuario === idUsuario,
    );
  };

  return {
    predicciones,
    agregarPrediccion,
    eliminarPrediccion,
    obtenerPrediccionesUsuario,
  };
};
