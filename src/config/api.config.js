/**
 * Configuración de la API
 * 
 * En desarrollo, Vite expone las variables de entorno con el prefijo VITE_
 * Para producción, ajusta estas variables según tu entorno
 */

// URL base de la API - por defecto apunta a Docker en localhost:5000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Timeout para las peticiones (en milisegundos)
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000

// Configuración de CORS (si es necesario)
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
}

// Función para verificar si la API está disponible
export async function checkAPIHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId);
    return response.ok
  } catch (error) {
    console.warn('API health check failed:', error)
    return false
  }
}

