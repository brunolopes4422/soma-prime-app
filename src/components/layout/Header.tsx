import { useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { Theme } from "../../styles/themes";

interface HeaderProps {
  theme: Theme;
}

const pageTitles: Record<string, string> = {
  "/":              "Início",
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
    <header className={`h-14 px-6 flex items-center justify-between border-b ${theme.sidebar}`}>
      <div className="flex items-center gap-2">
        <BookOpen size={18} className={theme.accent} />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium ${theme.badge}`}>
        {theme.name}
      </span>
    </header>
  );
}