import { Routes, Route } from "react-router-dom";
import { BarraNavegacion } from "./componentes/disenyo/Navbar";
import { Inicio } from "./vistas/Inicio";
import { Clasificacion } from "./vistas/Clasificacion";
import { MisPredicciones } from "./vistas/MisPredicciones";
import { HacerPrediccion } from "./vistas/HacerPrediccion";

const App = () => {
  // Datos de ejemplo del usuario (más adelante vendrá de un contexto/API)
  const usuarioActual = {
    id: "1",
    nombre: "Juan Pérez",
    puntosTotal: 245,
  };

  return (
    <div className="min-h-screen">
      <BarraNavegacion usuarioActual={usuarioActual} />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/mis-predicciones" element={<MisPredicciones />} />
        <Route path="/hacer-prediccion" element={<HacerPrediccion />} />
      </Routes>
    </div>
  );
};

export default App;
