import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TextoEnConstruccion.css";

export default function TextoEnConstruccion({
  lineas,
  onEditarLineas,
  imagen,
  imagenURL,
  setImagen,
  setImagenURL,
  handleImagen,
  handleImagenLink,
}) {

  // ─────────────────────────────────────────────
  // A) Barra de herramientas
  // ─────────────────────────────────────────────
  function aplicarFormato(tag) {
    const textarea = document.getElementById("editor-poema");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return;

    const textoCompleto = lineas.join("\n");
    const antes = textoCompleto.slice(0, start);
    const seleccionado = textoCompleto.slice(start, end);
    const despues = textoCompleto.slice(end);

    const nuevoTexto = `${antes}<${tag}>${seleccionado}</${tag}>${despues}`;
    onEditarLineas(nuevoTexto.split("\n"));

    setTimeout(() => textarea.focus(), 0);
  }

  // ─────────────────────────────────────────────
  // B) Editar textarea grande
  // ─────────────────────────────────────────────
  function handleTextarea(e) {
    const nuevas = e.target.value.split("\n");
    onEditarLineas(nuevas);
  }

  // ─────────────────────────────────────────────
  // C) Drag & drop
  // ─────────────────────────────────────────────
  function handleDrag(result) {
    if (!result.destination) return;

    const nuevas = Array.from(lineas);
    const [movida] = nuevas.splice(result.source.index, 1);
    nuevas.splice(result.destination.index, 0, movida);

    onEditarLineas(nuevas);
  }

  return (
    <div className="texto-contenedor">
      <h3>Poema en construcción</h3>

      {/* ───────────────────────────────────────── */}
      {/* Toolbar */}
      {/* ───────────────────────────────────────── */}
      <div className="toolbar">
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
      </div>

      {/* ───────────────────────────────────────── */}
      {/* TEXTAREA PRINCIPAL */}
      {/* ───────────────────────────────────────── */}
      <textarea
        id="editor-poema"
        className="texto-total"
        value={lineas.join("\n")}
        onChange={handleTextarea}
        placeholder="Tu poema aparecerá aquí…"
      />

      {/* ───────────────────────────────────────── */}
      {/* CARGA DE IMAGEN — AHORA EN EL LUGAR CORRECTO */}
      {/* ───────────────────────────────────────── */}
      <div style={{ marginTop: "15px" }}>
        {/* Cargar desde archivo */}
        <label htmlFor="archivo-intervenir" className="escribir-boton-archivo">
          Cargar imagen
        </label>

        <input
          id="archivo-intervenir"
          type="file"
          accept="image/*"
          onChange={handleImagen}
          className="escribir-input-archivo"
        />

        {/* Cargar desde link */}
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="Pegar enlace de imagen"
            value={imagenURL}
            onChange={(e) => setImagenURL(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={handleImagenLink}
            className="escribir-boton-archivo"
          >
            Usar link
          </button>
        </div>

        {/* Previsualización */}
        {imagen && (
          <img
            src={imagen}
            alt="preview"
            style={{
              width: "100%",
              borderRadius: "12px",
              marginTop: "14px",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* ───────────────────────────────────────── */}
      {/* LÍNEAS ARRASTRABLES */}
      {/* ───────────────────────────────────────── */}
      {lineas.length > 0 && (
        <div className="texto-lista">
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId="lista-versos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {lineas.map((linea, index) => (
                    <Draggable
                      key={index}
                      draggableId={`verso-${index}`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="texto-linea"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span className="texto-linea-texto">{linea}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}
