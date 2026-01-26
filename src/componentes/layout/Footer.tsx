import { Link } from "react-router-dom";
//AQUI SE HA IPORTADO LA LIBRERIA DE LUCIDE-REACT PARA LOS ICONOS DE LAS REDES SOCIALES
import { Instagram, Youtube, X } from "lucide-react";
export const Footer = () => {
  const estilosRedesSociales =
    "w-10 h-10 rounded-full bg-dark-card border border-primary/20 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all hover:scale-110";
  return (
    <footer className="bg-dark-bg border-t border-primary/20 mt-auto">
      {/* CONTENEDOR PRINCIPAL CENTRADO */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 lg:py-12">
        {/* FILA SUPERIOR CON LOGO Y ENLACES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* COLUMNA 1: LOGO Y DESCRIPCION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="text-xl">⚽</span>
              </div>
              <span className="text-2xl font-black text-white">
                GOALZ<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              La mejor plataforma para predecir resultados de fútbol y competir
              con tus amigos.
            </p>
          </div>

          {/* COLUMNA 2 ENLACES RAPIDOS */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/clasificacion"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Clasificación
                </Link>
              </li>
              <li>
                <Link
                  to="/mis-predicciones"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Mis Predicciones
                </Link>
              </li>
              <li>
                <Link
                  to="/hacer-prediccion"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Hacer Predicción
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3 REDES SOCIALES */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Síguenos</h3>
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
        <div className="border-t border-primary/20 pt-6">
          {/* FILA INFERIOR COPYRIGHT */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} GOALZ. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                to="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Privacidad
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                Términos
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-primary transition-colors"
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
