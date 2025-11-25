import { useState } from "react";
import { alquilerAPI } from "../services/api";
import { formatearFechaLegible } from "../utils/dateFormatter";
import { FaChartBar, FaCar, FaCalendarAlt } from "react-icons/fa";
import "../components/Table.css";
import "../components/Form.css";
import "./Reportes.css";
import BarChart from "../components/BarChart";

function Reportes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reporteTipo, setReporteTipo] = useState("periodo");
  const [datosReporte, setDatosReporte] = useState([]);

  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
    limit: 10,
    anio: "",
  });

  const handleGenerarReporte = async () => {
    setError(null);
    setLoading(true);
    try {
      let data = [];

      if (reporteTipo === "periodo") {
        if (!filtros.desde || !filtros.hasta) {
          throw new Error("Debe seleccionar un rango de fechas");
        }
        data = await alquilerAPI.listarPorPeriodo(filtros.desde, filtros.hasta);
      } else if (reporteTipo === "vehiculos-mas-alquilados") {
        data = await alquilerAPI.vehiculosMasAlquilados(
          filtros.desde || null,
          filtros.hasta || null,
          filtros.limit || 10
        );
      } else if (reporteTipo === "facturacion-mensual") {
        if (!filtros.anio) {
          throw new Error(
            "Debe seleccionar un año para la facturación mensual"
          );
        }

        // SOLO AÑO – se elimina mes
        data = await alquilerAPI.facturacionMensual(filtros.anio);
      }

      setDatosReporte(data);
    } catch (err) {
      setError(err.message);
      setDatosReporte([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFiltros = () => {
    setFiltros({
      desde: "",
      hasta: "",
      limit: 10,
      anio: "",
    });
    setDatosReporte([]);
    setError(null);
  };

  return (
    <div>
      {/* Título */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: 0 }}>Reportes</h2>
      </div>

      {/* FORMULARIO */}
      <div className="form-container" style={{ marginBottom: "2rem" }}>
        <h3>
          <FaChartBar style={{ marginRight: "0.5rem" }} />
          Generar Reporte
        </h3>

        {error && <div className="error">{error}</div>}

        {/* Tipo de reporte */}
        <div className="form-group">
          <label>Tipo de Reporte *</label>
          <select
            value={reporteTipo}
            onChange={(e) => {
              setReporteTipo(e.target.value);
              setDatosReporte([]);
              setError(null);
            }}
          >
            <option value="periodo">Alquileres por Período</option>
            <option value="vehiculos-mas-alquilados">
              Vehículos Más Alquilados
            </option>
            <option value="facturacion-mensual">
              Estadística de facturación mensual
            </option>
          </select>
        </div>

        {/* Fechas → solo si NO es facturación mensual */}
        {reporteTipo !== "facturacion-mensual" && (
          <div className="form-row">
            <div className="form-group">
              <label>Fecha Desde</label>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) =>
                  setFiltros({ ...filtros, desde: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) =>
                  setFiltros({ ...filtros, hasta: e.target.value })
                }
              />
            </div>
          </div>
        )}

        {/* Año → ÚNICO filtro para facturación mensual */}
        {reporteTipo === "facturacion-mensual" && (
          <div className="form-group">
            <label>Año *</label>
            <input
              type="number"
              min="2000"
              max="2100"
              placeholder="Ej: 2025"
              value={filtros.anio}
              onChange={(e) => setFiltros({ ...filtros, anio: e.target.value })}
            />
          </div>
        )}

        {/* Límite (solo para top vehículos) */}
        {reporteTipo === "vehiculos-mas-alquilados" && (
          <div className="form-group">
            <label>Límite de Resultados</label>
            <input
              type="number"
              min="1"
              max="100"
              value={filtros.limit}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  limit: parseInt(e.target.value) || 10,
                })
              }
            />
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={resetFiltros}
          >
            Limpiar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerarReporte}
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && <div className="loading">Generando reporte...</div>}

      {/* RESULTADOS */}
      {datosReporte.length > 0 && (
        <div>
          {/* Header visual */}
          <div className="reporte-header">
            <h3>
              {reporteTipo === "periodo" ? (
                <>
                  <FaCalendarAlt style={{ marginRight: "0.5rem" }} />
                  Alquileres del Período
                </>
              ) : reporteTipo === "vehiculos-mas-alquilados" ? (
                <>
                  <FaCar style={{ marginRight: "0.5rem" }} />
                  Vehículos Más Alquilados
                </>
              ) : (
                <>
                  <FaChartBar style={{ marginRight: "0.5rem" }} />
                  Facturación Mensual
                </>
              )}
            </h3>

            <p className="reporte-info">
              {reporteTipo === "facturacion-mensual"
                ? `Facturación total del año ${filtros.anio}`
                : reporteTipo === "periodo"
                ? `Período: ${formatearFechaLegible(
                    filtros.desde
                  )} - ${formatearFechaLegible(filtros.hasta)}`
                : `Top ${filtros.limit} vehículos más alquilados`}
            </p>
          </div>

          {/* Gráfico de facturación mensual */}
          {reporteTipo === "facturacion-mensual" ? (
            <div className="chart-container">
              <BarChart
                labels={datosReporte.map((x) => x.mes)}
                values={datosReporte.map((x) => x.total)}
              />
            </div>
          ) : (
            <div className="table-container">
              {/* Tablas existentes */}
              {reporteTipo === "periodo" ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Vehículo</th>
                      <th>Empleado</th>
                      <th>Fecha Inicio</th>
                      <th>Fecha Fin</th>
                      <th>Costo Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosReporte.map((alq) => (
                      <tr key={alq.id}>
                        <td>
                          {alq.cliente?.nombre} {alq.cliente?.apellido}
                        </td>
                        <td>{alq.vehiculo?.patente}</td>
                        <td>
                          {alq.empleado?.nombre} {alq.empleado?.apellido}
                        </td>
                        <td>{formatearFechaLegible(alq.fecha_inicio)}</td>
                        <td>{formatearFechaLegible(alq.fecha_fin)}</td>
                        <td>
                          {alq.costo_total
                            ? `$${alq.costo_total.toLocaleString("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}`
                            : "-"}
                        </td>
                        <td>
                          <span
                            className="estado-pill"
                            data-estado={alq.estado}
                          >
                            {alq.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Posición</th>
                      <th>Patente</th>
                      <th>Modelo</th>
                      <th>Alquileres</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosReporte.map((item, index) => {
                      const modelo = item.vehiculo?.modelo
                        ? `${item.vehiculo.modelo.marca?.nombre || ""} ${
                            item.vehiculo.modelo.nombre || ""
                          }`
                        : "-";

                      return (
                        <tr key={item.vehiculo_id || index}>
                          <td>
                            <span className="ranking-badge">{index + 1}</span>
                          </td>
                          <td>{item.vehiculo?.patente || "-"}</td>
                          <td>{modelo}</td>
                          <td>
                            <strong>
                              {item.cantidad_alquileres ||
                                item.total_alquileres ||
                                0}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* VACÍO */}
      {datosReporte.length === 0 && !loading && (
        <div className="empty-state">
          <p>
            Selecciona los filtros y genera un reporte para ver los resultados
          </p>
        </div>
      )}
    </div>
  );
}

export default Reportes;
