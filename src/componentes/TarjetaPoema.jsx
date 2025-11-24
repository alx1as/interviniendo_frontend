import { useState } from "react";
import "./TarjetaPoema.css";
import { usePoemas } from "../contexto/PoemasContexto";
import { useAuth } from "../contexto/AuthContexto";

export default function TarjetaPoema({ poema }) {
  const { agregarComentario } = usePoemas();
  const { usuario } = useAuth();

  const [comentario, setComentario] = useState("");

  const textoHTML = poema.texto || "";
  const fecha =
    poema.ultimaActividad ||
    new Date(poema.fecha).toLocaleDateString("es-AR");
  const comentarios = poema.comentarios || [];

  const esLargo = textoHTML.length > 350;
  const [verMas, setVerMas] = useState(!esLargo);

  const textoRecortado =
    textoHTML.substring(0, 350) + (esLargo ? "…" : "");

  const textoParaMostrar = verMas ? textoHTML : textoRecortado;

  const etiquetaClase =
    poema.etiqueta === "Texto intervenido"
      ? "etiqueta-intervenido"
      : poema.etiqueta === "Texto propio"
      ? "etiqueta-propio"
      : "etiqueta-cadaver";

  return (
    <div className="tarjeta-poema">
      <div className="tarjeta-header">
        <span className="tarjeta-autor">{poema.autora}</span>

        <span className={`tarjeta-etiqueta ${etiquetaClase}`}>
          {poema.etiqueta}
        </span>
      </div>

      <div className="tarjeta-fecha">{fecha}</div>


      {/* ───────────────────────────────────────────── */}
      {/* TEXTO CON FORMATO HTML */}
      {/* ───────────────────────────────────────────── */}
      <div
        className="tarjeta-cuerpo"
        style={{ whiteSpace: "pre-wrap" }}
        dangerouslySetInnerHTML={{ __html: textoParaMostrar }}
      ></div>

      {esLargo && (
        <button
          className="tarjeta-leer-mas"
          onClick={() => setVerMas(!verMas)}
        >
          {verMas ? "Leer menos" : "Leer más"}
        </button>
      )}
     
{poema.imagen && (
  <img
    src={poema.imagen}
    alt="poema"
    style={{
      width: "100%",
      borderRadius: "8px",
      marginBottom: "12px",
      objectFit: "cover"
    }}
  />
)}

      <div className="tarjeta-comentarios-bloque">
        <div className="tarjeta-comentarios-total">
          {comentarios.length} comentario(s)
        </div>

        <div className="tarjeta-ultimos-comentarios">
          {comentarios.slice(-2).map((c, i) => (
            <div key={i} className="tarjeta-comentario">
              <span className="comentario-autora">{c.autora}: </span>
              <span>{c.texto}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tarjeta-comentar">
        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribe un comentario..."
          className="tarjeta-input"
        />

        <button
          className="tarjeta-boton-comentar"
          onClick={() => {
            if (!comentario.trim()) return;
            agregarComentario(
              poema.id,
              usuario?.nombre || "Anónima",
              comentario.trim()
            );
            setComentario("");
          }}
        >
          Comentar
        </button>
      </div>
    </div>
  );
}
