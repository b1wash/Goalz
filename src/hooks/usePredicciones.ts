// HOOK PERSONALIZADO PARA MANEJAR LA LOGICA DE PREDICCIONES
import { useState, useEffect } from "react";
import type { Prediccion } from "../types";
import { predictionService } from "../services/predictionService";

/**
 * HOOK PARA GESTIONAR EL ESTADO GLOBAL DE LAS PREDICCIONES
 */
export const usePredicciones = () => {
  // ESTADO PARA ALMACENAR LAS PREDICCIONES CARGADAS EN MEMORIA
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [loading, setLoading] = useState(true);

  // EFECTO PARA SINCRONIZAR CON LA BASE DE DATOS AL INICIAR
  useEffect(() => {
    const cargarPredicciones = async () => {
      try {
        setLoading(true);
        // OBTENER TODOS LOS DATOS DESDE EL SERVICIO API
        const data = await predictionService.getAll();
        setPredicciones(data);
      } catch (err) {
        console.error("ERROR AL CARGAR PREDICCIONES EN EL HOOK:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPredicciones();
  }, []);

  /**
   * AGREGA UNA PREDICCION AL ESTADO LOCAL
   */
  const agregarPrediccion = (nuevaPrediccion: Omit<Prediccion, "id">) => {
    const prediccion: Prediccion = {
      ...nuevaPrediccion,
      id: Date.now().toString(), // ID TEMPORAL HASTA QUE SE RECARGUE DE LA API
    } as Prediccion;

    setPredicciones((prev) => [...prev, prediccion]);
    return prediccion;
  };

  /**
   * ELIMINA UNA PREDICCION DEL ESTADO LOCAL
   */
  const eliminarPrediccion = (id: string) => {
    setPredicciones((prev) => prev.filter((p) => p.id !== id));
  };

  /**
   * RECUPERA LAS PREDICCIONES FILTRADAS POR EL ID DE UN USUARIO
   */
  const obtenerPrediccionesUsuario = (idUsuario: string) => {
    return predicciones.filter(
      (p) => p.userId === idUsuario || p.idUsuario === idUsuario,
    );
  };

  return {
    predicciones,
    loading,
    agregarPrediccion,
    eliminarPrediccion,
    obtenerPrediccionesUsuario,
  };
};
