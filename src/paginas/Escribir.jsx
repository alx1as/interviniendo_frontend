import { useState } from "react";
import { usePoemas } from "../contexto/PoemasContexto";
import { useAuth } from "../contexto/AuthContexto";
import "./Escribir.css";

export default function Escribir() {
  const { guardarPoema } = usePoemas();
  const { usuario } = useAuth();

  const [texto, setTexto] = useState("");
  const [fuente, setFuente] = useState("serif");
  const [imagen, setImagen] = useState(null);

  // ─────────────────────────────────────────────
  // FORMATO
  // ─────────────────────────────────────────────
  function aplicarFormato(tag) {
    const textarea = document.getElementById("editor-escribir");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return;

    const antes = texto.slice(0, start);
    const seleccionado = texto.slice(start, end);
    const despues = texto.slice(end);

    const nuevo = `${antes}<${tag}>${seleccionado}</${tag}>${despues}`;
    setTexto(nuevo);

    setTimeout(() => textarea.focus(), 0);
  }

  // ─────────────────────────────────────────────
  // IMAGEN
  // ─────────────────────────────────────────────
  function handleImagen(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagen(reader.result);
    reader.readAsDataURL(file);
  }

  // ─────────────────────────────────────────────
  // GUARDAR
  // ─────────────────────────────────────────────
  function guardar() {
  if (!texto.trim()) return;

  guardarPoema({
    autora: usuario?.nombre || "Anónima",
    etiqueta: "Texto propio",
    lineas: texto.split("\n").map((l) => l.trim()),
    imagen: imagen || null   // ⬅️ AGREGADO
  });

  setTexto("");
  setImagen(null);
  alert("Texto guardado ✔");
}


  return (
    <div className="escribir-contenedor">
      <h2>Escribir</h2>

      {/* IMAGEN */}
      {imagen && (
        <img
          src={imagen}
          alt="adjunta"
          className="escribir-imagen"
        />
      )}

      <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "12px" }}>
  <label htmlFor="archivo-imagen" className="escribir-boton-archivo">
    Seleccionar imagen
  </label>

  <input
    id="archivo-imagen"
    type="file"
    accept="image/*"
    onChange={handleImagen}
    className="escribir-input-archivo"
  />

  <span className="escribir-nombre-archivo">
    {imagen ? "Imagen cargada ✓" : "Sin imagen"}
  </span>
</div>


      {/* Barra formato */}
      <div className="escribir-toolbar">
        <button onClick={() => aplicarFormato("b")} style={{ fontWeight: "bold" }}>
          N
        </button>

        <button onClick={() => aplicarFormato("i")} style={{ fontStyle: "italic" }}>
          C
        </button>

        <button
          onClick={() => aplicarFormato("u")}
          style={{ textDecoration: "underline" }}
        >
          S
        </button>

        <select
          value={fuente}
          onChange={(e) => setFuente(e.target.value)}
          className="select-fuente"
        >
          <option value="serif">Serif poética</option>
          <option value="sans-serif">Moderna</option>
          <option value="monospace">Máquina de escribir</option>
        </select>
      </div>

      {/* Editor */}
      <textarea
        id="editor-escribir"
        className="escribir-textarea"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribí tu poema…"
        style={{ fontFamily: fuente }}
        rows={10}
      />

      {/* Botón guardar */}
      {texto.trim() !== "" && (
        <button className="escribir-guardar" onClick={guardar}>
          Guardar texto
        </button>
      )}
    </div>
  );
}
