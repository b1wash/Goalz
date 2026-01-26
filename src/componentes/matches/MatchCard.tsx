// COMPONENTE PARA MOSTRAR UNA TARJETA DE PARTIDO
import type { Partido } from "../../tipos";
import { Badge } from "../ui";

export interface MatchCardProps {
  match: Partido;
  showResult?: boolean;
}

export const MatchCard = ({ match, showResult = true }: MatchCardProps) => {
  return (
    <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all">
      <div className="flex flex-col gap-4">
        {/* FECHA Y JORNADA */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Jornada {match.matchday}</span>
          <span>{new Date(match.date).toLocaleDateString("es-ES")}</span>
        </div>

        {/* EQUIPOS Y RESULTADO */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="text-right">
            <p className="font-bold text-white text-lg">
              {match.homeTeam || match.equipoLocal}
            </p>
          </div>

          <div className="text-center">
            {showResult && match.result ? (
              <div className="text-2xl font-black text-primary">
                {match.result.homeGoals} - {match.result.awayGoals}
              </div>
            ) : (
              <span className="text-gray-400 font-bold">VS</span>
            )}
          </div>

          <div className="text-left">
            <p className="font-bold text-white text-lg">
              {match.awayTeam || match.equipoVisitante}
            </p>
          </div>
        </div>

        {/* ESTADO */}
        <div className="flex justify-center">
          <Badge
            text={
              match.status === "finished" || match.estado === "finalizado"
                ? "Finalizado"
                : "Pendiente"
            }
            variant={
              match.status === "finished" || match.estado === "finalizado"
                ? "success"
                : "warning"
            }
          />
        </div>
      </div>
    </div>
  );
};
