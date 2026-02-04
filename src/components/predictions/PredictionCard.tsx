// COMPONENTE: TARJETA DE PREDICCION
// ESTE COMPONENTE MUESTRA UNA TARJETA INDIVIDUAL CON LA PREDICCION DE UN USUARIO
// INCLUYE: PARTIDO, PREDICCION DEL USUARIO, RESULTADO REAL Y PUNTOS OBTENIDOS

import type { Prediccion, Partido } from "../../types";
import { Badge } from "../ui";

// INTERFAZ QUE DEFINE LAS PROPS QUE RECIBE EL COMPONENTE
export interface PredictionCardProps {
  prediction: Prediccion; // OBJETO CON LA PREDICCION DEL USUARIO
  match: Partido; // OBJETO CON LA INFORMACION DEL PARTIDO
}

export const PredictionCard = ({ prediction, match }: PredictionCardProps) => {
  // FUNCION: CONVERTIR CODIGO DE PREDICCION A TEXTO LEGIBLE
  // TRANSFORMA "1", "X", "2" EN TEXTO CON EMOJI PARA MEJOR UX
  // EJEMPLO: "1" -> Local", "X" -> "Empate", "2" -> Visitante"
  const getResultText = (pred: "1" | "X" | "2") => {
    if (pred === "1") return "🏠 Local";
    if (pred === "X") return "🤝 Empate";
    return "✈️ Visitante";
  };

  // FUNCION: DETERMINAR COLOR DEL BADGE SEGUN PUNTOS
  // ASIGNA UN VARIANT (COLOR) AL BADGE DEPENDIENDO DE LOS PUNTOS OBTENIDOS:
  // - NULL (PENDIENTE) -> WARNING (AMARILLO)
  // - 5 PUNTOS (MARCADOR EXACTO) -> SUCCESS (VERDE)
  // - 3 PUNTOS (RESULTADO CORRECTO) -> INFO (AZUL)
  // - 0 PUNTOS (FALLO) -> DANGER (ROJO)
  const getPointsVariant = (points: number | null) => {
    if (points === null) return "warning"; // PARTIDO PENDIENTE
    if (points === 5) return "success"; // MARCADOR EXACTO ACERTADO
    if (points === 3) return "info"; // RESULTADO 1X2 ACERTADO
    return "danger"; // PREDICCION FALLADA
  };

  return (
    // CONTENEDOR PRINCIPAL DE LA TARJETA
    // DISEÑO RESPONSIVE CON DARK MODE, BORDES, SOMBRAS Y HOVER EFFECTS
    <div className="bg-white dark:bg-dark-card/50 backdrop-blur-sm border-2 border-slate-200 dark:border-primary/20 rounded-xl p-5 hover:border-primary dark:hover:border-primary/40 transition-all duration-150 shadow-md">
      {/* SECCION 1: INFORMACION DEL PARTIDO */}
      {/* MUESTRA LOS DOS EQUIPOS QUE SE ENFRENTAN EN FORMATO: EQUIPO1 vs EQUIPO2 */}
      {/* USA GRID DE 3 COLUMNAS PARA ALINEAR: LOCAL - VS - VISITANTE */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3 items-center text-base">
          {/* EQUIPO LOCAL - ALINEADO A LA DERECHA */}
          <p className="text-right font-black text-slate-900 dark:text-white text-base">
            {/* OPERADOR || PARA COMPATIBILIDAD CON DIFERENTES FORMATOS DE API */}
            {match.homeTeam || match.equipoLocal}
          </p>

          {/* SEPARADOR "VS" - CENTRADO Y DESTACADO */}
          {/* UPPERCASE Y TRACKING-WIDER PARA MEJOR LEGIBILIDAD */}
          <p className="text-center font-bold text-slate-500 dark:text-gray-300 text-sm uppercase tracking-wider">
            vs
          </p>

          {/* EQUIPO VISITANTE - ALINEADO A LA IZQUIERDA */}
          <p className="text-left font-black text-slate-900 dark:text-white text-base">
            {match.awayTeam || match.equipoVisitante}
          </p>
        </div>
      </div>

      {/* SECCION 2: PREDICCION DEL USUARIO */}
      {/* MUESTRA LA PREDICCION QUE HIZO EL USUARIO: RESULTADO (1X2) Y MARCADOR EXACTO */}

      <div className="mb-4 p-4 bg-slate-100 dark:bg-dark-bg/50 rounded-lg border border-slate-200 dark:border-primary/10">
        {/* ETIQUETA DESCRIPTIVA */}
        <p className="text-xs font-bold text-slate-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
          Tu predicción:
        </p>

        {/* CONTENEDOR FLEX PARA ALINEAR: RESULTADO A LA IZQUIERDA, MARCADOR A LA DERECHA */}
        <div className="flex items-center justify-between">
          {/* RESULTADO PREDICHO (1X2) CON COLOR PRIMARY */}
          <span className="font-black text-primary text-base">
            {/* LLAMA A LA FUNCION getResultText PARA CONVERTIR EL CODIGO A TEXTO */}
            {/* USA OPERADOR || PARA COMPATIBILIDAD CON DIFERENTES FORMATOS */}
            {getResultText(
              prediction.prediction || prediction.prediccion || "1",
            )}
          </span>

          {/* MARCADOR EXACTO PREDICHO - TAMAÑO GRANDE (3XL) PARA DESTACAR */}
          <span className="text-3xl font-black text-slate-900 dark:text-white">
            {/* OPERADOR ?? (NULLISH COALESCING) PARA OBTENER EL VALOR CORRECTO */}
            {/* INTENTA: exactScore.home, LUEGO marcadorExacto.home, FINALMENTE 0 */}
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

      {/* SECCION 3: RESULTADO REAL Y PUNTOS */}
      {/* MUESTRA EL RESULTADO FINAL DEL PARTIDO (SI YA SE JUGO) Y LOS PUNTOS GANADOS */}
      <div className="flex items-center justify-between">
        {/* RENDERIZADO CONDICIONAL: SOLO MUESTRA SI EL PARTIDO TIENE RESULTADO */}
        {/* USA && (OPERADOR AND) PARA VERIFICAR SI match.result EXISTE */}
        {match.result && (
          <div className="text-sm">
            {/* ETIQUETA "RESULTADO:" */}
            <p className="text-slate-600 dark:text-gray-300 mb-1 font-bold text-xs uppercase tracking-wide">
              Resultado:
            </p>

            {/* MARCADOR FINAL DEL PARTIDO */}
            <p className="font-black text-slate-900 dark:text-white text-lg">
              {match.result.homeGoals} - {match.result.awayGoals}
            </p>
          </div>
        )}

        {/* BADGE DE PUNTOS CON COLOR DINAMICO */}
        {/* MUESTRA "PENDIENTE" SI EL PARTIDO NO SE HA JUGADO */}
        {/* O LOS PUNTOS OBTENIDOS SI YA TIENE RESULTADO */}
        <Badge
          text={
            // OPERADOR TERNARIO PARA DECIDIR QUE TEXTO MOSTRAR
            prediction.points === null
              ? "Pendiente" // SI NO HAY PUNTOS AUN
              : `${prediction.points} pts` // SI YA HAY PUNTOS ASIGNADOS
          }
          variant={getPointsVariant(
            // OPERADOR ?? PARA COMPATIBILIDAD CON DIFERENTES FORMATOS
            prediction.points ?? prediction.puntosGanados ?? null,
          )}
        />
      </div>
    </div>
  );
};
