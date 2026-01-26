import type { Usuario, Partido, Prediccion } from "../tipos";

// USUARIOS DE EJEMPLO
export const usuariosMock: Usuario[] = [
  {
    id: "1",
    nombre: "Biwash Shrestha",
    puntosTotal: 245,
  },
  {
    id: "2",
    nombre: "Carlos Gol",
    puntosTotal: 230,
  },
  {
    id: "3",
    nombre: "Ana Portera",
    puntosTotal: 260,
  },
  {
    id: "4",
    nombre: "Luis Delantero",
    puntosTotal: 215,
  },
  {
    id: "5",
    nombre: "María Defensa",
    puntosTotal: 200,
  },
];

// PARTIDOS DE EJEMPLO
export const partidosMock: Partido[] = [
  {
    id: "1",
    equipoLocal: "Real Madrid",
    equipoVisitante: "FC Barcelona",
    fecha: "2024-04-21T21:00:00.000Z",
    estado: "pendiente",
  },
  {
    id: "2",
    equipoLocal: "Manchester City",
    equipoVisitante: "Arsenal",
    fecha: "2024-03-31T17:30:00.000Z",
    estado: "finalizado",
    resultado: {
      golesLocal: 0,
      golesVisitante: 0,
    },
  },
  {
    id: "3",
    equipoLocal: "Atlético Madrid",
    equipoVisitante: "Girona",
    fecha: "2024-04-13T14:00:00.000Z",
    estado: "pendiente",
  },
  {
    id: "4",
    equipoLocal: "PSG",
    equipoVisitante: "Dortmund",
    fecha: "2024-05-07T21:00:00.000Z",
    estado: "pendiente",
  },
  {
    id: "5",
    equipoLocal: "Bayern Munich",
    equipoVisitante: "Real Madrid",
    fecha: "2024-05-01T21:00:00.000Z",
    estado: "finalizado",
    resultado: {
      golesLocal: 2,
      golesVisitante: 2,
    },
  },
];

// PREDICCIONES DE EJEMPLO
export const prediccionesMock: Prediccion[] = [
  {
    id: "1",
    idPartido: "2",
    idUsuario: "1",
    prediccion: "1",
    marcadorExacto: {
      local: 2,
      visitante: 1,
    },
    puntosGanados: 0,
  },
  {
    id: "2",
    idPartido: "5",
    idUsuario: "1",
    prediccion: "X",
    marcadorExacto: {
      local: 2,
      visitante: 2,
    },
    puntosGanados: 5,
  },
];
