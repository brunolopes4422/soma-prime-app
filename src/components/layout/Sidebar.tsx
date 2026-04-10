import { NavLink, useNavigate } from "react-router-dom";
import { Users, FileText, Calculator, Briefcase, LayoutDashboard, Home, BookOpen } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
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
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive ? "active-link" : "inactive-link"
    }`;

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 border-r flex flex-col"
      style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}
    >
      <style>{`
        .active-link { background-color: rgba(245,166,35,0.12); color: #f5a623; border: 1px solid rgba(245,166,35,0.2); }
        .inactive-link { color: var(--soma-muted); border: 1px solid transparent; }
        .inactive-link:hover { color: var(--soma-text); background-color: rgba(128,128,128,0.08); }
      `}</style>

      {/* Logo */}
      <div className="px-5 py-4 border-b flex items-center" style={{ borderColor: "var(--soma-border)", minHeight: 72 }}>
        <img
          key={isDark ? "dark" : "light"}
          src={isDark ? "/logos/soma-logo.png" : "/logos/logotemaclaro.png"}
          alt="Soma Prime"
          style={{ height: 40, width: "auto", objectFit: "contain", objectPosition: "left" }}
        />
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass}><Home size={18} /> Início</NavLink>

        <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Escola</p>
        <NavLink to="/trilhas" className={linkClass}><BookOpen size={18} /> Trilhas de Carreira</NavLink>

        <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Guias</p>
        {guideLinks
          .filter(g => theme.modules.includes(g.module))
          .map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}><Icon size={18} /> {label}</NavLink>
          ))}

        {profile?.role === "manager" && (
          <>
            <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Gestão</p>
            <NavLink to="/dashboard" className={linkClass}><LayoutDashboard size={18} /> Dashboard</NavLink>
          </>
        )}
      </nav>

      {/* Usuário */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--soma-border)" }}>
        <button
          onClick={() => navigate("/perfil")}
          className="flex items-center gap-3 mb-3 w-full text-left rounded-lg p-1 transition-colors"
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(245,166,35,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden"
            style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
            <img
              src={profile?.avatar_url ?? ""}
              alt=""
              className="w-full h-full object-cover"
              onError={e => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                img.parentElement!.innerText = profile?.full_name?.[0]?.toUpperCase() ?? "U";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--soma-text)" }}>{profile?.full_name ?? "Usuário"}</p>
            <p className="text-xs truncate capitalize" style={{ color: "var(--soma-muted)" }}>{profile?.sector ?? profile?.role}</p>
          </div>
        </button>
        <button onClick={signOut} className="w-full text-sm text-center transition-colors hover:text-red-400"
          style={{ color: "var(--soma-muted)" }}>
          Sair
        </button>
      </div>
    </aside>
  );
}