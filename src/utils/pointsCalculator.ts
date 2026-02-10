// UTILIDADES PARA EL CALCULO DE PUNTOS
import type { TipoPrediccion } from "../types";

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
  // 4. 0 PUNTOS SI NO ACIERTA
  return 0;
};
