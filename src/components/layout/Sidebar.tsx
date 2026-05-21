import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Users, FileText, Calculator, Briefcase, LayoutDashboard, Home, BookOpen, Settings, BookMarked, Monitor, X, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import type { Theme } from "../../styles/themes";

interface SidebarProps {
  theme: Theme;
  open?: boolean;
  onClose?: () => void;
}

const guideLinks = [
  { to: "/guias/cs",          label: "CS / Atendimento", icon: Users,      module: "cs" },
  { to: "/guias/fiscal",      label: "Fiscal",            icon: FileText,   module: "fiscal" },
  { to: "/guias/dp",          label: "Dep. Pessoal",      icon: Briefcase,  module: "dp" },
  { to: "/guias/contabil",    label: "Contábil",          icon: BookMarked, module: "contabil" },
  { to: "/guias/omie",        label: "OMIE",              icon: Calculator, module: "omie" },
  { to: "/guias/informatica", label: "Informática",       icon: Monitor,    module: "informatica" },
];

export default function Sidebar({ theme, open = true, onClose }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [guidesOpen, setGuidesOpen] = React.useState(() => location.pathname.startsWith("/guias"));

  const isAdminOrManager = profile?.role === "manager" || profile?.role === "admin";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive ? "active-link" : "inactive-link"
    }`;

  const sidebarContent = (
    <aside className="h-full flex flex-col w-64"
      style={{ backgroundColor: "var(--soma-card)", borderRight: "1px solid var(--soma-border)" }}>
      <style>{`
        .active-link { background-color: rgba(245,166,35,0.12); color: #f5a623; border: 1px solid rgba(245,166,35,0.2); }
        .inactive-link { color: var(--soma-muted); border: 1px solid transparent; }
        .inactive-link:hover { color: var(--soma-text); background-color: rgba(128,128,128,0.08); }
        .admin-link { color: var(--soma-muted); border: 1px solid transparent; display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 150ms; }
        .admin-link:hover { color: #f5a623; background-color: rgba(245,166,35,0.08); }
      `}</style>

      {/* Logo */}
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--soma-border)", minHeight: 64 }}>
        <img
          key={isDark ? "dark" : "light"}
          src={isDark ? "/logos/soma-logo.png" : "/logos/logotemaclaro.png"}
          alt="Soma Prime"
          style={{ height: 36, width: "auto", objectFit: "contain", objectPosition: "left" }}
        />
        {/* Botão fechar — só no mobile */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ color: "var(--soma-muted)" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/" end className={linkClass} onClick={onClose}><Home size={18} /> Início</NavLink>

        <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Escola</p>
        <NavLink to="/trilhas" className={linkClass} onClick={onClose}><BookOpen size={18} /> Trilhas de Carreira</NavLink>

        <button
          onClick={() => setGuidesOpen(v => !v)}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium transition-all duration-150 inactive-link"
        >
          <BookOpen size={18} />
          <span className="flex-1 text-left">Guias Operacionais</span>
          <ChevronRight size={14} className="transition-transform duration-300"
            style={{ transform: guidesOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
        </button>
        {guidesOpen && (
          <div className="ml-3 pl-3 space-y-1" style={{ borderLeft: "1px solid var(--soma-border)" }}>
            {guideLinks
              .filter(g => theme.modules.includes(g.module))
              .map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={linkClass} onClick={onClose}>
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
          </div>
        )}

        {isAdminOrManager && (
          <>
            <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Gestão</p>
            <NavLink to="/dashboard" className={linkClass} onClick={onClose}><LayoutDashboard size={18} /> Dashboard</NavLink>
          </>
        )}

        {profile?.role === "admin" && (
          <>
            <p className="px-4 pt-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Sistema</p>
            <a href="/admin" className="admin-link"><Settings size={18} /> Painel Admin</a>
          </>
        )}
      </nav>

      {/* Usuário */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--soma-border)" }}>
        <button
          onClick={() => { navigate("/perfil"); onClose?.(); }}
          className="flex items-center gap-3 mb-3 w-full text-left rounded-lg p-1 transition-colors"
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(245,166,35,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden"
            style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
            <img src={profile?.avatar_url ?? ""} alt="" className="w-full h-full object-cover"
              onError={e => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                img.parentElement!.innerText = profile?.full_name?.[0]?.toUpperCase() ?? "U";
              }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--soma-text)" }}>{profile?.full_name ?? "Usuário"}</p>
            <p className="text-xs truncate capitalize" style={{ color: "var(--soma-muted)" }}>
              {profile?.role === "admin" ? "Administrador" : profile?.role === "manager" ? "Gestor" : profile?.sector ?? profile?.role}
            </p>
          </div>
        </button>
        <button onClick={signOut} className="w-full text-sm text-center transition-colors hover:text-red-400"
          style={{ color: "var(--soma-muted)" }}>
          Sair
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop — sidebar normal inline (controlada pelo Layout via width) */}
      <div className="hidden lg:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile — gaveta deslizante */}
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={onClose}
        />
        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out lg:hidden`}
          style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }}
        >
          {sidebarContent}
        </div>
      </>
    </>
  );
}