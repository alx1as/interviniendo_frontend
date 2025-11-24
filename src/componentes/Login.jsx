// componentes/Login.jsx
import { useState } from "react";
import { useAuth } from "../contexto/AuthContexto";

export default function Login() {
  const { iniciar } = useAuth();
  const [nombre, setNombre] = useState("");

  function enviar(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    iniciar({ nombre: nombre.trim() });
  }

  return (
    <div style={{ padding: 20 }}>
      <form onSubmit={enviar}>
        <h2>Bienvenida</h2>

        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button type="submit" style={{ padding: "8px 14px" }}>
          Entrar
        </button>
      </form>
    </div>
  );
}
