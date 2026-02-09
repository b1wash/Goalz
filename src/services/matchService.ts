// SERVICIO PARA GESTIONAR LA ENTIDAD DE PARTIDOS (MATCHES)
import { api } from "./api";
import type { Partido } from "../types";
// import { partidosMock } from "../utils/mockData";

// INTERFAZ PARA LA CREACION DE UN NUEVO PARTIDO EN EL SISTEMA
export interface CrearPartidoDTO {
  homeTeam: string;
  awayTeam: string;
  date: string;
  matchday: number;
  status: "pending" | "finished";
  result: { homeGoals: number; awayGoals: number } | null;
  homeLogo?: string;
  awayLogo?: string;
}

// INTERFAZ PARA REGISTRAR EL MARCADOR FINAL DE UN ENCUENTRO
export interface ActualizarResultadoDTO {
  result: {
    homeGoals: number;
    awayGoals: number;
  };
  status: "finished";
}

export const matchService = {
  // OBTENER EL LISTADO COMPLETO DE PARTIDOS REGISTRADOS
  getAll: async (): Promise<Partido[]> => {
    return api.get<Partido[]>("/matches");
    //DEVUELVE LOS DATOS DE EJEMPLO
    //return Promise.resolve(partidosMock);
  },

  // FILTRAR Y OBTENER UNICAMENTE LOS PARTIDOS QUE AUN NO HAN COMENZADO
  getUpcoming: async (): Promise<Partido[]> => {
    return api.get<Partido[]>("/matches?status=pending");
  },

  // FILTRAR Y OBTENER LOS PARTIDOS QUE YA HAN FINALIZADO
  getFinished: async (): Promise<Partido[]> => {
    return api.get<Partido[]>("/matches?status=finished");
  },

  // OBTENER LA FICHA DETALLADA DE UN PARTIDO POR SU IDENTIFICADOR UNICO
  getById: async (id: string): Promise<Partido> => {
    return api.get<Partido>(`/matches/${id}`);
  },

  // REGISTRAR UN NUEVO PARTIDO EN LA BASE DE DATOS
  create: async (partido: CrearPartidoDTO): Promise<Partido> => {
    return api.post<Partido>("/matches", partido);
  },

  // ACTUALIZAR EL MARCADOR Y EL ESTADO DE UN PARTIDO EXISTENTE
  updateResult: async (
    id: string,
    data: ActualizarResultadoDTO,
  ): Promise<Partido> => {
    // SINCRONIZACION AUTOMATICA
    const updatePayload = {
      ...data,
      estado: data.status === "finished" ? "finalizado" : "pendiente",
      resultado: data.result,
    };
    return api.patch<Partido>(`/matches/${id}`, updatePayload);
  },
  // ELIMINAR UN REGISTRO DE PARTIDO DEL SISTEMA
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/matches/${id}`);
  },
};
