import { createContext, useContext, useState, useEffect } from "react";
import { apiGet, apiPost } from "../api";

const PoemasContexto = createContext();

export function PoemasProvider({ children }) {
  const [poemas, setPoemas] = useState([]);

  // cargar desde backend
  useEffect(() => {
    async function cargar() {
      const data = await apiGet("/poemas/");
      setPoemas(data);
    }
    cargar();
  }, []);

  // guardar poema en backend
  async function guardarPoema({ autora, etiqueta, lineas, imagen = null }) {
    const nuevo = await apiPost("/poemas/", {
      autora,
      etiqueta,
      texto: lineas.join("\n"),
      imagen,
    });

    setPoemas((prev) => [nuevo, ...prev]);
  }

  // guardar comentario en frontend (más adelante lo mando a backend)
 async function agregarComentario(idPoema, autora, texto) {
  const res = await apiPost(`/poemas/${idPoema}/comentarios`, {
    autora,
    texto
  });

  setPoemas(prev =>
    prev.map(p =>
      p.id === idPoema
        ? { ...p, comentarios: [...p.comentarios, res] }
        : p
    )
  );
}



  return (
    <PoemasContexto.Provider
      value={{
        poemas,
        guardarPoema,
        agregarComentario,
        getRecientes: () => poemas.slice(0, 5),
        getTodos: () => poemas,
      }}
    >
      {children}
    </PoemasContexto.Provider>
  );
}

export function usePoemas() {
  return useContext(PoemasContexto);
}
