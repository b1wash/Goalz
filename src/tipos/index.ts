// DEFINICION DE UN USUARIO
export interface Usuario {
  id: string;
  nombre: string;
  puntosTotal: number;
  avatar?: string;
}

// DEFINICION DE UN PARTIDO DE FUTBOL
export interface Partido {
  id: string;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  estado: "pendiente" | "finalizado";
  resultado?: {
    golesLocal: number;
    golesVisitante: number;
  };
}

// DEFINICION DE UNA PREDICCION
export interface Prediccion {
  id: string;
  idPartido: string;
  idUsuario: string;
  prediccion: "1" | "X" | "2";
  marcadorExacto: {
    local: number;
    visitante: number;
  };
  puntosGanados?: number;
}

// ESTADISTICAS DE UN USUARIO PARA LA CLASIFICACION
export interface EstadisticasUsuario extends Usuario {
  prediccionesCorrectas: number;
  prediccionesTotales: number;
  porcentajeAcierto: number;
}
