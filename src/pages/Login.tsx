import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Card, Button } from "../components/ui";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // VALIDACION BASICA
    if (!email.trim()) {
      setError("Por favor, introduce tu email");
      return;
    }

    if (!email.includes("@")) {
      setError("El email no tiene un formato válido");
      return;
    }

    if (!password.trim()) {
      setError("Por favor, introduce tu contraseña");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      // REDIRIGIR A INICIO TRAS LOGIN EXITOSO
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center py-12 px-4 transition-colors duration-150">
      <div className="w-full max-w-md">
        {/* LOGO CENTRADO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary via-emerald-400 to-primary flex items-center justify-center shadow-lg shadow-primary/50">
                <span className="text-3xl filter drop-shadow-lg">⚽</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                GOALZ
              </h1>
              <p className="text-xs font-bold text-primary/80 uppercase tracking-widest">
                Predictor
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
            Introduce tu email para acceder
          </p>
        </div>

        {/* TARJETA DE LOGIN */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MENSAJE DE ERROR */}
            {error && (
              <div className="p-4 bg-danger/10 border-2 border-danger/30 rounded-xl animate-shake">
                <p className="text-danger font-bold text-sm flex items-center gap-2">
                  <span className="text-lg">⚠️</span> {error}
                </p>
              </div>
            )}

            {/* CAMPO EMAIL */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-slate-900 dark:text-white text-sm font-black uppercase tracking-tight"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-dark-bg border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* CAMPO CONTRASEÑA */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-slate-900 dark:text-white text-sm font-black uppercase tracking-tight"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-dark-bg border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* INFO DE USUARIOS DE PRUEBA */}
            <div className="bg-slate-100 dark:bg-dark-bg/50 p-4 rounded-xl border border-slate-200 dark:border-white/10">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                📧 USUARIOS DE PRUEBA:
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 font-semibold">
                <li>• biwash@goalz.com (admin123) - ADMIN</li>
                <li>• kerrly@goalz.com (kerrly123)</li>
                <li>• sergio@goalz.com (sergio123)</li>
                <li>• esteban@goalz.com (esteban123)</li>
              </ul>
            </div>

            {/* BOTON DE ENVIO */}
            <Button
              type="submit"
              className="w-full py-4 text-lg font-black flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>VERIFICANDO...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>ENTRAR</span>
                </>
              )}
            </Button>

            {/* ENLACE A REGISTRO */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-primary font-bold hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </form>
        </Card>

        {/* INFO ADICIONAL */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-bold mt-6">
          Este es un sistema de autenticación simulado para demostración.
        </p>
      </div>
    </div>
  );
};
