// COMPONENTE: LISTADO DE PREDICCIONES
// ESTE COMPONENTE SE ENCARGA DE RENDERIZAR UNA COLECCION DE TARJETAS DE PREDICCION
// RECIBE LAS PREDICCIONES Y LOS PARTIDOS PARA PODER RELACIONARLOS

import type { Prediccion, Partido } from "../../types";
import { PredictionCard } from "./PredictionCard";

// INTERFAZ QUE DEFINE LAS PROPS DEL COMPONENTE
export interface PredictionListProps {
  predictions: Prediccion[]; // ARRAY CON TODAS LAS PREDICCIONES DEL USUARIO
  matches: Partido[]; // ARRAY CON TODOS LOS PARTIDOS PARA BUSCAR LA INFO DE CADA PREDICCION
}

export const PredictionList = ({
  predictions,
  matches,
}: PredictionListProps) => {
  // CONTROL DE ESTADO VACIO: SI EL USUARIO NO TIENE PREDICCIONES, MOSTRAMOS UN MENSAJE
  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-gray-400 text-lg font-bold">
          No tienes predicciones todavía
        </p>
        <p className="text-slate-400 dark:text-gray-500 text-sm mt-2">
          ¡Haz tu primera predicción!
        </p>
      </div>
    );
  }

  return (
    // CONTENEDOR GRID: ORGANIZA LAS TARJETAS EN COLUMNAS SEGUN EL TAMAÑO DE PANTALLA
    // 1 COLUMNA EN MOVIL, 2 EN TABLET Y 3 EN ESCRITORIO
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* RECORREMOS EL ARRAY DE PREDICCIONES PARA GENERAR LAS TARJETAS */}
      {predictions.map((prediction) => {
        // BUSQUEDA: ENCONTRAMOS EL PARTIDO AL QUE PERTENECE ESTA PREDICCION
        const match = matches.find(
          (m) => m.id === (prediction.matchId || prediction.idPartido),
        );

        // VALIDACION: SI NO SE ENCUENTRA EL PARTIDO ASOCIADO, SE IGNORA ESTA PREDICCION
        if (!match) return null;

        return (
          // RENDERIZADO DEL COMPONENTE HIJO "PredictionCard"
          <PredictionCard
            key={prediction.id} // KEY UNICA PARA QUE REACT GESTIONE EFICIENTEMENTE LA LISTA
            prediction={prediction}
            match={match}
          />
        );
      })}
    </div>
  );
};
