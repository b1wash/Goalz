// VISTA DE MIS PREDICCIONES
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { matchService } from "../servicios/matchService";
import { predictionService } from "../servicios/predictionService";
import type { Partido, Prediccion } from "../tipos";
import { useApp } from "../contexto/AppContext";
import { PredictionCard } from "../componentes/predictions";

export const MisPredicciones = () => {
  const { usuarioActual } = useApp();
  const [todasLasPredicciones, setTodasLasPredicciones] = useState<
    Prediccion[]
  >([]);
  const [todosLosPartidos, setTodosLosPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FILTRO PARA MOSTRAR DIFERENTES TIPOS DE PREDICCIONES
  const [filtro, setFiltro] = useState<
    "todas" | "acertadas" | "falladas" | "pendientes"
  >("todas");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // CARGAR PREDICCIONES DEL USUARIO ACTUAL
        const predictionsData = await predictionService.getByUser(
          usuarioActual.id,
        );
        setTodasLasPredicciones(predictionsData);

        // CARGAR TODOS LOS PARTIDOS PARA TENER LA INFO
        const matchesData = await matchService.getAll();
        setTodosLosPartidos(matchesData);

        setError(null);
      } catch (err) {
        setError("Error al cargar tus predicciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuarioActual.id]);

  // FUNCION PARA OBTENER EL PARTIDO DE UNA PREDICCION
  const obtenerPartido = (idPartido: string): Partido | undefined => {
    return todosLosPartidos.find((p) => p.id === idPartido);
  };

  // FILTRAR PREDICCIONES SEGUN EL FILTRO SELECCIONADO
  const prediccionesFiltradas = todasLasPredicciones.filter((pred) => {
    const partidoId = pred.matchId || pred.idPartido;
    if (!partidoId) return false;

    const partido = obtenerPartido(partidoId);
    if (!partido) return false;

    if (filtro === "todas") return true;

    const estado = (partido.status || partido.estado) as string;
    const puntos = pred.points ?? pred.puntosGanados;

    if (filtro === "pendientes")
      return estado === "pending" || estado === "pendiente";

    const isFinished = estado === "finished" || estado === "finalizado";
    if (filtro === "acertadas") return isFinished && (puntos ?? 0) > 0;
    if (filtro === "falladas") return isFinished && (puntos ?? 0) === 0;
    return true;
  });

  // CALCULAR ESTADISTICAS
  const totalPredicciones = todasLasPredicciones.length;
  const acertadas = todasLasPredicciones.filter(
    (p) => (p.points ?? p.puntosGanados ?? 0) > 0,
  ).length;
  const puntosTotal = todasLasPredicciones.reduce(
    (sum, p) => sum + (p.points ?? p.puntosGanados ?? 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center">
        <div className="text-white text-2xl font-black animate-spin">⌛</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITULO */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
            📊 Mis Predicciones
          </h1>
          <p className="text-gray-400 text-lg">
            Revisa todas tus predicciones y verifica tus aciertos
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-danger/10 border border-danger/30 rounded-xl text-danger font-bold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* ESTADISTICAS RAPIDAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-primary mb-2">
              {totalPredicciones}
            </div>
            <div className="text-sm text-gray-400 font-semibold">
              Total Predicciones
            </div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-accent mb-2">
              {acertadas}
            </div>
            <div className="text-sm text-gray-400 font-semibold">Acertadas</div>
          </div>
          <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 text-center">
            <div className="text-4xl font-black text-emerald-400 mb-2">
              {puntosTotal}
            </div>
            <div className="text-sm text-gray-400 font-semibold">
              Puntos Ganados
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltro("todas")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                filtro === "todas"
                  ? "bg-primary text-dark-bg shadow-lg"
                  : "bg-dark-bg/50 text-gray-400 hover:text-white hover:bg-dark-hover"
              }`}
            >
              Todas ({todasLasPredicciones.length})
            </button>
            <button
              onClick={() => setFiltro("pendientes")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                filtro === "pendientes"
                  ? "bg-primary text-dark-bg shadow-lg"
                  : "bg-dark-bg/50 text-gray-400 hover:text-white hover:bg-dark-hover"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltro("acertadas")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                filtro === "acertadas"
                  ? "bg-primary text-dark-bg shadow-lg"
                  : "bg-dark-bg/50 text-gray-400 hover:text-white hover:bg-dark-hover"
              }`}
            >
              Acertadas ({acertadas})
            </button>
            <button
              onClick={() => setFiltro("falladas")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                filtro === "falladas"
                  ? "bg-primary text-dark-bg shadow-lg"
                  : "bg-dark-bg/50 text-gray-400 hover:text-white hover:bg-dark-hover"
              }`}
            >
              Falladas
            </button>
          </div>
        </div>

        {/* LISTA DE PREDICCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prediccionesFiltradas.length === 0 ? (
            <div className="col-span-full bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <p className="text-gray-400 text-lg">
                No tienes predicciones en esta categoría
              </p>
            </div>
          ) : (
            prediccionesFiltradas.map((prediccion) => {
              const partido = obtenerPartido(
                prediccion.matchId || prediccion.idPartido || "",
              );
              if (!partido) return null;

              return (
                <PredictionCard
                  key={prediccion.id}
                  prediction={prediccion}
                  match={partido}
                />
              );
            })
          )}
        </div>

        {/* MENSAJE SI NO HAY PREDICCIONES */}
        {todasLasPredicciones.length === 0 && !loading && (
          <div className="mt-8 bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Aún no has hecho predicciones
            </h3>
            <p className="text-gray-400 mb-6">
              ¡Empieza a predecir resultados y gana puntos!
            </p>
            <Link
              to="/hacer-prediccion"
              className="inline-block px-8 py-4 bg-primary text-dark-bg font-black rounded-xl hover:bg-emerald-400 hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
              Hacer mi primera predicción
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
