// COMPONENTE PARA MOSTRAR UNA TARJETA DE PREDICCION
import type { Prediccion, Partido } from "../../types";
import { Badge } from "../ui";

export interface PredictionCardProps {
  prediction: Prediccion;
  match: Partido;
}

export const PredictionCard = ({ prediction, match }: PredictionCardProps) => {
  const getResultText = (pred: "1" | "X" | "2") => {
    if (pred === "1") return "🏠 Local";
    if (pred === "X") return "🤝 Empate";
    return "✈️ Visitante";
  };

  const getPointsVariant = (points: number | null) => {
    if (points === null) return "warning";
    if (points === 5) return "success";
    if (points === 3) return "info";
    return "danger";
  };

  return (
    <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all">
      {/* PARTIDO */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-2 items-center text-sm">
          <p className="text-right font-bold text-white">
            {match.homeTeam || match.equipoLocal}
          </p>
          <p className="text-center text-gray-400">vs</p>
          <p className="text-left font-bold text-white">
            {match.awayTeam || match.equipoVisitante}
          </p>
        </div>
      </div>

      {/* TU PREDICCION */}
      <div className="mb-4 p-3 bg-dark-bg/50 rounded-lg">
        <p className="text-xs text-gray-400 mb-1">Tu predicción:</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">
            {getResultText(
              prediction.prediction || prediction.prediccion || "1",
            )}
          </span>
          <span className="text-2xl font-black text-white">
            {prediction.exactScore?.home ??
              prediction.marcadorExacto?.home ??
              0}{" "}
            -{" "}
            {prediction.exactScore?.away ??
              prediction.marcadorExacto?.away ??
              0}
          </span>
        </div>
      </div>

      {/* RESULTADO Y PUNTOS */}
      <div className="flex items-center justify-between">
        {match.result && (
          <div className="text-sm">
            <p className="text-gray-400 mb-1">Resultado:</p>
            <p className="font-bold text-white">
              {match.result.homeGoals} - {match.result.awayGoals}
            </p>
          </div>
        )}

        <Badge
          text={
            prediction.points === null
              ? "Pendiente"
              : `${prediction.points} pts`
          }
          variant={getPointsVariant(
            prediction.points ?? prediction.puntosGanados ?? null,
          )}
        />
      </div>
    </div>
  );
};
