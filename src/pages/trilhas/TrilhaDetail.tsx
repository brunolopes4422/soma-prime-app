import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useTrilha } from "../../hooks/useTrilha";
import {
  ChevronLeft, ChevronRight, CheckCircle2, Play, Trophy,
  Clock, MessageCircle, Send, Bot, X, Flame, Menu,
  BookOpen, PenLine, Lock, SkipBack, SkipForward,
  Maximize2, Pause, Star, AlertTriangle
} from "lucide-react";

// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface Trilha { id: string; title: string; description: string; sector: string; level: number; }
interface Comment { id: string; content: string; created_at: string; profiles: { full_name: string } | null; }

const levelLabel: Record<number, string> = { 1: "Júnior", 2: "Pleno", 3: "Sênior", 4: "Gestor" };
const levelColor: Record<number, string> = { 1: "#22c55e", 2: "#60a5fa", 3: "#a855f7", 4: "#f5a623" };

// ─── STREAK ───────────────────────────────────────────────────────────────────
function useStreak(userId: string) {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    if (!userId) return;
    async function load() {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("study_streaks").select("*").eq("user_id", userId).single();
      if (!data) { await supabase.from("study_streaks").insert({ user_id: userId, current: 1, longest: 1, last_date: today }); setStreak(1); return; }
      if (data.last_date === today) { setStreak(data.current); return; }
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const newCurrent = data.last_date === yStr ? data.current + 1 : 1;
      const newLongest = Math.max(newCurrent, data.longest);
      await supabase.from("study_streaks").update({ current: newCurrent, longest: newLongest, last_date: today }).eq("user_id", userId);
      setStreak(newCurrent);
    }
    load();
  }, [userId]);
  return streak;
}

// ─── IA TUTORA (modal) ────────────────────────────────────────────────────────
function AIModal({ lessonTitle, lessonContent, trilhaTitle, onClose }: {
  lessonTitle: string; lessonContent: string; trilhaTitle: string; onClose: () => void;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const suggestions = ["Pode me dar um exemplo prático?", "Qual o erro mais comum aqui?", "Como isso funciona na prática?"];

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: `Você é a Tutora da Soma Prime Academy — especialista em contabilidade. Aula: "${lessonTitle}" | Trilha: "${trilhaTitle}". Conteúdo: ${lessonContent?.slice(0, 800) ?? ""}. Responda em português brasileiro, seja direta e prática, máximo 3 parágrafos. SEMPRE termine com: "⚠️ Consulte os manuais oficiais e confirme com o responsável do setor antes de aplicar qualquer procedimento!"` },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7, max_tokens: 500,
        }),
      });
      const data = await res.json();
      let reply = data.choices?.[0]?.message?.content ?? "Não consegui responder. Tente novamente!";
      if (!reply.includes("gestor") && !reply.includes("responsável")) reply += "\n\n⚠️ Consulte os manuais oficiais e confirme com o responsável do setor antes de aplicar!";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Ops! Erro de conexão. Tente novamente. 😅" }]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-lg rounded-2xl flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--soma-card)", border: "1px solid rgba(168,85,247,0.3)", maxHeight: "85vh", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(168,85,247,0.1))", borderBottom: "1px solid rgba(168,85,247,0.2)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <Bot size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm" style={{ color: "#d8b4fe" }}>IA Tutora — Soma Prime Academy</p>
            <p className="text-xs truncate" style={{ color: "var(--soma-muted)" }}>Aula: {lessonTitle}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70" style={{ color: "var(--soma-muted)" }}><X size={16} /></button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-48">
          {messages.length === 0 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                  <Bot size={13} className="text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-xs"
                  style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>
                  Olá! 👋 Estou aqui para tirar suas dúvidas sobre <strong style={{ color: "#d8b4fe" }}>{lessonTitle}</strong>.
                  <br /><br />
                  <span style={{ color: "#f5a623" }}>⚠️</span> Sempre confirme as informações com o responsável do setor!
                </div>
              </div>
              <div className="pl-9 space-y-1.5">
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(s)}
                    className="w-full text-left text-xs px-3 py-2 rounded-xl transition-all hover:opacity-80"
                    style={{ backgroundColor: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "#d8b4fe" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                  <Bot size={11} className="text-white" />
                </div>
              )}
              <div className="text-xs leading-relaxed rounded-2xl px-3 py-2.5 max-w-xs whitespace-pre-wrap"
                style={m.role === "user"
                  ? { backgroundColor: "#7c3aed", color: "#fff", borderBottomRightRadius: 4 }
                  : { backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)", borderBottomLeftRadius: 4 }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                <Bot size={11} className="text-white" />
              </div>
              <div className="rounded-2xl px-3 py-2.5 flex gap-1" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#a855f7", animationDelay: `${i*150}ms` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Aviso + Input */}
        <div className="shrink-0">
          <div className="px-4 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "rgba(245,166,35,0.05)", borderTop: "1px solid rgba(245,166,35,0.15)" }}>
            <AlertTriangle size={10} style={{ color: "#f5a623" }} />
            <p className="text-xs" style={{ color: "rgba(245,166,35,0.8)" }}>Confirme com o responsável do setor antes de aplicar!</p>
          </div>
          <div className="p-3" style={{ borderTop: "1px solid var(--soma-border)" }}>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Digite sua dúvida sobre a aula..."
                className="flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none"
                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
              <button onClick={() => send()} disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMENTÁRIOS ──────────────────────────────────────────────────────────────
function Comments({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("lesson_comments").select("*, profiles(full_name)").eq("lesson_id", lessonId).order("created_at");
    setComments(data ?? []);
  }, [lessonId]);

  useEffect(() => { load(); }, [load]);

  async function submit() {
    if (!text.trim() || !user || loading) return;
    setLoading(true);
    await supabase.from("lesson_comments").insert({ lesson_id: lessonId, user_id: user.id, content: text.trim() });
    setText(""); await load();
    setLoading(false);
  }

  const initials = (name: string) => name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--soma-text)" }}>
        <MessageCircle size={16} style={{ color: "#f5a623" }} /> Comentários da aula ({comments.length})
      </h3>

      {/* Input */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
          {user ? initials((user as any).email ?? "") : "?"}
        </div>
        <div className="flex-1 space-y-2">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
            placeholder="Adicione um comentário ou dúvida sobre esta aula..."
            className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
            style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
          <button onClick={submit} disabled={loading || !text.trim()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40 transition-all"
            style={{ backgroundColor: "#f5a623", color: "#000" }}>
            <Send size={12} /> Comentar
          </button>
        </div>
      </div>

      {/* Lista */}
      {comments.length === 0 && (
        <p className="text-xs text-center py-3" style={{ color: "var(--soma-muted)" }}>Seja o primeiro a comentar! 💬</p>
      )}
      {comments.map(c => (
        <div key={c.id} className="flex gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: "rgba(96,165,250,0.15)", color: "#60a5fa" }}>
            {initials(c.profiles?.full_name ?? "?")}
          </div>
          <div className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold" style={{ color: "#f5a623" }}>{c.profiles?.full_name ?? "Colaborador"}</p>
              <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--soma-text)" }}>{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ANOTAÇÕES ────────────────────────────────────────────────────────────────
function Notes({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("lesson_notes").select("content").eq("lesson_id", lessonId).eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setNote(data.content); });
  }, [lessonId, user]);

  function handleChange(val: string) {
    setNote(val); setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!user) return;
      await supabase.from("lesson_notes").upsert({ lesson_id: lessonId, user_id: user.id, content: val, updated_at: new Date().toISOString() }, { onConflict: "lesson_id,user_id" });
      setSaved(true);
    }, 800);
  }

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 font-semibold text-sm" style={{ color: "var(--soma-text)" }}>
        <PenLine size={16} style={{ color: "#60a5fa" }} /> Minhas anotações
      </h3>
      <textarea value={note} onChange={e => handleChange(e.target.value)} rows={4}
        placeholder="Anote os pontos mais importantes para revisar depois..."
        className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
        style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
      <p className="text-xs" style={{ color: saved ? "#4ade80" : "var(--soma-muted)" }}>
        {saved ? "✅ Salvo automaticamente" : "Digitando..."}
      </p>
    </div>
  );
}

// ─── PLAYER DE VÍDEO ──────────────────────────────────────────────────────────
function VideoPlayer({ url }: { url: string }) {
  const ytId = url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  if (!ytId) return null;
  return (
    <div style={{ aspectRatio: "16/9", backgroundColor: "#000" }}>
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

// ─── CONTEÚDO DA AULA (estilo Notion) ─────────────────────────────────────────
function LessonContent({ content }: { content: string }) {
  if (!content?.trim()) return null;
  const lines = content.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;

        // Título com emoji (ex: "━━━ Título ━━━" ou linha com ━)
        if (line.startsWith("━")) return (
          <h3 key={i} className="font-semibold text-sm pt-4 pb-1 flex items-center gap-2"
            style={{ color: "var(--soma-text)", borderTop: i > 0 ? "1px solid var(--soma-border)" : "none", marginTop: 8 }}>
            {line.replace(/━/g, "").trim()}
          </h3>
        );

        // Callout ⚠️
        if (line.startsWith("⚠️")) return (
          <div key={i} className="flex gap-3 p-3 rounded-xl my-2"
            style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.25)" }}>
            <span className="shrink-0 text-sm">⚠️</span>
            <p className="text-sm leading-relaxed" style={{ color: "#f5a623" }}>{line.replace("⚠️", "").trim()}</p>
          </div>
        );

        // Passos numerados (1. 2. 3.)
        if (/^\d+\./.test(line.trim())) {
          const num = line.match(/^(\d+)\./)?.[1];
          const text = line.replace(/^\d+\./, "").trim();
          return (
            <div key={i} className="flex gap-3 py-1.5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: "#f5a623", color: "#000" }}>{num}</span>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--soma-muted)" }}>{text}</p>
            </div>
          );
        }

        // Bullets (•)
        if (line.trim().startsWith("•")) return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="text-xs mt-1 shrink-0" style={{ color: "#f5a623" }}>•</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>{line.replace(/^•/, "").trim()}</p>
          </div>
        );

        // Checklist ✅ ou ❌
        if (line.trim().startsWith("✅") || line.trim().startsWith("❌")) return (
          <div key={i} className="flex gap-2 py-0.5">
            <span className="shrink-0 text-sm">{line.trim().startsWith("✅") ? "✅" : "❌"}</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>
              {line.replace(/^✅|^❌/, "").trim()}
            </p>
          </div>
        );

        // Emojis de seção (📌 💡 📋 📅)
        if (/^[📌💡📋📅🔴🟡🟢🟠🟣📊]/.test(line.trim())) return (
          <p key={i} className="text-sm leading-relaxed py-0.5" style={{ color: "var(--soma-text)" }}>{line}</p>
        );

        // Texto normal
        return <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>{line}</p>;
      })}
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function TrilhaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { modules, progress, hasCert, loading, completeLesson, totalLessons, doneLessons, pct } = useTrilha(id ?? "");

  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [certDone, setCertDone] = useState(false);
  const [certLoading, setCertLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"conteudo" | "notas" | "comentarios">("conteudo");

  const streak = useStreak(user?.id ?? "");

  // Carrega trilha
  useEffect(() => {
    if (!id) return;
    supabase.from("trilhas").select("*").eq("id", id).single().then(({ data }) => setTrilha(data));
  }, [id]);

  // Define primeira aula automaticamente
  useEffect(() => {
    if (modules.length > 0 && !activeLessonId) {
      const firstLesson = modules[0]?.lessons?.[0];
      if (firstLesson) setActiveLessonId(firstLesson.id);
    }
  }, [modules]);

  // Encontra aula ativa
  const activeLesson = modules.flatMap(m => m.lessons).find((l: any) => l.id === activeLessonId);
  const activeModule = modules.find(m => m.lessons.some((l: any) => l.id === activeLessonId));

  // Aula anterior / próxima
  const allLessons = modules.flatMap(m => m.lessons as any[]);
  const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  async function handleComplete() {
    if (!activeLessonId) return;
    await completeLesson(activeLessonId);
    // Avança para próxima aula automaticamente
    if (nextLesson) {
      setTimeout(() => setActiveLessonId(nextLesson.id), 400);
    }
  }

  async function handleCertificate() {
    if (!profile || !id || hasCert || pct < 100) return;
    setCertLoading(true);
    await supabase.from("certificates").insert({ user_id: profile.id, trilha_id: id, issued_at: new Date().toISOString() });
    setCertDone(true);
    setCertLoading(false);
  }

  if (loading || !trilha) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-pulse text-sm" style={{ color: "#f5a623" }}>Carregando trilha...</span>
    </div>
  );

  const lvColor = levelColor[trilha.level] ?? "#f5a623";
  const isDone = activeLessonId ? !!progress[activeLessonId] : false;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative" style={{ backgroundColor: "var(--soma-bg)" }}>

      {/* ── SIDEBAR DE MÓDULOS ─────────────────────────────────────────── */}
      {/* Overlay mobile */}
      {showSidebar && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setShowSidebar(false)} />
      )}

      <aside className={`
        fixed lg:relative z-40 lg:z-auto top-0 left-0 h-full
        flex flex-col shrink-0 transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `} style={{ width: 272, backgroundColor: "var(--soma-card)", borderRight: "1px solid var(--soma-border)" }}>

        {/* Header sidebar */}
        <div className="p-4 shrink-0" style={{ borderBottom: "1px solid var(--soma-border)" }}>
          <button onClick={() => navigate("/trilhas")}
            className="flex items-center gap-1.5 text-xs mb-4 hover:opacity-70 transition-opacity"
            style={{ color: "var(--soma-muted)" }}>
            <ChevronLeft size={14} /> Todas as trilhas
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: `${lvColor}20`, color: lvColor, border: `1px solid ${lvColor}40` }}>
              {levelLabel[trilha.level]}
            </span>
            {streak > 0 && (
              <span className="flex items-center gap-1 text-xs" style={{ color: "#f5a623" }}>
                <Flame size={12} /> {streak}d
              </span>
            )}
          </div>
          <p className="font-bold text-sm leading-snug mb-3" style={{ color: "var(--soma-text)" }}>{trilha.title}</p>
          {/* Progress */}
          <div className="space-y-1">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#22c55e" : "#f5a623" }} />
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--soma-muted)" }}>
              <span>{doneLessons} de {totalLessons} aulas</span>
              <span style={{ color: pct === 100 ? "#22c55e" : "#f5a623" }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Lista de módulos */}
        <div className="flex-1 overflow-y-auto py-2">
          {modules.map((mod, modIdx) => {
            const modDone = mod.lessons.filter((l: any) => progress[l.id]).length;
            const modTotal = mod.lessons.length;
            return (
              <div key={mod.id}>
                {/* Título módulo */}
                <div className="px-4 py-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>
                    {modIdx + 1}. {mod.title}
                  </p>
                  <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{modDone}/{modTotal}</span>
                </div>
                {/* Aulas */}
                {mod.lessons.map((lesson: any) => {
                  const isActive = lesson.id === activeLessonId;
                  const isDoneL = !!progress[lesson.id];
                  return (
                    <button key={lesson.id}
                      onClick={() => { setActiveLessonId(lesson.id); setShowSidebar(false); setActiveTab("conteudo"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:opacity-80"
                      style={{ backgroundColor: isActive ? "rgba(245,166,35,0.08)" : "transparent", borderRight: isActive ? `2px solid ${lvColor}` : "2px solid transparent" }}>
                      {/* Ícone status */}
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: isDoneL ? "#22c55e" : isActive ? lvColor : "var(--soma-bg)" }}>
                        {isDoneL
                          ? <CheckCircle2 size={11} color="#000" />
                          : isActive
                            ? <Play size={9} color="#000" style={{ marginLeft: 1 }} />
                            : <Play size={9} style={{ color: "var(--soma-muted)", marginLeft: 1 }} />
                        }
                      </span>
                      <span className="flex-1 min-w-0 text-xs leading-snug truncate"
                        style={{ color: isDoneL ? "var(--soma-muted)" : isActive ? lvColor : "var(--soma-text)", textDecoration: isDoneL ? "line-through" : "none" }}>
                        {lesson.title}
                      </span>
                      {lesson.duration_min > 0 && (
                        <span className="text-xs shrink-0" style={{ color: "var(--soma-muted)" }}>{lesson.duration_min}m</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Certificado */}
        {pct === 100 && (
          <div className="p-4 shrink-0" style={{ borderTop: "1px solid var(--soma-border)" }}>
            {hasCert || certDone ? (
              <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
                <Trophy size={14} /> Certificado emitido! 🎉
              </div>
            ) : (
              <button onClick={handleCertificate} disabled={certLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#f5a623", color: "#000" }}>
                <Trophy size={14} /> {certLoading ? "Gerando..." : "Emitir Certificado"}
              </button>
            )}
          </div>
        )}
      </aside>

      {/* ── ÁREA PRINCIPAL ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar mobile */}
        <div className="flex items-center gap-3 px-4 py-3 lg:hidden shrink-0"
          style={{ backgroundColor: "var(--soma-card)", borderBottom: "1px solid var(--soma-border)" }}>
          <button onClick={() => setShowSidebar(true)} style={{ color: "var(--soma-muted)" }}>
            <Menu size={20} />
          </button>
          <p className="flex-1 text-sm font-medium truncate" style={{ color: "var(--soma-text)" }}>{activeLesson?.title ?? trilha.title}</p>
        </div>

        {/* Área scrollável */}
        <div className="flex-1 overflow-y-auto">

          {/* ── PLAYER ───────────────────────────────────────────────── */}
          <div style={{ backgroundColor: "#0a0a0e" }}>
            {activeLesson?.video_url ? (
              <VideoPlayer url={activeLesson.video_url} />
            ) : (
              <div className="flex items-center justify-center" style={{ aspectRatio: "16/7" }}>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "transparent" }}>
                    <BookOpen size={28} style={{ color: "var(--soma-muted)" }} />
                  </div>
                  <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Aula em formato de leitura</p>
                </div>
              </div>
            )}

            {/* Navegação de aulas */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button onClick={() => prevLesson && setActiveLessonId(prevLesson.id)} disabled={!prevLesson}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg disabled:opacity-30 transition-all hover:opacity-70"
                style={{ color: "var(--soma-muted)", border: "1px solid var(--soma-border)" }}>
                <SkipBack size={12} /> Anterior
              </button>
              <div className="flex-1 text-center">
                <p className="text-xs font-medium truncate" style={{ color: "var(--soma-text)" }}>{activeLesson?.title}</p>
                <p className="text-xs" style={{ color: "var(--soma-muted)" }}>
                  {activeModule?.title} · {activeLesson?.duration_min ? `${activeLesson.duration_min} min` : ""}
                </p>
              </div>
              <button onClick={() => nextLesson && setActiveLessonId(nextLesson.id)} disabled={!nextLesson}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg disabled:opacity-30 transition-all hover:opacity-70"
                style={{ color: "var(--soma-muted)", border: "1px solid var(--soma-border)" }}>
                Próxima <SkipForward size={12} />
              </button>
            </div>
          </div>

          {/* ── CONTEÚDO CLARO ───────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-8">

            {/* Header da aula */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${lvColor}15`, color: lvColor, border: `1px solid ${lvColor}30` }}>
                  {levelLabel[trilha.level]}
                </span>
                <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{activeModule?.title}</span>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--soma-text)" }}>{activeLesson?.title}</h1>
              {activeLesson?.description && (
                <p className="text-base" style={{ color: "var(--soma-muted)" }}>{activeLesson.description}</p>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                {activeLesson?.duration_min > 0 && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: "var(--soma-muted)" }}>
                    <Clock size={14} /> {activeLesson.duration_min} min
                  </span>
                )}
                {isDone && (
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: "#22c55e" }}>
                    <CheckCircle2 size={14} /> Concluída
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: "var(--soma-border)" }}>
              {[
                { id: "conteudo", label: "Conteúdo", icon: BookOpen },
                { id: "notas", label: "Anotações", icon: PenLine },
                { id: "comentarios", label: "Comentários", icon: MessageCircle },
              ].map(({ id: tabId, label, icon: Icon }) => (
                <button key={tabId} onClick={() => setActiveTab(tabId as any)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all"
                  style={{
                    borderBottomColor: activeTab === tabId ? "#f5a623" : "transparent",
                    color: activeTab === tabId ? "#f5a623" : "var(--soma-muted)",
                  }}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            {/* Conteúdo da aba */}
            <div>
              {activeTab === "conteudo" && activeLesson?.content && (
                <LessonContent content={activeLesson.content} />
              )}
              {activeTab === "notas" && activeLessonId && (
                <Notes lessonId={activeLessonId} />
              )}
              {activeTab === "comentarios" && activeLessonId && (
                <Comments lessonId={activeLessonId} />
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--soma-border)" }}>
              {!isDone ? (
                <button onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "#f5a623", color: "#000" }}>
                  <CheckCircle2 size={16} /> Marcar como concluída
                </button>
              ) : (
                <div className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>
                  <CheckCircle2 size={16} /> Aula concluída ✨
                </div>
              )}
              <button onClick={() => setShowAI(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#d8b4fe" }}>
                <Bot size={16} /> Perguntar para IA
              </button>
              {nextLesson && (
                <button onClick={() => setActiveLessonId(nextLesson.id)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all hover:opacity-80 ml-auto"
                  style={{ border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
                  Próxima aula <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── IA MODAL ───────────────────────────────────────────────────── */}
      {showAI && activeLesson && (
        <AIModal
          lessonTitle={activeLesson.title}
          lessonContent={activeLesson.content ?? ""}
          trilhaTitle={trilha.title}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}