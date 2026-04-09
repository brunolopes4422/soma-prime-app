import { NavLink } from "react-router-dom";
import { Users, FileText, Calculator, Briefcase,
         LayoutDashboard, Home, BookOpen } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import type { Theme } from "../../styles/themes";

interface SidebarProps { theme: Theme; }

const guideLinks = [
  { to: "/guias/cs",     label: "CS / Atendimento", icon: Users,      module: "cs" },
  { to: "/guias/fiscal", label: "Fiscal",            icon: FileText,   module: "fiscal" },
  { to: "/guias/dp",     label: "Dep. Pessoal",      icon: Briefcase,  module: "dp" },
  { to: "/guias/omie",   label: "OMIE",              icon: Calculator, module: "omie" },
];

export default function Sidebar({ theme }: SidebarProps) {
  const { profile, signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive
        ? "bg-gold-light/15 text-gold-light border border-gold-light/20"
        : "text-soma-muted hover:text-soma-text hover:bg-soma-border/50"
    }`;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 border-r border-soma-border bg-soma-card flex flex-col">

      {/* Logo */}
      <div className="px-5 py-4 border-b border-soma-border/30">
        <img
          src="/logos/soma-logo.png"
          alt="Soma Prime"
          className="h-10 object-contain"
          onError={e => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
          }}
        />
        <span className="hidden font-bold text-lg text-gold-light tracking-widest">
          SOMA PRIME
        </span>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass}>
          <Home size={18} /> Início
        </NavLink>

        <p className="px-4 pt-4 pb-1 text-xs uppercase text-soma-muted tracking-widest">Escola</p>
        <NavLink to="/trilhas" className={linkClass}>
          <BookOpen size={18} /> Trilhas de Carreira
        </NavLink>

        <p className="px-4 pt-4 pb-1 text-xs uppercase text-soma-muted tracking-widest">Guias</p>
        {guideLinks
          .filter(g => theme.modules.includes(g.module))
          .map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}

        {profile?.role === "manager" && (
          <>
            <p className="px-4 pt-4 pb-1 text-xs uppercase text-soma-muted tracking-widest">Gestão</p>
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
          </>
        )}
      </nav>

      {/* Usuário + logout */}
      <div className="px-4 py-4 border-t border-soma-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gold-light/20 flex items-center justify-center text-sm font-bold text-gold-light">
            {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-soma-text truncate">{profile?.full_name ?? "Usuário"}</p>
            <p className="text-xs text-soma-muted truncate capitalize">{profile?.sector ?? profile?.role}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full text-sm text-center text-soma-muted hover:text-soma-danger transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}