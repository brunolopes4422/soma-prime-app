import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { getTheme } from "../../styles/themes";
import type { CompanyKey } from "../../styles/themes";
import { Trophy, Lock, CheckCircle2, ChevronRight, Star, BookOpen, Play, Users, FileText, Briefcase, BookMarked, Calculator, Monitor, Zap } from "lucide-react";

interface Trilha {
  id: string;
  title: string;
  description: string;
  sector: string;
  level: number;
  order_num: number;
}

const levelLabel: Record<number, string> = { 1: "Júnior", 2: "Pleno", 3: "Sênior", 4: "Gestor" };
const levelColor: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "rgba(34,197,94,0.12)",   text: "#16a34a", border: "rgba(34,197,94,0.25)" },
  2: { bg: "rgba(96,165,250,0.12)",  text: "#2563eb", border: "rgba(96,165,250,0.25)" },
  3: { bg: "rgba(168,85,247,0.12)",  text: "#9333ea", border: "rgba(168,85,247,0.25)" },
  4: { bg: "rgba(245,166,35,0.12)",  text: "#f5a623", border: "rgba(245,166,35,0.25)" },
};
const levelGradient: Record<number, string> = {
  1: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))",
  2: "linear-gradient(135deg, rgba(96,165,250,0.08), rgba(96,165,250,0.02))",
  3: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(168,85,247,0.02))",
  4: "linear-gradient(135deg, rgba(245,166,35,0.08), rgba(245,166,35,0.02))",
};

const sectorConfig: Record<string, { label: string; icon: any; color: string }> = {
  cs:          { label: "Customer Success",     icon: Users,      color: "#f5a623" },
  fiscal:      { label: "Fiscal",               icon: FileText,   color: "#60a5fa" },
  dp:          { label: "Departamento Pessoal", icon: Briefcase,  color: "#a78bfa" },
  contabil:    { label: "Contábil",             icon: BookMarked, color: "#34d399" },
  omie:        { label: "OMIE / Financeiro",    icon: Calculator, color: "#fb923c" },
  informatica: { label: "Informática",          icon: Monitor,    color: "#22d3ee" },
};

export default function Trilhas() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");

  const [trilhas, setTrilhas]         = useState<Trilha[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [progress, setProgress]       = useState<Record<string, number>>({});
  const [duracaoMap, setDuracaoMap]   = useState<Record<string, number>>({});
  const [loading, setLoading]         = useState(true);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Trilhas da empresa com duração das aulas
      const { data: trilhasData } = await supabase
        .from("trilhas").select("*, modules(lessons(duration_min))")
        .eq("company", profile!.company)
        .order("sector").order("order_num");

      // Monta mapa de carga horária por trilha
      const duracaoMapLocal: Record<string, number> = {};
      (trilhasData ?? []).forEach((t: any) => {
        const totalMin = (t.modules ?? []).reduce((a: number, m: any) =>
          a + (m.lessons ?? []).reduce((b: number, l: any) => b + (l.duration_min ?? 10), 0), 0);
        duracaoMapLocal[t.id] = Math.ceil(totalMin / 60);
      });

      // Verifica se há controle de acesso — se sim, filtra
      const { data: accessData } = await supabase
        .from("user_trilha_access").select("trilha_id")
        .eq("user_id", profile!.id);

      // Se o usuário tem registros de acesso, filtra; senão mostra todas (admin/manager)
      const allowedIds = accessData && accessData.length > 0
        ? accessData.map((a: any) => a.trilha_id)
        : null;

      const filteredTrilhas = allowedIds
        ? (trilhasData ?? []).filter(t => allowedIds.includes(t.id))
        : (trilhasData ?? []);

      const { data: certsData } = await supabase
        .from("certificates").select("trilha_id")
        .eq("user_id", profile!.id);

      // Busca progresso por trilha
      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, lessons(module_id, modules(trilha_id))")
        .eq("user_id", profile!.id)
        .eq("completed", true);

      // Monta mapa de progresso
      const prog: Record<string, number> = {};
      (progressData ?? []).forEach((p: any) => {
        const trilhaId = p.lessons?.modules?.trilha_id;
        if (trilhaId) prog[trilhaId] = (prog[trilhaId] ?? 0) + 1;
      });

      setTrilhas(filteredTrilhas);
      setDuracaoMap(duracaoMapLocal);
      setCertificates((certsData ?? []).map(c => c.trilha_id));
      setProgress(prog);
      setLoading(false);

      // Todos os setores começam fechados
      if (trilhasData && trilhasData.length > 0) {
      }
    }
    load();
  }, [profile]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-pulse text-sm" style={{ color: "#f5a623" }}>Carregando trilhas...</span>
    </div>
  );

  // Agrupa por setor
  const grouped = trilhas.reduce((acc, t) => {
    if (!acc[t.sector]) acc[t.sector] = [];
    acc[t.sector].push(t);
    return acc;
  }, {} as Record<string, Trilha[]>);

  const totalCerts = certificates.length;
  const totalTrilhas = trilhas.length;
  const inProgress = Object.keys(progress).filter(id => !certificates.includes(id) && progress[id] > 0).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--soma-text)" }}>🎓 Escola {theme.name}</h1>
        <p className="text-sm mt-1" style={{ color: "var(--soma-muted)" }}>
          Sua jornada de desenvolvimento profissional. Complete as trilhas e avance na carreira.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Trilhas disponíveis", value: totalTrilhas, icon: BookOpen, color: "#f5a623" },
          { label: "Certificados obtidos", value: totalCerts,  icon: Trophy,   color: "#22c55e" },
          { label: "Em progresso",         value: inProgress,  icon: Zap,      color: "#60a5fa" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border p-5 text-center transition-all"
            style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: `${color}15` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--soma-text)" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Setores */}
      {Object.entries(grouped).map(([sector, items]) => {
        const cfg = sectorConfig[sector] ?? { label: sector, icon: BookOpen, color: "#f5a623" };
        const SectorIcon = cfg.icon;
        const isExpanded = expandedSector === sector;
        const sectorCerts = items.filter(t => certificates.includes(t.id)).length;

        return (
          <div key={sector}>
            {/* Header do setor — clicável */}
            <button
              onClick={() => setExpandedSector(isExpanded ? null : sector)}
              className="w-full flex items-center gap-3 mb-4 group"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cfg.color}15` }}>
                <SectorIcon size={16} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--soma-text)" }}>
                  {cfg.label}
                </p>
                <p className="text-xs" style={{ color: "var(--soma-muted)" }}>
                  {sectorCerts}/{items.length} trilhas concluídas
                </p>
              </div>
              <ChevronRight size={16}
                className="transition-transform duration-300"
                style={{ color: "var(--soma-muted)", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Cards das trilhas */}
            {isExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {items.map((trilha, idx) => {
                  const isCompleted = certificates.includes(trilha.id);
                  const isLocked    = idx > 0 && !certificates.includes(items[idx - 1].id);
                  const lc          = levelColor[trilha.level] ?? levelColor[1];
                  const doneLessons = progress[trilha.id] ?? 0;

                  return (
                    <button
                      key={trilha.id}
                      onClick={() => !isLocked && navigate(`/trilhas/${trilha.id}`)}
                      disabled={isLocked}
                      className="text-left rounded-2xl border p-5 transition-all duration-200 group relative overflow-hidden"
                      style={{
                        backgroundColor: "var(--soma-card)",
                        borderColor: isCompleted ? "rgba(34,197,94,0.3)" : isLocked ? "var(--soma-border)" : "var(--soma-border)",
                        opacity: isLocked ? 0.5 : 1,
                        cursor: isLocked ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={e => { if (!isLocked) e.currentTarget.style.borderColor = lc.border; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = isCompleted ? "rgba(34,197,94,0.3)" : "var(--soma-border)"; }}
                    >
                      {/* Fundo sutil de nível */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
                        style={{ background: isLocked ? "none" : levelGradient[trilha.level] }} />

                      <div className="relative space-y-4">
                        {/* Topo: badge nível + ícone status */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2.5 py-1 rounded-full font-semibold border"
                              style={{ backgroundColor: lc.bg, color: lc.text, borderColor: lc.border }}>
                              {levelLabel[trilha.level]}
                            </span>
                            {duracaoMap[trilha.id] > 0 && (
                              <span className="text-xs flex items-center gap-1" style={{ color: "var(--soma-muted)" }}>
                                🕐 {duracaoMap[trilha.id]}h
                              </span>
                            )}
                          </div>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: isCompleted ? "rgba(34,197,94,0.12)" : isLocked ? "var(--soma-bg)" : lc.bg }}>
                            {isCompleted
                              ? <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
                              : isLocked
                                ? <Lock size={16} style={{ color: "var(--soma-muted)" }} />
                                : doneLessons > 0
                                  ? <Play size={16} style={{ color: lc.text }} />
                                  : <Star size={16} style={{ color: lc.text }} />
                            }
                          </div>
                        </div>

                        {/* Título e descrição */}
                        <div>
                          <p className="font-bold text-base leading-snug mb-1" style={{ color: "var(--soma-text)" }}>
                            {trilha.title.replace(/^CS (Júnior|Pleno|Sênior|Gestor) — /, "").replace(/^DP (Júnior|Pleno) — /, "")}
                          </p>
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--soma-muted)" }}>
                            {trilha.description}
                          </p>
                        </div>

                        {/* Rodapé: progresso ou certificado */}
                        {isCompleted ? (
                          <div className="flex items-center gap-2 text-xs font-semibold"
                            style={{ color: "#22c55e" }}>
                            <Trophy size={13} /> Certificado emitido
                          </div>
                        ) : isLocked ? (
                          <div className="flex items-center gap-2 text-xs"
                            style={{ color: "var(--soma-muted)" }}>
                            <Lock size={12} /> Conclua a trilha anterior
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="h-1.5 rounded-full overflow-hidden"
                              style={{ backgroundColor: "var(--soma-bg)" }}>
                              <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${doneLessons > 0 ? Math.min(doneLessons * 5, 95) : 0}%`, backgroundColor: lc.text }} />
                            </div>
                            <div className="flex justify-between text-xs" style={{ color: "var(--soma-muted)" }}>
                              <span>{doneLessons > 0 ? `${doneLessons} aulas concluídas` : "Não iniciada"}</span>
                              <span style={{ color: lc.text }}>
                                {doneLessons > 0 ? `${Math.min(doneLessons * 5, 95)}%` : "0%"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}