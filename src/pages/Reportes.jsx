import { useState, useEffect } from 'react'
import { alquilerAPI } from '../services/api'
import { formatearFechaLegible } from '../utils/dateFormatter'
import { FaChartBar, FaCar, FaCalendarAlt, FaFilter } from 'react-icons/fa'
import '../components/Table.css'
import '../components/Form.css'
import './Reportes.css'

function Reportes() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reporteTipo, setReporteTipo] = useState('periodo')
  const [filtros, setFiltros] = useState({
    desde: '',
    hasta: '',
    limit: 10
  })
  const [datosReporte, setDatosReporte] = useState([])
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const handleGenerarReporte = async () => {
    setError(null)
    setLoading(true)
    try {
      let data = []
      
      if (reporteTipo === 'periodo') {
        if (!filtros.desde || !filtros.hasta) {
          throw new Error('Debe seleccionar un rango de fechas')
        }
        data = await alquilerAPI.listarPorPeriodo(filtros.desde, filtros.hasta)
      } else if (reporteTipo === 'vehiculos-mas-alquilados') {
        data = await alquilerAPI.vehiculosMasAlquilados(
          filtros.desde || null,
          filtros.hasta || null,
          filtros.limit || 10
        )
      }
      
      setDatosReporte(data)
    } catch (err) {
      setError(err.message)
      setDatosReporte([])
    } finally {
      setLoading(false)
    }
  }

  const resetFiltros = () => {
    setFiltros({
      desde: '',
      hasta: '',
      limit: 10
    })
    setDatosReporte([])
    setError(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0 }}>Reportes</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          <FaFilter style={{ marginRight: '0.5rem' }} />
          {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
      </div>

      {mostrarFiltros && (
        <div className="form-container" style={{ marginBottom: '2rem' }}>
          <h3>
            <FaChartBar style={{ marginRight: '0.5rem' }} />
            Generar Reporte
          </h3>
          {error && <div className="error">{error}</div>}
          
          <div className="form-group">
            <label>Tipo de Reporte<span className="required-asterisk"> *</span></label>
            <select
              value={reporteTipo}
              onChange={(e) => {
                setReporteTipo(e.target.value)
                setDatosReporte([])
                setError(null)
              }}
              required
            >
              <option value="periodo">Alquileres por Período</option>
              <option value="vehiculos-mas-alquilados">Vehículos Más Alquilados</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha Desde</label>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
              />
            </div>
          </div>

          {reporteTipo === 'vehiculos-mas-alquilados' && (
            <div className="form-group">
              <label>Límite de Resultados</label>
              <input
                type="number"
                min="1"
                max="100"
                value={filtros.limit}
                onChange={(e) => setFiltros({ ...filtros, limit: parseInt(e.target.value) || 10 })}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={resetFiltros}>
              Limpiar
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleGenerarReporte}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Reporte'}
            </button>
          </div>
        </div>
      )}

      {loading && <div className="loading">Generando reporte...</div>}

      {datosReporte.length > 0 && (
        <div className="table-container">
          <div className="reporte-header">
            <h3>
              {reporteTipo === 'periodo' ? (
                <>
                  <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                  Alquileres del Período
                </>
              ) : (
                <>
                  <FaCar style={{ marginRight: '0.5rem' }} />
                  Vehículos Más Alquilados
                </>
              )}
            </h3>
            <p className="reporte-info">
              {reporteTipo === 'periodo' 
                ? `Período: ${formatearFechaLegible(filtros.desde)} - ${formatearFechaLegible(filtros.hasta)}`
                : `Top ${filtros.limit} vehículos más alquilados`
              }
            </p>
          </div>

          {reporteTipo === 'periodo' ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
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
                {datosReporte.map((alquiler) => (
                  <tr key={alquiler.id}>
                    <td>{alquiler.id}</td>
                    <td>{alquiler.cliente?.nombre} {alquiler.cliente?.apellido}</td>
                    <td>{alquiler.vehiculo?.patente}</td>
                    <td>{alquiler.empleado?.nombre} {alquiler.empleado?.apellido}</td>
                    <td>{formatearFechaLegible(alquiler.fecha_inicio)}</td>
                    <td>{formatearFechaLegible(alquiler.fecha_fin)}</td>
                    <td>
                      {alquiler.costo_total 
                        ? `$${alquiler.costo_total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : '-'
                      }
                    </td>
                    <td>
                      <span style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        backgroundColor: alquiler.estado === 'ACTIVO' ? '#d4edda' : '#f8d7da',
                        color: alquiler.estado === 'ACTIVO' ? '#155724' : '#721c24'
                      }}>
                        {alquiler.estado}
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
                  <th>Vehículo</th>
                  <th>Patente</th>
                  <th>Modelo</th>
                  <th>Cantidad de Alquileres</th>
                </tr>
              </thead>
              <tbody>
                {datosReporte.map((item, index) => (
                  <tr key={item.vehiculo_id || index}>
                    <td>
                      <span className="ranking-badge">{index + 1}</span>
                    </td>
                    <td>{item.vehiculo?.patente || '-'}</td>
                    <td>{item.vehiculo?.patente || '-'}</td>
                    <td>
                      {item.vehiculo?.modelo 
                        ? `${item.vehiculo.modelo.marca?.nombre || ''} ${item.vehiculo.modelo.nombre || ''}`.trim()
                        : '-'
                      }
                    </td>
                    <td>
                      <strong>{item.cantidad_alquileres || item.total_alquileres || 0}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {datosReporte.length === 0 && !loading && mostrarFiltros && (
        <div className="empty-state">
          <p>Selecciona los filtros y genera un reporte para ver los resultados</p>
        </div>
      )}
    </div>
  )
}

export default Reportes

