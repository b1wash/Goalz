// COMPONENTE PARA MOSTRAR UNA TARJETA DE PARTIDO
import type { Partido } from "../../types";
import { Badge } from "../ui";

export interface MatchCardProps {
  match: Partido;
  showResult?: boolean;
}

export const MatchCard = ({ match, showResult = true }: MatchCardProps) => {
  // Formatear fecha y hora
  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("es-ES", opciones);
  };

  const formatearHora = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm border-2 border-slate-200 dark:border-primary/20 rounded-2xl p-4 hover:border-primary dark:hover:border-primary/40 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col gap-3">
        {/* FECHA Y JORNADA */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-wider">
            Jornada {match.matchday}
          </span>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-700 dark:text-gray-300">
              {formatearFecha(match.date)}
            </div>
            <div className="text-xs font-black text-primary mt-0.5">
              🕐 {formatearHora(match.date)}
            </div>
          </div>
        </div>

        {/* EQUIPOS Y RESULTADO */}
        <div className="grid grid-cols-3 gap-4 items-center py-4">
          <div className="text-right">
            <p className="font-black text-slate-900 dark:text-white text-lg lg:text-xl">
              {match.homeTeam || match.equipoLocal}
            </p>
          </div>

          <div className="text-center">
            {showResult && match.result ? (
              <div className="text-3xl font-black text-primary bg-primary/10 rounded-xl py-2">
                {match.result.homeGoals} - {match.result.awayGoals}
              </div>
            ) : (
              <span className="text-slate-400 dark:text-gray-400 font-black text-xl">
                VS
              </span>
            )}
          </div>

          <div className="text-left">
            <p className="font-black text-slate-900 dark:text-white text-lg lg:text-xl">
              {match.awayTeam || match.equipoVisitante}
            </p>
          </div>
        </div>

        {/* ESTADO */}
        <div className="flex justify-center mt-2">
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
