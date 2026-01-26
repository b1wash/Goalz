// COMPONENTE PARA MOSTRAR UNA LISTA DE PREDICCIONES
import type { Prediccion, Partido } from "../../tipos";
import { PredictionCard } from "./PredictionCard";

export interface PredictionListProps {
  predictions: Prediccion[];
  matches: Partido[];
}

export const PredictionList = ({
  predictions,
  matches,
}: PredictionListProps) => {
  if (predictions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No tienes predicciones todavía</p>
        <p className="text-gray-500 text-sm mt-2">
          ¡Haz tu primera predicción!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {predictions.map((prediction) => {
        const match = matches.find(
          (m) => m.id === (prediction.matchId || prediction.idPartido),
        );
        if (!match) return null;

        return (
          <PredictionCard
            key={prediction.id}
            prediction={prediction}
            match={match}
          />
        );
      })}
    </div>
  );
};
