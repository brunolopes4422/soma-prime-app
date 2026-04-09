import { useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { Theme } from "../../styles/themes";

interface HeaderProps { theme: Theme; }

const pageTitles: Record<string, string> = {
  "/":              "Início",
  "/trilhas":       "Escola — Trilhas de Carreira",
  "/guias/cs":      "Guia — CS / Atendimento",
  "/guias/fiscal":  "Guia — Fiscal",
  "/guias/dp":      "Guia — Departamento Pessoal",
  "/guias/omie":    "Guia — OMIE",
  "/dashboard":     "Dashboard de Gestão",
};

export default function Header({ theme }: HeaderProps) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? "Guia Operacional";

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-soma-border bg-soma-card">
      <div className="flex items-center gap-2">
        <BookOpen size={18} className="text-gold-light" />
        <span className="font-semibold text-sm text-soma-text">{title}</span>
      </div>
      <span className="text-xs px-3 py-1 rounded-full font-medium bg-gold-light/10 text-gold-light border border-gold-light/20">
        {theme.name}
      </span>
    </header>
  );
}