const API_BASE_URL = "http://localhost:5000";

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("token");

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(url, config);

    // 👇 Puede no haber body (204, PATCH, DELETE, etc.)
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text; // texto plano
      }
    }

    if (!response.ok) {
      const msg =
        (data && (data.error || data.message)) || `Error: ${response.status}`;
      throw new Error(msg);
    }

    return data; // puede ser null y está bien
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const clienteAPI = {
  listar: () => fetchAPI("/clientes"),
  obtener: (id) => fetchAPI(`/clientes/${id}`),
  crear: (data) => fetchAPI("/clientes", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/clientes/${id}`, { method: "PUT", body: data }),
  eliminar: (id) => fetchAPI(`/clientes/${id}`, { method: "DELETE" }),
  obtenerPorDni: (dni) => fetchAPI(`/clientes/dni/${dni}`),
  obtenerPorEmail: (email) => fetchAPI(`/clientes/email/${email}`),
};

export const vehiculoAPI = {
  listar: () => fetchAPI("/vehiculos"),
  obtener: (id) => fetchAPI(`/vehiculos/${id}`),
  crear: (data) => fetchAPI("/vehiculos", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/vehiculos/${id}`, { method: "PUT", body: data }),
  eliminar: (id) => fetchAPI(`/vehiculos/${id}`, { method: "DELETE" }),
  obtenerPorEstado: (estados) => fetchAPI(`/vehiculos/estado/${estados}`),
};

export const alquilerAPI = {
  listar: () => fetchAPI("/alquileres"),
  obtener: (id) => fetchAPI(`/alquileres/${id}`),
  crear: (data) => fetchAPI("/alquileres", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/alquileres/${id}`, { method: "PUT", body: data }),
  finalizar: (id) =>
    fetchAPI(`/alquileres/${id}/finalizar`, { method: "PATCH" }),
  listarPorCliente: (clienteId) => fetchAPI(`/alquileres/cliente/${clienteId}`),
  listarPorVehiculo: (vehiculoId) =>
    fetchAPI(`/alquileres/vehiculo/${vehiculoId}`),
  listarPorEstado: (estados) => fetchAPI(`/alquileres/estado/${estados}`),
  listarPorPeriodo: (desde, hasta) =>
    fetchAPI(`/alquileres/periodo?desde=${desde}&hasta=${hasta}`),
  vehiculosMasAlquilados: (desde, hasta, limit) => {
    let url = "/alquileres/vehiculos-mas-alquilados?";
    if (desde) url += `desde=${desde}&`;
    if (hasta) url += `hasta=${hasta}&`;
    if (limit) url += `limit=${limit}`;
    return fetchAPI(url);
  },
  facturacionMensual: (anio, mes) => {
    let url = `/alquileres/facturacion-mensual?anio=${anio}`;
    if (mes) url += `&mes=${mes}`;
    return fetchAPI(url);
  },
};

export const reservaAPI = {
  listar: () => fetchAPI("/reservas"),
  obtener: (id) => fetchAPI(`/reservas/${id}`),
  crear: (data) => fetchAPI("/reservas", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/reservas/${id}`, { method: "PUT", body: data }),
  cancelar: (id) => fetchAPI(`/reservas/${id}/cancelar`, { method: "PATCH" }),
  listarPorCliente: (clienteId) => fetchAPI(`/reservas/cliente/${clienteId}`),
  listarPorEstado: (estados) => fetchAPI(`/reservas/estado/${estados}`),
};

export const empleadoAPI = {
  listar: () => fetchAPI("/empleados"),
  obtener: (id) => fetchAPI(`/empleados/${id}`),
  crear: (data) => fetchAPI("/empleados", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/empleados/${id}`, { method: "PUT", body: data }),
  listarPorRol: (rol) => fetchAPI(`/empleados/rol/${rol}`),
  obtenerPorDni: (dni) => fetchAPI(`/empleados/dni/${dni}`),
  obtenerPorEmail: (email) => fetchAPI(`/empleados/email/${email}`),
};

export const marcaAPI = {
  listar: () => fetchAPI("/marcas"),
  obtener: (id) => fetchAPI(`/marcas/${id}`),
  crear: (data) => fetchAPI("/marcas", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/marcas/${id}`, { method: "PUT", body: data }),
  eliminar: (id) => fetchAPI(`/marcas/${id}`, { method: "DELETE" }),
  obtenerPorNombre: (nombre) => fetchAPI(`/marcas/nombre/${nombre}`),
};

export const modeloAPI = {
  listar: () => fetchAPI("/modelos"),
  obtener: (id) => fetchAPI(`/modelos/${id}`),
  crear: (data) => fetchAPI("/modelos", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/modelos/${id}`, { method: "PUT", body: data }),
  eliminar: (id) => fetchAPI(`/modelos/${id}`, { method: "DELETE" }),
};

export const multaAPI = {
  listar: () => fetchAPI("/multas"),
  obtener: (id) => fetchAPI(`/multas/${id}`),
  crear: (data) => fetchAPI("/multas", { method: "POST", body: data }),
  actualizar: (id, data) =>
    fetchAPI(`/multas/${id}`, { method: "PUT", body: data }),
  eliminar: (id) => fetchAPI(`/multas/${id}`, { method: "DELETE" }),
};

export const authAPI = {
  login: (data) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: data,
    }),
};
