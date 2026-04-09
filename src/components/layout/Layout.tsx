import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "../../contexts/AuthContext";
import { getTheme } from "../../styles/themes";
import type { CompanyKey } from "../../styles/themes";

export default function Layout() {
  const { profile } = useAuth();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");

  return (
    <div className="flex min-h-screen bg-soma-bg text-soma-text">
      <Sidebar theme={theme} />

      <div className="flex flex-col flex-1 ml-64 relative">
        <Header theme={theme} />

        {/* Conteúdo principal */}
        <main className="flex-1 p-6 overflow-y-auto relative">

          {/* S decorativo no canto direito — metade cortada */}
          <div
            className="fixed top-1/2 -translate-y-1/2 right-0 pointer-events-none select-none"
            style={{ width: "320px", opacity: 0.06 }}
          >
            <img
              src="/logos/soma-s.png"
              alt=""
              className="w-full h-auto"
              style={{
                transform: "translateX(40%)",
                filter: "brightness(2) sepia(1) saturate(3) hue-rotate(5deg)",
              }}
            />
          </div>

          <Outlet />
        </main>

        {/* Linha dourada no rodapé */}
        <div
          className="h-1 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #a07830, #f5a623, #c9a84c, #f5a623, #a07830)" }}
        />
      </div>
    </div>
  );
}