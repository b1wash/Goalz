// SERVICIO PARA GESTIONAR PREDICCIONES
import { api } from "./api";
import type { Prediccion } from "../tipos";

// INTERFAZ PARA CREAR UNA PREDICCION (SIN ID)
export interface CrearPrediccionDTO {
  matchId: string;
  userId: string;
  prediction: "1" | "X" | "2";
  exactScore: {
    home: number;
    away: number;
  };
  points: number | null;
  createdAt: string;
}

export const predictionService = {
  // OBTENER TODAS LAS PREDICCIONES
  getAll: async (): Promise<Prediccion[]> => {
    return api.get<Prediccion[]>("/predictions");
  },

  // OBTENER PREDICCIONES DE UN USUARIO
  getByUser: async (userId: string): Promise<Prediccion[]> => {
    return api.get<Prediccion[]>(`/predictions?userId=${userId}`);
  },

  // OBTENER PREDICCIONES DE UN PARTIDO
  getByMatch: async (matchId: string): Promise<Prediccion[]> => {
    return api.get<Prediccion[]>(`/predictions?matchId=${matchId}`);
  },

  // OBTENER UNA PREDICCION POR ID
  getById: async (id: string): Promise<Prediccion> => {
    return api.get<Prediccion>(`/predictions/${id}`);
  },

  // CREAR UNA NUEVA PREDICCION
  create: async (prediccion: CrearPrediccionDTO): Promise<Prediccion> => {
    return api.post<Prediccion>("/predictions", prediccion);
  },

  // ACTUALIZAR PUNTOS DE UNA PREDICCION
  updatePoints: async (id: string, points: number): Promise<Prediccion> => {
    return api.patch<Prediccion>(`/predictions/${id}`, { points });
  },

  // ELIMINAR UNA PREDICCION
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/predictions/${id}`);
  },
};
