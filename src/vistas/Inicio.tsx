//VISTA PARA INICIO
export const Inicio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {/* HERO SECTION */}
        <div className="bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-2xl shadow-primary/10 p-6 sm:p-8 lg:p-12 mb-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              Bienvenido a <span className="text-primary">GOALZ</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto">
              El mejor predictor de resultados de fútbol. Compite con tus amigos
              y demuestra quién conoce mejor el deporte rey.
            </p>
          </div>

          {/* PARTIDOS A MOSTRAR*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
            <div className="group relative overflow-hidden bg-gradient-to-br from-primary to-emerald-600 rounded-2xl p-6 lg:p-8 text-white text-center shadow-lg shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl lg:text-5xl mb-3">⚽</div>
                <div className="text-4xl lg:text-5xl font-black mb-2">128</div>
                <div className="text-sm lg:text-base font-semibold opacity-90">
                  Partidos Activos
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 lg:p-8 text-white text-center shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl lg:text-5xl mb-3">👥</div>
                <div className="text-4xl lg:text-5xl font-black mb-2">
                  1,247
                </div>
                <div className="text-sm lg:text-base font-semibold opacity-90">
                  Usuarios Activos
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-accent to-orange-600 rounded-2xl p-6 lg:p-8 text-white text-center shadow-lg shadow-accent/30 hover:shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl lg:text-5xl mb-3">🏆</div>
                <div className="text-4xl lg:text-5xl font-black mb-2">
                  3,891
                </div>
                <div className="text-sm lg:text-base font-semibold opacity-90">
                  Predicciones Hoy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="group bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 p-6 lg:p-8 hover:border-primary/40 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-3xl lg:text-4xl flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                📊
              </div>
              <div className="flex-1">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  Mis Predicciones
                </h3>
                <p className="text-gray-400 text-sm lg:text-base mb-4">
                  Revisa tus predicciones anteriores y verifica tus aciertos.
                </p>
                <button className="text-primary font-bold text-sm lg:text-base hover:text-emerald-400 hover:underline transition-colors flex items-center gap-2">
                  Ver mis predicciones
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="group bg-dark-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-primary/20 p-6 lg:p-8 hover:border-primary/40 transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-3xl lg:text-4xl flex-shrink-0 group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                🏆
              </div>
              <div className="flex-1">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                  Clasificación
                </h3>
                <p className="text-gray-400 text-sm lg:text-base mb-4">
                  Consulta el ranking de los mejores predictores.
                </p>
                <button className="text-accent font-bold text-sm lg:text-base hover:text-yellow-400 hover:underline transition-colors flex items-center gap-2">
                  Ver clasificación
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
