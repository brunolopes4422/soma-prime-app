import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AcademyAIFloat from "../ui/AcademyAIFloat";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { getTheme } from "../../styles/themes";
import type { CompanyKey } from "../../styles/themes";

export default function Layout() {
  const { profile } = useAuth();
  const { isDark } = useTheme();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");
  const logoSSrc = isDark ? "/logos/soma-s.png" : "/logos/SomaSTemaclaro.png";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--soma-bg)", color: "var(--soma-text)" }}>
      <Sidebar theme={theme} />

      <div className="flex flex-col flex-1 ml-64 relative">
        <Header theme={theme} />

        <main className="flex-1 p-6 overflow-y-auto relative">
          {/* S decorativo */}
          <div className="fixed top-1/2 -translate-y-1/2 right-0 pointer-events-none select-none"
            style={{ width: 380, opacity: isDark ? 0.06 : 0.04 }}>
            <img key={logoSSrc} src={logoSSrc} alt="" style={{ width: "100%", transform: "translateX(40%)" }} />
          </div>
          <Outlet />
        </main>

        {/* Linha dourada no rodapé */}
        <div className="h-1 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #a07830, #f5a623, #c9a84c, #f5a623, #a07830)" }} />
      </div>

      {/* IA Tutora flutuante — disponível em todo o portal */}
      <AcademyAIFloat />
    </div>
  );
}