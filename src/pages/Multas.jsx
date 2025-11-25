import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { multaAPI, alquilerAPI } from "../services/api";
import "../components/Table.css";
import "../components/Form.css";

function Multas() {
  const [multas, setMultas] = useState([]);
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id_alquiler: "",
    descripcion: "",
    monto: "",
    fecha: "",
  });

  useEffect(() => {
    cargarMultas();
    cargarAlquileres();
  }, []);

  const cargarMultas = async () => {
    try {
      setLoading(true);
      const data = await multaAPI.listar();
      setMultas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarAlquileres = async () => {
    try {
      const data = await alquilerAPI.listar();
      setAlquileres(data);
    } catch (err) {
      console.error("Error cargando alquileres:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = {
        id_alquiler: parseInt(formData.id_alquiler, 10),
        descripcion: formData.descripcion,
        monto: parseFloat(formData.monto),
        fecha: formData.fecha,
      };

      if (editingId) {
        await multaAPI.actualizar(editingId, data);
      } else {
        await multaAPI.crear(data);
      }

      await cargarMultas();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (multa) => {
    setEditingId(multa.id);
    setFormData({
      id_alquiler: multa.alquiler?.id || "",
      descripcion: multa.descripcion || "",
      monto: multa.monto || "",
      fecha: multa.fecha || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta multa?")) return;

    try {
      await multaAPI.eliminar(id);
      await cargarMultas();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_alquiler: "",
      descripcion: "",
      monto: "",
      fecha: "",
    });
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  if (loading) return <div className="loading">Cargando multas...</div>;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: 0 }}>Multas</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "+ Nueva Multa"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <h3>{editingId ? "Editar Multa" : "Nueva Multa"}</h3>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Alquiler <span className="required-asterisk">*</span>
              </label>
              <select
                value={formData.id_alquiler}
                onChange={(e) =>
                  setFormData({ ...formData, id_alquiler: e.target.value })
                }
                required
              >
                <option value="">Seleccione un alquiler</option>
                {alquileres.map((a) => (
                  <option key={a.id} value={a.id}>
                    ID {a.id} — {a.cliente?.nombre} {a.cliente?.apellido} —{" "}
                    {a.vehiculo?.patente}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Monto *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.monto}
                  onChange={(e) =>
                    setFormData({ ...formData, monto: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
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
        {multas.length === 0 ? (
          <div className="empty-state">
            <p>No hay multas registradas</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {multas.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.alquiler?.cliente?.nombre}{" "}
                    {m.alquiler?.cliente?.apellido}
                  </td>
                  <td>{m.alquiler?.vehiculo?.patente || "-"}</td>
                  <td>{m.fecha}</td>
                  <td>${m.monto}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleEdit(m)}
                      >
                        <FaEdit style={{ marginRight: "0.3rem" }} />
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(m.id)}
                      >
                        <FaTrash style={{ marginRight: "0.3rem" }} />
                        Eliminar
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

export default Multas;
