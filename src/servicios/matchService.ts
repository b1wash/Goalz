// SERVICIO PARA GESTIONAR PARTIDOS
import { api } from "./api";
import type { Partido } from "../tipos";

// INTERFAZ PARA CREAR UN PARTIDO (SIN ID)
export interface CrearPartidoDTO {
  homeTeam: string;
  awayTeam: string;
  date: string;
  matchday: number;
  status: "pending" | "finished";
  result: { homeGoals: number; awayGoals: number } | null;
}

// INTERFAZ PARA ACTUALIZAR RESULTADO
export interface ActualizarResultadoDTO {
  result: {
    homeGoals: number;
    awayGoals: number;
  };
  status: "finished";
}

export const matchService = {
  // OBTENER TODOS LOS PARTIDOS
  getAll: async (): Promise<Partido[]> => {
    return api.get<Partido[]>("/matches");
  },

  // OBTENER SOLO PARTIDOS PENDIENTES
  getUpcoming: async (): Promise<Partido[]> => {
    return api.get<Partido[]>("/matches?status=pending");
  },

  // OBTENER SOLO PARTIDOS FINALIZADOS
  getFinished: async (): Promise<Partido[]> => {
    return api.get<Partido[]>("/matches?status=finished");
  },

  // OBTENER UN PARTIDO POR ID
  getById: async (id: string): Promise<Partido> => {
    return api.get<Partido>(`/matches/${id}`);
  },

  // CREAR UN NUEVO PARTIDO
  create: async (partido: CrearPartidoDTO): Promise<Partido> => {
    return api.post<Partido>("/matches", partido);
  },

  // ACTUALIZAR RESULTADO DE UN PARTIDO
  updateResult: async (
    id: string,
    data: ActualizarResultadoDTO,
  ): Promise<Partido> => {
    return api.patch<Partido>(`/matches/${id}`, data);
  },

  // ELIMINAR UN PARTIDO
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/matches/${id}`);
  },
};
