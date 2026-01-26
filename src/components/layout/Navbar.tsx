import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import type { Usuario } from "../../types";

interface BarraNavegacionProps {
  usuarioActual?: Usuario | null;
}

export const BarraNavegacion: React.FC<BarraNavegacionProps> = ({
  usuarioActual,
}) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-lg border-b border-slate-200 dark:border-primary/20 shadow-2xl transition-colors duration-300">
        {/* CONTENEDOR CENTRADO CON MAX-WIDTH OPTIMIZADO PARA ULTRAWIDE EN MI CASO COMO TENGO UN MONITOR DE ULTRA WIDE */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4 lg:gap-8">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 relative z-10"
            >
              {/* ICONO LOGO*/}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-all duration-300"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-primary via-emerald-400 to-primary flex items-center justify-center shadow-lg shadow-primary/50 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-xl sm:text-2xl lg:text-3xl filter drop-shadow-lg">
                    ⚽
                  </span>
                </div>
              </div>

              {/* LOGO TEXTO*/}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                  GOALZ
                </span>
                <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-primary/80 uppercase tracking-widest">
                  Predictor
                </span>
              </div>
            </Link>

            {/* MENÚ DESKTOP */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center max-w-2xl">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `group relative px-4 xl:px-6 py-2.5 rounded-xl font-bold text-sm xl:text-base transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-lg shadow-primary/50"
                      : "text-gray-300 hover:text-white hover:bg-dark-hover"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg xl:text-xl">🏠</span>
                  <span>Inicio</span>
                </span>

                {/* LINEA INFERIOR CON HOVER ANIMADO */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </NavLink>

              <NavLink
                to="/clasificacion"
                className={({ isActive }) =>
                  `group relative px-4 xl:px-6 py-2.5 rounded-xl font-bold text-sm xl:text-base transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-lg shadow-primary/50"
                      : "text-gray-300 hover:text-white hover:bg-dark-hover"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg xl:text-xl">🏆</span>
                  <span>Clasificación</span>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </NavLink>

              <NavLink
                to="/mis-predicciones"
                className={({ isActive }) =>
                  `group relative px-4 xl:px-6 py-2.5 rounded-xl font-bold text-sm xl:text-base transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-lg shadow-primary/50"
                      : "text-gray-300 hover:text-white hover:bg-dark-hover"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg xl:text-xl">📊</span>
                  <span>Mis Predicciones</span>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </NavLink>

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `group relative px-4 xl:px-6 py-2.5 rounded-xl font-bold text-sm xl:text-base transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-dark-bg shadow-lg shadow-primary/50"
                      : "text-gray-300 hover:text-white hover:bg-dark-hover"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg xl:text-xl">🔧</span>
                  <span>Admin</span>
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            </div>

            {/* ZONA DERECHA */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              {/* TOGGLE MODO OSCURO */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-dark-card hover:bg-dark-hover border border-primary/20 text-white transition-all duration-300"
                aria-label="Cambiar tema"
              >
                {isDark ? "☀️" : "🌙"}
              </button>

              {/* BOTON CTA PRINCIPAL */}
              <Link
                to="/hacer-prediccion"
                className="group relative overflow-hidden px-4 sm:px-5 lg:px-6 xl:px-8 py-2 lg:py-2.5 xl:py-3 bg-gradient-to-r from-primary via-emerald-500 to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-dark-bg font-black text-xs sm:text-sm lg:text-base rounded-full shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-base sm:text-lg lg:text-xl">⚡</span>
                  <span className="hidden sm:inline">Predecir</span>
                  <span className="hidden lg:inline">Ahora</span>
                </span>
              </Link>

              {/* MOSTRAR USUARIO PARA PANTALLA PC */}
              {usuarioActual && (
                <div className="hidden xl:flex items-center gap-4 pl-6 border-l-2 border-primary/30">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white leading-tight">
                      {usuarioActual.nombre}
                    </p>
                    <p className="text-xs font-semibold text-primary flex items-center justify-end gap-1">
                      <span className="text-accent">⭐</span>
                      {usuarioActual.puntosTotal} pts
                    </p>
                  </div>

                  {/* PARA MOSTRAR LA LETRA INICIAL DEL USUARIO */}

                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 blur-md rounded-full"></div>
                    <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-dark-bg font-black text-lg shadow-lg border-2 border-primary/50">
                      {(usuarioActual.nombre || usuarioActual.name)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  </div>
                </div>
              )}

              {/* BOTON HAMBURGUESA MOVIL */}
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="lg:hidden relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-dark-card hover:bg-dark-hover border border-primary/20 flex items-center justify-center transition-all duration-300 group"
                aria-label="Menú"
              >
                <div className="w-5 flex flex-col gap-1.5">
                  <span
                    className={`block h-1 bg-white rounded-full transition-all duration-300 ${
                      menuAbierto ? "rotate-45 translate-y-3" : ""
                    }`}
                  />
                  <span
                    className={`block h-1 bg-white rounded-full transition-all duration-300 ${
                      menuAbierto ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-1 bg-white rounded-full transition-all duration-300 ${
                      menuAbierto ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* MENu MOVIL DESPLEGABLE */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-dark-card/95 backdrop-blur-lg border-t border-primary/20 ${
            menuAbierto ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-2">
            {/* ENLACES MENU MOVIL */}
            <NavLink
              to="/"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/30"
                    : "bg-dark-bg/50 text-gray-300 hover:bg-dark-hover hover:text-white border border-primary/10"
                }`
              }
            >
              <span className="text-xl">🏠</span>
              <span>Inicio</span>
            </NavLink>

            <NavLink
              to="/clasificacion"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/30"
                    : "bg-dark-bg/50 text-gray-300 hover:bg-dark-hover hover:text-white border border-primary/10"
                }`
              }
            >
              <span className="text-xl">🏆</span>
              <span>Clasificación</span>
            </NavLink>

            <NavLink
              to="/mis-predicciones"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/30"
                    : "bg-dark-bg/50 text-gray-300 hover:bg-dark-hover hover:text-white border border-primary/10"
                }`
              }
            >
              <span className="text-xl">📊</span>
              <span>Mis Predicciones</span>
            </NavLink>

            <NavLink
              to="/admin"
              onClick={() => setMenuAbierto(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-dark-bg shadow-lg shadow-primary/30"
                    : "bg-dark-bg/50 text-gray-300 hover:bg-dark-hover hover:text-white border border-primary/10"
                }`
              }
            >
              <span className="text-xl">🔧</span>
              <span>Admin</span>
            </NavLink>

            {/* BOTON CTA MOVIL */}
            <Link
              to="/hacer-prediccion"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-4 mt-4 bg-gradient-to-r from-primary via-emerald-500 to-primary text-dark-bg font-black text-base rounded-xl shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 active:scale-95 transition-all duration-200"
            >
              <span className="text-xl">⚡</span>
              <span>Hacer Predicción</span>
            </Link>

            {/* INFO USUARIO MOVIL */}
            {usuarioActual && (
              <div className="flex items-center gap-3 px-4 py-4 mt-4 bg-dark-bg/50 rounded-xl border-2 border-primary/20">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-md rounded-full"></div>
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-dark-bg font-black text-xl shadow-lg">
                    {(usuarioActual.nombre || usuarioActual.name)
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {usuarioActual.nombre}
                  </p>
                  <p className="text-xs font-semibold text-primary flex items-center gap-1">
                    <span className="text-accent">⭐</span>
                    {usuarioActual.puntosTotal} puntos
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="h-16 lg:h-20"></div>
    </>
  );
};
