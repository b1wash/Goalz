// TIPOS PARA PREDICCIONES (1=LOCAL, X=EMPATE, 2=VISITANTE)
export type TipoPrediccion = "1" | "X" | "2";

// ESTADOS DE UN PARTIDO
export type EstadoPartido = "pending" | "finished" | "pendiente" | "finalizado";

// DEFINICION DE UN USUARIO (COMPATIBLE CON DB.JSON Y CODIGO EXISTENTE)
export interface Usuario {
  id: string;
  name: string;
  nombre: string; // REQUERIDO PARA COMPATIBILIDAD
  email: string;
  totalPoints: number;
  puntosTotal: number; // REQUERIDO PARA COMPATIBILIDAD
  correctPredictions: number;
  totalPredictions: number;
}

// RESULTADO DE UN PARTIDO
export interface ResultadoPartido {
  homeGoals: number;
  awayGoals: number;
  golesLocal: number; // REQUERIDO PARA COMPATIBILIDAD
  golesVisitante: number; // REQUERIDO PARA COMPATIBILIDAD
}

// DEFINICION DE UN PARTIDO DE FUTBOL (COMPATIBLE CON DB.JSON Y CODIGO EXISTENTE)
export interface Partido {
  id: string;
  homeTeam: string;
  equipoLocal: string; // REQUERIDO PARA COMPATIBILIDAD
  awayTeam: string;
  equipoVisitante: string; // REQUERIDO PARA COMPATIBILIDAD
  date: string;
  fecha: string; // REQUERIDO PARA COMPATIBILIDAD
  matchday: number;
  status: "pending" | "finished";
  estado: "pendiente" | "finalizado"; // REQUERIDO PARA COMPATIBILIDAD
  result: ResultadoPartido | null;
  resultado: ResultadoPartido | null; // REQUERIDO PARA COMPATIBILIDAD
}

// MARCADOR EXACTO DE UNA PREDICCION
export interface MarcadorExacto {
  home: number;
  away: number;
  local: number; // REQUERIDO PARA COMPATIBILIDAD
  visitante: number; // REQUERIDO PARA COMPATIBILIDAD
}

// DEFINICION DE UNA PREDICCION (COMPATIBLE CON DB.JSON Y CODIGO EXISTENTE)
export interface Prediccion {
  id: string;
  matchId: string;
  idPartido: string; // REQUERIDO PARA COMPATIBILIDAD
  userId: string;
  idUsuario: string; // REQUERIDO PARA COMPATIBILIDAD
  prediction: TipoPrediccion;
  prediccion: TipoPrediccion; // REQUERIDO PARA COMPATIBILIDAD
  exactScore: MarcadorExacto;
  marcadorExacto: MarcadorExacto; // REQUERIDO PARA COMPATIBILIDAD
  points: number | null;
  puntosGanados: number | null; // REQUERIDO PARA COMPATIBILIDAD
  createdAt: string;
}

// DATOS PARA CREAR UNA PREDICCION (FORMULARIO)
export interface DatosFormularioPrediccion {
  matchId: string;
  prediction: TipoPrediccion;
  exactScoreHome: number;
  exactScoreAway: number;
}

// DATOS PARA CREAR UN PARTIDO (FORMULARIO ADMIN)
export interface DatosFormularioPartido {
  homeTeam: string;
  awayTeam: string;
  date: string;
  matchday: number;
}

// DATOS PARA ACTUALIZAR RESULTADO (FORMULARIO ADMIN)
export interface DatosFormularioResultado {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}
