import { useState, useEffect } from "react";
import { empleadoAPI } from "../services/api";
import "../components/Table.css";
import "../components/Form.css";

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    direccion: "",
    telefono: "",
    email: "",
    rol: "",
    password: "",
  });

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const data = await empleadoAPI.listar();
      setEmpleados(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };

      // Si estás editando y la password viene vacía, NO la mandamos
      if (editingId && !payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await empleadoAPI.actualizar(editingId, payload);
      } else {
        await empleadoAPI.crear(payload);
      }

      await cargarEmpleados();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (empleado) => {
    setEditingId(empleado.id);
    setFormData({
      nombre: empleado.nombre || "",
      apellido: empleado.apellido || "",
      dni: empleado.dni || "",
      direccion: empleado.direccion || "",
      telefono: empleado.telefono || "",
      email: empleado.email || "",
      rol: empleado.rol || "",
      password: "", // se deja vacío para cambiar solo si se escribe algo
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      dni: "",
      direccion: "",
      telefono: "",
      email: "",
      rol: "",
      password: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Cargando empleados...</div>;

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
        <h2>Empleados</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            // si venías editando y apretás "Nuevo", reseteamos todo
            if (!showForm) {
              resetForm();
              setShowForm(true);
            } else {
              resetForm();
            }
          }}
        >
          {showForm ? "Cancelar" : "+ Nuevo Empleado"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <h3>{editingId ? "Editar Empleado" : "Nuevo Empleado"}</h3>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Apellido *</label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>DNI *</label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rol *</label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccione un rol</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="ATENCION">Atencion al cliente</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Contraseña {editingId ? "(dejar vacío para no cambiar)" : "*"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editingId}
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
        {empleados.length === 0 ? (
          <div className="empty-state">
            <p>No hay empleados registrados</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.apellido}</td>
                  <td>{empleado.dni}</td>
                  <td
                    style={{
                      maxWidth: "140px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {empleado.email}
                  </td>
                  <td>{empleado.direccion || "-"}</td>
                  <td>{empleado.telefono || "-"}</td>
                  <td>
                    <span
                      style={{
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                        backgroundColor:
                          empleado.rol === "ADMIN"
                            ? "#d4edda"
                            : empleado.rol === "ATENCION"
                            ? "#fff3cd"
                            : "#f8d7da",
                        color:
                          empleado.rol === "ADMIN"
                            ? "#155724"
                            : empleado.rol === "ATENCION"
                            ? "#856404"
                            : "#721c24",
                      }}
                    >
                      {empleado.rol}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleEdit(empleado)}
                      >
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

export default Empleados;
