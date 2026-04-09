import { NavLink } from "react-router-dom";
import { LayoutDashboard, Home, FileText, Users, Calculator } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { Theme } from "../../styles/themes";

interface SidebarProps {
  theme: Theme;
}

const guideLinks = [
  { to: "/guias/cs",     label: "CS / Atendimento", icon: Users,       module: "cs" },
  { to: "/guias/fiscal", label: "Fiscal",            icon: FileText,    module: "fiscal" },
  { to: "/guias/dp",     label: "Dep. Pessoal",      icon: Users,       module: "dp" },
  { to: "/guias/omie",   label: "OMIE",              icon: Calculator,  module: "omie" },
];

export default function Sidebar({ theme }: SidebarProps) {
  const { profile, signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-gold/20 text-gold font-semibold"
        : "opacity-70 hover:opacity-100 hover:bg-gold/10"
    }`;

  return (
    <aside className={`fixed top-0 left-0 h-screen w-64 border-r flex flex-col ${theme.sidebar}`}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-inherit">
        <img
          src={theme.logo}
          alt={theme.name}
          className="h-8 object-contain"
          onError={e => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
          }}
        />
        <span className={`hidden font-bold text-lg ${theme.accent}`}>{theme.fallback}</span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass}>
          <Home size={18} /> Início
        </NavLink>

        <p className="px-4 pt-4 pb-1 text-xs uppercase opacity-40 tracking-widest">Guias</p>

        {guideLinks
          .filter(g => theme.modules.includes(g.module))
          .map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}

        {profile?.role === "manager" && (
          <>
            <p className="px-4 pt-4 pb-1 text-xs uppercase opacity-40 tracking-widest">Gestão</p>
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </>
        )}
      </nav>

      {/* Usuário + logout */}
      <div className="px-4 py-4 border-t border-inherit">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold/30 flex items-center justify-center text-sm font-bold text-gold">
            {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name ?? "Usuário"}</p>
            <p className="text-xs opacity-50 truncate capitalize">{profile?.sector ?? profile?.role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full text-sm text-center opacity-50 hover:opacity-100 hover:text-red-400 transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}