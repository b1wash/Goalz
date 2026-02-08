import { Routes, Route } from "react-router-dom";
import { BarraNavegacion } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { Inicio } from "./pages/Inicio";
import { Clasificacion } from "./pages/Clasificacion";
import { MisPredicciones } from "./pages/MisPredicciones";
import { HacerPrediccion } from "./pages/HacerPrediccion";
import { AdminMatches } from "./pages/AdminMatches";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BarraNavegacion />
      <Routes>
        {/* RUTAS PUBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/clasificacion" element={<Clasificacion />} />

        {/* RUTAS PROTEGIDAS (REQUIEREN AUTENTICACION) */}
        <Route
          path="/mis-predicciones"
          element={
            <ProtectedRoute>
              <MisPredicciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hacer-prediccion"
          element={
            <ProtectedRoute>
              <HacerPrediccion />
            </ProtectedRoute>
          }
        />

        {/* RUTAS DE ADMINISTRADOR (REQUIEREN ROLE ADMIN) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminMatches />
            </AdminRoute>
          }
        />

        {/* CUALQUIER RUTA NO DEFINIDA */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
