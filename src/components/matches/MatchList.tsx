// COMPONENTE: LISTADO DE PARTIDOS
// SE ENCARGA DE MOSTRAR UNA COLECCION DE PARTIDOS USANDO TARJETAS INDIVIDUALES
import type { Partido } from "../../types";
import { MatchCard } from "./MatchCard";

// INTERFAZ PARA LAS PROPIEDADES (PROPS) DEL COMPONENTE
export interface MatchListProps {
  matches: Partido[]; // ARRAY DE PARTIDOS A MOSTRAR
  showResult?: boolean; // OPCIONAL: INDICA SI SE DEBE MOSTRAR EL RESULTADO FINAL
}

export const MatchList = ({ matches, showResult = true }: MatchListProps) => {
  // CONTROL DE SEGURIDAD: SI EL ARRAY ESTA VACIO MOSTRAMOS UN MENSAJE INFORMATIVO
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-gray-400 text-lg font-bold">
          No hay partidos disponibles
        </p>
      </div>
    );
  }

  return (
    // CONTENEDOR GRID RESPONSIVO: 1 COLUMNA EN MOVIL, 2 EN TABLET Y 3 EN ESCRITORIO
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* ITERAMOS SOBRE EL ARRAY DE PARTIDOS PARA RENDERIZAR CADA TARJETA */}
      {matches.map((match) => (
        <MatchCard
          key={match.id} // IDENTIFICADOR UNICO PARA OPTIMIZACION DE REACT
          match={match}
          showResult={showResult}
        />
      ))}
    </div>
  );
};
