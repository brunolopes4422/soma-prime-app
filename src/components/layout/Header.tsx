import { useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import type { Theme } from "../../styles/themes";

interface HeaderProps { theme: Theme; }

const pageTitles: Record<string, string> = {
  "/":             "Início",
  "/trilhas":      "Escola — Trilhas de Carreira",
  "/guias/cs":     "Guia — CS / Atendimento",
  "/guias/fiscal": "Guia — Fiscal",
  "/guias/dp":     "Guia — Departamento Pessoal",
  "/guias/omie":   "Guia — OMIE",
  "/dashboard":    "Dashboard de Gestão",
};

export default function Header({ theme }: HeaderProps) {
  const { pathname } = useLocation();
  const { isDark, toggle } = useTheme();
  const title = pageTitles[pathname] ?? "Guia Operacional";

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b shrink-0"
      style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>

      <div className="flex items-center gap-2">
        <BookOpen size={18} style={{ color: "#f5a623" }} />
        <span className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{title}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Botão toggle tema */}
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--soma-muted)", backgroundColor: "transparent" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(128,128,128,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <span className="text-xs px-3 py-1 rounded-full font-medium border"
          style={{ backgroundColor: "rgba(245,166,35,0.1)", color: "#f5a623", borderColor: "rgba(245,166,35,0.2)" }}>
          {theme.name}
        </span>
      </div>
    </header>
  );
}