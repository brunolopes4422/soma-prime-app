import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getTheme } from "../styles/themes";
import type { CompanyKey } from "../styles/themes";
import { supabase } from "../lib/supabase";
import {
  Trophy, BookOpen, Flame, ChevronRight, Play,
  CheckCircle2, Lock, Star, ArrowRight, LayoutDashboard,
  Zap, Target
} from "lucide-react";

interface Trilha {
  id: string; title: string; description: string;
  sector: string; level: number; order_num: number;
}

const levelLabel: Record<number, string> = { 1: "Júnior", 2: "Pleno", 3: "Sênior", 4: "Gestor" };
const levelColor: Record<number, { text: string; bg: string; border: string }> = {
  1: { text: "#16a34a", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.2)" },
  2: { text: "#2563eb", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.2)" },
  3: { text: "#9333ea", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)" },
  4: { text: "#f5a623", bg: "rgba(245,166,35,0.1)",  border: "rgba(245,166,35,0.2)" },
};
const sectorLabel: Record<string, string> = {
  cs: "Customer Success", fiscal: "Fiscal", dp: "Dep. Pessoal",
  contabil: "Contábil", omie: "OMIE", informatica: "Informática",
};

export default function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");

  const [trilhas, setTrilhas]       = useState<Trilha[]>([]);
  const [certificates, setCerts]    = useState<string[]>([]);
  const [progress, setProgress]     = useState<Record<string, number>>({});
  const [totalLessons, setTotal]    = useState<Record<string, number>>({});
  const [streak, setStreak]         = useState(0);
  const [loading, setLoading]       = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const firstName = profile?.full_name?.split(" ")[0] ?? "colaborador";

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Trilhas da empresa
      const { data: t } = await supabase.from("trilhas").select("*")
        .eq("company", profile!.company).order("sector").order("order_num");

      // Certificados
      const { data: c } = await supabase.from("certificates").select("trilha_id")
        .eq("user_id", profile!.id);

      // Progresso de aulas
      const { data: p } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, lessons(module_id, modules(trilha_id))")
        .eq("user_id", profile!.id).eq("completed", true);

      // Total de aulas por trilha
      const { data: mods } = await supabase
        .from("modules").select("trilha_id, lessons(id)");

      const totMap: Record<string, number> = {};
      (mods ?? []).forEach((m: any) => {
        totMap[m.trilha_id] = (totMap[m.trilha_id] ?? 0) + (m.lessons?.length ?? 0);
      });

      const progMap: Record<string, number> = {};
      (p ?? []).forEach((item: any) => {
        const tid = item.lessons?.modules?.trilha_id;
        if (tid) progMap[tid] = (progMap[tid] ?? 0) + 1;
      });

      // Streak
      const { data: s } = await supabase.from("study_streaks")
        .select("current").eq("user_id", profile!.id).single();

      setTrilhas(t ?? []);
      setCerts((c ?? []).map((x: any) => x.trilha_id));
      setProgress(progMap);
      setTotal(totMap);
      setStreak(s?.current ?? 0);
      setLoading(false);
    }
    load();
  }, [profile]);

  // Trilha em progresso (mais recente com aulas feitas)
  const inProgressTrilhas = trilhas.filter(t => progress[t.id] > 0 && !certificates.includes(t.id));
  const activeTrilha = inProgressTrilhas[0] ?? trilhas[0];

  // Stats
  const totalCerts   = certificates.length;
  const totalTrilhas = trilhas.length;
  const totalDone    = Object.values(progress).reduce((a, b) => a + b, 0);
  const overallPct   = totalTrilhas > 0
    ? Math.round((Object.values(progress).reduce((a, b) => a + b, 0) /
        Math.max(Object.values(totalLessons).reduce((a, b) => a + b, 0), 1)) * 100)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-pulse text-sm" style={{ color: "#f5a623" }}>Carregando...</span>
    </div>
  );

  // Agrupa trilhas por setor
  const grouped = trilhas.reduce((acc, t) => {
    if (!acc[t.sector]) acc[t.sector] = [];
    acc[t.sector].push(t);
    return acc;
  }, {} as Record<string, Trilha[]>);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">

      {/* Boas-vindas */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--soma-text)" }}>
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--soma-muted)" }}>
            Bem-vindo ao portal da {theme.name}. Continue sua jornada de aprendizado.
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)" }}>
            <Flame size={16} style={{ color: "#f5a623" }} />
            <span className="text-sm font-bold" style={{ color: "#f5a623" }}>{streak} dias seguidos</span>
          </div>
        )}
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen,      value: totalDone,    label: "Aulas concluídas", color: "#f5a623" },
          { icon: Trophy,        value: totalCerts,   label: "Certificados",     color: "#22c55e" },
          { icon: Target,        value: `${overallPct}%`, label: "Progresso geral", color: "#60a5fa" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="rounded-2xl border p-4 text-center"
            style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: `${color}15` }}>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Continuar de onde parou */}
      {activeTrilha && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--soma-muted)" }}>
            {inProgressTrilhas.length > 0 ? "Continue de onde parou" : "Comece por aqui"}
          </p>
          <button
            onClick={() => navigate(`/trilhas/${activeTrilha.id}`)}
            className="w-full text-left rounded-2xl border p-5 transition-all hover:opacity-90 group"
            style={{ backgroundColor: "var(--soma-card)", borderColor: "rgba(245,166,35,0.3)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(245,166,35,0.12)" }}>
                {certificates.includes(activeTrilha.id)
                  ? <Trophy size={22} style={{ color: "#22c55e" }} />
                  : progress[activeTrilha.id] > 0
                    ? <Play size={22} style={{ color: "#f5a623" }} />
                    : <Star size={22} style={{ color: "#f5a623" }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold border"
                    style={{ ...levelColor[activeTrilha.level] }}>
                    {levelLabel[activeTrilha.level]}
                  </span>
                  <span className="text-xs" style={{ color: "var(--soma-muted)" }}>
                    {sectorLabel[activeTrilha.sector] ?? activeTrilha.sector}
                  </span>
                </div>
                <p className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>{activeTrilha.title}</p>
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{
                        width: `${totalLessons[activeTrilha.id] > 0 ? Math.round((progress[activeTrilha.id] ?? 0) / totalLessons[activeTrilha.id] * 100) : 0}%`,
                        backgroundColor: "#f5a623"
                      }} />
                  </div>
                  <p className="text-xs" style={{ color: "var(--soma-muted)" }}>
                    {progress[activeTrilha.id] ?? 0} de {totalLessons[activeTrilha.id] ?? 0} aulas · {totalLessons[activeTrilha.id] > 0 ? Math.round((progress[activeTrilha.id] ?? 0) / totalLessons[activeTrilha.id] * 100) : 0}%
                  </p>
                </div>
              </div>
              <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1"
                style={{ color: "#f5a623" }} />
            </div>
          </button>
        </div>
      )}

      {/* Trilhas por setor */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>
            Suas trilhas
          </p>
          <button onClick={() => navigate("/trilhas")}
            className="flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
            style={{ color: "#f5a623" }}>
            Ver todas <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {Object.entries(grouped).map(([sector, items]) => {
            const sectorCerts = items.filter(t => certificates.includes(t.id)).length;
            const sectorDone  = items.reduce((a, t) => a + (progress[t.id] ?? 0), 0);
            const sectorTotal = items.reduce((a, t) => a + (totalLessons[t.id] ?? 0), 0);
            const sectorPct   = sectorTotal > 0 ? Math.round(sectorDone / sectorTotal * 100) : 0;

            return (
              <button key={sector}
                onClick={() => navigate("/trilhas")}
                className="w-full text-left rounded-2xl border p-4 flex items-center gap-4 transition-all hover:opacity-80 group"
                style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>
                      {sectorLabel[sector] ?? sector}
                    </p>
                    <span className="text-xs shrink-0" style={{ color: "var(--soma-muted)" }}>
                      {sectorCerts}/{items.length} trilhas
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${sectorPct}%`, backgroundColor: sectorPct === 100 ? "#22c55e" : "#f5a623" }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--soma-muted)" }}>{sectorPct}% concluído</p>
                </div>
                <ChevronRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--soma-muted)" }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Atalho Dashboard — gestores */}
      {(profile?.role === "manager" || profile?.role === "admin") && (
        <button onClick={() => navigate("/dashboard")}
          className="w-full text-left rounded-2xl border p-5 flex items-center gap-4 transition-all hover:opacity-80"
          style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(245,166,35,0.1)" }}>
            <LayoutDashboard size={18} style={{ color: "#f5a623" }} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>Dashboard de Gestão</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>
              Acompanhe o progresso da sua equipe em tempo real.
            </p>
          </div>
          <ChevronRight size={16} style={{ color: "var(--soma-muted)" }} />
        </button>
      )}

      {/* Card do perfil */}
      <div className="rounded-2xl border p-4 flex items-center gap-3"
        style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden shrink-0"
          style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
          {profile?.avatar_url
            ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            : profile?.full_name?.[0]?.toUpperCase() ?? "U"
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate" style={{ color: "var(--soma-text)" }}>{profile?.full_name}</p>
          <p className="text-xs" style={{ color: "var(--soma-muted)" }}>
            {profile?.role === "admin" ? "Administrador" : profile?.role === "manager" ? "Gestor" : "Colaborador"}
            {profile?.sector ? ` · ${profile.sector.toUpperCase()}` : ""} · {theme.name}
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0"
          style={{ backgroundColor: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.2)" }}>
          {profile?.role === "admin" ? "Admin" : profile?.role === "manager" ? "Gestor" : "Colaborador"}
        </span>
      </div>
    </div>
  );
}