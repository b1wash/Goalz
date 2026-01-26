// UTILIDADES PARA EL CALCULO DE PUNTOS
import type { TipoPrediccion } from "../types";

/**
 * Calcula los puntos ganados por una predicción basada en el resultado real.
 * @param pred - La predicción del usuario (1, X, 2)
 * @param userScore - El marcador exacto predicho por el usuario
 * @param realScore - El marcador real del partido
 * @returns Los puntos ganados (5, 3 o 0)
 */
export const calcularPuntosGanados = (
  pred: TipoPrediccion,
  userScore: { home: number; away: number },
  realScore: { homeGoals: number; awayGoals: number },
): number => {
  // 1. DETERMINAR EL RESULTADO REAL (1, X, 2)
  let resultadoReal: TipoPrediccion;
  if (realScore.homeGoals > realScore.awayGoals) resultadoReal = "1";
  else if (realScore.homeGoals < realScore.awayGoals) resultadoReal = "2";
  else resultadoReal = "X";

  // 2. VERIFICAR SI ACERTO EL MARCADOR EXACTO (5 PUNTOS)
  if (
    userScore.home === realScore.homeGoals &&
    userScore.away === realScore.awayGoals
  ) {
    return 5;
  }

  // 3. VERIFICAR SI ACERTO EL RESULTADO (3 PUNTOS)
  if (pred === resultadoReal) {
    return 3;
  }

  // 4. NO ACERTO NADA (0 PUNTOS)
  return 0;
};
