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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto
                   bg-ph-card border border-ph-border rounded-2xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-ph-card border-b border-ph-border px-6 py-4 flex items-start gap-3 rounded-t-2xl">
          {icon && <span className="text-2xl">{icon}</span>}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-ph-text text-lg leading-tight">{title}</h2>
            {subtitle && <p className="text-sm text-ph-text/50 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ph-bg transition-colors text-ph-text/50 hover:text-ph-text"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5 text-ph-text text-sm leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}