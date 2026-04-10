import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Users, Building2, Layers, BookOpen, ArrowLeft, Settings } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { to: "/admin/usuarios",  label: "Usuários",  icon: Users },
  { to: "/admin/empresas",  label: "Empresas",  icon: Building2 },
  { to: "/admin/setores",   label: "Setores",   icon: Layers },
  { to: "/admin/guias",     label: "Guias",     icon: BookOpen },
];

export default function AdminLayout() {
  const { profile, signOut } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
      isActive ? "active-link" : "inactive-link"
    }`;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--soma-bg)", color: "var(--soma-text)" }}>
      <style>{`
        .active-link { background-color: rgba(245,166,35,0.12); color: #f5a623; border: 1px solid rgba(245,166,35,0.2); }
        .inactive-link { color: var(--soma-muted); border: 1px solid transparent; }
        .inactive-link:hover { color: var(--soma-text); background-color: rgba(128,128,128,0.08); }
      `}</style>

      {/* Sidebar Admin */}
      <aside className="fixed top-0 left-0 h-screen w-64 border-r flex flex-col"
        style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>

        {/* Header */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--soma-border)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Settings size={18} style={{ color: "#f5a623" }} />
            <span className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>Painel Admin</span>
          </div>
          <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Gestão do sistema</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-4 pb-1 text-xs uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>Gerenciar</p>
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t space-y-2" style={{ borderColor: "var(--soma-border)" }}>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--soma-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--soma-text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--soma-muted)")}>
            <ArrowLeft size={16} /> Voltar ao portal
          </button>
          <button onClick={signOut}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--soma-muted)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--soma-muted)")}>
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 ml-64">

        {/* Header */}
        <header className="h-14 px-6 flex items-center justify-between border-b shrink-0"
          style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <div className="flex items-center gap-2">
            <img
              src={isDark ? "/logos/soma-logo.png" : "/logos/logotemaclaro.png"}
              alt="Soma Prime"
              style={{ height: 32, width: "auto", objectFit: "contain" }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--soma-muted)" }}>
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
                {profile?.full_name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--soma-text)" }}>
                {profile?.full_name}
              </span>
            </div>
          </div>
        </header>

        {/* Página */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Rodapé dourado */}
        <div className="h-1 w-full shrink-0"
          style={{ background: "linear-gradient(90deg, #a07830, #f5a623, #c9a84c, #f5a623, #a07830)" }} />
      </div>
    </div>
  );
}