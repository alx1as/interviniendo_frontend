import { useState } from "react";
import { useAuth } from "../contexto/AuthContexto";
import "./AuthForm.css";

export default function Registro() {
  const { registro } = useAuth();
  const [nombre, setNombre] = useState("");

  function enviar(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    registro({ nombre: nombre.trim() });
  }

  return (
    <div className="auth-contenedor">
      <h2>Registrarte</h2>

      <form onSubmit={enviar} className="auth-form">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
