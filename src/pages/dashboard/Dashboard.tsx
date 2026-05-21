import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Users, CheckCircle2, Trophy, AlertCircle} from "lucide-react";

interface TeamMember {
  id: string;
  full_name: string;
  sector: string;
  role: string;
}

interface ChecklistSummary {
  user_id: string;
  completed: number;
  total: number;
}

interface QuizSummary {
  user_id: string;
  guide: string;
  tab: string;
  score: number;
  total: number;
  attempted_at: string;
}

const CHECKLIST_TOTALS: Record<string, number> = {
  cs: 16,
  fiscal: 16,
  dp: 16,
};

export default function Dashboard() {
  const { profile } = useAuth();
  const [team, setTeam]               = useState<TeamMember[]>([]);
  const [checklists, setChecklists]   = useState<ChecklistSummary[]>([]);
  const [quizzes, setQuizzes]         = useState<QuizSummary[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Busca equipe da mesma empresa
      const { data: teamData } = await supabase
        .from("profiles")
        .select("id, full_name, sector, role")
        .eq("company", profile!.company)
        .eq("role", "collaborator");

      // Busca progresso dos checklists
      const { data: checkData } = await supabase
        .from("checklist_items")
        .select("user_id, completed");

      // Busca resultados dos quizzes
      const { data: quizData } = await supabase
        .from("quiz_results")
        .select("user_id, guide, tab, score, total, attempted_at")
        .order("attempted_at", { ascending: false });

      setTeam(teamData ?? []);

      // Agrupa checklist por usuário
      const checkMap: Record<string, number> = {};
      (checkData ?? []).forEach(row => {
        if (row.completed) checkMap[row.user_id] = (checkMap[row.user_id] ?? 0) + 1;
      });
      setChecklists(Object.entries(checkMap).map(([user_id, completed]) => ({
        user_id, completed, total: 16
      })));

      setQuizzes(quizData ?? []);
      setLoading(false);
    }
    load();
  }, [profile]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-pulse text-sm" style={{ color: "#f5a623" }}>Carregando dashboard...</span>
    </div>
  );

  // Métricas gerais
  const totalMembers = team.length;
  const onboardingDone = team.filter(m => {
    const c = checklists.find(c => c.user_id === m.id);
    return c && c.completed >= (CHECKLIST_TOTALS[m.sector] ?? 16);
  }).length;

  const avgQuizScore = quizzes.length > 0
    ? Math.round((quizzes.reduce((a, q) => a + (q.score / q.total) * 100, 0) / quizzes.length))
    : 0;

  const atRisk = team.filter(m => {
    const c = checklists.find(c => c.user_id === m.id);
    return !c || c.completed === 0;
  }).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--soma-text)" }}>Dashboard de Gestão</h1>
        <p className="text-sm mt-1" style={{ color: "var(--soma-muted)" }}>Acompanhe o progresso da sua equipe em tempo real.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Colaboradores", value: totalMembers, icon: Users, color: "#60a5fa", border: "rgba(96,165,250,0.25)" },
          { label: "Onboarding completo", value: onboardingDone, icon: CheckCircle2, color: "#22c55e", border: "rgba(34,197,94,0.25)" },
          { label: "Média nos quizzes", value: `${avgQuizScore}%`, icon: Trophy, color: "#f5a623", border: "rgba(245,166,35,0.2)" },
          { label: "Sem progresso", value: atRisk, icon: AlertCircle, color: "#f87171", border: "rgba(248,113,113,0.25)" },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ backgroundColor: "var(--soma-card)", border: `1px solid ${border}` }}>
            <div className="mb-3"><Icon size={20} style={{ color }} /></div>
            <p className="text-2xl font-bold" style={{ color: "var(--soma-text)" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabela da equipe */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--soma-muted)" }}>Equipe</h2>
        {team.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <Users size={32} className="mx-auto opacity-20 mb-2" />
            <p className="text-sm opacity-50">Nenhum colaborador cadastrado ainda.</p>
            <p className="text-xs opacity-30 mt-1">Adicione colaboradores com role = "collaborator" no Supabase.</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--soma-border)", backgroundColor: "var(--soma-bg)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Colaborador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Setor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Checklist</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Melhor quiz</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {team.map(member => {
                  const check = checklists.find(c => c.user_id === member.id);
                  const memberQuizzes = quizzes.filter(q => q.user_id === member.id);
                  const bestQuiz = memberQuizzes.length > 0
                    ? Math.max(...memberQuizzes.map(q => Math.round((q.score / q.total) * 100)))
                    : null;
                  const checkTotal = CHECKLIST_TOTALS[member.sector] ?? 16;
                  const checkDone = check?.completed ?? 0;
                  const pct = Math.round((checkDone / checkTotal) * 100);
                  const status = pct === 100 ? "Completo" : pct > 0 ? "Em progresso" : "Não iniciado";
                  const statusBg = pct === 100 ? "rgba(34,197,94,0.12)" : pct > 0 ? "rgba(245,166,35,0.12)" : "rgba(248,113,113,0.12)";
                  const statusText = pct === 100 ? "#16a34a" : pct > 0 ? "#d97706" : "#dc2626";

                  return (
                    <tr key={member.id} style={{ borderBottom: "1px solid var(--soma-border)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
                            {member.full_name?.[0]?.toUpperCase()}
                          </span>
                          <span className="font-medium" style={{ color: "var(--soma-text)" }}>{member.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 uppercase text-xs" style={{ color: "var(--soma-muted)" }}>{member.sector}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
                            <div className="h-full rounded-full transition-all" style={{ backgroundColor: "#f5a623" }} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs opacity-60">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {bestQuiz !== null
                          ? <span className="font-semibold" style={{ color: bestQuiz >= 70 ? "#16a34a" : "#dc2626" }}>{bestQuiz}%</span>
                          : <span style={{ color: "var(--soma-muted)" }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusBg, color: statusText }}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Últimos quizzes */}
      {quizzes.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--soma-muted)" }}>Últimas tentativas de quiz</h2>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--soma-border)", backgroundColor: "var(--soma-bg)" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Colaborador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Guia</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Aba</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Resultado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Data</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.slice(0, 10).map((q, i) => {
                  const member = team.find(m => m.id === q.user_id);
                  const pct = Math.round((q.score / q.total) * 100);
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid var(--soma-border)" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--soma-text)" }}>{member?.full_name ?? "—"}</td>
                      <td className="px-4 py-3 uppercase text-xs" style={{ color: "var(--soma-muted)" }}>{q.guide}</td>
                      <td className="px-4 py-3 text-xs capitalize" style={{ color: "var(--soma-muted)" }}>{q.tab}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold" style={{ color: pct >= 70 ? "#16a34a" : "#dc2626" }}>
                          {q.score}/{q.total} ({pct}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--soma-muted)" }}>
                        {new Date(q.attempted_at).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}