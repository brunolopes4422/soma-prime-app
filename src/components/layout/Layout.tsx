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
    <div className={`flex min-h-screen ${theme.bg} ${theme.text}`}>
      <Sidebar theme={theme} />
      <div className="flex flex-col flex-1 ml-64">
        <Header theme={theme} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}