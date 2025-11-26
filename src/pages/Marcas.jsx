import { useState, useEffect } from "react";
import { marcaAPI } from "../services/api";
import "../components/Table.css";
import "../components/Form.css";

function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
  });

  useEffect(() => {
    cargarMarcas();
  }, []);

  const cargarMarcas = async () => {
    try {
      setLoading(true);
      const data = await marcaAPI.listar();
      setMarcas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await marcaAPI.actualizar(editingId, formData);
      } else {
        await marcaAPI.crear(formData);
      }

      await cargarMarcas();
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (marca) => {
    setEditingId(marca.id);
    setFormData({
      nombre: marca.nombre || "",
    });
    setError(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta marca?")) return;

    try {
      await marcaAPI.eliminar(id);
      await cargarMarcas();
      setError(null);
    } catch (err) {
      if (
        err.message &&
        err.message.toLowerCase().includes("modelos asociados")
      ) {
        setError(
          "No se puede eliminar la marca porque está siendo utilizada por uno o más modelos. " +
            "Primero reasigne o elimine esos modelos."
        );
      } else {
        setError(err.message || "Error al eliminar la marca.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: "" });
    setEditingId(null);
    setError(null);
  };

  if (loading) return <div className="loading">Cargando marcas...</div>;

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
        <h2>Marcas</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancelar" : "+ Nueva Marca"}
        </button>
      </div>

      {/* Error global*/}
      {error && (
        <div className="error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="form-container" style={{ marginBottom: "2rem" }}>
          <h3>{editingId ? "Editar Marca" : "Nueva Marca"}</h3>

          <form onSubmit={handleSubmit}>
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
        {marcas.length === 0 ? (
          <div className="empty-state">
            <p>No hay marcas registradas</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {marcas.map((marca) => (
                <tr key={marca.id}>
                  <td>{marca.nombre}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleEdit(marca)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(marca.id)}
                      >
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

export default Marcas;
