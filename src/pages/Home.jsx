import { Link } from 'react-router-dom'
import { FaUsers, FaCar, FaFileContract, FaCalendarAlt, FaUserTie, FaTag, FaCog, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa'
import './Home.css'

function Home() {
  const cards = [
    { path: '/clientes', icon: FaUsers, title: 'Clientes', description: 'Gestionar clientes del sistema' },
    { path: '/vehiculos', icon: FaCar, title: 'Vehículos', description: 'Administrar flota de vehículos' },
    { path: '/alquileres', icon: FaFileContract, title: 'Alquileres', description: 'Gestionar alquileres activos' },
    { path: '/reservas', icon: FaCalendarAlt, title: 'Reservas', description: 'Administrar reservas de vehículos' },
    { path: '/empleados', icon: FaUserTie, title: 'Empleados', description: 'Gestionar personal' },
    { path: '/marcas', icon: FaTag, title: 'Marcas', description: 'Administrar marcas de vehículos' },
    { path: '/modelos', icon: FaCog, title: 'Modelos', description: 'Gestionar modelos de vehículos' },
    { path: '/multas', icon: FaExclamationTriangle, title: 'Multas', description: 'Administrar multas de alquileres' },
  ]

  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-content">
          <h2>Bienvenido a Auto Track</h2>
          <p>Controla tu flota completa desde un solo lugar. Gestión inteligente de alquileres, vehículos y clientes.</p>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="home-grid">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link 
              key={card.path} 
              to={card.path} 
              className="home-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="card-icon-wrapper">
                <Icon className="card-icon" />
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-arrow">
                <FaArrowRight />
              </div>
              <div className="card-shine"></div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Home
