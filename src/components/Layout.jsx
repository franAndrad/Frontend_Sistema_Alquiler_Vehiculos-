import { Link, useLocation, useNavigate } from "react-router-dom";
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
    { path: "/", label: "Inicio" },
    { path: "/clientes", label: "Clientes" },
    { path: "/vehiculos", label: "Vehículos" },
    { path: "/alquileres", label: "Alquileres" },
    { path: "/reservas", label: "Reservas" },
    { path: "/empleados", label: "Empleados" },
    { path: "/marcas", label: "Marcas" },
    { path: "/modelos", label: "Modelos" },
    { path: "/multas", label: "Multas" },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-top">
          <h1 className="header-title">🚗 Sistema de Alquiler de Vehículos</h1>

          {isLogged && (
            <div className="header-right">
              {userEmail && (
                <span className="user-chip">
                  <span className="user-dot" />
                  {userEmail}
                </span>
              )}
              <button className="logout-btn" onClick={handleLogout}>
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
                    ? "nav-link active login-link"
                    : "nav-link login-link"
                }
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>

        {isLogged && (
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={
                  location.pathname === item.path
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
