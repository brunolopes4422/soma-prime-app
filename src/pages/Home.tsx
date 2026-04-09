import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTheme } from "../styles/themes";
import type { CompanyKey } from "../styles/themes";
import { Users, FileText, Calculator, LayoutDashboard, ArrowRight } from "lucide-react";

const guideCards = [
  {
    module: "cs",
    to: "/guias/cs",
    icon: Users,
    title: "CS / Atendimento",
    desc: "Fluxo de atendimento, scripts, ferramentas e rotinas do setor de Customer Success.",
    color: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
  },
  {
    module: "fiscal",
    to: "/guias/fiscal",
    icon: FileText,
    title: "Fiscal",
    desc: "Obrigações fiscais, prazos, regimes tributários e rotinas do departamento fiscal.",
    color: "from-yellow-500/10 to-yellow-600/5",
    border: "border-yellow-500/20",
  },
  {
    module: "dp",
    to: "/guias/dp",
    icon: Users,
    title: "Dep. Pessoal",
    desc: "Admissões, demissões, folha de pagamento e rotinas do departamento pessoal.",
    color: "from-orange-500/10 to-orange-600/5",
    border: "border-orange-500/20",
  },
  {
    module: "omie",
    to: "/guias/omie",
    icon: Calculator,
    title: "OMIE",
    desc: "Contas a pagar, contas a receber e conciliação bancária no sistema OMIE.",
    color: "from-gold/10 to-gold/5",
    border: "border-gold/20",
  },
];

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");

  const availableGuides = guideCards.filter(g =>
    theme.modules.includes(g.module)
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Boas-vindas */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          {greeting}, {profile?.full_name?.split(" ")[0] ?? "colaborador"}! 👋
        </h1>
        <p className="opacity-50 text-sm">
          Bem-vindo ao portal operacional da {theme.name}. Selecione um guia para começar.
        </p>
      </div>

      {/* Cards dos guias */}
      <div>
        <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Guias disponíveis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableGuides.map(({ to, icon: Icon, title, desc }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="card-base border border-soma-border/30 bg-soma-card text-left group 
                         hover:border-gold-light hover:shadow-lg hover:shadow-gold-light/10
                         transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-lg bg-gold/10 ${theme.accent}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs opacity-50 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Atalho dashboard — só gestores */}
      {profile?.role === "manager" && (
        <div>
          <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">Gestão</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className={`card-base border text-left group hover:scale-[1.02] hover:shadow-md w-full
                        bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg bg-gold/10 ${theme.accent}`}>
                <LayoutDashboard size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Dashboard de Gestão</h3>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs opacity-50 mt-1">
                  Acompanhe o progresso de onboarding da sua equipe.
                </p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Info do perfil */}
      <div className={`card-base border ${theme.card} rounded-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center font-bold text-gold">
            {profile?.full_name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div>
            <p className="font-semibold text-sm">{profile?.full_name}</p>
            <p className="text-xs opacity-40 capitalize">
              {profile?.role === "manager" ? "Gestor" : "Colaborador"} · {profile?.sector?.toUpperCase()} · {theme.name}
            </p>
          </div>
          <span className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${theme.badge}`}>
            {profile?.role === "manager" ? "Gestor" : "Colaborador"}
          </span>
        </div>
      </div>

    </div>
  );
}