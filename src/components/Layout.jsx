import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaHome, FaUsers, FaCar, FaFileContract, FaCalendarAlt, FaUserTie, FaTag, FaCog, FaExclamationTriangle, FaChartBar } from "react-icons/fa";
import Logo from "./Logo";
import "./Layout.css";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const isLogged = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRol");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Inicio", icon: FaHome },
    { path: "/clientes", label: "Clientes", icon: FaUsers },
    { path: "/vehiculos", label: "Vehículos", icon: FaCar },
    { path: "/alquileres", label: "Alquileres", icon: FaFileContract },
    { path: "/reservas", label: "Reservas", icon: FaCalendarAlt },
    { path: "/empleados", label: "Empleados", icon: FaUserTie },
    { path: "/marcas", label: "Marcas", icon: FaTag },
    { path: "/modelos", label: "Modelos", icon: FaCog },
    { path: "/multas", label: "Multas", icon: FaExclamationTriangle },
    { path: "/reportes", label: "Reportes", icon: FaChartBar },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand">
          <Logo size="medium" />
          <div className="brand-info">
            <p className="brand-tagline">Tu alquiler de vehículos simplificado</p>
          </div>
          
          {isLogged && (
            <div className="header-right">
              {userEmail && (
                <span className="user-chip">
                  <span className="user-dot" />
                  {userEmail}
                </span>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: '6px' }} />
                Cerrar sesión
              </button>
            </div>
          )}

          {!isLogged && (
            <div className="header-right">
              <Link
                to="/login"
                className={
                  location.pathname === "/login"
                    ? "login-btn active"
                    : "login-btn"
                }
              >
                <FaSignInAlt style={{ marginRight: '6px' }} />
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>

        {isLogged && (
          <nav className="nav-tabs">
            <div className="nav-tabs-container">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-tab ${isActive ? "active" : ""}`}
                  >
                    <Icon className="nav-tab-icon" />
                    <span className="nav-tab-label">{item.label}</span>
                    {isActive && <div className="nav-tab-indicator" />}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
