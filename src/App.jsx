import { Routes, Route } from "react-router-dom";
import Inicio from "./paginas/Inicio";
import Escribir from "./paginas/Escribir";
import Intervenir from "./paginas/Intervenir";
import CadaverExquisito from "./paginas/CadaverExquisito";
import Login from "./componentes/Login";
import BarraNavegacion from "./componentes/BarraNavegacion";
import './App.css';
export default function App() {
  return (
    <>
      <BarraNavegacion />
      <Routes>
        <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
<Route path="/inicio" element={<Inicio />} />
        <Route path="/crear" element={<Escribir />} />
        <Route path="/intervenir" element={<Intervenir />} />
        <Route path="/cadaver" element={<CadaverExquisito />} />
      </Routes>
    </>
  );
}
