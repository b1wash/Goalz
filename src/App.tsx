import { Routes, Route } from "react-router-dom";
import { BarraNavegacion } from "./componentes/disenyo/Navbar";
import { Footer } from "./componentes/disenyo/Footer";
import { Inicio } from "./paginas/Inicio";
import { Clasificacion } from "./paginas/Clasificacion";
import { MisPredicciones } from "./paginas/MisPredicciones";
import { HacerPrediccion } from "./paginas/HacerPrediccion";

const App = () => {
  //  DATOS DEL USUARIO PARA PORBAR
  const usuarioActual = {
    id: "1",
    nombre: "Biwash Shrestha",
    puntosTotal: 245,
  };

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
