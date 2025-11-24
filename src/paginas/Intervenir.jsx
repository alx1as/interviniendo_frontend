import { useState } from "react";
import BancoFragmentos from "../componentes/BancoFragmentos";
import TextoEnConstruccion from "../componentes/TextoEnConstruccion";
import { usePoemas } from "../contexto/PoemasContexto";
import { useAuth } from "../contexto/AuthContexto";
import "./Intervenir.css";

export default function Intervenir() {
  const [lineas, setLineas] = useState([]);
  const [imagen, setImagen] = useState(null);
  const [imagenURL, setImagenURL] = useState("");

  const { guardarPoema } = usePoemas();
  const { usuario } = useAuth();

  // Agregar línea
  function agregarLinea(texto) {
    setLineas((prev) => [...prev, texto]);
  }

  function editarTodas(nuevasLineas) {
    setLineas(nuevasLineas);
  }

  // Procesar imagen desde archivo
  function handleImagen(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 900;
        const scale = MAX_WIDTH / img.width;

        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        setImagen(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // Imagen desde link
  function handleImagenLink() {
    if (!imagenURL.trim()) return;
    setImagen(imagenURL.trim());
  }

  // Guardar poema
  function guardar() {
    if (lineas.length === 0) return;

    guardarPoema({
      autora: usuario?.nombre || "Anónima",
      etiqueta: "Texto intervenido",
      lineas,
      imagen: imagen || null,
    });

    setLineas([]);
    setImagen(null);
    setImagenURL("");
    alert("Poema guardado ✔");
  }

  return (
    <div className="intervenir-contenedor">
      <h2>Intervenir poema</h2>

      <BancoFragmentos onElegir={agregarLinea} />

      <TextoEnConstruccion
        lineas={lineas}
        onEditarLineas={editarTodas}
        imagen={imagen}
        imagenURL={imagenURL}
        setImagen={setImagen}
        setImagenURL={setImagenURL}
        handleImagen={handleImagen}
        handleImagenLink={handleImagenLink}
      />

      {lineas.length > 0 && (
        <button className="boton-guardar-poema" onClick={guardar}>
          Guardar poema
        </button>
      )}
    </div>
  );
}
