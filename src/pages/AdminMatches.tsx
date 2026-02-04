// PANEL DE ADMINISTRACION MEJORADO CON MULTIPLES SECCIONES
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { matchService } from "../services/matchService";
import { predictionService } from "../services/predictionService";
import { userService } from "../services/userService";
import { calcularPuntosGanados } from "../utils/pointsCalculator";
import { validarDatosPartido, validarGoles } from "../utils/validators";
import { Card, Button, Badge } from "../components/ui";
import { useApp } from "../context/AppContext";
import type {
  Partido,
  DatosFormularioPartido,
  DatosFormularioResultado,
  Usuario,
  Prediccion,
} from "../types";

export const AdminMatches = () => {
  const { recargarUsuario } = useApp();
  const location = useLocation();

  // ESTADO PARA NAVEGACION ENTRE TABS
  const [tabActiva, setTabActiva] = useState<
    "dashboard" | "partidos" | "usuarios" | "estadisticas"
  >(location.state?.tabActiva || "dashboard");

  // ESTADOS PARA LOS DATOS
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ESTADOS PARA GESTION PARTIDOS
  const [vistaPartidos, setVistaPartidos] = useState<
    "lista" | "crear" | "actualizar"
  >("lista");
  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "pending" | "finished"
  >("todos");
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);
  const [formCrear, setFormCrear] = useState<DatosFormularioPartido>({
    homeTeam: "",
    awayTeam: "",
    date: "",
    matchday: 1,
  });
  const [formResultado, setFormResultado] = useState<DatosFormularioResultado>({
    matchId: "",
    homeGoals: 0,
    awayGoals: 0,
  });

  // CARGAR TODOS LOS DATOS
  useEffect(() => {
    cargarTodosLosDatos();
  }, []);

  const cargarTodosLosDatos = async () => {
    try {
      setLoading(true);
      const [partidosData, usuariosData, prediccionesData] = await Promise.all([
        matchService.getAll(),
        userService.getAll(),
        predictionService.getAll(),
      ]);
      setPartidos(partidosData);
      setUsuarios(usuariosData);
      setPredicciones(prediccionesData);
      setError(null);
    } catch (err) {
      setError("Error al cargar los datos del sistema");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //FUNCION PARA GESTION DE LOS PARTIDOS (MANTENER LAS ORIGINALES)
  const validarFormCrear = (): boolean => {
    const validacion = validarDatosPartido(
      formCrear.homeTeam,
      formCrear.awayTeam,
      formCrear.date,
      formCrear.matchday,
    );
    if (!validacion.esValido) {
      setError(validacion.mensaje);
      return false;
    }
    return true;
  };

  const handleCrearPartido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormCrear()) return;

    try {
      await matchService.create({
        homeTeam: formCrear.homeTeam,
        awayTeam: formCrear.awayTeam,
        date: new Date(formCrear.date).toISOString(),
        matchday: formCrear.matchday,
        status: "pending",
        result: null,
      });

      setSuccess("¡Partido creado exitosamente!");
      setFormCrear({ homeTeam: "", awayTeam: "", date: "", matchday: 1 });
      setVistaPartidos("lista");
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al crear el partido");
      console.error(err);
    }
  };

  const handleActualizarResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formResultado.matchId) {
      setError("Debes seleccionar un partido");
      return;
    }

    const validacion = validarGoles(
      formResultado.homeGoals,
      formResultado.awayGoals,
    );
    if (!validacion.esValido) {
      setError(validacion.mensaje);
      return;
    }

    try {
      await matchService.updateResult(formResultado.matchId, {
        result: {
          homeGoals: formResultado.homeGoals,
          awayGoals: formResultado.awayGoals,
        },
        status: "finished",
      });

      await calcularPuntos(
        formResultado.matchId,
        formResultado.homeGoals,
        formResultado.awayGoals,
      );

      await recargarUsuario();
      setSuccess("¡Resultado actualizado y puntos distribuidos!");
      setFormResultado({ matchId: "", homeGoals: 0, awayGoals: 0 });
      setVistaPartidos("lista");
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al actualizar el resultado");
      console.error(err);
    }
  };

  const calcularPuntos = async (
    matchId: string,
    golesLocal: number,
    golesVisitante: number,
  ) => {
    try {
      const predicciones = await predictionService.getByMatch(matchId);

      for (const pred of predicciones) {
        const puntos = calcularPuntosGanados(
          pred.prediction || pred.prediccion,
          {
            home: pred.exactScore?.home ?? pred.marcadorExacto?.local ?? 0,
            away: pred.exactScore?.away ?? pred.marcadorExacto?.visitante ?? 0,
          },
          { homeGoals: golesLocal, awayGoals: golesVisitante },
        );

        await predictionService.updatePoints(pred.id, puntos);

        const usuario = await userService.getById(pred.userId);
        await userService.updateStats(pred.userId, {
          totalPoints: usuario.totalPoints + puntos,
          correctPredictions:
            puntos > 0
              ? usuario.correctPredictions + 1
              : usuario.correctPredictions,
          totalPredictions: usuario.totalPredictions,
        });
      }
    } catch (err) {
      console.error("Error al calcular puntos:", err);
    }
  };

  const handleEliminarPartido = async (partido: Partido) => {
    if (
      !window.confirm(
        `¿Eliminar "${partido.homeTeam} vs ${partido.awayTeam}"?\n\nSe eliminarán todas las predicciones asociadas.`,
      )
    )
      return;

    try {
      const prediccionesDelPartido = await predictionService.getByMatch(
        partido.id,
      );
      for (const prediccion of prediccionesDelPartido) {
        await predictionService.delete(prediccion.id);
      }
      await matchService.delete(partido.id);
      setSuccess(
        `Partido eliminado (${prediccionesDelPartido.length} predicciones)`,
      );
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al eliminar el partido");
      console.error(err);
    }
  };

  const handleEliminarUsuario = async (usuario: Usuario) => {
    if (
      !window.confirm(
        `¿Eliminar al usuario "${usuario.nombre}"?\n\n⚠️ Se eliminarán todas sus predicciones.`,
      )
    )
      return;

    try {
      const prediccionesUsuario = predicciones.filter(
        (p) => p.userId === usuario.id,
      );
      for (const pred of prediccionesUsuario) {
        await predictionService.delete(pred.id);
      }
      await userService.delete(usuario.id);
      setSuccess(
        `Usuario eliminado (${prediccionesUsuario.length} predicciones)`,
      );
      cargarTodosLosDatos();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al eliminar el usuario");
      console.error(err);
    }
  };

  // Estadísticas calculadas
  const partidosPendientes = partidos.filter((p) => p.status === "pending");
  const partidosFinalizados = partidos.filter((p) => p.status === "finished");
  const usuariosJugadores = usuarios.filter((u) => u.role !== "admin");
  const prediccionesAcertadas = predicciones.filter((p) => (p.points ?? 0) > 0);
  const tasaAcierto =
    predicciones.length > 0
      ? ((prediccionesAcertadas.length / predicciones.length) * 100).toFixed(1)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="text-primary text-2xl font-black animate-pulse uppercase tracking-widest">
          CARGANDO PANEL...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2">
            🔧 Panel de Administración
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-bold">
            GESTIÓN CENTRALIZADA DEL SISTEMA GOALZ
          </p>
        </div>

        {/* MENSAJES */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl animate-shake">
            <p className="text-danger font-bold flex items-center gap-2">
              <span>⚠️</span> {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="text-primary font-bold flex items-center gap-2">
              <span>✅</span> {success}
            </p>
          </div>
        )}

        {/* NAVEGACIÓN POR TABS */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
          <button
            onClick={() => setTabActiva("dashboard")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "dashboard"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            📊 DASHBOARD
          </button>
          <button
            onClick={() => setTabActiva("partidos")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "partidos"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            ⚽ PARTIDOS
          </button>
          <button
            onClick={() => setTabActiva("usuarios")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "usuarios"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            👥 USUARIOS
          </button>
          <button
            onClick={() => setTabActiva("estadisticas")}
            className={`px-6 py-3 rounded-t-xl font-black text-sm transition-all ${
              tabActiva === "estadisticas"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-slate-100 dark:bg-dark-card text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-dark-hover"
            }`}
          >
            📈 ESTADÍSTICAS
          </button>
        </div>

        {/* CONTENIDO SEGÚN TAB ACTIVA */}
        {tabActiva === "dashboard" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Resumen del Sistema
            </h2>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-primary/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">⚽</div>
                  <div className="text-4xl font-black text-primary mb-1">
                    {partidos.length}
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Total Partidos
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-accent/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">👥</div>
                  <div className="text-4xl font-black text-accent mb-1">
                    {usuariosJugadores.length}
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Jugadores Activos
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-blue-500/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">📊</div>
                  <div className="text-4xl font-black text-blue-500 mb-1">
                    {predicciones.length}
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Predicciones Totales
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-emerald-500/20">
                <div className="text-center">
                  <div className="text-5xl mb-3">🎯</div>
                  <div className="text-4xl font-black text-emerald-500 mb-1">
                    {tasaAcierto}%
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Tasa de Acierto
                  </div>
                </div>
              </Card>
            </div>

            {/* Resumen de jornada */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>📅</span> Partidos Pendientes
                </h3>
                <div className="space-y-3">
                  {partidosPendientes.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {p.homeTeam} vs {p.awayTeam}
                      </span>
                      <Badge text="PENDIENTE" variant="warning" />
                    </div>
                  ))}
                  {partidosPendientes.length === 0 && (
                    <p className="text-gray-400 text-center py-4">
                      No hay partidos pendientes
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏆</span> Top 5 Clasificación
                </h3>
                <div className="space-y-3">
                  {usuariosJugadores
                    .sort((a, b) => (b.puntosTotal ?? 0) - (a.puntosTotal ?? 0))
                    .slice(0, 5)
                    .map((u, i) => (
                      <div
                        key={u.id}
                        className="p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-primary">
                            #{i + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {u.nombre}
                          </span>
                        </div>
                        <span className="font-black text-primary">
                          {u.puntosTotal} pts
                        </span>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB PARTIDOS - contenido original */}
        {tabActiva === "partidos" && (
          <div>
            {/* Navegación interna */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={() => setVistaPartidos("lista")}
                variant={vistaPartidos === "lista" ? "primary" : "secondary"}
              >
                📋 LISTA
              </Button>
              <Button
                onClick={() => setVistaPartidos("crear")}
                variant={vistaPartidos === "crear" ? "primary" : "secondary"}
              >
                ➕ CREAR
              </Button>
            </div>

            {/* Lista de partidos */}
            {vistaPartidos === "lista" && (
              <div className="space-y- 4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    BASE DE DATOS DE PARTIDOS
                  </h2>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setFiltroEstado("todos")}
                      variant={
                        filtroEstado === "todos" ? "primary" : "secondary"
                      }
                      className="text-sm"
                    >
                      TODOS ({partidos.length})
                    </Button>
                    <Button
                      onClick={() => setFiltroEstado("pending")}
                      variant={
                        filtroEstado === "pending" ? "primary" : "secondary"
                      }
                      className="text-sm"
                    >
                      PENDIENTES ({partidosPendientes.length})
                    </Button>
                    <Button
                      onClick={() => setFiltroEstado("finished")}
                      variant={
                        filtroEstado === "finished" ? "primary" : "secondary"
                      }
                      className="text-sm"
                    >
                      FINALIZADOS ({partidosFinalizados.length})
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {partidos
                    .filter(
                      (partido) =>
                        filtroEstado === "todos" ||
                        partido.status === filtroEstado,
                    )
                    .map((partido) => (
                      <Card
                        key={partido.id}
                        hover
                        className="border-primary/20"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                          <div className="flex-1">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                              JORNADA {partido.matchday} •{" "}
                              {new Date(partido.date).toLocaleDateString(
                                "es-ES",
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-8 items-center">
                              <p className="text-right font-black text-slate-900 dark:text-white text-xl">
                                {partido.homeTeam}
                              </p>
                              <div className="text-center">
                                {partido.result ? (
                                  <div className="text-3xl font-black text-primary">
                                    {partido.result.homeGoals} -{" "}
                                    {partido.result.awayGoals}
                                  </div>
                                ) : (
                                  <div className="text-gray-400 font-black border-2 border-gray-200 dark:border-gray-700 rounded-lg py-1">
                                    VS
                                  </div>
                                )}
                              </div>
                              <p className="text-left font-black text-slate-900 dark:text-white text-xl">
                                {partido.awayTeam}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge
                              text={
                                partido.status === "finished"
                                  ? "FINALIZADO"
                                  : "PENDIENTE"
                              }
                              variant={
                                partido.status === "finished"
                                  ? "success"
                                  : "warning"
                              }
                            />
                            {partido.status === "pending" && (
                              <Button
                                onClick={() => {
                                  setPartidoSeleccionado(partido);
                                  setFormResultado({
                                    matchId: partido.id,
                                    homeGoals: 0,
                                    awayGoals: 0,
                                  });
                                  setVistaPartidos("actualizar");
                                }}
                              >
                                ACTUALIZAR
                              </Button>
                            )}
                            <Button
                              onClick={() => handleEliminarPartido(partido)}
                              variant="danger"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>
            )}

            {/* Formulario crear */}
            {vistaPartidos === "crear" && (
              <Card className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                  NUEVO PARTIDO
                </h2>
                <form onSubmit={handleCrearPartido} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        EQUIPO LOCAL
                      </label>
                      <input
                        type="text"
                        value={formCrear.homeTeam}
                        onChange={(e) =>
                          setFormCrear({
                            ...formCrear,
                            homeTeam: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                        placeholder="REAL MADRID"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        EQUIPO VISITANTE
                      </label>
                      <input
                        type="text"
                        value={formCrear.awayTeam}
                        onChange={(e) =>
                          setFormCrear({
                            ...formCrear,
                            awayTeam: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                        placeholder="FC BARCELONA"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        FECHA Y HORA
                      </label>
                      <input
                        type="datetime-local"
                        value={formCrear.date}
                        onChange={(e) =>
                          setFormCrear({ ...formCrear, date: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all appearance-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        JORNADA
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formCrear.matchday}
                        onChange={(e) =>
                          setFormCrear({
                            ...formCrear,
                            matchday: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full py-4 text-lg">
                    🚀 CREAR PARTIDO
                  </Button>
                </form>
              </Card>
            )}

            {/* Formulario actualizar resultado */}
            {vistaPartidos === "actualizar" && partidoSeleccionado && (
              <Card className="max-w-2xl mx-auto border-accent/20">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                  REGISTRAR RESULTADO FINAL
                </h2>
                <div className="mb-8 p-6 bg-slate-50 dark:bg-dark-bg/50 rounded-2xl border border-slate-200 dark:border-white/10">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <p className="text-right font-black text-slate-900 dark:text-white text-2xl uppercase">
                      {partidoSeleccionado.homeTeam}
                    </p>
                    <div className="text-center text-gray-400 font-bold">
                      VS
                    </div>
                    <p className="text-left font-black text-slate-900 dark:text-white text-2xl uppercase">
                      {partidoSeleccionado.awayTeam}
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleActualizarResultado}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        GOLES LOCAL
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formResultado.homeGoals}
                        onChange={(e) =>
                          setFormResultado({
                            ...formResultado,
                            homeGoals: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-6 bg-slate-50 dark:bg-dark-bg border-2 border-slate-200 dark:border-primary/20 rounded-2xl text-slate-900 dark:text-white text-4xl font-black text-center focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block text-slate-700 dark:text-slate-300 font-black mb-2 uppercase text-xs tracking-wider">
                        GOLES VISITANTE
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={formResultado.awayGoals}
                        onChange={(e) =>
                          setFormResultado({
                            ...formResultado,
                            awayGoals: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-6 bg-slate-50 dark:bg-dark-bg border-2 border-slate-200 dark:border-primary/20 rounded-2xl text-slate-900 dark:text-white text-4xl font-black text-center focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/20 text-center">
                    <span className="text-gray-500 dark:text-gray-400 font-bold block mb-2">
                      MARCADOR FINAL:
                    </span>
                    <span className="text-5xl font-black text-primary tracking-tighter">
                      {formResultado.homeGoals} - {formResultado.awayGoals}
                    </span>
                  </div>

                  <Button type="submit" className="w-full py-5 text-xl">
                    🎯 CONFIRMAR Y DISTRIBUIR PUNTOS
                  </Button>
                  <Button
                    onClick={() => setVistaPartidos("lista")}
                    variant="secondary"
                    className="w-full"
                  >
                    CANCELAR
                  </Button>
                </form>
              </Card>
            )}
          </div>
        )}

        {/* TAB USUARIOS */}
        {tabActiva === "usuarios" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              GESTIÓN DE USUARIOS
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {usuarios.map((usuario) => (
                <Card key={usuario.id} hover className="border-primary/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-black text-xl">
                        {usuario.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                          {usuario.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
                          {usuario.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge
                        text={usuario.role === "admin" ? "ADMIN" : "JUGADOR"}
                        variant={usuario.role === "admin" ? "primary" : "info"}
                      />
                      {usuario.role !== "admin" && (
                        <>
                          <div className="text-right">
                            <div className="text-2xl font-black text-primary">
                              {usuario.puntosTotal}
                            </div>
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              PUNTOS
                            </div>
                          </div>
                          <Button
                            onClick={() => handleEliminarUsuario(usuario)}
                            variant="danger"
                            className="text-sm"
                          >
                            🗑️ ELIMINAR
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB ESTADÍSTICAS */}
        {tabActiva === "estadisticas" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              ESTADÍSTICAS GENERALES
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Resumen de Predicciones
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Total de predicciones:
                    </span>
                    <span className="font-black text-2xl text-primary">
                      {predicciones.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Predicciones acertadas:
                    </span>
                    <span className="font-black text-2xl text-emerald-500">
                      {prediccionesAcertadas.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Tasa de acierto global:
                    </span>
                    <span className="font-black text-2xl text-accent">
                      {tasaAcierto}%
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
                  Estado del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Partidos creados:
                    </span>
                    <span className="font-black text-2xl text-primary">
                      {partidos.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Partidos pendientes:
                    </span>
                    <span className="font-black text-2xl text-blue-500">
                      {partidosPendientes.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-dark-bg/50 rounded-lg">
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Usuarios registrados:
                    </span>
                    <span className="font-black text-2xl text-accent">
                      {usuarios.length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
