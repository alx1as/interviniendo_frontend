import { Link } from "react-router-dom";
import { useAuth } from "../contexto/AuthContexto";
import "./BarraNavegacion.css";

export default function BarraNavegacion() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-izquierda">
        <Link to="/" className="nav-logo">
          Laboratorio de poemas
        </Link>
      </div>

      <div className="nav-derecha">
        {!usuario && (
          <>
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/login" className="nav-link">Entrar</Link>
          </>
        )}

        {usuario && (
          <>
            <Link to="/" className="nav-link">Inicio</Link>
    
            <Link to="/crear" className="nav-link">Escribir</Link>
            <Link to="/intervenir" className="nav-link">Intervenir</Link>
            <Link to="/cadaver" className="nav-link">Cadáver</Link>
            <span className="nav-logout" onClick={logout}>Salir</span>
          </>
        )}
      </div>
    </nav>
  );
}
