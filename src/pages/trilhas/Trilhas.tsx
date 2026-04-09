import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { getTheme } from "../../styles/themes";
import type { CompanyKey } from "../../styles/themes";
import { Trophy, Lock, CheckCircle2, ChevronRight, Star } from "lucide-react";

interface Trilha {
  id: string;
  title: string;
  description: string;
  sector: string;
  level: number;
  order_num: number;
  total_lessons?: number;
  completed_lessons?: number;
}

const levelLabel: Record<number, string> = {
  1: "Júnior",
  2: "Pleno",
  3: "Sênior",
  4: "Gestor",
};

const levelColor: Record<number, string> = {
  1: "bg-green-100 text-green-700 border-green-200",
  2: "bg-blue-100 text-blue-700 border-blue-200",
  3: "bg-purple-100 text-purple-700 border-purple-200",
  4: "bg-gold/10 text-gold border-gold/20",
};

const sectorIcon: Record<string, string> = {
  cs:     "👥",
  fiscal: "📄",
  dp:     "💼",
};

export default function Trilhas() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const theme = getTheme((profile?.company as CompanyKey) ?? "soma_prime");
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    async function load() {
      // Busca trilhas da empresa
      const { data: trilhasData } = await supabase
        .from("trilhas")
        .select("*")
        .eq("company", profile!.company)
        .order("sector")
        .order("order_num");

      // Busca certificados do usuário
      const { data: certsData } = await supabase
        .from("certificates")
        .select("trilha_id")
        .eq("user_id", profile!.id);

      setTrilhas(trilhasData ?? []);
      setCertificates((certsData ?? []).map(c => c.trilha_id));
      setLoading(false);
    }
    load();
  }, [profile]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="text-gold animate-pulse">Carregando trilhas...</span>
    </div>
  );

  // Agrupa por setor
  const grouped = trilhas.reduce((acc, t) => {
    if (!acc[t.sector]) acc[t.sector] = [];
    acc[t.sector].push(t);
    return acc;
  }, {} as Record<string, Trilha[]>);

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">🎓 Escola {theme.name}</h1>
        <p className="opacity-50 text-sm">
          Sua jornada de desenvolvimento profissional. Complete as trilhas e avance na carreira.
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Trilhas disponíveis", value: trilhas.length, icon: "📚" },
          { label: "Certificados obtidos", value: certificates.length, icon: "🏆" },
          { label: "Em progresso", value: trilhas.length - certificates.length, icon: "⚡" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card-base border border-soma-border/30 bg-soma-card text-center">
            <span className="text-2xl">{icon}</span>
            <p className="text-2xl font-bold mt-1 text-soma-text">{value}</p>
            <p className="text-xs text-soma-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Trilhas por setor */}
      {Object.entries(grouped).map(([sector, items]) => (
        <div key={sector}>
          <h2 className="text-xs uppercase tracking-widest opacity-40 mb-4">
            {sectorIcon[sector]} {sector === "cs" ? "Customer Success" : sector === "fiscal" ? "Fiscal" : "Departamento Pessoal"}
          </h2>
          <div className="space-y-3">
            {items.map((trilha, idx) => {
              const isCompleted = certificates.includes(trilha.id);
              const isLocked = idx > 0 && !certificates.includes(items[idx - 1].id);

              return (
                <button
                  key={trilha.id}
                  onClick={() => !isLocked && navigate(`/trilhas/${trilha.id}`)}
                  disabled={isLocked}
                  className={`w-full text-left card-base border group transition-all duration-200
                    ${isCompleted
                      ? "border-green-500/30 hover:border-green-500/60"
                      : isLocked
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:border-gold-light/60 hover:shadow-lg hover:shadow-gold-light/5"}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Ícone status */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                      ${isCompleted ? "bg-green-100" : isLocked ? "bg-soma-bg" : "bg-gold/10"}`}>
                      {isCompleted
                        ? <CheckCircle2 size={20} className="text-green-500" />
                        : isLocked
                          ? <Lock size={18} className="opacity-30" />
                          : <Star size={18} className="text-gold" />
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{trilha.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${levelColor[trilha.level]}`}>
                          {levelLabel[trilha.level]}
                        </span>
                        {isCompleted && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium flex items-center gap-1">
                            <Trophy size={10} /> Certificado
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-50 mt-0.5 truncate">{trilha.description}</p>
                    </div>

                    {/* Seta */}
                    {!isLocked && (
                      <ChevronRight size={16} className="opacity-30 group-hover:opacity-70 group-hover:text-gold transition-all shrink-0" />
                    )}
                  </div>

                  {/* Barra de progresso */}
                  {!isLocked && !isCompleted && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-soma-bg rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full w-0" />
                      </div>
                      <span className="text-xs opacity-30">0%</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}