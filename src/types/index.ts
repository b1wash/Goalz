// DEFINICIONES DE TIPOS TYPESCRIPT PARA TODA LA APLICACION

// TIPO: RESULTADO DE UNA PREDICCION (1X2)
// "1" = VICTORIA LOCAL, "X" = EMPATE, "2" = VICTORIA VISITANTE
export type TipoPrediccion = "1" | "X" | "2";

// TIPO: ESTADOS POSIBLES DE UN PARTIDO
export type EstadoPartido = "pending" | "finished" | "pendiente" | "finalizado";

// INTERFAZ: USUARIO DEL SISTEMA
// COMPATIBLE CON db.json Y DIFERENTES VERSIONES DE LA API
export interface Usuario {
  id: string;
  name: string;
  nombre: string;
  email: string;
  password: string;
  role: "admin" | "user";
  totalPoints: number;
  puntosTotal: number;
  correctPredictions: number;
  totalPredictions: number;
}

// INTERFAZ: RESULTADO FINAL DE UN PARTIDO
// ALMACENA LOS GOLES DE AMBOS EQUIPOS
export interface ResultadoPartido {
  homeGoals: number;
  awayGoals: number;
  golesLocal: number;
  golesVisitante: number;
}

// INTERFAZ: PARTIDO DE FUTBOL
// CONTIENE TODA LA INFORMACION DE UN PARTIDO
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
  homeLogo?: string;
  awayLogo?: string;
}

// INTERFAZ: MARCADOR EXACTO DE UNA PREDICCION
// GUARDA LOS GOLES QUE EL USUARIO PREDICE PARA CADA EQUIPO
export interface MarcadorExacto {
  home: number;
  away: number;
  local: number;
  visitante: number;
}

// INTERFAZ: PREDICCION DE UN USUARIO
// RELACIONA: UN USUARIO, UN PARTIDO Y SU PRONOSTICO
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

// INTERFAZ: DATOS DE FORMULARIO PARA CREAR PREDICCION
// SE USA EN EL COMPONENTE DE "HACER PREDICCION"
export interface DatosFormularioPrediccion {
  matchId: string;
  prediction: TipoPrediccion;
  exactScoreHome: number;
  exactScoreAway: number;
}

// INTERFAZ: DATOS DE FORMULARIO PARA CREAR PARTIDO
// SE USA EN EL PANEL DE ADMINISTRADOR
export interface DatosFormularioPartido {
  homeTeam: string;
  awayTeam: string;
  date: string;
  matchday: number;
  homeLogo?: string;
  awayLogo?: string;
}

// INTERFAZ: DATOS DE FORMULARIO PARA ACTUALIZAR RESULTADO
// SE USA CUANDO EL ADMIN INGRESA EL RESULTADO FINAL
export interface DatosFormularioResultado {
  matchId: string;
  homeGoals: number;
  awayGoals: number;
}
