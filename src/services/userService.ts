// SERVICIO PARA GESTIONAR LOS DATOS DE LOS USUARIOS Y EL RANKING
import { api } from "./api";
import type { Usuario } from "../types";

// FUNCION INTERNA PARA NORMALIZAR LOS DATOS DEL USUARIO ENTRE DIFERENTES VERSIONES DE LA API
const mapUser = (user: Usuario): Usuario => ({
  ...user,
  nombre: user.name || user.nombre,
  puntosTotal: user.totalPoints ?? user.puntosTotal ?? 0,
});

export const userService = {
  // OBTENER EL LISTADO COMPLETO DE USUARIOS REGISTRADOS
  getAll: async (): Promise<Usuario[]> => {
    const users = await api.get<Usuario[]>("/users");
    return users.map(mapUser);
  },

  // OBTENER LA LISTA DE USUARIOS PREPARADA PARA LA VISTA DE CLASIFICACION
  getLeaderboard: async (): Promise<Usuario[]> => {
    const users = await api.get<Usuario[]>("/users");
    return users.map(mapUser);
  },

  // OBTENER EL PERFIL DETALLADO DE UN USUARIO POR SU ID
  getById: async (id: string): Promise<Usuario> => {
    const user = await api.get<Usuario>(`/users/${id}`);
    return mapUser(user);
  },

  // ACTUALIZAR LAS ESTADISTICAS GLOBALES (PUNTOS, ACIERTOS) DE UN USUARIO
  updateStats: async (
    id: string,
    data: Partial<
      Pick<Usuario, "totalPoints" | "correctPredictions" | "totalPredictions">
    >,
  ): Promise<Usuario> => {
    const user = await api.patch<Usuario>(`/users/${id}`, data);
    return mapUser(user);
  },

  // CREAR UN NUEVO USUARIO (REGISTRO)
  create: async (data: Omit<Usuario, "id">): Promise<Usuario> => {
    const user = await api.post<Usuario>("/users", data);
    return mapUser(user);
  },

  // ELIMINAR UN USUARIO POR SU ID
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
