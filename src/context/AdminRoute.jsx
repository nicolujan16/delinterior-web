import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider"; // ajusta la ruta según tu estructura

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>; // Podés poner un spinner o skeleton acá
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;
