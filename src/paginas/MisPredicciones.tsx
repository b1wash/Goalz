// VISTA DE MIS PREDICCIONES
import { useState } from "react";
import { partidosMock } from "../utils/mockData";
import type { Partido } from "../tipos";
import { useApp } from "../contexto/AppContext";

export const MisPredicciones = () => {
  // OBTENER PREDICCIONES DEL CONTEXTO GLOBAL
  const { predicciones: todasLasPredicciones, usuarioActual } = useApp();

  // FILTRAR SOLO LAS PREDICCIONES DEL USUARIO ACTUAL
  const prediccionesMock = todasLasPredicciones.filter(
    (p) => p.idUsuario === usuarioActual.id,
  );

  // FILTRO PARA MOSTRAR DIFERENTES TIPOS DE PREDICCIONES
  const [filtro, setFiltro] = useState<
    "todas" | "acertadas" | "falladas" | "pendientes"
  >("todas");

  // FUNCION PARA OBTENER EL PARTIDO DE UNA PREDICCION
  const obtenerPartido = (idPartido: string): Partido | undefined => {
    return partidosMock.find((p) => p.id === idPartido);
  };

  // FILTRAR PREDICCIONES SEGUN EL FILTRO SELECCIONADO
  const prediccionesFiltradas = prediccionesMock.filter((pred) => {
    const partido = obtenerPartido(pred.idPartido || pred.matchId || "");
    if (!partido) return false;

    if (filtro === "todas") return true;
    if (filtro === "pendientes") return partido.estado === "pendiente";
    if (filtro === "acertadas")
      return partido.estado === "finalizado" && (pred.puntosGanados ?? 0) > 0;
    if (filtro === "falladas")
      return partido.estado === "finalizado" && (pred.puntosGanados ?? 0) === 0;
    return true;
  });

  // CALCULAR ESTADISTICAS
  const totalPredicciones = prediccionesMock.length;
  const acertadas = prediccionesMock.filter(
    (p) => (p.puntosGanados ?? 0) > 0,
  ).length;
  const puntosTotal = prediccionesMock.reduce(
    (sum, p) => sum + (p.puntosGanados ?? 0),
    0,
  );

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
              Todas ({prediccionesMock.length})
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
        <div className="space-y-4">
          {prediccionesFiltradas.length === 0 ? (
            <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <p className="text-gray-400 text-lg">
                No tienes predicciones en esta categoría
              </p>
            </div>
          ) : (
            prediccionesFiltradas.map((prediccion) => {
              const partido = obtenerPartido(prediccion.idPartido);
              if (!partido) return null;

              const esPendiente = partido.estado === "pendiente";
              const acerto = (prediccion.puntosGanados ?? 0) > 0;

              return (
                <div
                  key={prediccion.id}
                  className={`bg-dark-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all hover:shadow-xl ${
                    esPendiente
                      ? "border-primary/20 hover:border-primary/40"
                      : acerto
                        ? "border-primary/40 hover:border-primary/60 shadow-primary/10"
                        : "border-danger/20 hover:border-danger/40"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* INFORMACION DEL PARTIDO */}
                    <div className="flex-1">
                      {/* FECHA */}
                      <div className="text-xs text-gray-400 mb-3">
                        {new Date(partido.fecha).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      {/* EQUIPOS Y RESULTADO */}
                      <div className="grid grid-cols-3 gap-4 items-center mb-4">
                        <div className="text-right">
                          <p className="font-bold text-white text-lg">
                            {partido.equipoLocal}
                          </p>
                        </div>
                        <div className="text-center">
                          {partido.resultado ? (
                            <div className="text-2xl font-black text-primary">
                              {partido.resultado.golesLocal} -{" "}
                              {partido.resultado.golesVisitante}
                            </div>
                          ) : (
                            <span className="text-gray-400 font-bold">VS</span>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-white text-lg">
                            {partido.equipoVisitante}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* TU PREDICCION */}
                    <div className="lg:border-l lg:border-primary/20 lg:pl-6">
                      <div className="bg-dark-bg/50 rounded-lg p-4 min-w-[200px]">
                        <p className="text-xs text-gray-400 mb-2">
                          Tu predicción:
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">
                            Resultado:
                          </span>
                          <span className="font-bold text-white">
                            {prediccion.prediccion === "1"
                              ? "Victoria Local"
                              : prediccion.prediccion === "X"
                                ? "Empate"
                                : "Victoria Visitante"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">
                            Marcador:
                          </span>
                          <span className="font-bold text-primary">
                            {prediccion.marcadorExacto.local} -{" "}
                            {prediccion.marcadorExacto.visitante}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PUNTOS GANADOS */}
                    <div className="text-center lg:text-right">
                      {esPendiente ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/30 text-warning rounded-lg">
                          <span className="text-xl">⏳</span>
                          <span className="font-bold">Pendiente</span>
                        </div>
                      ) : acerto ? (
                        <div className="inline-flex flex-col items-center gap-1">
                          <div className="text-3xl">✅</div>
                          <div className="text-2xl font-black text-primary">
                            +{prediccion.puntosGanados} pts
                          </div>
                          <div className="text-xs text-gray-400">
                            ¡Acertaste!
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex flex-col items-center gap-1">
                          <div className="text-3xl">❌</div>
                          <div className="text-xl font-bold text-danger">
                            0 pts
                          </div>
                          <div className="text-xs text-gray-400">
                            No acertaste
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* MENSAJE SI NO HAY PREDICCIONES */}
        {prediccionesMock.length === 0 && (
          <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Aún no has hecho predicciones
            </h3>
            <p className="text-gray-400 mb-6">
              ¡Empieza a predecir resultados y gana puntos!
            </p>
            <a
              href="/hacer-prediccion"
              className="inline-block px-6 py-3 bg-primary text-dark-bg font-bold rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Hacer mi primera predicción
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
