// VISTA PARA HACER UNA PREDICCION
import { useState, useEffect } from "react";
import { useApp } from "../contexto/AppContext";
import { matchService } from "../servicios/matchService";
import { predictionService } from "../servicios/predictionService";
import type { Partido } from "../tipos";

export const HacerPrediccion = () => {
  // OBTENER FUNCIONES DEL CONTEXTO GLOBAL
  const { agregarPrediccion, usuarioActual } = useApp();

  // ESTADOS
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [partidoSeleccionado, setPartidoSeleccionado] = useState("");
  const [prediccion, setPrediccion] = useState<"1" | "X" | "2">("1");
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  // CARGAR PARTIDOS AL INICIAR
  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        setLoading(true);
        const data = await matchService.getAll();
        setPartidos(data);
        setError("");
      } catch (err) {
        setError("Error al cargar los partidos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarPartidos();
  }, []);

  // OBTENER SOLO PARTIDOS PENDIENTES
  const partidosPendientes = partidos.filter(
    (p) => p.status === "pending" || p.estado === "pendiente",
  );

  // VALIDAR QUE LA PREDICCION COINCIDA CON EL MARCADOR
  const validarPrediccion = (): boolean => {
    if (!partidoSeleccionado) {
      setError("Debes seleccionar un partido");
      return false;
    }

    // VERIFICAR QUE EL MARCADOR COINCIDA CON LA PREDICCION
    if (golesLocal > golesVisitante && prediccion !== "1") {
      setError(
        "El marcador no coincide con tu predicción (debería ser Victoria Local)",
      );
      return false;
    }
    if (golesLocal < golesVisitante && prediccion !== "2") {
      setError(
        "El marcador no coincide con tu predicción (debería ser Victoria Visitante)",
      );
      return false;
    }
    if (golesLocal === golesVisitante && prediccion !== "X") {
      setError(
        "El marcador no coincide con tu predicción (debería ser Empate)",
      );
      return false;
    }

    setError("");
    return true;
  };

  // MANEJAR EL ENVIO DEL FORMULARIO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarPrediccion()) {
      return;
    }

    try {
      setLoading(true);

      const nuevaPrediccion = {
        matchId: partidoSeleccionado,
        idPartido: partidoSeleccionado, // Compatibilidad
        userId: usuarioActual.id,
        idUsuario: usuarioActual.id, // Compatibilidad
        prediction: prediccion,
        prediccion: prediccion, // Compatibilidad
        exactScore: {
          home: golesLocal,
          away: golesVisitante,
          local: golesLocal, // Compatibilidad
          visitante: golesVisitante, // Compatibilidad
        },
        marcadorExacto: {
          home: golesLocal,
          away: golesVisitante,
          local: golesLocal, // Compatibilidad
          visitante: golesVisitante, // Compatibilidad
        },
        points: null,
        puntosGanados: null, // Compatibilidad
        createdAt: new Date().toISOString(),
      };

      // 1. GUARDAR EN LA API
      await predictionService.create({
        matchId: nuevaPrediccion.matchId,
        userId: nuevaPrediccion.userId,
        prediction: nuevaPrediccion.prediction,
        exactScore: {
          home: golesLocal,
          away: golesVisitante,
        },
        points: null,
        createdAt: nuevaPrediccion.createdAt,
      });

      // 2. ACTUALIZAR CONTEXTO LOCAL
      agregarPrediccion(nuevaPrediccion);

      // MOSTRAR MENSAJE DE EXITO
      setExito(true);
      setTimeout(() => {
        setExito(false);
        // RESETEAR FORMULARIO
        setPartidoSeleccionado("");
        setPrediccion("1");
        setGolesLocal(0);
        setGolesVisitante(0);
      }, 3000);
    } catch (err) {
      setError("Error al guardar la predicción en el servidor");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // OBTENER PARTIDO SELECCIONADO
  const partido = partidos.find((p) => p.id === partidoSeleccionado);

  if (loading && partidos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg flex items-center justify-center">
        <div className="text-white text-2xl font-black animate-pulse">
          Preparando estadio...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg py-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITULO */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
            ⚡ Hacer Predicción
          </h1>
          <p className="text-gray-400 text-lg">
            Elige un partido y predice el resultado
          </p>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* SELECCIONAR PARTIDO */}
          <div className="mb-6">
            <label className="block text-white font-bold text-lg mb-3">
              1️⃣ Selecciona un Partido
            </label>
            <select
              value={partidoSeleccionado}
              onChange={(e) => setPartidoSeleccionado(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white font-semibold focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            >
              <option value="">-- Elige un partido --</option>
              {partidosPendientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.equipoLocal || p.homeTeam} vs{" "}
                  {p.equipoVisitante || p.awayTeam} -{" "}
                  {new Date(p.fecha || p.date).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* VISTA PREVIA DEL PARTIDO */}
          {partido && (
            <div className="mb-6 p-4 bg-dark-bg/50 border border-primary/30 rounded-xl">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-right">
                  <p className="font-bold text-white text-xl">
                    {partido.equipoLocal || partido.homeTeam}
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 font-bold">VS</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-white text-xl">
                    {partido.equipoVisitante || partido.awayTeam}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SELECCIONAR RESULTADO (1 X 2) */}
          <div className="mb-6">
            <label className="block text-white font-bold text-lg mb-3">
              2️⃣ ¿Quién ganará?
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setPrediccion("1")}
                disabled={loading}
                className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  prediccion === "1"
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/50 scale-105"
                    : "bg-dark-bg border border-primary/20 text-gray-400 hover:border-primary/40 hover:text-white"
                } disabled:opacity-50`}
              >
                <div className="text-2xl mb-1">🏠</div>
                <div>Local</div>
              </button>
              <button
                type="button"
                onClick={() => setPrediccion("X")}
                disabled={loading}
                className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  prediccion === "X"
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/50 scale-105"
                    : "bg-dark-bg border border-primary/20 text-gray-400 hover:border-primary/40 hover:text-white"
                } disabled:opacity-50`}
              >
                <div className="text-2xl mb-1">🤝</div>
                <div>Empate</div>
              </button>
              <button
                type="button"
                onClick={() => setPrediccion("2")}
                disabled={loading}
                className={`py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                  prediccion === "2"
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/50 scale-105"
                    : "bg-dark-bg border border-primary/20 text-gray-400 hover:border-primary/40 hover:text-white"
                } disabled:opacity-50`}
              >
                <div className="text-2xl mb-1">✈️</div>
                <div>Visitante</div>
              </button>
            </div>
          </div>

          {/* MARCADOR EXACTO */}
          <div className="mb-6">
            <label className="block text-white font-bold text-lg mb-3">
              3️⃣ Marcador Exacto
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Goles Local
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={golesLocal}
                  disabled={loading}
                  onChange={(e) => setGolesLocal(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Goles Visitante
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={golesVisitante}
                  disabled={loading}
                  onChange={(e) =>
                    setGolesVisitante(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-dark-bg border border-primary/20 rounded-lg text-white text-2xl font-bold text-center focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-dark-bg/50 rounded-lg border border-primary/30">
                <span className="text-gray-400">Tu predicción:</span>
                <span className="text-3xl font-black text-primary">
                  {golesLocal} - {golesVisitante}
                </span>
              </div>
            </div>
          </div>

          {/* MENSAJES DE ERROR Y EXITO */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg">
              <p className="text-danger font-semibold flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {exito && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-primary font-semibold flex items-center gap-2">
                <span className="text-xl">✅</span>
                ¡Predicción guardada correctamente!
              </p>
            </div>
          )}

          {/* BOTON ENVIAR */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-primary to-emerald-600 text-dark-bg font-black text-lg rounded-xl shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? "Guardando..." : "🎯 Guardar Predicción"}
          </button>

          {/* INFORMACION ADICIONAL */}
          <div className="mt-6 p-4 bg-dark-bg/30 rounded-lg border border-primary/10">
            <p className="text-gray-400 text-sm">
              <strong className="text-primary">💡 Consejo:</strong> Acertar el
              resultado exacto te da 5 puntos. Acertar solo el ganador (1, X o
              2) te da 3 puntos.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
