import React, { useState } from "react";
import { useCadaver } from "../contexto/CadaverContexto";
import { usePoemas } from "../contexto/PoemasContexto";
import { useAuth } from "../contexto/AuthContexto";
import "./CadaverExquisito.css";

const PARTICIPANTES_ENUM = ["Valen", "Alexia", "Bicha", "Camila", "Maca"];

export default function CadaverExquisito() {
  const { usuario } = useAuth();
  const {
    cadaver,
    iniciarCadaver,
    agregarVerso,
    agregarRonda,
    cerrarCadaver,
    finalizar
  } = useCadaver();

  const { guardarPoema } = usePoemas();
  const [verso, setVerso] = useState("");

  // Última palabra del último verso
  function pistaActual() {
    const todos = cadaver.rondas.flatMap(r => r.versos);
    if (todos.length === 0) return null;

    const ultimo = todos.at(-1);
    if (!ultimo) return null;

    const palabras = ultimo.trim().split(/\s+/);
    return palabras.at(-1);
  }

  function enviarVerso() {
    if (!verso.trim()) return;
    agregarVerso(usuario.nombre, verso.trim());
    setVerso("");
  }

  function publicarCadaver() {
    finalizar(textoFinal => {
      guardarPoema({
        autora: usuario.nombre,
        etiqueta: "Cadáver exquisito",
        lineas: textoFinal.split("\n")
      });
    });
  }

  const faltan = 5 - cadaver.participantes.length;

  return (
    <div className="cadaver-contenedor">
      <h2 className="cadaver-titulo">Cadáver Exquisito</h2>

      {!cadaver.activo && (
        <button
          onClick={() => iniciarCadaver(usuario.nombre)}
          className="cadaver-btn"
        >
          Iniciar Cadáver Exquisito
        </button>
      )}

      {cadaver.activo && (
        <div className="cadaver-info">
          <p><b>Ronda actual:</b> {cadaver.rondaActual}</p>

          <p>
            <b>Participantes:</b>{" "}
            {cadaver.participantes.join(", ") || "—"}
          </p>

          <p>
            <b>Última en participar:</b>{" "}
            {cadaver.participantes.at(-1) || "—"}
          </p>

          <p>
            <b>Progreso:</b>{" "}
            {cadaver.participantes.length}/5{" "}
            {faltan > 0 && `(faltan ${faltan})`}
          </p>

          {pistaActual() && (
            <div className="cadaver-pista">
              <span className="cadaver-pista-label">Pista:</span>
              <span className="cadaver-pista-palabra">{pistaActual()}</span>
            </div>
          )}

          <textarea
            value={verso}
            onChange={(e) => setVerso(e.target.value)}
            className="cadaver-textarea"
            placeholder="Tu verso…"
            rows={3}
          />

          <div className="cadaver-botones">
            <button onClick={enviarVerso} className="cadaver-btn">
              Agregar verso
            </button>

            <button
              onClick={publicarCadaver}
              className="cadaver-btn cadaver-btn-publicar"
            >
              Cerrar y publicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
