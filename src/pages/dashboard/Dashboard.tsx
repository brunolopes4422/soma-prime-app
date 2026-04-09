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
      <span className="text-gold animate-pulse">Carregando dashboard...</span>
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
        <h1 className="text-2xl font-bold">Dashboard de Gestão</h1>
        <p className="text-sm opacity-50 mt-1">Acompanhe o progresso da sua equipe em tempo real.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Colaboradores", value: totalMembers, icon: Users, color: "text-blue-500", bg: "bg-blue-50 border-blue-200" },
          { label: "Onboarding completo", value: onboardingDone, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50 border-green-200" },
          { label: "Média nos quizzes", value: `${avgQuizScore}%`, icon: Trophy, color: "text-gold", bg: "bg-gold/5 border-gold/20" },
          { label: "Sem progresso", value: atRisk, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50 border-red-200" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card-base border rounded-xl ${bg}`}>
            <div className={`${color} mb-2`}><Icon size={20} /></div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs opacity-60 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabela da equipe */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-4">Equipe</h2>
        {team.length === 0 ? (
          <div className="card-base border border-soma-border bg-white text-center py-10">
            <Users size={32} className="mx-auto opacity-20 mb-2" />
            <p className="text-sm opacity-50">Nenhum colaborador cadastrado ainda.</p>
            <p className="text-xs opacity-30 mt-1">Adicione colaboradores com role = "collaborator" no Supabase.</p>
          </div>
        ) : (
          <div className="card-base border border-soma-border bg-white overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-soma-border bg-soma-bg">
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Colaborador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Setor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Checklist</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Melhor quiz</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Status</th>
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
                  const statusColor = pct === 100 ? "bg-green-100 text-green-700" : pct > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";

                  return (
                    <tr key={member.id} className="border-b border-soma-border last:border-0 hover:bg-soma-bg/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">
                            {member.full_name?.[0]?.toUpperCase()}
                          </span>
                          <span className="font-medium">{member.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 uppercase text-xs opacity-60">{member.sector}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-soma-bg rounded-full overflow-hidden">
                            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs opacity-60">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {bestQuiz !== null
                          ? <span className={`font-semibold ${bestQuiz >= 70 ? "text-green-600" : "text-red-500"}`}>{bestQuiz}%</span>
                          : <span className="opacity-30">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>{status}</span>
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
          <h2 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-4">Últimas tentativas de quiz</h2>
          <div className="card-base border border-soma-border bg-white overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-soma-border bg-soma-bg">
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Colaborador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Guia</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Aba</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Resultado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Data</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.slice(0, 10).map((q, i) => {
                  const member = team.find(m => m.id === q.user_id);
                  const pct = Math.round((q.score / q.total) * 100);
                  return (
                    <tr key={i} className="border-b border-soma-border last:border-0 hover:bg-soma-bg/50">
                      <td className="px-4 py-3 font-medium">{member?.full_name ?? "—"}</td>
                      <td className="px-4 py-3 uppercase text-xs opacity-60">{q.guide}</td>
                      <td className="px-4 py-3 text-xs opacity-60 capitalize">{q.tab}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${pct >= 70 ? "text-green-600" : "text-red-500"}`}>
                          {q.score}/{q.total} ({pct}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs opacity-50">
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