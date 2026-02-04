// VISTA DE INICIO (HOME) PARA RESUMEN Y NAVEGACION RAPIDA
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { matchService } from "../services/matchService";
import { useApp } from "../context/AppContext";
import { MatchCard } from "../components/matches";
import { Card, Button } from "../components/ui";
import type { Partido } from "../types";

export const Inicio = () => {
  const { usuarioActual } = useApp();

  // ESTADOS DE DATOS LOCALES
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CARGAR PARTIDOS Y RESULTADOS AL INICIAR LA SESION
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const matchesData = await matchService.getAll();
        setPartidos(matchesData);
        setError(null);
      } catch (err) {
        setError("Error al cargar los datos de la jornada");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // FILTRAR PARTIDOS PENDIENTES PARA EL MODULO DE "PROXIMOS"
  const partidosPendientes = partidos.filter(
    (p) => p.status === "pending" || p.estado === "pendiente",
  );

  // RENDERIZADO DE CARGA PREVIO AL CONTENIDO
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="text-primary text-3xl font-black animate-pulse uppercase tracking-[0.25em]">
          GOALZ...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg transition-colors duration-150">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        {/* MENSAJE DE ERROR GLOBAL */}
        {error && (
          <div className="mb-10 p-6 bg-danger/10 border-2 border-danger/30 rounded-2xl text-danger font-black text-center animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* SECCION HERO: BIENVENIDA Y ESTADISTICAS PRINCIPALES */}
        <Card className="p-6 sm:p-8 lg:p-10 mb-8 relative overflow-hidden group">
          {/* EFECTOS VISUALES DE FONDO EN EL HERO */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-primary/10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -ml-48 -mb-48 transition-all group-hover:bg-blue-500/10"></div>

          <div className="relative z-10 text-center mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              Bievenido a <span className="text-primary italic">GOALZ</span>
            </h1>
            Predice resultados, gana puntos y demuestra que eres el que más sabe
            de fútbol en la comunidad.
          </div>

          {/* TARJETAS DE ESTADISTICAS RAPIDAS (SUMMARY CARDS) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 relative z-10">
            <div className="flex flex-col items-center p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm transition-all hover:border-primary/50">
              <div className="text-5xl mb-3">⚽</div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                {partidos.length}
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Partidos en BD
              </div>
            </div>

            <div className="flex flex-col items-center p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm transition-all hover:border-blue-500/50">
              <div className="text-5xl mb-3">📅</div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                {partidosPendientes.length}
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Pendientes hoy
              </div>
            </div>

            {/* TARJETA DIFERENTE PARA ADMIN VS USUARIO */}
            {usuarioActual?.role === "admin" ? (
              <div className="flex flex-col items-center p-6 rounded-3xl bg-accent/10 border border-accent/20 shadow-xl shadow-accent/5 transition-all hover:scale-105">
                <div className="text-5xl mb-3">👥</div>
                <div className="text-4xl font-black text-accent mb-1">0</div>
                <div className="text-[10px] font-black text-accent/70 uppercase tracking-widest">
                  Total Jugadores
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center p-6 rounded-3xl bg-primary/10 border border-primary/20 shadow-xl shadow-primary/5 transition-all hover:scale-105">
                <div className="text-5xl mb-3">🏆</div>
                <div className="text-4xl font-black text-primary mb-1">
                  {usuarioActual?.puntosTotal ??
                    usuarioActual?.totalPoints ??
                    0}
                </div>
                <div className="text-[10px] font-black text-primary/70 uppercase tracking-widest">
                  Tu puntuación
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* SECCION: PROXIMOS ENCUENTROS DE LA JORNADA */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <span className="text-primary text-4xl">●</span> PRÓXIMOS PARTIDOS
            </h2>
            {usuarioActual?.role === "admin" ? (
              <Link to="/admin" state={{ tabActiva: "partidos" }}>
                <Button variant="secondary" className="px-6 py-2">
                  GESTIONAR PARTIDOS →
                </Button>
              </Link>
            ) : (
              <Link to="/hacer-prediccion">
                <Button variant="secondary" className="px-6 py-2">
                  VER TODOS →
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partidosPendientes.slice(0, 4).map((partido) => (
              <div key={partido.id} className="group flex flex-col gap-4">
                <MatchCard match={partido} showResult={false} />
                {/* SOLO MOSTRAR BOTON SI NO ES ADMIN */}
                {usuarioActual?.role !== "admin" && (
                  <Link to="/hacer-prediccion" className="w-full">
                    <Button className="w-full py-4 uppercase font-black text-xs tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                      REALIZAR PRONOSTICO
                    </Button>
                  </Link>
                )}
              </div>
            ))}

            {/* ESTADO VACIO PARA PARTIDOS */}
            {partidosPendientes.length === 0 && (
              <div className="col-span-full py-16 bg-slate-50 dark:bg-dark-card/20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl text-center">
                <p className="text-gray-500 font-black uppercase tracking-widest">
                  No hay partidos pendientes en esta jornada
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECCION: ACCESOS DIRECTOS A OTRAS VISTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* MOSTRAR PANEL ADMIN O MIS PREDICCIONES SEGUN ROL */}
          {usuarioActual?.role === "admin" ? (
            <Link to="/admin" className="group">
              <Card hover className="p-8 lg:p-10 border-primary/10">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl group-hover:bg-primary group-hover:text-dark-bg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/5">
                    🔧
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      Panel de Gestión
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
                      ADMINISTRA PARTIDOS, ACTUALIZA RESULTADOS Y GESTIONA LOS
                      USUARIOS.
                    </p>
                    <span className="text-primary font-black text-xs tracking-widest flex items-center gap-2">
                      ABRIR PANEL{" "}
                      <span className="group-hover:translate-x-2 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <Link to="/mis-predicciones" className="group">
              <Card hover className="p-8 lg:p-10 border-primary/10">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-4xl group-hover:bg-primary group-hover:text-dark-bg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-primary/5">
                    📊
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      Mis Predicciones
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
                      REVISA EL ESTADO DE TUS APUESTAS Y EL DESGLOSE DE TUS
                      PUNTOS.
                    </p>
                    <span className="text-primary font-black text-xs tracking-widest flex items-center gap-2">
                      ABRIR HISTORIAL{" "}
                      <span className="group-hover:translate-x-2 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          <Link to="/clasificacion" className="group">
            <Card hover className="p-8 lg:p-10 border-accent/10">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-4xl group-hover:bg-accent group-hover:text-dark-bg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 shadow-lg shadow-accent/5">
                  🏆
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
                    Clasificación
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">
                    MIRA QUIÉN LIDERA EL RANKING DE GOALZ Y DÓNDE TE ENCUENTRAS
                    TÚ.
                  </p>
                  <span className="text-accent font-black text-xs tracking-widest flex items-center gap-2">
                    VER EL PODIO{" "}
                    <span className="group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};
