// COMPONENTE REUTILIZABLE PARA SPINNER DE CARGA
export interface CargandoProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const Cargando = ({
  message = "Cargando...",
  size = "md",
}: CargandoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full animate-spin`}
        ></div>
        <div className="text-primary font-black uppercase tracking-widest">
          {message}
        </div>
      </div>
    </div>
  );
};
