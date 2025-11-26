import { Navigate, Outlet, useLocation } from "react-router-dom";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payloadBase64 + "===".slice((payloadBase64.length + 3) % 4);

    const payloadJson = atob(padded);
    const payload = JSON.parse(payloadJson);

    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (err) {
    console.error("Error al validar token:", err);
    return false;
  }
}

export default function RequireAuth() {
  const location = useLocation();

  const valido = isTokenValid();

  if (!valido) {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRol");

    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
