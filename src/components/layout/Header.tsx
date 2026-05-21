import { useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon, PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import type { Theme } from "../../styles/themes";

interface HeaderProps {
  theme: Theme;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

const pageTitles: Record<string, string> = {
  "/":                  "Início",
  "/trilhas":           "Escola — Trilhas de Carreira",
  "/guias/cs":          "Guia — CS / Atendimento",
  "/guias/fiscal":      "Guia — Fiscal",
  "/guias/dp":          "Guia — Dep. Pessoal",
  "/guias/omie":        "Guia — OMIE",
  "/guias/contabil":    "Guia — Contábil",
  "/guias/informatica": "Guia — Informática",
  "/dashboard":         "Dashboard de Gestão",
};

export default function Header({ theme, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const { pathname } = useLocation();
  const { isDark, toggle } = useTheme();

  const isInTrilha = pathname.startsWith("/trilhas/");
  const title = isInTrilha ? "Trilhas de Carreira" : (pageTitles[pathname] ?? "Guia Operacional");

  return (
    <header className="h-14 px-4 flex items-center justify-between border-b shrink-0"
      style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>

      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button onClick={onToggleSidebar}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
            style={{ color: "var(--soma-muted)" }}>
            {/* Mobile: sempre hambúrguer */}
            <span className="lg:hidden"><Menu size={18} /></span>
            {/* Desktop: toggle panel */}
            <span className="hidden lg:block">
              {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: "#f5a623" }} />
          <span className="font-semibold text-sm truncate max-w-48 sm:max-w-none"
            style={{ color: "var(--soma-text)" }}>{title}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
          style={{ color: "var(--soma-muted)" }}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <span className="text-xs px-2.5 py-1 rounded-full font-medium border hidden sm:inline-flex"
          style={{ backgroundColor: "rgba(245,166,35,0.1)", color: "#f5a623", borderColor: "rgba(245,166,35,0.2)" }}>
          {theme.name}
        </span>
      </div>
    </header>
  );
}