import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { reservaAPI, clienteAPI, vehiculoAPI } from "../services/api";
import { formatearFechaLegible } from "../utils/dateFormatter";
import "../components/Table.css";
import "../components/Form.css";

function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_vehiculo: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  useEffect(() => {
    cargarReservas();
    cargarClientes();
    cargarVehiculos();
  }, []);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      const data = await reservaAPI.listar();
      setReservas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const data = await clienteAPI.listar();
      setClientes(data);
    } catch (err) {
      console.error("Error cargando clientes:", err);
    }
  };

  const cargarVehiculos = async () => {
    try {
      const data = await vehiculoAPI.listar();
      setVehiculos(data);
    } catch (err) {
      console.error("Error cargando vehículos:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = {
        id_cliente: parseInt(formData.id_cliente, 10),
        id_vehiculo: parseInt(formData.id_vehiculo, 10),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
      };

      if (editingId) {
        await reservaAPI.actualizar(editingId, data);
      } else {
        await reservaAPI.crear(data);
      }

      await cargarReservas();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (reserva) => {
    setEditingId(reserva.id);

    // Cortamos a YYYY-MM-DD por si vienen con hora desde el backend
    const fechaInicio =
      (reserva.fecha_inicio && reserva.fecha_inicio.slice(0, 10)) || "";
    const fechaFin =
      (reserva.fecha_fin && reserva.fecha_fin.slice(0, 10)) || "";

    setFormData({
      id_cliente: reserva.cliente?.id || "",
      id_vehiculo: reserva.vehiculo?.id || "",
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
    });

    setShowForm(true);
  };

  const handleCancelar = async (id) => {
    if (!window.confirm("¿Está seguro de cancelar esta reserva?")) return;

    try {
      await reservaAPI.cancelar(id);
      await cargarReservas();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_cliente: "",
      id_vehiculo: "",
      fecha_inicio: "",
      fecha_fin: "",
    });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="loading">Cargando reservas...</div>;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2>Reservas</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              // cerrar y limpiar
              resetForm();
              setShowForm(false);
            } else {
              // abrir en modo "nueva reserva"
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancelar" : "+ Nueva Reserva"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <h3>{editingId ? "Editar Reserva" : "Nueva Reserva"}</h3>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Cliente <span className="required-asterisk">*</span>
              </label>
              <select
                value={formData.id_cliente}
                onChange={(e) =>
                  setFormData({ ...formData, id_cliente: e.target.value })
                }
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido} - DNI: {cliente.dni}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Vehículo <span className="required-asterisk">*</span>
              </label>
              <select
                value={formData.id_vehiculo}
                onChange={(e) =>
                  setFormData({ ...formData, id_vehiculo: e.target.value })
                }
                required
              >
                <option value="">Seleccione un vehículo</option>
                {vehiculos.map((vehiculo) => (
                  <option key={vehiculo.id} value={vehiculo.id}>
                    {vehiculo.patente} - {vehiculo.modelo?.marca?.nombre}{" "}
                    {vehiculo.modelo?.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  Fecha Inicio <span className="required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_inicio: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  Fecha Fin <span className="required-asterisk">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fecha_fin: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      <div className="table-container">
        {reservas.length === 0 ? (
          <div className="empty-state">
            <p>No hay reservas registradas</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha Reserva</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>
                    {reserva.cliente?.nombre} {reserva.cliente?.apellido}
                  </td>
                  <td>{reserva.vehiculo?.patente}</td>
                  <td>{formatearFechaLegible(reserva.fecha_reserva)}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        backgroundColor:
                          reserva.estado === "CONFIRMADA"
                            ? "#e3fcec"
                            : reserva.estado === "FINALIZADA"
                            ? "#e0e7ff"
                            : reserva.estado === "EXPIRADA"
                            ? "#fff3cd"
                            : reserva.estado === "CANCELADA"
                            ? "#ffeaea"
                            : "#f8f9fa",
                        color:
                          reserva.estado === "CONFIRMADA"
                            ? "#218838"
                            : reserva.estado === "FINALIZADA"
                            ? "#1e40af"
                            : reserva.estado === "EXPIRADA"
                            ? "#856404"
                            : reserva.estado === "CANCELADA"
                            ? "#c00"
                            : "#333",
                      }}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      {/* solo tiene sentido cancelar cuando está CONFIRMADA */}
                      {reserva.estado === "CONFIRMADA" && (
                        <button
                          className="btn btn-warning btn-small"
                          onClick={() => handleCancelar(reserva.id)}
                          title="Cancelar reserva"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleEdit(reserva)}
                        title="Editar reserva"
                      >
                        <FaEdit style={{ marginRight: "0.3rem" }} />
                        Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Reservas;
