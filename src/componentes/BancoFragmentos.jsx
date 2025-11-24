import { useEffect, useState } from "react";
import "./BancoFragmentos.css";

export default function BancoFragmentos({ onElegir }) {
  const [fragmentos, setFragmentos] = useState([]);
  const [cargando, setCargando] = useState(true);

  async function cargarFragmentos() {
    setCargando(true);
    const res = await fetch("/fragmentos.json");
    const data = await res.json();

    const mezclado = [...data.quotes].sort(() => Math.random() - 0.5);
    setFragmentos(mezclado.slice(0, 6));

    setCargando(false);
  }

  useEffect(() => {
    cargarFragmentos();
  }, []);

  if (cargando) return <p className="banco-loading">Cargando fragmentos…</p>;

  return (
    <div className="banco-contenedor">
      <div className="banco-encabezado">
        <h3>Fragmentos para inspirarte</h3>

        <button className="banco-regenerar" onClick={cargarFragmentos}>
          ↻ Regenerar
        </button>
      </div>

      <div className="banco-grid">
        {fragmentos.map((f) => (
          <div key={f.id} className="banco-card">
            <p className="banco-quote">“{f.quote}”</p>
            <p className="banco-author">{f.author}</p>

            <button className="banco-elegir" onClick={() => onElegir(f.quote)}>
              Elegir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
