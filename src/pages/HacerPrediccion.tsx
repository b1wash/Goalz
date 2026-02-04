// VISTA PARA HACER UNA PREDICCION
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { matchService } from "../services/matchService";
import { predictionService } from "../services/predictionService";
import { validarCoherenciaMarcador, validarGoles } from "../utils/validators";
import { Card, Button, Select } from "../components/ui";
import type { Partido, Prediccion } from "../types";

export const HacerPrediccion = () => {
  // OBTENER FUNCIONES Y DATOS DEL CONTEXTO GLOBAL
  const { agregarPrediccion, usuarioActual } = useApp();

  // ESTADOS DEL FORMULARIO Y DATOS
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState("");
  const [prediccion, setPrediccion] = useState<"1" | "X" | "2">("1");
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);

  // ESTADOS DE UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  // CARGAR PARTIDOS DISPONIBLES AL INICIAR
  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        setLoading(true);
        const data = await matchService.getAll();
        setPartidos(data);
      } catch (err) {
        console.error("Error al cargar partidos:", err);
        setError("Error al cargar los partidos desde el servidor");
      } finally {
        setLoading(false);
      }
    };
    cargarPartidos();
  }, []);

  // FILTRAR SOLO PARTIDOS QUE AUN NO HAN COMENZADO
  const partidosPendientes = partidos.filter(
    (p) => p.status === "pending" || p.estado === "pendiente",
  );

  // VALIDAR QUE LA PREDICCION SEA LOGICA RESPECTO AL MARCADOR
  const validarPrediccion = (): boolean => {
    if (!partidoSeleccionado) {
      setError("Por favor, selecciona un partido de la lista");
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
        idPartido: partidoSeleccionado, // COMPATIBILIDAD CON CODIGO ANTIGUO
        userId: usuarioActual!.id,
        idUsuario: usuarioActual!.id, // COMPATIBILIDAD CON CODIGO ANTIGUO
        prediction: prediccion,
        prediccion: prediccion, // COMPATIBILIDAD CON CODIGO ANTIGUO
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

      // ACTUALIZAR ESTADO GLOBAL
      agregarPrediccion(nuevaPrediccion);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="text-primary text-2xl font-black animate-pulse uppercase tracking-widest">
          Cargando partidos...
        </div>
      </div>
    );
  }

  // BLOQUEAR ACCESO SI ES ADMIN
  if (usuarioActual?.role === "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABECERA - COMPACTA */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 bg-gradient-to-r from-slate-900 via-primary to-slate-900 dark:from-white dark:via-primary dark:to-white bg-clip-text text-transparent">
            ⚡ Hacer Predicción
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-bold uppercase tracking-wider">
            DEMUESTRA TUS CONOCIMIENTOS Y GANA PUNTOS
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL - COMPACTO */}
        <Card className="p-6 lg:p-8 relative overflow-hidden">
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

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* 1. SELECCION DE PARTIDO */}
            <div className="space-y-3">
              <label className="block text-slate-900 dark:text-white text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary text-dark-bg flex items-center justify-center text-sm">
                  1
                </span>
                Slecciona el partido
              </label>
              <Select
                value={partidoSeleccionado}
                onChange={(e) => setPartidoSeleccionado(e.target.value)}
                className="text-base py-3 font-bold"
              >
                <option value="">-- ELIGE UN ENCUENTRO DE LA JORNADA --</option>
                {partidosPendientes.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.homeTeam} vs {m.awayTeam} (
                    {new Date(m.date).toLocaleDateString("es-ES")})
                  </option>
                ))}
              </Select>
            </div>

            {/* 2. RESULTADO 1X2 */}
            <div className="space-y-3">
              <label className="block text-slate-900 dark:text-white text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center text-sm">
                  2
                </span>
                ¿Quién ganará? (1X2)
              </label>
              <div className="grid grid-cols-3 gap-4">
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
                    className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      prediccion === opt.id
                        ? `${opt.border} bg-gradient-to-b ${opt.color} shadow-lg scale-105`
                        : "border-slate-200 dark:border-white/10 grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
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
                      className={`text-2xl font-black mb-1 ${prediccion === opt.id ? "text-slate-900 dark:text-white" : "text-gray-400"}`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. MARCADOR EXACTO */}
            <div className="space-y-3">
              <label className="block text-slate-900 dark:text-white text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-accent text-dark-bg flex items-center justify-center text-sm">
                  3
                </span>
                Marcador exacto (+5 puntos)
              </label>

              <div className="bg-slate-50 dark:bg-dark-bg/50 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-center gap-6 sm:gap-12">
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
                        className="w-9 h-9 rounded-full bg-white dark:bg-dark-card shadow-md flex items-center justify-center text-xl font-black hover:bg-danger hover:text-white transition-colors"
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
                        className="w-16 py-3 bg-white dark:bg-dark-bg border-2 border-primary/30 rounded-xl text-2xl font-black text-center text-primary focus:border-primary active:scale-95 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGolesLocal(Math.min(20, golesLocal + 1))
                        }
                        className="w-9 h-9 rounded-full bg-white dark:bg-dark-card shadow-md flex items-center justify-center text-xl font-black hover:bg-primary hover:text-white transition-colors"
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
                        className="w-9 h-9 rounded-full bg-white dark:bg-dark-card shadow-md flex items-center justify-center text-xl font-black hover:bg-danger hover:text-white transition-colors"
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
                        className="w-16 py-3 bg-white dark:bg-dark-bg border-2 border-blue-500/30 rounded-xl text-2xl font-black text-center text-blue-500 focus:border-blue-500 active:scale-95 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setGolesVisitante(Math.min(20, golesVisitante + 1))
                        }
                        className="w-9 h-9 rounded-full bg-white dark:bg-dark-card shadow-md flex items-center justify-center text-xl font-black hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTON DE ENVIO */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full py-6 text-xl lg:text-2xl font-black flex items-center justify-center gap-4 group"
              >
                <span>🚀 ENVIAR PREDICCION</span>
                <span className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                  ⚽
                </span>
              </Button>
              <p className="mt-4 text-center text-gray-500 font-bold text-xs uppercase tracking-widest">
                ¡UNA VEZ ENVIADA, NO PODRAS MODIFICAR TU APUESTA!
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
