// SERVICIO PARA GESTIONAR LAS PREDICCIONES DE LOS USUARIOS
import { api } from "./api";
import type { Prediccion } from "../types";

// INTERFAZ PARA REGISTRAR UNA NUEVA PREDICCION EN EL SISTEMA
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
  // OBTENER EL LISTADO HISTORICO DE TODAS LAS PREDICCIONES DEL SISTEMA
  getAll: async (): Promise<Prediccion[]> => {
    return api.get<Prediccion[]>("/predictions");
  },

  // FILTRAR Y OBTENER LAS PREDICCIONES REALIZADAS POR UN USUARIO ESPECIFICO
  getByUser: async (userId: string): Promise<Prediccion[]> => {
    return api.get<Prediccion[]>(`/predictions?userId=${userId}`);
  },

  // OBTENER TODAS LAS PREDICCIONES ASOCIADAS A UN PARTIDO CONCRETO
  getByMatch: async (matchId: string): Promise<Prediccion[]> => {
    return api.get<Prediccion[]>(`/predictions?matchId=${matchId}`);
  },

  // OBTENER LOS DETALLES DE UNA PREDICCION MEDIANTE SU ID
  getById: async (id: string): Promise<Prediccion> => {
    return api.get<Prediccion>(`/predictions/${id}`);
  },

  // CREAR Y GUARDAR UNA NUEVA PREDICCION EN LA BASE DE DATOS
  create: async (prediccion: CrearPrediccionDTO): Promise<Prediccion> => {
    return api.post<Prediccion>("/predictions", prediccion);
  },

  // ASIGNAR O ACTUALIZAR LOS PUNTOS OBTENIDOS POR UNA PREDICCION YA EVALUADA
  updatePoints: async (id: string, points: number): Promise<Prediccion> => {
    return api.patch<Prediccion>(`/predictions/${id}`, { points });
  },

  // ELIMINAR UNA PREDICCION DEL REGISTRO
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/predictions/${id}`);
  },
};
