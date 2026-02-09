import { Link } from "react-router-dom";
//AQUI SE HA IPORTADO LA LIBRERIA DE LUCIDE-REACT PARA LOS ICONOS DE LAS REDES SOCIALES
import { Instagram, Youtube, X } from "lucide-react";
export const Footer = () => {
  const estilosRedesSociales =
    "w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-card border border-slate-300 dark:border-primary/20 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:text-primary hover:border-primary/40 transition-all duration-150 hover:scale-110";
  return (
    <footer className="bg-slate-100 dark:bg-dark-bg border-t border-slate-300 dark:border-primary/20 mt-auto transition-colors duration-150">
      {/* CONTENEDOR PRINCIPAL CENTRADO */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
        {/* FILA SUPERIOR CON LOGO Y ENLACES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* COLUMNA 1: LOGO Y DESCRIPCION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-xl">⚽</span>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-150">
                GOALZ<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-slate-600 dark:text-gray-400 text-sm transition-colors duration-150">
              La mejor plataforma para predecir resultados de fútbol y competir
              con tus amigos.
            </p>
          </div>

          {/* COLUMNA 2 ENLACES RAPIDOS */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 transition-colors duration-150">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150 text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/clasificacion"
                  className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150 text-sm"
                >
                  Clasificación
                </Link>
              </li>
              <li>
                <Link
                  to="/mis-predicciones"
                  className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150 text-sm"
                >
                  Mis Predicciones
                </Link>
              </li>
              <li>
                <Link
                  to="/hacer-prediccion"
                  className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150 text-sm"
                >
                  Hacer Predicción
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3 REDES SOCIALES */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 transition-colors duration-150">
              Síguenos
            </h3>
            <div className="flex gap-4">
              <Link
                to="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className={estilosRedesSociales}
                aria-label="Twitter"
              >
                <X size={20} strokeWidth={2} />
              </Link>
              <Link
                to="https://instagram.com"
                rel="noopener noreferrer"
                className={estilosRedesSociales}
                aria-label="Instagram"
              >
                <Instagram size={20} strokeWidth={2} />
              </Link>{" "}
              <Link
                to="https://youtube.com"
                rel="noopener noreferrer"
                className={estilosRedesSociales}
                aria-label="YouTube"
              >
                <Youtube size={20} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>

        {/* LINEA PARA SEPARAR */}
        <div className="border-t border-slate-300 dark:border-primary/20 pt-6">
          {/* FILA INFERIOR COPYRIGHT */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 dark:text-gray-400 text-sm text-center sm:text-left transition-colors duration-150">
              © {new Date().getFullYear()} GOALZ. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="#"
                className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150"
              >
                Privacidad
              </Link>
              <Link
                to="#"
                className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150"
              >
                Términos
              </Link>
              <Link
                to="#"
                className="text-slate-600 dark:text-gray-400 hover:text-primary transition-colors duration-150"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
