import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AcademyAIFloat from "../ui/AcademyAIFloat";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getTheme } from "../../styles/themes";
import type { CompanyKey } from "../../styles/themes";
import { useState, useEffect } from "react";

export default function Layout() {
  const { profile } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");
  const logoSSrc = isDark ? "/logos/soma-s.png" : "/logos/SomaSTemaclaro.png";

  const isInTrilha = location.pathname.startsWith("/trilhas/");

  // Desktop: sidebar recolhe ao entrar na trilha
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(!isInTrilha);
  // Mobile: gaveta começa fechada
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fecha gaveta mobile ao trocar de página
  useEffect(() => { setMobileSidebarOpen(false); }, [location.pathname]);

  // Recolhe sidebar desktop ao entrar numa trilha
  useEffect(() => { setDesktopSidebarOpen(!isInTrilha); }, [isInTrilha]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--soma-bg)", color: "var(--soma-text)" }}>

      {/* Desktop sidebar — recolhe com animação */}
      <div className="hidden lg:block transition-all duration-300 ease-in-out shrink-0"
        style={{ width: desktopSidebarOpen ? 256 : 0, overflow: "hidden" }}>
        <Sidebar theme={theme} />
      </div>

      {/* Mobile sidebar — gaveta */}
      <div className="lg:hidden">
        <Sidebar
          theme={theme}
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header
          theme={theme}
          sidebarOpen={desktopSidebarOpen}
          onToggleSidebar={() => {
            // Desktop: toggle recolher/expandir
            setDesktopSidebarOpen(v => !v);
            // Mobile: abre gaveta
            setMobileSidebarOpen(v => !v);
          }}
        />

        <main className="flex-1 overflow-y-auto relative"
          style={{ padding: isInTrilha ? 0 : "1.5rem" }}>
          {!isInTrilha && (
            <div className="fixed top-1/2 -translate-y-1/2 right-0 pointer-events-none select-none hidden lg:block"
              style={{ width: 380, opacity: isDark ? 0.06 : 0.04 }}>
              <img key={logoSSrc} src={logoSSrc} alt=""
                style={{ width: "100%", transform: "translateX(40%)" }} />
            </div>
          )}
          <Outlet />
        </main>

        {!isInTrilha && (
          <div className="h-1 w-full shrink-0"
            style={{ background: "linear-gradient(90deg, #a07830, #f5a623, #c9a84c, #f5a623, #a07830)" }} />
        )}
      </div>

      <AcademyAIFloat />
    </div>
  );
}