// CONFIGURACION BASE DE LA API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// FUNCIONES GENERICAS PARA HACER PETICIONES HTTP
export const api = {
  // OBTENER DATOS (GET)
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // CREAR DATOS (POST)
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // ACTUALIZAR DATOS PARCIALMENTE (PATCH)
  patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  // ELIMINAR DATOS (DELETE)
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },
};
