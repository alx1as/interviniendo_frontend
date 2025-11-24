import { Navigate } from "react-router-dom";
import { useAuth } from "../contexto/AuthContexto";

export default function RutaProtegida({ children }) {
  const { autenticado, cargando } = useAuth();

  if (cargando) return null;

  return autenticado ? children : <Navigate to="/login" />;
}
