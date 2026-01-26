// VISTA DE LA CLASIFICACION DE LOS USUARIOS
import { useState, useEffect } from "react";
import { userService } from "../servicios/userService";
import type { Usuario } from "../tipos";

export const Clasificacion = () => {
  // ESTADOS
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CARGAR USUARIOS AL INICIAR
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true);
        const data = await userService.getLeaderboard();
        setUsuarios(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar la clasificación");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarUsuarios();
  }, []);

  // ORDENAR USUARIOS POR PUNTOS (DE MAYOR A MENOR)
  const usuariosOrdenados = [...usuarios].sort(
    (a, b) =>
      (b.puntosTotal ?? b.totalPoints) - (a.puntosTotal ?? a.totalPoints),
  );

  // FUNCION PARA OBTENER EL COLOR SEGUN LA POSICION
  const obtenerColorPosicion = (posicion: number): string => {
    if (posicion === 1) return "from-accent to-yellow-600"; // ORO
    if (posicion === 2) return "from-gray-300 to-gray-400"; // PLATA
    if (posicion === 3) return "from-orange-400 to-orange-600"; // BRONCE
    return "from-primary to-emerald-600"; // RESTO
  };

  // FUNCION PARA OBTENER EL ICONO SEGUN LA POSICION
  const obtenerIconoPosicion = (posicion: number): string => {
    if (posicion === 1) return "🥇";
    if (posicion === 2) return "🥈";
    if (posicion === 3) return "🥉";
    return "🏅";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg py-8">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TITULO */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2">
            🏆 Clasificación
          </h1>
          <p className="text-gray-400 text-lg">
            Los mejores predictores de la temporada
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-white text-2xl">Cargando clasificación...</div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg">
            <p className="text-danger font-semibold flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* CONTENIDO */}
        {!loading && !error && (
          <>
            {/* PODIO (TOP 3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {usuariosOrdenados.slice(0, 3).map((usuario, index) => {
                const posicion = index + 1;
                return (
                  <div
                    key={usuario.id}
                    className={`relative overflow-hidden rounded-2xl p-6 text-center transform transition-all hover:scale-105 ${
                      posicion === 1 ? "md:order-2 md:scale-110" : ""
                    } ${posicion === 2 ? "md:order-1" : ""} ${
                      posicion === 3 ? "md:order-3" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        posicion === 1
                          ? "#fbbf24, #f59e0b"
                          : posicion === 2
                            ? "#d1d5db, #9ca3af"
                            : "#fb923c, #f97316"
                      })`,
                    }}
                  >
                    {/* EFECTO DE BRILLO */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>

                    <div className="relative z-10">
                      {/* ICONO DE MEDALLA */}
                      <div className="text-6xl mb-3">
                        {obtenerIconoPosicion(posicion)}
                      </div>

                      {/* POSICION */}
                      <div className="text-sm font-bold text-white/80 mb-2">
                        #{posicion}
                      </div>

                      {/* AVATAR */}
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                        {(usuario.nombre || usuario.name)
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {/* NOMBRE */}
                      <h3 className="text-xl font-black text-white mb-2">
                        {usuario.nombre || usuario.name}
                      </h3>

                      {/* PUNTOS */}
                      <div className="text-3xl font-black text-white">
                        {usuario.puntosTotal ?? usuario.totalPoints}
                      </div>
                      <div className="text-sm text-white/80 font-semibold">
                        puntos
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TABLA COMPLETA */}
            <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* CABECERA */}
              <div className="bg-dark-bg/50 border-b border-primary/20 px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  Clasificación Completa
                </h2>
              </div>

              {/* LISTA DE USUARIOS */}
              <div className="divide-y divide-primary/10">
                {usuariosOrdenados.map((usuario, index) => {
                  const posicion = index + 1;
                  const esTop3 = posicion <= 3;
                  const esUsuarioActual = usuario.id === "1"; // TU USUARIO

                  return (
                    <div
                      key={usuario.id}
                      className={`px-6 py-4 transition-all hover:bg-dark-hover ${
                        esUsuarioActual
                          ? "bg-primary/5 border-l-4 border-primary"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* POSICION */}
                        <div className="flex-shrink-0 w-12 text-center">
                          {esTop3 ? (
                            <span className="text-3xl">
                              {obtenerIconoPosicion(posicion)}
                            </span>
                          ) : (
                            <span className="text-xl font-bold text-gray-400">
                              #{posicion}
                            </span>
                          )}
                        </div>

                        {/* AVATAR */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black text-white shadow-lg bg-gradient-to-br ${obtenerColorPosicion(
                            posicion,
                          )}`}
                        >
                          {(usuario.nombre || usuario.name)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        {/* NOMBRE */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">
                              {usuario.nombre || usuario.name}
                            </h3>
                            {esUsuarioActual && (
                              <span className="px-2 py-1 bg-primary/20 border border-primary/40 text-primary text-xs font-bold rounded">
                                TÚ
                              </span>
                            )}
                          </div>
                        </div>

                        {/* PUNTOS */}
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">
                            {usuario.puntosTotal ?? usuario.totalPoints}
                          </div>
                          <div className="text-xs text-gray-400 font-semibold">
                            puntos
                          </div>
                        </div>

                        {/* ESTADISTICAS ADICIONALES (OPCIONAL) */}
                        <div className="hidden lg:flex gap-6 text-center">
                          <div>
                            <div className="text-sm font-bold text-white">
                              {Math.floor(Math.random() * 20) + 10}
                            </div>
                            <div className="text-xs text-gray-400">
                              Predicciones
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-accent">
                              {Math.floor(Math.random() * 15) + 5}
                            </div>
                            <div className="text-xs text-gray-400">
                              Acertadas
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INFORMACION ADICIONAL */}
            <div className="mt-8 p-6 bg-dark-card/30 border border-primary/10 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">
                📊 Cómo funciona la clasificación
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Acertar el marcador exacto:{" "}
                    <strong className="text-white">+5 puntos</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Acertar el resultado (1, X o 2):{" "}
                    <strong className="text-white">+3 puntos</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    La clasificación se actualiza automáticamente después de
                    cada partido
                  </span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
