// UTILIDADES PARA VALIDACIONES DE FORMULARIOS Y LOGICA DE NEGOCIO
import type { TipoPrediccion } from "../types";

/**
 * VALIDA SI UN MARCADOR ES COHERENTE CON LA PREDICCIÓN ELEGIDA (1, X, 2)
 */
export const validarCoherenciaMarcador = (
  prediccion: TipoPrediccion,
  golesLocal: number,
  golesVisitante: number,
): { esValido: boolean; mensaje: string } => {
  if (golesLocal > golesVisitante && prediccion !== "1") {
    return {
      esValido: false,
      mensaje:
        "El marcador no coincide con tu predicción (debería ser Victoria Local)",
    };
  }
  if (golesLocal < golesVisitante && prediccion !== "2") {
    return {
      esValido: false,
      mensaje:
        "El marcador no coincide con tu predicción (debería ser Victoria Visitante)",
    };
  }
  if (golesLocal === golesVisitante && prediccion !== "X") {
    return {
      esValido: false,
      mensaje: "El marcador no coincide con tu predicción (debería ser Empate)",
    };
  }

  return { esValido: true, mensaje: "" };
};

/**
 * VALIDA LOS DATOS BASICOS REQUERIDOS PARA LA CREACION DE UN PARTIDO
 */
export const validarDatosPartido = (
  homeTeam: string,
  awayTeam: string,
  date: string,
  matchday: number,
): { esValido: boolean; mensaje: string } => {
  if (!homeTeam || !awayTeam) {
    return {
      esValido: false,
      mensaje: "Los nombres de los equipos son obligatorios",
    };
  }
  if (homeTeam === awayTeam) {
    return { esValido: false, mensaje: "Los equipos deben ser diferentes" };
  }
  if (!date) {
    return { esValido: false, mensaje: "La fecha es obligatoria" };
  }
  if (matchday <= 0) {
    return { esValido: false, mensaje: "La jornada debe ser mayor a 0" };
  }

  return { esValido: true, mensaje: "" };
};

/**
 * VALIDA SI LOS GOLES ESTAN EN UN RANGO LOGICO Y REALISTA (0-20)
 */
export const validarGoles = (
  golesHome: number,
  golesAway: number,
): { esValido: boolean; mensaje: string } => {
  if (golesHome < 0 || golesAway < 0) {
    return { esValido: false, mensaje: "Los goles no pueden ser negativos" };
  }
  if (golesHome > 20 || golesAway > 20) {
    return { esValido: false, mensaje: "Los goles no pueden ser mayores a 20" };
  }
  return { esValido: true, mensaje: "" };
};
