// contexto/AuthContexto.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContexto = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // cargar sesión existente
  useEffect(() => {
    const guardado = localStorage.getItem("usuaria");
    if (guardado) {
      setUsuario(JSON.parse(guardado)); // { nombre }
    }
    setCargando(false);
  }, []);

  // login/registro — ahora es lo mismo
  function iniciar({ nombre }) {
    const datos = { nombre };
    setUsuario(datos);
    localStorage.setItem("usuaria", JSON.stringify(datos));
    navigate("/inicio");
  }

  // logout
  function logout() {
    setUsuario(null);
    localStorage.removeItem("usuaria");
    navigate("/login");
  }

  // proteger rutas excepto /login
  useEffect(() => {
    if (!cargando && !usuario && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [cargando, usuario, location.pathname, navigate]);

  return (
    <AuthContexto.Provider
      value={{
        usuario,
        cargando,
        iniciar, // único método
        logout,
        autenticado: !!usuario,
      }}
    >
      {children}
    </AuthContexto.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContexto);
}
