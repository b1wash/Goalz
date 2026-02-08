import React from "react";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* OVERLAY OSCURO CON EFECTO BLUR */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* CONTENIDO DEL MODAL */}
      <div className="relative bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-fade-in-up transform transition-all scale-100">
        {/* CABECERA CON ICONO */}
        <div
          className={`p-6 border-b border-slate-100 dark:border-white/5 flex items-center gap-4 ${
            variant === "danger"
              ? "bg-red-50 dark:bg-red-900/10"
              : variant === "warning"
                ? "bg-amber-50 dark:bg-amber-900/10"
                : "bg-slate-50 dark:bg-slate-800/50"
          }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${
              variant === "danger"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : variant === "warning"
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            {variant === "danger" ? "⚠️" : variant === "warning" ? "🛡️" : "ℹ️"}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* CUERPO DEL MENSAJE */}
        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* PIE CON BOTONES */}
        <div className="p-4 bg-slate-50 dark:bg-dark-bg/50 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5">
          <Button
            variant="secondary"
            onClick={onClose}
            className="font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="font-black px-6 shadow-lg hover:transform hover:-translate-y-0.5 transition-transform"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
