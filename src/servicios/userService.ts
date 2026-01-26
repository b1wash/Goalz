// SERVICIO PARA GESTIONAR USUARIOS
import { api } from "./api";
import type { Usuario } from "../tipos";

export const userService = {
  // OBTENER TODOS LOS USUARIOS
  getAll: async (): Promise<Usuario[]> => {
    return api.get<Usuario[]>("/users");
  },

  // OBTENER USUARIOS ORDENADOS POR PUNTOS (CLASIFICACION)
  getLeaderboard: async (): Promise<Usuario[]> => {
    const users = await api.get<Usuario[]>(
      "/users?_sort=totalPoints&_order=desc",
    );
    return users;
  },

  // OBTENER UN USUARIO POR ID
  getById: async (id: string): Promise<Usuario> => {
    return api.get<Usuario>(`/users/${id}`);
  },

  // ACTUALIZAR PUNTOS Y ESTADISTICAS DE UN USUARIO
  updateStats: async (
    id: string,
    data: Partial<
      Pick<Usuario, "totalPoints" | "correctPredictions" | "totalPredictions">
    >,
  ): Promise<Usuario> => {
    return api.patch<Usuario>(`/users/${id}`, data);
  },
};
