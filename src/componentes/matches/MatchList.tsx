// COMPONENTE PARA MOSTRAR UNA LISTA DE PARTIDOS
import type { Partido } from "../../tipos";
import { MatchCard } from "./MatchCard";

export interface MatchListProps {
  matches: Partido[];
  showResult?: boolean;
}

export const MatchList = ({ matches, showResult = true }: MatchListProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No hay partidos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} showResult={showResult} />
      ))}
    </div>
  );
};
