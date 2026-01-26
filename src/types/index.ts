// TIPOS PARA PREDICCIONES (1=LOCAL, X=EMPATE, 2=VISITANTE)
export type TipoPrediccion = "1" | "X" | "2";

// ESTADOS DE UN PARTIDO
export type EstadoPartido = "pending" | "finished" | "pendiente" | "finalizado";

// DEFINICION DE UN USUARIO (COMPATIBLE CON DB.JSON Y CODIGO EXISTENTE)
export interface Usuario {
  id: string;
  name: string;
  nombre: string;
  email: string;
  totalPoints: number;
  puntosTotal: number;
  correctPredictions: number;
  totalPredictions: number;
}

// RESULTADO DE UN PARTIDO
export interface ResultadoPartido {
  homeGoals: number;
  awayGoals: number;
  golesLocal: number;
  golesVisitante: number;
}

// DEFINICION DE UN PARTIDO DE FUTBOL (COMPATIBLE CON DB.JSON Y CODIGO EXISTENTE)
export interface Partido {
  id: string;
  homeTeam: string;
  equipoLocal: string;
  awayTeam: string;
  equipoVisitante: string;
  date: string;
  fecha: string;
  matchday: number;
  status: "pending" | "finished";
  estado: "pendiente" | "finalizado";
  result: ResultadoPartido | null;
  resultado: ResultadoPartido | null;
}

// MARCADOR EXACTO DE UNA PREDICCION
export interface MarcadorExacto {
  home: number;
  away: number;
  local: number;
  visitante: number;
}

// DEFINICION DE UNA PREDICCION (COMPATIBLE CON DB.JSON Y CODIGO EXISTENTE)
export interface Prediccion {
  id: string;
  matchId: string;
  idPartido: string;
  userId: string;
  idUsuario: string;
  prediction: TipoPrediccion;
  prediccion: TipoPrediccion;
  exactScore: MarcadorExacto;
  marcadorExacto: MarcadorExacto;
  points: number | null;
  puntosGanados: number | null;
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
