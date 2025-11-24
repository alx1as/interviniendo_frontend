import "./Inicio.css";
import TarjetaPoema from "../componentes/TarjetaPoema";
import { usePoemas } from "../contexto/PoemasContexto";

export default function Inicio() {

  const { poemas } = usePoemas(); // textos reales guardados desde Intervenir

  // separar recientes (últimos 3) y todos
  const recientes = poemas.slice(0, 3);
  const todos = poemas;

  return (
    <div className="inicio-lista">
      <h2 className="inicio-titulo">Última actividad</h2>

      {recientes.length === 0 && (
        <p>No hay actividad reciente todavía.</p>
      )}

      {recientes.map((poema) => (
        <TarjetaPoema key={poema.id} poema={poema} />
      ))}

      <h2 className="inicio-titulo" style={{ marginTop: "40px" }}>
        Todos los textos
      </h2>

      {todos.length === 0 && (
        <p>Aún no se creó ningún texto.</p>
      )}

      {todos.map((poema) => (
        <TarjetaPoema key={poema.id} poema={poema} />
      ))}
    </div>
  );
}
