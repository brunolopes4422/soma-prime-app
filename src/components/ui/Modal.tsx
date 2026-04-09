import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, subtitle, icon, children }: ModalProps) {
  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Trava scroll do body
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto
                   bg-white rounded-2xl shadow-2xl border border-soma-border"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-soma-border px-6 py-4 flex items-start gap-3 rounded-t-2xl">
          {icon && <span className="text-2xl">{icon}</span>}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-soma-text text-lg leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-soma-text/50 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-soma-bg transition-colors text-soma-text/50 hover:text-soma-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5 text-soma-text text-sm leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}