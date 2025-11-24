import TarjetaPoema from "./TarjetaPoema";

export default function ListarTextos({ titulo, lista }) {
  return (
    <div className="inicio-lista">
      {titulo && <h2 className="inicio-titulo">{titulo}</h2>}

      {lista.length === 0 && <p>No hay poemas aún.</p>}

      {lista.map((p) => (
        <TarjetaPoema
          key={p.id}
          poema={{
            autora: p.autora,
            etiqueta: p.etiqueta,
            ultimaActividad: new Date(p.fecha).toLocaleString(),
            textoRecortado: p.texto.slice(0, 120) + "…",
            textoCompleto: p.texto,
            comentarios: p.comentarios || []
          }}
        />
      ))}
    </div>
  );
}
