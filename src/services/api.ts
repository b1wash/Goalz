// CONFIGURACION BASE DE LA API
// FUNCIONES GENERICAS PARA HACER PETICIONES HTTP
// USO DE FETCH API
// VARIABLE DE ENTORNO: URL BASE DE LA API
// SI NO ESTA DEFINIDA EN .env, USA LOCALHOST:3001 POR DEFECTO
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// OBJETO API: CONTIENE METODOS PARA TODAS LAS OPERACIONES HTTP
export const api = {
  // METODO GET: OBTENER DATOS DEL SERVIDOR
  get: async <T>(endpoint: string): Promise<T> => {
    // 1. HACER PETICION HTTP GET
    const response = await fetch(`${API_URL}${endpoint}`);

    // 2. VERIFICAR SI LA RESPUESTA FUE EXITOSA (STATUS 200-299)
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // 3. CONVERTIR LA RESPUESTA JSON A OBJETO JAVASCRIPT
    return response.json();
  },

  // METODO POST: CREAR NUEVOS DATOS EN EL SERVIDOR
  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    // 1. HACER PETICION HTTP POST CON CONFIGURACION
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // CONVERTIR OBJETO A STRING JSON
    });

    // 2. VERIFICAR SI LA CREACION FUE EXITOSA
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // 3. RETORNAR EL OBJETO CREADO
    return response.json();
  },

  // METODO PATCH: ACTUALIZAR PARCIALMENTE DATOS EXISTENTES
  patch: async <T>(endpoint: string, data: unknown): Promise<T> => {
    // 1. HACER PETICION HTTP PATCH
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // 2. VERIFICAR RESPUESTA
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // 3. RETORNAR OBJETO ACTUALIZADO
    return response.json();
  },

  // METODO DELETE: ELIMINAR DATOS DEL SERVIDOR
  delete: async <T>(endpoint: string): Promise<T> => {
    // 1. HACER PETICION HTTP DELETE
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
    });

    // 2. VERIFICAR SI LA ELIMINACION FUE EXITOSA
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // 3. RETORNAR RESPUESTA (JSON SERVER DEVUELVE OBJETO VACIO {})
    return response.json();
  },
};
