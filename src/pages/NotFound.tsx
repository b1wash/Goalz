import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
      {/* TARJETA ROJA ANIMADA */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-danger blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
        <div className="relative w-32 h-44 bg-linear-to-br from-red-500 to-red-700 rounded-lg shadow-2xl transform rotate-12 group-hover:rotate-6 transition-transform duration-300 flex items-center justify-center border-2 border-white/20">
          <span className="text-6xl font-black text-white/90 drop-shadow-lg">
            404
          </span>
        </div>
        {/* ICONO */}
        <div className="absolute -bottom-4 -right-4 text-5xl animate-bounce">
          🚩
        </div>
      </div>

      {/* TEXTO PRICIPAL */}
      <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
        ¡FUERA DE JUEGO!
      </h1>

      <div className="h-1 w-24 bg-primary rounded-full mb-6"></div>

      {/* DESCRIPCIÓN */}
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-md mb-10 font-medium">
        Parece que te has adelantado a la defensa. <br />
        La página que buscas no existe o ha sido expulsada del partido.
      </p>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-black shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <span>⚽</span>
          VOLVER AL INICIO
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>

      {/* DECORACIÓN DE FONDO */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-1/4 left-1/4 text-9xl transform -rotate-12">
          ⚽
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-9xl transform rotate-12">
          🥅
        </div>
      </div>
    </div>
  );
};

export default NotFound;
