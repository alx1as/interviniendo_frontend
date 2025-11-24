import { createContext, useContext, useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "../api";

const CadaverContexto = createContext();

const PARTICIPANTES_ENUM = ["Valen", "Alexia", "Bicha", "Camila", "Maca"];

// normalización de nombres
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
    macarena: "Maca"
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
    cerrado: false
  };

  const [cadaver, setCadaver] = useState(estructuraInicial);
  const [cargando, setCargando] = useState(true);

  // cargar desde backend
  useEffect(() => {
    apiGet("/cadaver").then((data) => {
      if (data && data.rondas) setCadaver(data);
      setCargando(false);
    });
  }, []);

  // guardar en backend ante cada cambio
  useEffect(() => {
    if (!cargando) {
      apiPost("/cadaver", cadaver);
    }
  }, [cadaver, cargando]);

  // reset total
  async function reiniciarCadaver() {
    await apiDelete("/cadaver");
    setCadaver(estructuraInicial);
  }

  // iniciar juego
  function iniciarCadaver(usuario) {
    const nombre = normalizarNombre(usuario);

    setCadaver({
      activo: true,
      creadoPor: nombre,
      participantes: [nombre],
      rondas: [{ numero: 1, versos: [] }],
      rondaActual: 1,
      cerrado: false
    });
  }

  // cerrar sin publicar
  function cerrarCadaver() {
    setCadaver((prev) => ({ ...prev, cerrado: true }));
  }

  // finalizar y reiniciar
  function finalizar(publicarPoemaCallback) {
    const texto = cadaver.rondas
      .map((r) => r.versos.join("\n"))
      .join("\n\n");

    publicarPoemaCallback(texto);
    reiniciarCadaver();
  }

  // agregar verso
  function agregarVerso(usuario, texto) {
    const nombre = normalizarNombre(usuario);

    setCadaver((prev) => {
      const nuevasRondas = prev.rondas.map((r) =>
        r.numero === prev.rondaActual
          ? { ...r, versos: [...r.versos, texto] }
          : r
      );

      const nuevosParticipantes = prev.participantes.includes(nombre)
        ? prev.participantes
        : [...prev.participantes, nombre];

      const actualizado = {
        ...prev,
        participantes: nuevosParticipantes,
        rondas: nuevasRondas
      };

      // cierre automático
      const todas = PARTICIPANTES_ENUM.every((p) =>
        nuevosParticipantes.includes(p)
      );

      if (todas) actualizado.cerrado = true;

      return actualizado;
    });

    // pedir estado al backend para pista instantánea
    setTimeout(() => {
      apiGet("/cadaver").then((data) => {
        if (data) setCadaver(data);
      });
    }, 40);
  }

  function agregarRonda() {
    setCadaver((prev) => {
      const nueva = prev.rondaActual + 1;

      return {
        ...prev,
        rondas: [...prev.rondas, { numero: nueva, versos: [] }],
        rondaActual: nueva
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
        reiniciarCadaver
      }}
    >
      {children}
    </CadaverContexto.Provider>
  );
}

export function useCadaver() {
  return useContext(CadaverContexto);
}
