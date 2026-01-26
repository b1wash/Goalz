// VISTA DEL PANEL DE ADMINISTRACION
import { useState, useEffect } from "react";
import { matchService } from "../servicios/matchService";
import { predictionService } from "../servicios/predictionService";
import { userService } from "../servicios/userService";
import type {
  Partido,
  DatosFormularioPartido,
  DatosFormularioResultado,
} from "../tipos";

export const AdminMatches = () => {
  // ESTADOS
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [vistaActual, setVistaActual] = useState<
    "lista" | "crear" | "actualizar"
  >("lista");
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);

  // FORMULARIO CREAR PARTIDO
  const [formCrear, setFormCrear] = useState<DatosFormularioPartido>({
    homeTeam: "",
    awayTeam: "",
    date: "",
    matchday: 1,
  });

  // FORMULARIO ACTUALIZAR RESULTADO
  const [formResultado, setFormResultado] = useState<DatosFormularioResultado>({
    matchId: "",
    homeGoals: 0,
    awayGoals: 0,
  });

  // CARGAR PARTIDOS AL INICIAR
  useEffect(() => {
    cargarPartidos();
  }, []);

  const cargarPartidos = async () => {
    try {
      setLoading(true);
      const data = await matchService.getAll();
      setPartidos(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los partidos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // VALIDAR FORMULARIO CREAR PARTIDO
  const validarFormCrear = (): boolean => {
    if (!formCrear.homeTeam.trim()) {
      setError("El equipo local es obligatorio");
      return false;
    }
    if (!formCrear.awayTeam.trim()) {
      setError("El equipo visitante es obligatorio");
      return false;
    }
    if (formCrear.homeTeam === formCrear.awayTeam) {
      setError("Los equipos deben ser diferentes");
      return false;
    }
    if (!formCrear.date) {
      setError("La fecha es obligatoria");
      return false;
    }
    if (new Date(formCrear.date) < new Date()) {
      setError("La fecha debe ser futura");
      return false;
    }
    if (formCrear.matchday < 1) {
      setError("La jornada debe ser mayor a 0");
      return false;
    }
    return true;
  };

  // CREAR PARTIDO
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

      setSuccess("¡Partido creado correctamente!");
      setFormCrear({ homeTeam: "", awayTeam: "", date: "", matchday: 1 });
      setVistaActual("lista");
      cargarPartidos();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al crear el partido");
      console.error(err);
    }
  };

  // VALIDAR FORMULARIO RESULTADO
  const validarFormResultado = (): boolean => {
    if (!formResultado.matchId) {
      setError("Debes seleccionar un partido");
      return false;
    }
    if (formResultado.homeGoals < 0 || formResultado.awayGoals < 0) {
      setError("Los goles no pueden ser negativos");
      return false;
    }
    if (formResultado.homeGoals > 20 || formResultado.awayGoals > 20) {
      setError("Los goles no pueden ser mayores a 20");
      return false;
    }
    return true;
  };

  // ACTUALIZAR RESULTADO Y CALCULAR PUNTOS
  const handleActualizarResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormResultado()) return;

    try {
      // 1. ACTUALIZAR RESULTADO DEL PARTIDO
      await matchService.updateResult(formResultado.matchId, {
        result: {
          homeGoals: formResultado.homeGoals,
          awayGoals: formResultado.awayGoals,
        },
        status: "finished",
      });

      // 2. CALCULAR PUNTOS DE TODAS LAS PREDICCIONES DE ESTE PARTIDO
      await calcularPuntos(
        formResultado.matchId,
        formResultado.homeGoals,
        formResultado.awayGoals,
      );

      setSuccess("¡Resultado actualizado y puntos calculados!");
      setFormResultado({ matchId: "", homeGoals: 0, awayGoals: 0 });
      setVistaActual("lista");
      cargarPartidos();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al actualizar el resultado");
      console.error(err);
    }
  };

  // CALCULAR PUNTOS DE LAS PREDICCIONES
  const calcularPuntos = async (
    matchId: string,
    golesLocal: number,
    golesVisitante: number,
  ) => {
    try {
      // OBTENER TODAS LAS PREDICCIONES DE ESTE PARTIDO
      const predicciones = await predictionService.getByMatch(matchId);

      // DETERMINAR EL RESULTADO REAL (1, X, 2)
      let resultadoReal: "1" | "X" | "2";
      if (golesLocal > golesVisitante) resultadoReal = "1";
      else if (golesLocal < golesVisitante) resultadoReal = "2";
      else resultadoReal = "X";

      // CALCULAR PUNTOS PARA CADA PREDICCION
      for (const pred of predicciones) {
        let puntos = 0;

        // VERIFICAR SI ACERTO EL MARCADOR EXACTO (5 PUNTOS)
        if (
          pred.exactScore.home === golesLocal &&
          pred.exactScore.away === golesVisitante
        ) {
          puntos = 5;
        }
        // VERIFICAR SI ACERTO EL RESULTADO (3 PUNTOS)
        else if (pred.prediction === resultadoReal) {
          puntos = 3;
        }

        // ACTUALIZAR PUNTOS DE LA PREDICCION
        await predictionService.updatePoints(pred.id, puntos);

        // ACTUALIZAR ESTADISTICAS DEL USUARIO
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

  // SELECCIONAR PARTIDO PARA ACTUALIZAR
  const seleccionarPartido = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setFormResultado({
      matchId: partido.id,
      homeGoals: 0,
      awayGoals: 0,
    });
    setVistaActual("actualizar");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITULO */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
            🔧 Panel de Administración
          </h1>
          <p className="text-gray-400 text-lg">
            Gestiona partidos y resultados
          </p>
        </div>

        {/* MENSAJES */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-danger font-semibold flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-primary font-semibold flex items-center gap-2">
              <span className="text-xl">✅</span>
              {success}
            </p>
          </div>
        )}

        {/* BOTONES DE NAVEGACION */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setVistaActual("lista")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              vistaActual === "lista"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-dark-card text-gray-400 hover:text-white border border-primary/20"
            }`}
          >
            📋 Lista de Partidos
          </button>
          <button
            onClick={() => setVistaActual("crear")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              vistaActual === "crear"
                ? "bg-primary text-dark-bg shadow-lg"
                : "bg-dark-card text-gray-400 hover:text-white border border-primary/20"
            }`}
          >
            ➕ Crear Partido
          </button>
        </div>

        {/* VISTA: LISTA DE PARTIDOS */}
        {vistaActual === "lista" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Todos los Partidos
            </h2>
            {partidos.map((partido) => (
              <div
                key={partido.id}
                className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-2">
                      Jornada {partido.matchday} -{" "}
                      {new Date(partido.date).toLocaleDateString("es-ES")}
                    </div>
                    <div className="grid grid-cols-3 gap-4 items-center mb-2">
                      <div className="text-right">
                        <p className="font-bold text-white text-lg">
                          {partido.homeTeam}
                        </p>
                      </div>
                      <div className="text-center">
                        {partido.result ? (
                          <div className="text-2xl font-black text-primary">
                            {partido.result.homeGoals} -{" "}
                            {partido.result.awayGoals}
                          </div>
                        ) : (
                          <span className="text-gray-400 font-bold">VS</span>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white text-lg">
                          {partido.awayTeam}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <span
                        className={`px-2 py-1 rounded ${
                          partido.status === "finished"
                            ? "bg-primary/20 text-primary"
                            : "bg-warning/20 text-warning"
                        }`}
                      >
                        {partido.status === "finished"
                          ? "Finalizado"
                          : "Pendiente"}
                      </span>
                    </div>
                  </div>

                  {partido.status === "pending" && (
                    <button
                      onClick={() => seleccionarPartido(partido)}
                      className="px-4 py-2 bg-primary text-dark-bg font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Actualizar Resultado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTA: CREAR PARTIDO */}
        {vistaActual === "crear" && (
          <form
            onSubmit={handleCrearPartido}
            className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 sm:p-8 max-w-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Crear Nuevo Partido
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">
                  Equipo Local
                </label>
                <input
                  type="text"
                  value={formCrear.homeTeam}
                  onChange={(e) =>
                    setFormCrear({ ...formCrear, homeTeam: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Ej: Real Madrid"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  Equipo Visitante
                </label>
                <input
                  type="text"
                  value={formCrear.awayTeam}
                  onChange={(e) =>
                    setFormCrear({ ...formCrear, awayTeam: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Ej: FC Barcelona"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={formCrear.date}
                  onChange={(e) =>
                    setFormCrear({ ...formCrear, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  Jornada
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
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary to-emerald-600 text-dark-bg font-black text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                ✅ Crear Partido
              </button>
            </div>
          </form>
        )}

        {/* VISTA: ACTUALIZAR RESULTADO */}
        {vistaActual === "actualizar" && partidoSeleccionado && (
          <form
            onSubmit={handleActualizarResultado}
            className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 sm:p-8 max-w-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Actualizar Resultado
            </h2>

            <div className="mb-6 p-4 bg-dark-bg/50 rounded-lg">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <p className="font-bold text-white text-xl">
                    {partidoSeleccionado.homeTeam}
                  </p>
                </div>
                <div className="text-center text-gray-400 font-bold">VS</div>
                <div className="text-left">
                  <p className="font-bold text-white text-xl">
                    {partidoSeleccionado.awayTeam}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white font-bold mb-2">
                  Goles Local
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
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-2">
                  Goles Visitante
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
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-dark-bg/50 rounded-lg border border-primary/30">
                <span className="text-gray-400">Resultado:</span>
                <span className="text-3xl font-black text-primary">
                  {formResultado.homeGoals} - {formResultado.awayGoals}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-primary to-emerald-600 text-dark-bg font-black text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              🎯 Guardar Resultado y Calcular Puntos
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
