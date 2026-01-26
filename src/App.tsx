import { Routes, Route } from "react-router-dom";
import { BarraNavegacion } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Inicio } from "./pages/Inicio";
import { Clasificacion } from "./pages/Clasificacion";
import { MisPredicciones } from "./pages/MisPredicciones";
import { HacerPrediccion } from "./pages/HacerPrediccion";
import { AdminMatches } from "./pages/AdminMatches";
import { useApp } from "./context/AppContext";

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
        <Route path="/admin" element={<AdminMatches />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
