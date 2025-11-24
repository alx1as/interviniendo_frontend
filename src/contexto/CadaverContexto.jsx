import { createContext, useContext, useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

const CadaverContexto = createContext();

const PARTICIPANTES_ENUM = ["Valen", "Alexia", "Bicha", "Camila", "Maca"];

// Normalización de nombres
function normalizarNombre(nombre) {
  const limpio = nombre.trim().toLowerCase();

  const mapa = {
    valen: "Valen",
    vale: "Valen",
    valentina: "Valen",

    alexia: "Alexia",
    ale: "Alexia",

    bicha: "Bicha",
    sofia: "Bicha",

    cami: "Camila",
    camila: "Camila",

    maca: "Maca",
    macarena: "Maca",
  };

  return mapa[limpio] || nombre;
}

export function CadaverProvider({ children }) {
  const estructuraInicial = {
    activo: false,
    creadoPor: "",
    participantes: [],
    rondas: [{ numero: 1, versos: [] }],
    rondaActual: 1,
    cerrado: false,
  };

  const [cadaver, setCadaver] = useState(estructuraInicial);
  const [cargando, setCargando] = useState(true);

  // Cargar desde backend la primera vez
  useEffect(() => {
    apiGet("/cadaver").then((data) => {
      if (data && data.rondas) setCadaver(data);
      setCargando(false);
    });
  }, []);

  // Guardar en backend cada vez que cambia el estado
  useEffect(() => {
    if (cargando) return;
    if (!cadaver || !cadaver.rondas) return;

    apiPost("/cadaver", cadaver).catch((err) =>
      console.error("Error guardando:", err)
    );
  }, [cadaver]);

  // Reset total
  async function reiniciarCadaver() {
    await apiDelete("/cadaver");
    setCadaver(estructuraInicial);
  }

  // Iniciar juego
  function iniciarCadaver(usuario) {
    const nombre = normalizarNombre(usuario);

    setCadaver({
      activo: true,
      creadoPor: nombre,
      participantes: [nombre],
      rondas: [{ numero: 1, versos: [] }],
      rondaActual: 1,
      cerrado: false,
    });
  }

  // Cerrar sin publicar (manual)
  function cerrarCadaver() {
    setCadaver((prev) => ({ ...prev, cerrado: true }));
  }

  // Finalizar y publicar
  function finalizar(publicarPoemaCallback) {
    const texto = cadaver.rondas
      .map((r) => r.versos.join("\n"))
      .join("\n\n");

    publicarPoemaCallback(texto);
    reiniciarCadaver();
  }

  // Agregar verso
  function agregarVerso(usuario, texto) {
    const nombre = normalizarNombre(usuario);
    const versoLimpio = texto.trim();
    if (!versoLimpio) return;

    setCadaver((prev) => {
      const idx = prev.rondaActual - 1;

      const rondas = [...prev.rondas];
      rondas[idx] = {
        ...rondas[idx],
        versos: [...rondas[idx].versos, versoLimpio],
      };

      const participantes = prev.participantes.includes(nombre)
        ? prev.participantes
        : [...prev.participantes, nombre];

      const actualizado = {
        ...prev,
        rondas,
        participantes,
      };

      // Cierre automático
      if (PARTICIPANTES_ENUM.every((p) => participantes.includes(p))) {
        actualizado.cerrado = true;
      }

      return actualizado;
    });
  }

  // Cambiar de ronda manualmente
  function agregarRonda() {
    setCadaver((prev) => {
      const nueva = prev.rondaActual + 1;

      return {
        ...prev,
        rondas: [...prev.rondas, { numero: nueva, versos: [] }],
        rondaActual: nueva,
      };
    });
  }

  return (
    <CadaverContexto.Provider
      value={{
        cadaver,
        iniciarCadaver,
        agregarVerso,
        agregarRonda,
        cerrarCadaver,
        finalizar,
        reiniciarCadaver,
      }}
    >
      {children}
    </CadaverContexto.Provider>
  );
}

export function useCadaver() {
  return useContext(CadaverContexto);
}
