// VISTA DEL PANEL DE ADMINISTRACION
import { useState, useEffect } from "react";
import { matchService } from "../services/matchService";
import { predictionService } from "../services/predictionService";
import { userService } from "../services/userService";
import { calcularPuntosGanados } from "../utils/pointsCalculator";
import { validarDatosPartido, validarGoles } from "../utils/validators";
import { Card, Button, Badge } from "../components/ui";
import type {
  Partido,
  DatosFormularioPartido,
  DatosFormularioResultado,
} from "../types";

export const AdminMatches = () => {
  // ESTADOS DE LA PAGINA
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [vistaActual, setVistaActual] = useState<
    "lista" | "crear" | "actualizar"
  >("lista");
  const [partidoSeleccionado, setPartidoSeleccionado] =
    useState<Partido | null>(null);

  // FORMULARIO PARA CREAR NUEVOS PARTIDOS
  const [formCrear, setFormCrear] = useState<DatosFormularioPartido>({
    homeTeam: "",
    awayTeam: "",
    date: "",
    matchday: 1,
  });

  // FORMULARIO PARA ACTUALIZAR RESULTADOS REALES
  const [formResultado, setFormResultado] = useState<DatosFormularioResultado>({
    matchId: "",
    homeGoals: 0,
    awayGoals: 0,
  });

  // CARGAR LOS PARTIDOS AL MONTAR EL COMPONENTE
  useEffect(() => {
    cargarPartidos();
  }, []);

  // FUNCION PARA OBTENER TODOS LOS PARTIDOS DESDE EL SERVICIO
  const cargarPartidos = async () => {
    try {
      setLoading(true);
      const data = await matchService.getAll();
      setPartidos(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los partidos de la base de datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // VALIDAR LOS DATOS DEL FORMULARIO DE CREACION USANDO LA UTILIDAD
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

  // PROCESAR LA CREACION DE UN NUEVO PARTIDO
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

      setSuccess("¡Partido creado exitosamente en el sistema!");
      setFormCrear({ homeTeam: "", awayTeam: "", date: "", matchday: 1 });
      setVistaActual("lista");
      cargarPartidos();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error crítico: no se pudo crear el partido");
      console.error(err);
    }
  };

  // VALIDAR LOS GOLES INTRODUCIDOS USANDO LA UTILIDAD
  const validarFormResultado = (): boolean => {
    if (!formResultado.matchId) {
      setError("Debes seleccionar un partido para continuar");
      return false;
    }
    const validacion = validarGoles(
      formResultado.homeGoals,
      formResultado.awayGoals,
    );
    if (!validacion.esValido) {
      setError(validacion.mensaje);
      return false;
    }
    return true;
  };

  // ACTUALIZAR EL RESULTADO FINAL Y DISPARAR EL CALCULO DE PUNTOS
  const handleActualizarResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormResultado()) return;

    try {
      // 1. ACTUALIZAR EL ESTADO Y RESULTADO DEL PARTIDO EN LA API
      await matchService.updateResult(formResultado.matchId, {
        result: {
          homeGoals: formResultado.homeGoals,
          awayGoals: formResultado.awayGoals,
        },
        status: "finished",
      });

      // 2. CALCULAR Y REPARTIR PUNTOS A TODOS LOS USUARIOS QUE PREDICIERON
      await calcularPuntos(
        formResultado.matchId,
        formResultado.homeGoals,
        formResultado.awayGoals,
      );

      setSuccess("¡Resultado actualizado y puntos repartidos correctamente!");
      setFormResultado({ matchId: "", homeGoals: 0, awayGoals: 0 });
      setVistaActual("lista");
      cargarPartidos();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al procesar el resultado final");
      console.error(err);
    }
  };

  // LOGICA PARA RECORRER PREDICCIONES Y ACTUALIZAR ESTADISTICAS DE USUARIOS
  const calcularPuntos = async (
    matchId: string,
    golesLocal: number,
    golesVisitante: number,
  ) => {
    try {
      // BUSCAR TODAS LAS PREDICCIONES ASOCIADAS A ESTE PARTIDO
      const predicciones = await predictionService.getByMatch(matchId);

      for (const pred of predicciones) {
        // USAR LA UTILIDAD PARA DETERMINAR LOS PUNTOS EXACTOS
        const puntos = calcularPuntosGanados(
          pred.prediction || pred.prediccion,
          {
            home: pred.exactScore?.home ?? pred.marcadorExacto?.local ?? 0,
            away: pred.exactScore?.away ?? pred.marcadorExacto?.visitante ?? 0,
          },
          { homeGoals: golesLocal, awayGoals: golesVisitante },
        );

        // ACTUALIZAR LA PREDICCION CON LOS PUNTOS OBTENIDOS
        await predictionService.updatePoints(pred.id, puntos);

        // ACTUALIZAR EL PERFIL DEL USUARIO CON SUS NUEVOS TOTALES
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
      console.error("ERROR INTERNO AL CALCULAR PUNTOS:", err);
    }
  };

  // PREPARAR EL FORMULARIO PARA ACTUALIZAR UN PARTIDO ESPECIFICO
  const seleccionarPartido = (partido: Partido) => {
    setPartidoSeleccionado(partido);
    setFormResultado({
      matchId: partido.id,
      homeGoals: 0,
      awayGoals: 0,
    });
    setVistaActual("actualizar");
  };

  // RENDERIZADO DE CARGA
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center">
        <div className="text-white text-2xl font-black animate-pulse">
          CARGANDO MODULO ADMIN...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABECERA DEL PANEL */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2 transition-colors">
            🔧 Panel de Administración
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            GESTION CENTRALIZADA DE PARTIDOS Y RESULTADOS
          </p>
        </div>

        {/* MENSAJES DE NOTIFICACION */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-xl">
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

        {/* NAVEGACION INTERNA DEL PANEL */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            onClick={() => setVistaActual("lista")}
            variant={vistaActual === "lista" ? "primary" : "secondary"}
          >
            📋 LISTA DE PARTIDOS
          </Button>
          <Button
            onClick={() => setVistaActual("crear")}
            variant={vistaActual === "crear" ? "primary" : "secondary"}
          >
            ➕ CREAR PARTIDO
          </Button>
        </div>

        {/* SECCION: LISTADO DE PARTIDOS REGISTRADOS */}
        {vistaActual === "lista" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              BASE DE DATOS DE PARTIDOS
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {partidos.map((partido) => (
                <Card key={partido.id} hover className="border-primary/20">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        JORNADA {partido.matchday} •{" "}
                        {new Date(partido.date).toLocaleDateString("es-ES")}
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
                          partido.status === "finished" ? "success" : "warning"
                        }
                      />
                      {partido.status === "pending" && (
                        <Button onClick={() => seleccionarPartido(partido)}>
                          ACTUALIZAR RESULTADO
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SECCION: FORMULARIO DE ALTA DE PARTIDO */}
        {vistaActual === "crear" && (
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
                      setFormCrear({ ...formCrear, homeTeam: e.target.value })
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
                      setFormCrear({ ...formCrear, awayTeam: e.target.value })
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
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-primary/20 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-all"
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
                🚀 CREAR PARTIDO EN LA BASE DE DATOS
              </Button>
            </form>
          </Card>
        )}

        {/* SECCION: ACTUALIZACION DE RESULTADO REAL */}
        {vistaActual === "actualizar" && partidoSeleccionado && (
          <Card className="max-w-2xl mx-auto border-accent/20">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              REGISTRAR RESULTADO FINAL
            </h2>
            <div className="mb-8 p-6 bg-slate-50 dark:bg-dark-bg/50 rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="grid grid-cols-3 gap-4 items-center">
                <p className="text-right font-black text-slate-900 dark:text-white text-2xl uppercase">
                  {partidoSeleccionado.homeTeam}
                </p>
                <div className="text-center text-gray-400 font-bold">VS</div>
                <p className="text-left font-black text-slate-900 dark:text-white text-2xl uppercase">
                  {partidoSeleccionado.awayTeam}
                </p>
              </div>
            </div>

            <form onSubmit={handleActualizarResultado} className="space-y-8">
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
                  MARCADOR FINAL A REGISTRAR:
                </span>
                <span className="text-5xl font-black text-primary tracking-tighter">
                  {formResultado.homeGoals} - {formResultado.awayGoals}
                </span>
              </div>

              <Button type="submit" className="w-full py-5 text-xl">
                🎯 CONFIRMAR RESULTADO Y DISTRIBUIR PUNTOS
              </Button>
              <Button
                onClick={() => setVistaActual("lista")}
                variant="secondary"
                className="w-full"
              >
                CANCELAR
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};
