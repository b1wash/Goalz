// VISTA PARA HACER UNA PREDICCION
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { matchService } from "../services/matchService";
import { predictionService } from "../services/predictionService";
import { userService } from "../services/userService";
import { validarCoherenciaMarcador, validarGoles } from "../utils/validators";
import { Card, Button } from "../components/ui";
import type { Partido, Prediccion } from "../types";

export const HacerPrediccion = () => {
  // OBTENER FUNCIONES Y DATOS DEL CONTEXTO GLOBAL
  const { agregarPrediccion, usuarioActual, recargarUsuario } = useApp();

  // ESTADOS DEL FORMULARIO Y DATOS
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [prediccionesUsuario, setPrediccionesUsuario] = useState<Prediccion[]>(
    [],
  );
  const [partidoSeleccionado, setPartidoSeleccionado] = useState("");
  const [partidoActual, setPartidoActual] = useState<Partido | null>(null);
  const [prediccion, setPrediccion] = useState<"1" | "X" | "2">("1");
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // ESTADOS DE UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  // CARGAR PARTIDOS Y PREDICCIONES DEL USUARIO AL INICIAR
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = await matchService.getAll();
        setPartidos(data);

        // CARGAR PREDICCIONES DEL USUARIO PARA EVITAR DUPLICADOS
        if (usuarioActual) {
          const predicciones = await predictionService.getByUser(
            usuarioActual.id,
          );
          setPrediccionesUsuario(predicciones);
        }
      } catch (err) {
        console.error("Error al cargar partidos:", err);
        setError("Error al cargar los partidos desde el servidor");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [usuarioActual]);

  // FILTRAR SOLO PARTIDOS QUE AUN NO HAN COMENZADO Y QUE COINCIDAN CON LA BÚSQUEDA
  const partidosPendientes = partidos.filter((p) => {
    const esPendiente = p.status === "pending" || p.estado === "pendiente";
    if (!esPendiente) return false;

    if (busqueda) {
      const b = busqueda.toLowerCase();
      return (
        p.homeTeam.toLowerCase().includes(b) ||
        p.awayTeam.toLowerCase().includes(b)
      );
    }
    return true;
  });

  // VALIDAR QUE LA PREDICCION SEA LOGICA RESPECTO AL MARCADOR
  const validarPrediccion = (): boolean => {
    if (!partidoSeleccionado) {
      setError("Por favor, selecciona un partido de la lista");
      return false;
    }

    // VERIFICAR SI YA EXISTE UNA PREDICCIÓN PARA ESTE PARTIDO
    const yaPredicho = prediccionesUsuario.find(
      (p) => (p.matchId || p.idPartido) === partidoSeleccionado,
    );
    if (yaPredicho) {
      setError(
        "YA HAS HECHO UNA PREDICCIÓN PARA ESTE PARTIDO. No puedes modificarla.",
      );
      return false;
    }

    // 1. VALIDAR COHERENCIA (EJ: SI PONES 2-0 NO PUEDE SER PREDICCION 'X' O '2')
    const coherencia = validarCoherenciaMarcador(
      prediccion,
      golesLocal,
      golesVisitante,
    );
    if (!coherencia.esValido) {
      setError(coherencia.mensaje);
      return false;
    }

    // 2. VALIDAR QUE LOS GOLES ESTEN EN RANGOS REALISTAS
    const validacionGoles = validarGoles(golesLocal, golesVisitante);
    if (!validacionGoles.esValido) {
      setError(validacionGoles.mensaje);
      return false;
    }

    setError("");
    return true;
  };

  // PROCESAR EL ENVIO DE LA PREDICCION A LA API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VERIFICAR SESION Y VALIDACIONES
    if (!validarPrediccion() || !usuarioActual) {
      if (!usuarioActual)
        setError("Debes estar identificado para realizar predicciones");
      return;
    }

    try {
      setLoading(true);

      const nuevaPrediccion: Omit<Prediccion, "id"> = {
        matchId: partidoSeleccionado,
        idPartido: partidoSeleccionado,
        userId: usuarioActual!.id,
        idUsuario: usuarioActual!.id,
        prediction: prediccion,
        prediccion: prediccion,
        exactScore: {
          home: golesLocal,
          away: golesVisitante,
          local: golesLocal,
          visitante: golesVisitante,
        },
        marcadorExacto: {
          home: golesLocal,
          away: golesVisitante,
          local: golesLocal,
          visitante: golesVisitante,
        },
        points: null,
        puntosGanados: null,
        createdAt: new Date().toISOString(),
      };

      // REGISTRAR EN LA API
      await predictionService.create(nuevaPrediccion);

      // ACTUALIZAR ESTADISTICAS DEL USUARIO (INCREMENTAR TOTAL)
      if (usuarioActual) {
        await userService.updateStats(usuarioActual.id, {
          totalPredictions: (usuarioActual.totalPredictions || 0) + 1,
        });
        // RECARGAR DATOS DEL USUARIO EN EL CONTEXTO
        await recargarUsuario();
      }

      // ACTUALIZAR ESTADO GLOBAL DE PREDICCIONES
      agregarPrediccion(nuevaPrediccion);

      // ACTUALIZAR ESTADO LOCAL PARA BLOQUEAR DUPLICADOS INMEDIATAMENTE
      setPrediccionesUsuario((prev) => [
        ...prev,
        { ...nuevaPrediccion, id: Date.now().toString() } as Prediccion,
      ]);

      // RESETEAR FORMULARIO Y MOSTRAR EXITO
      setExito(true);
      setPartidoSeleccionado("");
      setGolesLocal(0);
      setGolesVisitante(0);
      setPrediccion("1");

      setTimeout(() => setExito(false), 5000);
    } catch (err) {
      console.error("Error al guardar predicción:", err);
      setError("Error al guardar la prediccion en el sistema");
    } finally {
      setLoading(false);
    }
  };

  if (loading && partidos.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="text-primary text-2xl font-black animate-pulse uppercase tracking-widest">
          Cargando partidos...
        </div>
      </div>
    );
  }

  // BLOQUEAR ACCESO SI ES ADMIN
  if (usuarioActual?.role === "admin") {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
              <div className="text-8xl mb-6 filter drop-shadow-2xl">🎯</div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                SOLO PARA JUGADORES
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-8">
                Como administrador, tu rol es gestionar los partidos y
                resultados, no hacer predicciones.
              </p>
              <Link to="/admin">
                <Button className="px-8 py-3 text-lg font-black group">
                  <span>🔧</span>
                  <span className="ml-2">IR AL PANEL DE GESTIÓN</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-6 transition-colors duration-150">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        {/* CABECERA - COMPACTA */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 bg-linear-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white bg-clip-text text-transparent">
            ⚡ Hacer Predicción
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-bold uppercase tracking-wider">
            DEMUESTRA TUS CONOCIMIENTOS Y GANA PUNTOS
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL - ULTRA COMPACTO */}
        <Card className="p-5 sm:p-6 relative overflow-hidden ring-1 ring-slate-200 dark:ring-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

          {/* MENSAJES DE ESTADO */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border-2 border-danger/30 rounded-xl animate-shake">
              <p className="text-danger font-black flex items-center gap-2 text-sm">
                <span className="text-xl">⚠️</span> {error}
              </p>
            </div>
          )}

          {exito && (
            <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl animate-bounce-subtle">
              <p className="text-primary font-black flex items-center gap-2 text-base">
                <span className="text-xl">✅</span> ¡PREDICCION GUARDADA! REVISA
                "MIS PREDICCIONES"
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* 1. SELECCION DE PARTIDO (CUSTOM DROPDOWN CON LOGOS) */}
            <div className="space-y-2.5">
              <label className="text-slate-900 dark:text-white text-base font-black uppercase tracking-tight flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary text-dark-bg flex items-center justify-center text-[10px] shadow-sm">
                  1
                </span>
                Partido
              </label>

              <div className="relative">
                {/* TRIGGER (EL BOTÓN QUE PARECE UN SELECT) */}
                <div
                  onClick={() => {
                    setExito(false);
                    setDropdownAbierto(!dropdownAbierto);
                  }}
                  className={`w-full p-4 bg-white dark:bg-dark-card border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between group ${
                    partidoSeleccionado
                      ? "border-primary shadow-lg shadow-primary/5"
                      : "border-slate-100 dark:border-white/5 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {partidoActual ? (
                      <>
                        <div className="flex -space-x-2">
                          <img
                            src={partidoActual.homeLogo}
                            className="w-8 h-8 object-contain rounded-full bg-slate-50 p-1 shadow-sm border border-slate-200"
                          />
                          <img
                            src={partidoActual.awayLogo}
                            className="w-8 h-8 object-contain rounded-full bg-slate-50 p-1 shadow-sm border border-slate-200"
                          />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white uppercase text-sm">
                            {partidoActual.homeTeam} VS {partidoActual.awayTeam}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">
                            Jornada {partidoActual.matchday}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-xl opacity-50">🏟️</span>
                        <span className="font-bold text-gray-400 uppercase text-sm tracking-wider">
                          Elegir partido de la jornada...
                        </span>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xl transition-transform duration-300 ${dropdownAbierto ? "rotate-180" : ""}`}
                  >
                    {dropdownAbierto ? "🔼" : "🔽"}
                  </span>
                </div>

                {/* DROPDOWN MENU (EL DESPLEGABLE) */}
                {dropdownAbierto && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1c2e] border-2 border-slate-100 dark:border-primary/20 rounded-2xl shadow-2xl z-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
                    {/* BUSCADOR DENTRO DEL DROPDOWN */}
                    <div className="p-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="BUSCAR EQUIPO..."
                          autoFocus
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-dark-bg border-2 border-slate-100 dark:border-white/10 rounded-xl text-xs font-black focus:outline-none focus:border-primary transition-all"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px]">
                          🔍
                        </span>
                      </div>
                    </div>

                    {/* LISTA DE PARTIDOS */}
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {partidosPendientes.length > 0 ? (
                        partidosPendientes.map((m) => {
                          const yaPredicho = prediccionesUsuario.some(
                            (p) => (p.matchId || p.idPartido) === m.id,
                          );
                          const isSelected = m.id === partidoSeleccionado;

                          return (
                            <div
                              key={m.id}
                              onClick={() => {
                                if (!yaPredicho) {
                                  setPartidoSeleccionado(m.id);
                                  setPartidoActual(m);
                                  setDropdownAbierto(false);
                                  setBusqueda("");
                                }
                              }}
                              className={`p-3 flex items-center justify-between hover:bg-primary/10 cursor-pointer transition-colors border-b border-slate-50 dark:border-white/5 last:border-0 ${
                                yaPredicho
                                  ? "opacity-40 cursor-not-allowed"
                                  : ""
                              } ${isSelected ? "bg-primary/5" : ""}`}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                  <img
                                    src={m.homeLogo}
                                    className="w-7 h-7 object-contain rounded-full bg-white p-0.5 shadow-sm"
                                  />
                                  <img
                                    src={m.awayLogo}
                                    className="w-7 h-7 object-contain rounded-full bg-white p-0.5 shadow-sm"
                                  />
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 dark:text-white uppercase text-[11px]">
                                    {m.homeTeam} - {m.awayTeam}
                                  </p>
                                  <p className="text-[9px] font-bold text-gray-400 capitalize">
                                    Jornada {m.matchday} •{" "}
                                    {isNaN(new Date(m.date).getTime())
                                      ? m.date
                                      : new Date(m.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {yaPredicho ? (
                                <span className="text-[8px] font-black bg-amber-500/10 text-amber-600 px-2 py-1 rounded">
                                  COMPLETADO
                                </span>
                              ) : isSelected ? (
                                <span className="text-primary text-xs">⭐</span>
                              ) : null}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">
                          No hay partidos que coincidan
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* OVERLAY PARA CERRAR AL HACER CLIC FUERA */}
                {dropdownAbierto && (
                  <div
                    className="fixed inset-0 z-90"
                    onClick={() => setDropdownAbierto(false)}
                  ></div>
                )}
              </div>
            </div>

            {/* VISUALIZACIÓN MINI DEL PARTIDO SELECT */}
            {partidoActual && (
              <div className="py-3 px-4 bg-slate-50 dark:bg-dark-bg/40 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-center gap-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3">
                  <img
                    src={partidoActual.homeLogo}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-xs font-black dark:text-white uppercase">
                    {partidoActual.homeTeam.substring(0, 15)}
                  </span>
                </div>
                <div className="text-primary font-black text-sm">VS</div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black dark:text-white uppercase">
                    {partidoActual.awayTeam.substring(0, 15)}
                  </span>
                  <img
                    src={partidoActual.awayLogo}
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
            )}

            {/* 2. RESULTADO 1X2 COMPACTO */}
            <div className="space-y-2.5">
              <label className="text-slate-900 dark:text-white text-base font-black uppercase tracking-tight flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                  2
                </span>
                ¿Quién ganará? (1X2)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: "1",
                    label: "LOCAL",
                    color: "from-primary/20",
                    border: "border-primary",
                  },
                  {
                    id: "X",
                    label: "EMPATE",
                    color: "from-gray-500/20",
                    border: "border-gray-500",
                  },
                  {
                    id: "2",
                    label: "VISITANTE",
                    color: "from-blue-500/20",
                    border: "border-blue-500",
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`relative flex flex-col items-center justify-center p-2.5 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      prediccion === opt.id
                        ? `${opt.border} bg-linear-to-b ${opt.color} shadow-sm scale-102`
                        : "border-slate-100 dark:border-white/5 opacity-60 hover:opacity-100 hover:border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="prediccion"
                      value={opt.id}
                      checked={prediccion === opt.id}
                      onChange={() => setPrediccion(opt.id as "1" | "X" | "2")}
                      className="hidden"
                    />
                    <span
                      className={`text-xl font-black ${prediccion === opt.id ? "text-slate-900 dark:text-white" : "text-gray-400"}`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-slate-900 dark:text-white text-base font-black uppercase tracking-tight flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-accent text-dark-bg flex items-center justify-center text-[10px] shadow-sm">
                  3
                </span>
                Marcador exacto
              </label>

              <div className="bg-slate-50 dark:bg-dark-bg/20 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center justify-center gap-6">
                  {/* LOCAL */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      LOCAL
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setGolesLocal(Math.max(0, golesLocal - 1))
                        }
                        className="w-7 h-7 rounded-lg bg-white dark:bg-dark-card shadow-sm flex items-center justify-center text-sm font-black hover:bg-danger hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={golesLocal}
                        onChange={(e) =>
                          setGolesLocal(parseInt(e.target.value) || 0)
                        }
                        className="w-12 py-1.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-lg text-lg font-black text-center text-primary focus:border-primary active:scale-95 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGolesLocal(Math.min(20, golesLocal + 1))
                        }
                        className="w-7 h-7 rounded-lg bg-white dark:bg-dark-card shadow-sm flex items-center justify-center text-sm font-black hover:bg-primary hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-3xl font-black text-gray-300 dark:text-gray-700 mt-6">
                    :
                  </div>

                  {/* VISITANTE */}
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      VISITANTE
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setGolesVisitante(Math.max(0, golesVisitante - 1))
                        }
                        className="w-7 h-7 rounded-lg bg-white dark:bg-dark-card shadow-sm flex items-center justify-center text-sm font-black hover:bg-danger hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={golesVisitante}
                        onChange={(e) =>
                          setGolesVisitante(parseInt(e.target.value) || 0)
                        }
                        className="w-12 py-1.5 bg-white dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-lg text-lg font-black text-center text-blue-500 focus:border-blue-500 active:scale-95 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGolesVisitante(Math.min(20, golesVisitante + 1))
                        }
                        className="w-7 h-7 rounded-lg bg-white dark:bg-dark-card shadow-sm flex items-center justify-center text-sm font-black hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTON DE ENVIO - COMPACTO */}
            <div className="pt-2">
              {prediccionesUsuario.some(
                (p) => (p.matchId || p.idPartido) === partidoSeleccionado,
              ) ? (
                <div className="bg-amber-100 dark:bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg text-center mb-2">
                  <p className="text-amber-700 dark:text-amber-400 font-extrabold uppercase text-[10px]">
                    ⚠️ Ya has realizado una predicción para este encuentro
                  </p>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={loading || !partidoSeleccionado}
                  className="w-full py-4 text-lg font-black flex items-center justify-center gap-3 group"
                >
                  <span>
                    {loading ? "PROCESANDO..." : "🚀 ENVIAR PREDICCION"}
                  </span>
                  <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    ⚽
                  </span>
                </Button>
              )}
              <p className="mt-2 text-center text-gray-400 font-bold text-[9px] uppercase tracking-widest">
                ¡UNA VEZ ENVIADA, NO PODRÁS MODIFICARLA!
              </p>
            </div>
          </form>
        </Card>

        {/* INFO ADICIONAL */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-dark-card/30 border border-slate-200 dark:border-white/5">
            <h4 className="font-black text-slate-900 dark:text-white mb-2 underline decoration-primary decoration-4 underline-offset-4">
              SISTEMA DE PUNTOS
            </h4>
            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1 font-bold">
              <li>✅ ACERTAR GANADOR (1X2): 3 PTS</li>
              <li>🔥 MARCADOR EXACTO: 5 PTS</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-dark-card/30 border border-slate-200 dark:border-white/5">
            <h4 className="font-black text-slate-900 dark:text-white mb-2 underline decoration-blue-500 decoration-4 underline-offset-4">
              ¿NECESITAS AYUDA?
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold">
              CONTACTA CON SOPORTE SI TIENES PROBLEMAS CON TUS PUNTOS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
