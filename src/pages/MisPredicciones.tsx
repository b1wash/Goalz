// VISTA PERSONAL DEL USUARIO: REPASO DE TODAS SUS APUESTAS
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { matchService } from "../services/matchService";
import { predictionService } from "../services/predictionService";
import { useApp } from "../context/AppContext";
import { PredictionCard } from "../components/predictions";
import { Card, Button } from "../components/ui";
import type { Partido, Prediccion } from "../types";

export const MisPredicciones = () => {
  const { usuarioActual } = useApp();

  // ESTADOS PRINCIPALES DE DATOS
  const [todasLasPredicciones, setTodasLasPredicciones] = useState<
    Prediccion[]
  >([]);
  const [todosLosPartidos, setTodosLosPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ESTADO PARA EL FILTRADO DINAMICO DE LA LISTA
  const [filtro, setFiltro] = useState<
    "todas" | "acertadas" | "falladas" | "pendientes"
  >("todas");

  // ESTADO PARA LA PAGINACION
  const [paginaActual, setPaginaActual] = useState(1);
  const ITEMS_POR_PAGINA = 9;

  // EFECTO PARA CARGAR PREDICCIONES Y PARTIDOS EN PARALELO
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        if (!usuarioActual) return;

        // 1. OBTENER LAS PREDICCIONES DEL USUARIO ACTUAL
        const predictionsData = await predictionService.getByUser(
          usuarioActual.id,
        );
        setTodasLasPredicciones(predictionsData);

        // 2. OBTENER EL CATALOGO DE PARTIDOS PARA CRUZAR LOS DATOS
        const matchesData = await matchService.getAll();
        setTodosLosPartidos(matchesData);

        setError(null);
      } catch (err) {
        setError("Error al cargar tu historial de predicciones");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuarioActual]);

  // FUNCION AUXILIAR PARA ENCONTRAR DETALLES DE UN PARTIDO POR SU ID
  const obtenerPartido = (idPartido: string): Partido | undefined => {
    return todosLosPartidos.find((p) => p.id === idPartido);
  };

  // LOGICA DE FILTRADO PARA LA INTERFAZ
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

  // LOGICA DE PAGINACION
  const totalPaginas = Math.ceil(
    prediccionesFiltradas.length / ITEMS_POR_PAGINA,
  );
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const indiceFin = indiceInicio + ITEMS_POR_PAGINA;
  const prediccionesPaginadas = prediccionesFiltradas.slice(
    indiceInicio,
    indiceFin,
  );

  // RESETEAR PAGINA CUANDO CAMBIA EL FILTRO
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  // CALCULOS EN TIEMPO REAL PARA EL RESUMEN SUPERIOR
  const totalPredicciones = todasLasPredicciones.length;
  const acertadas = todasLasPredicciones.filter(
    (p) => (p.points ?? p.puntosGanados ?? 0) > 0,
  ).length;
  const puntosTotal = todasLasPredicciones.reduce(
    (sum, p) => sum + (p.points ?? p.puntosGanados ?? 0),
    0,
  );

  // PANTALLA DE CARGA ESTILIZADA
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-primary font-black uppercase tracking-widest">
            Calculando resultados...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABECERA DE LA VISTA */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-2">
            📊 Mis Predicciones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-bold uppercase tracking-widest">
            HISTORIAL COMPLETO DE TUS APUESTAS DEPORTIVAS
          </p>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mb-8 p-6 bg-danger/10 border-2 border-danger/30 rounded-2xl">
            <p className="text-danger font-black flex items-center gap-3">
              <span className="text-2xl">⚠️</span> {error}
            </p>
          </div>
        )}

        {/* PANEL DE ESTADISTICAS RAPIDAS (SUMMARY) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card className="flex flex-col items-center justify-center p-8 bg-primary/5 border-primary/20">
            <div className="text-5xl font-black text-primary mb-2">
              {totalPredicciones}
            </div>
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Total predicciones
            </div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-8 bg-blue-500/5 border-blue-500/20">
            <div className="text-5xl font-black text-blue-500 mb-2">
              {acertadas}
            </div>
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Aciertos totales
            </div>
          </Card>
          <Card className="flex flex-col items-center justify-center p-8 bg-accent/5 border-accent/20">
            <div className="text-5xl font-black text-accent mb-2">
              {puntosTotal}
            </div>
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Puntos acumulados
            </div>
          </Card>
        </div>

        {/* BARRA DE FILTROS PARA LA LISTA */}
        <div className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-md border border-slate-200 dark:border-primary/20 rounded-2xl p-4 mb-10 flex flex-wrap gap-3">
          {[
            { id: "todas", label: "VER TODAS", count: totalPredicciones },
            {
              id: "pendientes",
              label: "PENDIENTES",
              count:
                totalPredicciones -
                (acertadas +
                  todasLasPredicciones.filter((p) => p.points === 0).length),
            },
            { id: "acertadas", label: "ACERTADAS", count: acertadas },
            {
              id: "falladas",
              label: "FALLADAS",
              count: todasLasPredicciones.filter(
                (p) => (p.points ?? 0) === 0 && p.points !== null,
              ).length,
            },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() =>
                setFiltro(
                  f.id as "todas" | "acertadas" | "falladas" | "pendientes",
                )
              }
              className={`px-6 py-3 rounded-xl font-black text-xs tracking-widest transition-all ${
                filtro === f.id
                  ? "bg-primary text-dark-bg shadow-lg shadow-primary/20"
                  : "bg-slate-100 dark:bg-dark-bg/50 text-gray-500 hover:text-primary"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* LISTADO DE TARJETAS DE PREDICCION - PAGINADAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prediccionesPaginadas.length === 0 ? (
            <div className="col-span-full py-20 bg-slate-50 dark:bg-dark-card/20 border-2 border-dashed border-slate-200 dark:border-primary/10 rounded-3xl text-center">
              <div className="text-6xl mb-6 grayscale opacity-50">🤷‍♂️</div>
              <p className="text-gray-500 dark:text-gray-400 text-xl font-black uppercase tracking-widest">
                No hay resultados para esta categoría
              </p>
            </div>
          ) : (
            prediccionesPaginadas.map((prediccion) => {
              const partido = obtenerPartido(
                prediccion.matchId || prediccion.idPartido || "",
              );
              if (!partido) return null;

              return (
                <div
                  key={prediccion.id}
                  className="transform hover:-translate-y-2 transition-transform duration-300"
                >
                  <PredictionCard prediction={prediccion} match={partido} />
                </div>
              );
            })
          )}
        </div>

        {/* CONTROLES DE PAGINACION */}
        {totalPaginas > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <Button
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setPaginaActual(num)}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                      paginaActual === num
                        ? "bg-primary text-dark-bg shadow-lg shadow-primary/20"
                        : "bg-slate-100 dark:bg-dark-bg text-gray-500 hover:text-primary"
                    }`}
                  >
                    {num}
                  </button>
                ),
              )}
            </div>

            <Button
              onClick={() =>
                setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
              }
              disabled={paginaActual === totalPaginas}
              className="px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </Button>
          </div>
        )}

        {/* CASO: USUARIO SIN HISTORIAL TOTAL */}
        {todasLasPredicciones.length === 0 && !loading && (
          <div className="mt-12 bg-white dark:bg-dark-card/50 border-2 border-primary/20 rounded-3xl p-16 text-center">
            <div className="text-7xl mb-6">🎯</div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase">
              ¿Aún no has empezado a jugar?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              Realiza tu primera predicción ahora y compite por el primer puesto
              de la clasificación general.
            </p>
            <Link to="/hacer-prediccion">
              <Button className="px-12 py-5 text-xl">
                🚀 ¡Hacer mi primera apuesta ahora!
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
