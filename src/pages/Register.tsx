import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../hooks/useApp";
import { Card, Button } from "../components/ui";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // VALIDACIONES
    if (!nombre.trim()) {
      setError("Por favor, introduce tu nombre");
      return;
    }

    if (nombre.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    if (!email.trim()) {
      setError("Por favor, introduce tu email");
      return;
    }

    if (!email.includes("@")) {
      setError("El email no tiene un formato válido");
      return;
    }

    if (!password.trim()) {
      setError("Por favor, introduce una contraseña");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      await register(nombre, email, password);
      // REDIRIGIR A INICIO TRAS REGISTRO EXITOSO
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrarse. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-150 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* LOGO CENTRADO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full"></div>
              <div className="w-16 h-16 bg-linear-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
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
            Crear Cuenta
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-sm">
            Únete a la competición de pronósticos
          </p>
        </div>

        {/* TARJETA DE REGISTRO */}
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

            {/* CAMPO NOMBRE */}
            <div className="space-y-2">
              <label
                htmlFor="nombre"
                className="block text-slate-900 dark:text-white text-sm font-black uppercase tracking-tight"
              >
                Nombre Completo
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-dark-bg border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-dark-bg border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            {/* CAMPO CONFIRMAR CONTRASEÑA */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-slate-900 dark:text-white text-sm font-black uppercase tracking-tight"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full px-4 py-3 bg-slate-100 dark:bg-dark-bg border-2 border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-semibold placeholder-gray-400 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
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
                  <span>CREANDO CUENTA...</span>
                </>
              ) : (
                <>
                  <span>🎯</span>
                  <span>REGISTRARSE</span>
                </>
              )}
            </Button>

            {/* ENLACE A LOGIN */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </Card>

        {/* INFO ADICIONAL */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-bold mt-6">
          Al registrarte, aceptas participar en la competición de pronósticos
          deportivos.
        </p>
      </div>
    </div>
  );
};
