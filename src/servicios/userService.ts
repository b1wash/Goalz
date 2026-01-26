// SERVICIO PARA GESTIONAR USUARIOS
import { api } from "./api";
import type { Usuario } from "../tipos";

// FUNCION INTERNA PARA MAPEAR DATOS DEL USUARIO (COMPATIBILIDAD)
const mapUser = (user: any): Usuario => ({
  ...user,
  nombre: user.name || user.nombre,
  puntosTotal: user.totalPoints ?? user.puntosTotal ?? 0,
});

export const userService = {
  // OBTENER TODOS LOS USUARIOS
  getAll: async (): Promise<Usuario[]> => {
    const users = await api.get<any[]>("/users");
    return users.map(mapUser);
  },

  // OBTENER USUARIOS ORDENADOS POR PUNTOS (CLASIFICACION)
  getLeaderboard: async (): Promise<Usuario[]> => {
    const users = await api.get<any[]>("/users");
    return users.map(mapUser);
  },

  // OBTENER UN USUARIO POR ID
  getById: async (id: string): Promise<Usuario> => {
    const user = await api.get<any>(`/users/${id}`);
    return mapUser(user);
  },

  // ACTUALIZAR PUNTOS Y ESTADISTICAS DE UN USUARIO
  updateStats: async (
    id: string,
    data: Partial<
      Pick<Usuario, "totalPoints" | "correctPredictions" | "totalPredictions">
    >,
  ): Promise<Usuario> => {
    const user = await api.patch<any>(`/users/${id}`, data);
    return mapUser(user);
  },
};
