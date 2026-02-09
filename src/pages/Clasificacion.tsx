// VISTA DE LA CLASIFICACION DE LOS USUARIOS (LEADERBOARD)
import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { useApp } from "../hooks/useApp";
import { Card, Badge } from "../components/ui";
import type { Usuario } from "../types";

export const Clasificacion = () => {
  const { usuarioActual } = useApp();

  // ESTADOS DE DATOS Y CARGA
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ESTADOS DE PAGINACION
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 10; // MOSTRAR 10 USUARIOS POR PAGINA

  // CARGAR USUARIOS AL INICIAR EL COMPONENTE
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true);
        const data = await userService.getLeaderboard();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar la clasificación desde el servidor");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  // ORDENAR USUARIOS POR PUNTOS (DE MAYOR A MENOR) Y FILTRAR ADMINS
  const usuariosOrdenados = [...usuarios]
    .filter((u) => u.role !== "admin") // NO MOSTRAR ADMINISTRADORES EN LA CLASIFICACION
    .sort((a, b) => {
      // 1. COMPARAR POR PUNTOS
      const puntosA = a.puntosTotal ?? a.totalPoints ?? 0;
      const puntosB = b.puntosTotal ?? b.totalPoints ?? 0;

      if (puntosB !== puntosA) {
        return puntosB - puntosA;
      }

      // 2. SI HAY EMPATE A PUNTOS, DESEMPATA POR NÚMERO DE ACIERTOS
      //ES DECIR, SI DOS USUARIOS TIENEN IGUAL PUNTOS, EL QUE MAS ACIERTOS TENGA GANA
      const aciertosA = a.correctPredictions ?? 0;
      const aciertosB = b.correctPredictions ?? 0;
      return aciertosB - aciertosA;
    });

  // CALCULAR PAGINACION
  const indiceUltimo = paginaActual * usuariosPorPagina;
  const indicePrimero = indiceUltimo - usuariosPorPagina;
  const usuariosPaginados = usuariosOrdenados.slice(
    indicePrimero,
    indiceUltimo,
  );
  const totalPaginas = Math.ceil(usuariosOrdenados.length / usuariosPorPagina);

  // FUNCION PARA OBTENER EL COLOR SEGUN LA POSICION EN EL RANKING
  const obtenerColorPosicion = (posicion: number): string => {
    if (posicion === 1) return "from-accent to-yellow-600"; // ORO
    if (posicion === 2) return "from-gray-300 to-gray-400"; // PLATA
    if (posicion === 3) return "from-orange-400 to-orange-600"; // BRONCE
    return "from-primary to-emerald-600"; // RESTO DE PARTICIPANTES
  };

  // FUNCION PARA OBTENER EL ICONO MEDALLA SEGUN LA POSICION
  const obtenerIconoPosicion = (posicion: number): string => {
    if (posicion === 1) return "🥇";
    if (posicion === 2) return "🥈";
    if (posicion === 3) return "🥉";
    return "🏅";
  };

  // RENDERIZADO DE CARGA
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
        <div className="text-primary text-2xl font-black animate-pulse uppercase">
          Actualizando ranking...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-8 transition-colors duration-150">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABECERA DE LA PAGINA */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-2">
            🏆 Clasificación
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl font-bold uppercase tracking-widest">
            LOS MEJORES PREDICTORES DE LA TEMPORADA
          </p>
        </div>

        {/* MENSAJE DE ERROR SI FALLA EL SERVIDOR */}
        {error && (
          <div className="mb-8 p-6 bg-danger/10 border-2 border-danger/30 rounded-2xl">
            <p className="text-danger font-black flex items-center gap-3">
              <span className="text-2xl">⚠️</span> {error}
            </p>
          </div>
        )}

        {/* CONTENIDO PRINCIPAL DE LA CLASIFICACION */}
        {!error && (
          <>
            {/* COMPROBAR SI ALGUIEN TIENE PUNTOS PARA MOSTRAR EL PODIO */}
            {usuariosOrdenados.length > 0 &&
            usuariosOrdenados.some(
              (u) => (u.puntosTotal ?? u.totalPoints ?? 0) > 0,
            ) ? (
              /* SECCION: PODIO (TOP 3) CON DISEÑO ESPECIAL - COMPACTO */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {usuariosOrdenados.slice(0, 3).map((usuario, index) => {
                  const posicion = index + 1;
                  return (
                    <div
                      key={usuario.id}
                      className={`relative group overflow-hidden rounded-2xl p-6 text-center shadow-xl transition-all duration-300 hover:scale-105 ${
                        posicion === 1
                          ? "md:order-2 md:scale-105 border-3 border-accent shadow-accent/20"
                          : ""
                      } ${posicion === 2 ? "md:order-1 mt-2" : ""} ${
                        posicion === 3 ? "md:order-3 mt-4" : ""
                      }`}
                      style={{
                        background:
                          posicion === 1
                            ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                            : posicion === 2
                              ? "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)"
                              : "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
                      }}
                    >
                      {/* EFECTO DE BRILLO AL PASAR EL RATON */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10 text-white">
                        <div className="text-5xl mb-3 transform group-hover:rotate-12 transition-transform duration-300">
                          {obtenerIconoPosicion(posicion)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-80">
                          PUESTO #{posicion}
                        </div>

                        {/* INICIAL DEL NOMBRE COMO AVATAR TEMPORAL */}
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/30 backdrop-blur-md border-3 border-white/40 flex items-center justify-center text-2xl font-black shadow-lg">
                          {(usuario.nombre || usuario.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <h3 className="text-lg font-black mb-1 drop-shadow-md truncate px-2">
                          {usuario.nombre || usuario.name}
                        </h3>
                        <div className="flex flex-col items-center">
                          <span className="text-3xl font-black">
                            {usuario.puntosTotal ?? usuario.totalPoints ?? 0}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                            PUNTOS
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* MENSAJE CUANDO NO HAY PUNTOS TODAVIA */
              <div className="mb-12 p-12 text-center bg-white dark:bg-dark-card/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-white/10">
                <div className="text-6xl mb-6 animate-bounce">⚽</div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase mb-2">
                  La temporada está por comenzar
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-bold max-w-md mx-auto">
                  Todavía nadie ha sumado puntos. ¡Sé el primero en hacer una
                  predicción y liderar la tabla!
                </p>
              </div>
            )}

            {/* SECCION: TABLA COMPLETA DE CLASIFICACION - COMPACTA */}
            <Card className="overflow-hidden border-primary/20 shadow-primary/5">
              <div className="bg-slate-50 dark:bg-dark-bg/50 border-b border-slate-200 dark:border-primary/20 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    TABLA COMPLETA DE PARTICIPANTES
                  </h2>
                  {/* INFORMACION DE PAGINACION */}
                  {totalPaginas > 1 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">
                      Mostrando {indicePrimero + 1}-
                      {Math.min(indiceUltimo, usuariosOrdenados.length)} de{" "}
                      {usuariosOrdenados.length}
                    </p>
                  )}
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {usuariosPaginados.map((usuario, index) => {
                  // CALCULAR LA POSICION REAL EN EL RANKING COMPLETO (NO SOLO EN LA PAGINA ACTUAL)
                  const posicion = indicePrimero + index + 1;
                  const esUsuarioActual = usuario.id === usuarioActual?.id;

                  return (
                    <div
                      key={usuario.id}
                      className={`px-6 py-4 transition-all hover:bg-slate-50 dark:hover:bg-white/5 ${
                        esUsuarioActual
                          ? "bg-primary/5 dark:bg-primary/5 border-l-4 border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* INDICADOR DE POSICION */}
                        <div className="shrink-0 w-12 text-center">
                          <span className="text-xl font-black text-slate-400 dark:text-gray-600 italic">
                            #{posicion}
                          </span>
                        </div>

                        {/* AVATAR ESTILIZADO */}
                        <div
                          className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white shadow-md bg-linear-to-br ${obtenerColorPosicion(posicion)}`}
                        >
                          {(usuario.nombre || usuario.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* INFORMACION DEL USUARIO */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                              {usuario.nombre || usuario.name}
                            </h3>
                            {esUsuarioActual && (
                              <Badge text="TÚ" variant="primary" />
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            JUGADOR ACTIVO
                          </p>
                        </div>

                        {/* COLUMNAS DE ESTADISTICAS (VISIBLE SOLO EN PANTALLAS GRANDES) */}
                        <div className="hidden lg:grid grid-cols-2 gap-8 mr-8 text-center">
                          <div>
                            <div className="text-base font-black text-slate-900 dark:text-white">
                              {usuario.totalPredictions ?? 0}
                            </div>
                            <div className="text-[9px] font-black text-gray-400 uppercase">
                              Predicciones
                            </div>
                          </div>
                          <div>
                            <div className="text-base font-black text-primary">
                              {usuario.correctPredictions ?? 0}
                            </div>
                            <div className="text-[9px] font-black text-gray-400 uppercase">
                              Aciertos
                            </div>
                          </div>
                        </div>

                        {/* PUNTOS TOTALES */}
                        <div className="text-right bg-slate-100 dark:bg-dark-bg/50 px-5 py-2 rounded-xl border border-slate-200 dark:border-white/5">
                          <div className="text-2xl font-black text-primary tracking-tighter">
                            {usuario.puntosTotal ?? usuario.totalPoints ?? 0}
                          </div>
                          <div className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            PUNTOS
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CONTROLES DE PAGINACION */}
              {totalPaginas > 1 && (
                <div className="bg-slate-50 dark:bg-dark-bg/50 border-t border-slate-200 dark:border-primary/20 px-6 py-4">
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* BOTON ANTERIOR */}
                    <button
                      onClick={() =>
                        setPaginaActual(Math.max(1, paginaActual - 1))
                      }
                      disabled={paginaActual === 1}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 font-bold text-sm text-slate-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-dark-card disabled:hover:text-slate-700 dark:disabled:hover:text-gray-300"
                    >
                      ← Anterior
                    </button>

                    {/* NUMEROS DE PAGINA */}
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                      (numero) => (
                        <button
                          key={numero}
                          onClick={() => setPaginaActual(numero)}
                          className={`min-w-10 px-3 py-2 rounded-lg font-black text-sm transition-all ${
                            paginaActual === numero
                              ? "bg-primary text-white border-2 border-primary scale-110"
                              : "bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                          }`}
                        >
                          {numero}
                        </button>
                      ),
                    )}

                    {/* BOTON SIGUIENTE */}
                    <button
                      onClick={() =>
                        setPaginaActual(
                          Math.min(totalPaginas, paginaActual + 1),
                        )
                      }
                      disabled={paginaActual === totalPaginas}
                      className="px-4 py-2 rounded-lg bg-white dark:bg-dark-card border border-slate-200 dark:border-white/10 font-bold text-sm text-slate-700 dark:text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-dark-card disabled:hover:text-slate-700 dark:disabled:hover:text-gray-300"
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </Card>

            {/* SECCION INFORMATIVA SOBRE EL REGLAMENTO */}
            <div className="mt-12 p-8 bg-white dark:bg-dark-card/30 border-2 border-slate-100 dark:border-white/5 rounded-3xl">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                <span className="text-2xl">📊</span> REGLAMENTO DE PUNTUACION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">
                      MARCADOR EXACTO
                    </h4>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      SI HAS ACERTADO LOS GOLES EXACTOS DE AMBOS EQUIPOS SUMAS{" "}
                      <span className="text-primary font-black">+5 PUNTOS</span>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-sm">
                      RESULTADO 1X2
                    </h4>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                      SI SOLO HAS ACERTADO EL GANADOR O EL EMPATE (PERO NO EL
                      MARCADOR EXACTO) SUMAS{" "}
                      <span className="text-blue-500 font-black">
                        +3 PUNTOS
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
