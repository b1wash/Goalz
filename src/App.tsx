import { Routes, Route } from "react-router-dom";
import { BarraNavegacion } from "./componentes/disenyo/Navbar";
import { Footer } from "./componentes/disenyo/Footer";
import { Inicio } from "./paginas/Inicio";
import { Clasificacion } from "./paginas/Clasificacion";
import { MisPredicciones } from "./paginas/MisPredicciones";
import { HacerPrediccion } from "./paginas/HacerPrediccion";
import { useApp } from "./contexto/AppContext";

const App = () => {
  // OBTENER EL USUARIO ACTUAL DESDE EL CONTEXTO GLOBAL
  const { usuarioActual } = useApp();

  return (
    <div className="min-h-screen flex flex-col">
      <BarraNavegacion usuarioActual={usuarioActual} />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/mis-predicciones" element={<MisPredicciones />} />
        <Route path="/hacer-prediccion" element={<HacerPrediccion />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
