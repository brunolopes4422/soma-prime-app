import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useTrilha } from "../../hooks/useTrilha";
import {
  ChevronLeft, ChevronDown, CheckCircle2, Lock,
  Play, Trophy, Star, Clock, BookOpen
} from "lucide-react";

interface Trilha {
  id: string;
  title: string;
  description: string;
  sector: string;
  level: number;
  company: string;
}

const levelLabel: Record<number, string> = { 1: "Júnior", 2: "Pleno", 3: "Sênior", 4: "Gestor" };
const levelColor: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "rgba(22,163,74,0.15)",   text: "#4ade80",  border: "rgba(22,163,74,0.3)" },
  2: { bg: "rgba(96,165,250,0.15)",  text: "#93c5fd",  border: "rgba(96,165,250,0.3)" },
  3: { bg: "rgba(168,85,247,0.15)",  text: "#d8b4fe",  border: "rgba(168,85,247,0.3)" },
  4: { bg: "rgba(245,166,35,0.15)",  text: "#f5a623",  border: "rgba(245,166,35,0.3)" },
};

function VideoPlayer({ url, onComplete }: { url: string; onComplete: () => void }) {
  const [played, setPlayed] = useState(false);
  const youtubeId = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  const embedUrl  = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?rel=0` : url;

  return (
    <div className="space-y-3">
      <div className="rounded-xl overflow-hidden" style={{ aspectRatio: "16/9", backgroundColor: "#000" }}>
        <iframe src={embedUrl} className="w-full h-full" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
      </div>
      {!played && (
        <button onClick={() => { setPlayed(true); onComplete(); }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          <CheckCircle2 size={16} /> Marcar como assistido
        </button>
      )}
      {played && (
        <div className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>
          <CheckCircle2 size={16} /> Aula concluída!
        </div>
      )}
    </div>
  );
}

export default function TrilhaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { modules, progress, hasCert, loading, completeLesson, totalLessons, doneLessons, pct } = useTrilha(id ?? "");

  const [trilha, setTrilha]         = useState<Trilha | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [certLoading, setCertLoading]   = useState(false);
  const [certDone, setCertDone]         = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("trilhas").select("*").eq("id", id).single()
      .then(({ data }) => setTrilha(data));
  }, [id]);

  useEffect(() => {
    if (modules.length > 0 && !activeModule) {
      setActiveModule(modules[0].id);
    }
  }, [modules]);

  async function handleCertificate() {
    if (!profile || !id || hasCert || pct < 100) return;
    setCertLoading(true);
    await supabase.from("certificates").insert({
      user_id: profile.id, trilha_id: id,
      issued_at: new Date().toISOString(),
    });
    setCertDone(true);
    setCertLoading(false);
  }

  if (loading || !trilha) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando trilha...</span>
    </div>
  );

  const colors = levelColor[trilha.level] ?? levelColor[1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="space-y-4">
        <button onClick={() => navigate("/trilhas")}
          className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          style={{ color: "var(--soma-muted)" }}>
          <ChevronLeft size={16} /> Voltar para Trilhas
        </button>

        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold border"
                  style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}>
                  {levelLabel[trilha.level]}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: "var(--soma-bg)", color: "var(--soma-muted)", border: "1px solid var(--soma-border)" }}>
                  {trilha.sector.toUpperCase()}
                </span>
              </div>
              <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>{trilha.title}</h1>
              <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{trilha.description}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-xs shrink-0">
              <div className="text-center">
                <p className="font-bold text-lg" style={{ color: "#f5a623" }}>{totalLessons}</p>
                <p style={{ color: "var(--soma-muted)" }}>aulas</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg" style={{ color: "#f5a623" }}>{doneLessons}</p>
                <p style={{ color: "var(--soma-muted)" }}>concluídas</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg" style={{ color: "#f5a623" }}>{pct}%</p>
                <p style={{ color: "var(--soma-muted)" }}>progresso</p>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="space-y-1.5">
            <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#22c55e" : "#f5a623" }} />
            </div>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{doneLessons} de {totalLessons} aulas concluídas</p>
          </div>

          {/* Botão certificado */}
          {pct === 100 && !hasCert && !certDone && (
            <button onClick={handleCertificate} disabled={certLoading}
              className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Trophy size={18} /> {certLoading ? "Gerando..." : "🎉 Emitir Certificado de Conclusão"}
            </button>
          )}
          {(hasCert || certDone) && (
            <div className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>
              <Trophy size={18} /> 🏆 Certificado emitido! Parabéns!
            </div>
          )}
        </div>
      </div>

      {/* Módulos e Aulas */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>
          Conteúdo da trilha
        </h2>

        {modules.length === 0 && (
          <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Conteúdo em preparação. Em breve!</p>
          </div>
        )}

        {modules.map((mod, modIdx) => {
          const modDone  = mod.lessons.filter(l => progress[l.id]).length;
          const modTotal = mod.lessons.length;
          const modPct   = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;
          const isOpen   = activeModule === mod.id;

          return (
            <div key={mod.id} className="rounded-2xl border overflow-hidden transition-all"
              style={{ backgroundColor: "var(--soma-card)", borderColor: isOpen ? "#f5a623" : "var(--soma-border)" }}>

              {/* Header do módulo */}
              <button className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => setActiveModule(isOpen ? null : mod.id)}>
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: modPct === 100 ? "#22c55e" : isOpen ? "#f5a623" : "var(--soma-bg)", color: modPct === 100 || isOpen ? "#000" : "var(--soma-muted)" }}>
                  {modPct === 100 ? <CheckCircle2 size={16} /> : modIdx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{mod.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{mod.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{modDone}/{modTotal}</span>
                  <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--soma-muted)" }} />
                </div>
              </button>

              {/* Aulas */}
              {isOpen && (
                <div className="border-t" style={{ borderColor: "rgba(245,166,35,0.2)" }}>
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isDone    = progress[lesson.id];
                    const isLessonOpen = activeLesson === lesson.id;

                    return (
                      <div key={lesson.id} className="border-b last:border-0" style={{ borderColor: "var(--soma-border)" }}>
                        {/* Header da aula */}
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                          style={{ backgroundColor: isLessonOpen ? "rgba(245,166,35,0.04)" : "transparent" }}
                          onClick={() => setActiveLesson(isLessonOpen ? null : lesson.id)}>
                          <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: isDone ? "#22c55e" : "var(--soma-bg)", border: `1px solid ${isDone ? "#22c55e" : "var(--soma-border)"}` }}>
                            {isDone
                              ? <CheckCircle2 size={12} color="#000" />
                              : <Play size={10} style={{ color: "var(--soma-muted)" }} />
                            }
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium" style={{ color: isDone ? "var(--soma-muted)" : "var(--soma-text)", textDecoration: isDone ? "line-through" : "none" }}>
                              {lessonIdx + 1}. {lesson.title}
                            </p>
                            {lesson.description && (
                              <p className="text-xs truncate mt-0.5" style={{ color: "var(--soma-muted)" }}>{lesson.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {lesson.duration_min > 0 && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--soma-muted)" }}>
                                <Clock size={11} /> {lesson.duration_min}min
                              </span>
                            )}
                            <ChevronDown size={14} className={`transition-transform ${isLessonOpen ? "rotate-180" : ""}`}
                              style={{ color: "var(--soma-muted)" }} />
                          </div>
                        </button>

                        {/* Conteúdo da aula */}
                        {isLessonOpen && (
                          <div className="px-5 pb-5 pt-2 space-y-4 border-t" style={{ borderColor: "rgba(245,166,35,0.15)" }}>
                            {lesson.video_url && (
                              <VideoPlayer url={lesson.video_url} onComplete={() => completeLesson(lesson.id)} />
                            )}
                            {lesson.content && (
                              <div className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line"
                                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
                                {lesson.content}
                              </div>
                            )}
                            {!lesson.video_url && !lesson.content && (
                              <div className="text-center py-6 text-sm" style={{ color: "var(--soma-muted)" }}>
                                <Star size={24} className="mx-auto mb-2 opacity-30" />
                                Conteúdo em preparação.
                              </div>
                            )}
                            {!progress[lesson.id] && (
                              <button onClick={() => completeLesson(lesson.id)}
                                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                                style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                                <CheckCircle2 size={16} /> Marcar como concluída
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}