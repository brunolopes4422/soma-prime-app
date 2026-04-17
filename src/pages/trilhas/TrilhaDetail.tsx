import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useTrilha } from "../../hooks/useTrilha";
import {
  ChevronLeft, ChevronDown, CheckCircle2, Play, Trophy,
  Clock, BookOpen, MessageCircle, PenLine, Send, Bot,
  X, Search, Flame, Star
} from "lucide-react";

// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface Trilha { id: string; title: string; description: string; sector: string; level: number; }
interface Comment { id: string; content: string; created_at: string; profiles: { full_name: string } | null; }
interface GlossaryTerm { id: string; term: string; definition: string; }
interface Badge { key: string; title: string; description: string; icon: string; earned: boolean; }

const levelLabel: Record<number, string> = { 1: "Júnior", 2: "Pleno", 3: "Sênior", 4: "Gestor" };
const levelColors: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "rgba(22,163,74,0.15)",  text: "#4ade80", border: "rgba(22,163,74,0.3)" },
  2: { bg: "rgba(96,165,250,0.15)", text: "#93c5fd", border: "rgba(96,165,250,0.3)" },
  3: { bg: "rgba(168,85,247,0.15)", text: "#d8b4fe", border: "rgba(168,85,247,0.3)" },
  4: { bg: "rgba(245,166,35,0.15)", text: "#f5a623", border: "rgba(245,166,35,0.3)" },
};

// ─── STREAK ───────────────────────────────────────────────────────────────────
function StreakBadge({ userId }: { userId: string }) {
  const [streak, setStreak] = useState(0);
  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase.from("study_streaks").select("*").eq("user_id", userId).single();
      if (!data) {
        await supabase.from("study_streaks").insert({ user_id: userId, current: 1, longest: 1, last_date: today });
        setStreak(1); return;
      }
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      if (data.last_date === today) { setStreak(data.current); return; }
      const newCurrent = data.last_date === yStr ? data.current + 1 : 1;
      const newLongest = Math.max(newCurrent, data.longest);
      await supabase.from("study_streaks").update({ current: newCurrent, longest: newLongest, last_date: today }).eq("user_id", userId);
      setStreak(newCurrent);
    }
    load();
  }, [userId]);
  if (!streak) return null;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
      style={{ backgroundColor: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623" }}>
      <Flame size={13} /> {streak} {streak === 1 ? "dia" : "dias"} seguidos
    </div>
  );
}

// ─── IA TUTORA ────────────────────────────────────────────────────────────────
function AcademyAI({ lessonTitle, lessonContent, trilhaTitle }: { lessonTitle: string; lessonContent: string; trilhaTitle: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Pode me dar um exemplo prático?",
    "Qual o erro mais comum nessa situação?",
    "Como isso funciona no dia a dia?",
  ];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user" as const, content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "Você é a Tutora da Soma Prime Academy — especialista em contabilidade com domínio completo de rotinas fiscais, departamento pessoal, contabilidade societária e customer success para empresas de pequeno, médio e grande porte.\n\nSeu papel é ajudar os colaboradores da Soma Prime a entender conceitos, procedimentos e boas práticas contábeis de forma clara e didática.\n\nRegras que você NUNCA quebra:\n1. Responda SEMPRE em português brasileiro\n2. Seja direta, prática e didática — use exemplos reais do dia a dia contábil\n3. Máximo 3 parágrafos por resposta\n4. Use emojis com moderação\n5. SEMPRE oriente a consultar os manuais oficiais do governo (Receita Federal, e-CAC, Portal do Simples Nacional, eSocial) quando a dúvida envolver legislação\n6. NUNCA passe informação como definitiva sem recomendar que o colaborador confirme com o chefe do setor ou superior direto\n7. SEMPRE finalize com: ⚠️ Consulte os manuais oficiais e confirme com o responsável do setor antes de aplicar qualquer procedimento!\n\nLembre-se: você é uma tutora poderosa, mas o conhecimento humano especializado de cada setor é insubstituível. Aula atual: \"" + lessonTitle + "\" da trilha \"" + trilhaTitle + "\". Conteúdo da aula: " + (lessonContent?.slice(0, 800) ?? "")
            },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "Não consegui responder agora. Tente novamente!";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Ops! Não consegui responder agora. Tente novamente em instantes." }]);
    }
    setLoading(false);
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-full justify-center transition-all"
        style={{ backgroundColor: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#d8b4fe" }}>
        <Bot size={15} /> Perguntar para IA Tutora
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            style={{ backgroundColor: "var(--soma-card)", border: "1px solid rgba(168,85,247,0.4)", maxHeight: "82vh" }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(168,85,247,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(168,85,247,0.2)" }}>
                  <Bot size={18} style={{ color: "#d8b4fe" }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>IA Tutora — Soma Prime Academy</p>
                  <p className="text-xs" style={{ color: "#d8b4fe" }}>Especialista em CS contábil • Aula: {lessonTitle}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[240px]">
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "rgba(168,85,247,0.15)" }}>
                    <Bot size={28} style={{ color: "#d8b4fe" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>Olá! Sou sua tutora nesta aula 👋</p>
                    <p className="text-xs mt-1" style={{ color: "var(--soma-muted)" }}>Tire qualquer dúvida sobre <strong>"{lessonTitle}"</strong></p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {suggestions.map(s => (
                      <button key={s} onClick={() => send(s)}
                        className="text-xs px-3 py-2 rounded-xl text-left transition-all hover:opacity-80"
                        style={{ backgroundColor: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "#d8b4fe" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: "rgba(168,85,247,0.2)" }}>
                      <Bot size={13} style={{ color: "#d8b4fe" }} />
                    </div>
                  )}
                  <div className="max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                    style={m.role === "user"
                      ? { backgroundColor: "#f5a623", color: "#000", borderBottomRightRadius: 4 }
                      : { backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)", borderBottomLeftRadius: 4 }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(168,85,247,0.2)" }}>
                    <Bot size={13} style={{ color: "#d8b4fe" }} />
                  </div>
                  <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                    <span className="flex gap-1">
                      {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#d8b4fe", animationDelay: `${i*150}ms` }} />)}
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: "var(--soma-border)" }}>
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                  placeholder="Digite sua dúvida sobre a aula..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                  style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
                <button onClick={() => send()} disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
                  style={{ backgroundColor: "#f5a623", color: "#000" }}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── COMENTÁRIOS ──────────────────────────────────────────────────────────────
function LessonComments({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function loadComments() {
    const { data } = await supabase.from("lesson_comments").select("*, profiles(full_name)").eq("lesson_id", lessonId).order("created_at");
    setComments(data ?? []);
  }

  useEffect(() => { if (open) loadComments(); }, [open]);

  async function submit() {
    if (!text.trim() || !user || loading) return;
    setLoading(true);
    await supabase.from("lesson_comments").insert({ lesson_id: lessonId, user_id: user.id, content: text.trim() });
    setText("");
    await loadComments();
    setLoading(false);
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-full justify-center transition-all"
        style={{ backgroundColor: open ? "rgba(245,166,35,0.1)" : "var(--soma-bg)", border: `1px solid ${open ? "rgba(245,166,35,0.3)" : "var(--soma-border)"}`, color: open ? "#f5a623" : "var(--soma-muted)" }}>
        <MessageCircle size={15} /> Comentários {comments.length > 0 && `(${comments.length})`}
      </button>

      {open && (
        <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: "var(--soma-border)" }}>
          {comments.length === 0 && (
            <p className="text-xs text-center py-3" style={{ color: "var(--soma-muted)" }}>Seja o primeiro a comentar! Compartilhe sua experiência com o time 💬</p>
          )}
          {comments.map(c => (
            <div key={c.id} className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
                {c.profiles?.full_name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold" style={{ color: "#f5a623" }}>{c.profiles?.full_name ?? "Colega"}</p>
                  <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{new Date(c.created_at).toLocaleDateString("pt-BR")}</p>
                </div>
                <p className="text-sm" style={{ color: "var(--soma-text)" }}>{c.content}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()}
              placeholder="Compartilhe sua experiência ou dúvida com o time..."
              className="flex-1 px-3 py-2 rounded-xl text-sm focus:outline-none"
              style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
            <button onClick={submit} disabled={loading || !text.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ANOTAÇÕES ────────────────────────────────────────────────────────────────
function LessonNotes({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    supabase.from("lesson_notes").select("content").eq("lesson_id", lessonId).eq("user_id", user.id).single()
      .then(({ data }) => { if (data) setNote(data.content); });
  }, [lessonId, user, open]);

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
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-full justify-center transition-all"
        style={{ backgroundColor: open ? "rgba(96,165,250,0.1)" : "var(--soma-bg)", border: `1px solid ${open ? "rgba(96,165,250,0.3)" : "var(--soma-border)"}`, color: open ? "#93c5fd" : "var(--soma-muted)" }}>
        <PenLine size={15} /> Minhas anotações
      </button>
      {open && (
        <div className="mt-3 space-y-2 border-t pt-3" style={{ borderColor: "var(--soma-border)" }}>
          <textarea value={note} onChange={e => handleChange(e.target.value)} rows={4}
            placeholder="Anote os pontos mais importantes para revisar depois..."
            className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
            style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
          <p className="text-xs" style={{ color: saved ? "#4ade80" : "var(--soma-muted)" }}>
            {saved ? "✅ Salvo automaticamente" : "Digitando..."}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── GLOSSÁRIO ────────────────────────────────────────────────────────────────
function Glossary({ sector }: { sector: string }) {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase.from("glossary").select("*").eq("sector", sector).order("term").then(({ data }) => setTerms(data ?? []));
  }, [sector, open]);

  const filtered = terms.filter(t => t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-full justify-center transition-all"
        style={{ backgroundColor: open ? "rgba(22,163,74,0.1)" : "var(--soma-bg)", border: `1px solid ${open ? "rgba(22,163,74,0.3)" : "var(--soma-border)"}`, color: open ? "#4ade80" : "var(--soma-muted)" }}>
        <BookOpen size={15} /> Glossário do CS
      </button>
      {open && (
        <div className="mt-3 space-y-3 border-t pt-3" style={{ borderColor: "var(--soma-border)" }}>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--soma-muted)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar termo (DAS, SLA, CND...)"
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none"
              style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {filtered.map(t => (
              <div key={t.id} className="rounded-xl p-3" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                <p className="font-bold text-xs mb-1" style={{ color: "#f5a623" }}>{t.term}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--soma-muted)" }}>{t.definition}</p>
              </div>
            ))}
            {filtered.length === 0 && <p className="text-xs text-center py-2" style={{ color: "var(--soma-muted)" }}>Nenhum termo encontrado.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BADGES ───────────────────────────────────────────────────────────────────
function BadgesPanel({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    async function load() {
      const { data: all } = await supabase.from("badges").select("*").order("key");
      const { data: earned } = await supabase.from("user_badges").select("badge_key").eq("user_id", userId);
      const earnedSet = new Set((earned ?? []).map(e => e.badge_key));
      setBadges((all ?? []).map(b => ({ ...b, earned: earnedSet.has(b.key) })));
    }
    load();
  }, [userId, open]);

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-full justify-center transition-all"
        style={{ backgroundColor: open ? "rgba(245,166,35,0.1)" : "var(--soma-bg)", border: `1px solid ${open ? "rgba(245,166,35,0.3)" : "var(--soma-border)"}`, color: open ? "#f5a623" : "var(--soma-muted)" }}>
        <Trophy size={15} /> Conquistas {earned.length > 0 && `(${earned.length})`}
      </button>
      {open && (
        <div className="mt-3 space-y-4 border-t pt-3" style={{ borderColor: "var(--soma-border)" }}>
          {earned.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "#f5a623" }}>✅ Conquistados ({earned.length})</p>
              <div className="grid grid-cols-2 gap-2">
                {earned.map(b => (
                  <div key={b.key} className="rounded-xl p-3 flex items-start gap-2"
                    style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}>
                    <span className="text-xl shrink-0">{b.icon}</span>
                    <div><p className="font-bold text-xs" style={{ color: "#f5a623" }}>{b.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{b.description}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {locked.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--soma-muted)" }}>🔒 Por conquistar ({locked.length})</p>
              <div className="grid grid-cols-2 gap-2">
                {locked.map(b => (
                  <div key={b.key} className="rounded-xl p-3 flex items-start gap-2 opacity-40"
                    style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                    <span className="text-xl shrink-0">{b.icon}</span>
                    <div><p className="font-bold text-xs" style={{ color: "var(--soma-text)" }}>{b.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{b.description}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function TrilhaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { modules, progress, hasCert, loading, completeLesson, totalLessons, doneLessons, pct } = useTrilha(id ?? "");

  const [trilha, setTrilha]             = useState<Trilha | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [certDone, setCertDone]         = useState(false);
  const [certLoading, setCertLoading]   = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("trilhas").select("*").eq("id", id).single().then(({ data }) => setTrilha(data));
  }, [id]);

  useEffect(() => {
    if (modules.length > 0 && !activeModule) setActiveModule(modules[0].id);
  }, [modules]);

  async function awardBadge(key: string) {
    if (!user) return;
    await supabase.from("user_badges").upsert({ user_id: user.id, badge_key: key }, { onConflict: "user_id,badge_key" });
  }

  async function handleCompleteLesson(lessonId: string) {
    await completeLesson(lessonId);
    await awardBadge("first_lesson");
    // Verifica se completou um módulo inteiro
    const mod = modules.find(m => m.lessons.some((l: any) => l.id === lessonId));
    if (mod) {
      const allDone = mod.lessons.every((l: any) => l.id === lessonId || progress[l.id]);
      if (allDone) await awardBadge("first_module");
    }
  }

  async function handleCertificate() {
    if (!profile || !id || hasCert || pct < 100) return;
    setCertLoading(true);
    await supabase.from("certificates").insert({ user_id: profile.id, trilha_id: id, issued_at: new Date().toISOString() });
    await awardBadge("first_trilha");
    if (trilha?.level === 1) await awardBadge("junior_cs");
    if (trilha?.level === 2) await awardBadge("pleno_cs");
    if (trilha?.level === 3) await awardBadge("senior_cs");
    if (trilha?.level === 4) await awardBadge("gestor_cs");
    setCertDone(true);
    setCertLoading(false);
  }

  if (loading || !trilha) return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando trilha...</span>
    </div>
  );

  const colors = levelColors[trilha.level] ?? levelColors[1];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">

      {/* Topo */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate("/trilhas")}
          className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
          style={{ color: "var(--soma-muted)" }}>
          <ChevronLeft size={16} /> Voltar para Trilhas
        </button>
        {user && <StreakBadge userId={user.id} />}
      </div>

      {/* Header da trilha */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold border"
                style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}>
                {levelLabel[trilha.level]}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full uppercase font-medium"
                style={{ backgroundColor: "var(--soma-bg)", color: "var(--soma-muted)", border: "1px solid var(--soma-border)" }}>
                {trilha.sector}
              </span>
            </div>
            <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>{trilha.title}</h1>
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{trilha.description}</p>
          </div>
          <div className="flex gap-5 shrink-0">
            {[{ label: "aulas", val: totalLessons }, { label: "concluídas", val: doneLessons }, { label: "progresso", val: `${pct}%` }].map(({ label, val }) => (
              <div key={label} className="text-center">
                <p className="font-bold text-2xl" style={{ color: "#f5a623" }}>{val}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="space-y-1.5">
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#22c55e" : "#f5a623" }} />
          </div>
          <div className="flex justify-between text-xs" style={{ color: "var(--soma-muted)" }}>
            <span>{doneLessons} de {totalLessons} aulas concluídas</span>
            <span style={{ color: pct === 100 ? "#22c55e" : "#f5a623", fontWeight: 600 }}>{pct}%</span>
          </div>
        </div>

        {/* Certificado */}
        {pct === 100 && !hasCert && !certDone && (
          <button onClick={handleCertificate} disabled={certLoading}
            className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
            style={{ backgroundColor: "#f5a623", color: "#000" }}>
            <Trophy size={18} /> {certLoading ? "Gerando certificado..." : "🎉 Emitir Certificado de Conclusão"}
          </button>
        )}
        {(hasCert || certDone) && (
          <div className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>
            <Trophy size={18} /> 🏆 Certificado emitido! Parabéns pela conquista!
          </div>
        )}
      </div>

      {/* Módulos */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--soma-muted)" }}>
          Conteúdo da trilha — {modules.length} módulos
        </h2>

        {modules.length === 0 && (
          <div className="rounded-2xl border p-10 text-center" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <Star size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Conteúdo em preparação. Em breve!</p>
          </div>
        )}

        {modules.map((mod, modIdx) => {
          const modDone  = mod.lessons.filter((l: any) => progress[l.id]).length;
          const modTotal = mod.lessons.length;
          const modPct   = modTotal > 0 ? Math.round((modDone / modTotal) * 100) : 0;
          const isOpen   = activeModule === mod.id;

          return (
            <div key={mod.id} className="rounded-2xl border overflow-hidden transition-all"
              style={{ backgroundColor: "var(--soma-card)", borderColor: isOpen ? "#f5a623" : "var(--soma-border)" }}>

              {/* Header módulo */}
              <button className="w-full flex items-center gap-4 px-5 py-4 text-left"
                onClick={() => setActiveModule(isOpen ? null : mod.id)}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: modPct === 100 ? "#22c55e" : isOpen ? "#f5a623" : "var(--soma-bg)", color: (modPct === 100 || isOpen) ? "#000" : "var(--soma-muted)" }}>
                  {modPct === 100 ? <CheckCircle2 size={16} /> : modIdx + 1}
                </span>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{mod.title}</p>
                    <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{mod.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${modPct}%`, backgroundColor: modPct === 100 ? "#22c55e" : "#f5a623" }} />
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "var(--soma-muted)" }}>{modDone}/{modTotal} aulas</span>
                  </div>
                </div>
                <ChevronDown size={16} className={`transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} style={{ color: "var(--soma-muted)" }} />
              </button>

              {/* Lista de aulas */}
              {isOpen && (
                <div className="border-t" style={{ borderColor: "rgba(245,166,35,0.15)" }}>
                  {mod.lessons.map((lesson: any, lessonIdx: number) => {
                    const isDone       = !!progress[lesson.id];
                    const isLessonOpen = activeLesson === lesson.id;

                    return (
                      <div key={lesson.id} className="border-b last:border-0" style={{ borderColor: "var(--soma-border)" }}>
                        {/* Header aula */}
                        <button className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
                          style={{ backgroundColor: isLessonOpen ? "rgba(245,166,35,0.03)" : "transparent" }}
                          onClick={() => setActiveLesson(isLessonOpen ? null : lesson.id)}>
                          <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: isDone ? "#22c55e" : "var(--soma-bg)", border: `1px solid ${isDone ? "#22c55e" : "var(--soma-border)"}` }}>
                            {isDone ? <CheckCircle2 size={12} color="#000" /> : <Play size={9} style={{ color: "var(--soma-muted)", marginLeft: 1 }} />}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium"
                              style={{ color: isDone ? "var(--soma-muted)" : "var(--soma-text)", textDecoration: isDone ? "line-through" : "none" }}>
                              {lessonIdx + 1}. {lesson.title}
                            </p>
                            {lesson.description && !isLessonOpen && (
                              <p className="text-xs truncate mt-0.5" style={{ color: "var(--soma-muted)" }}>{lesson.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {lesson.duration_min > 0 && (
                              <span className="flex items-center gap-1 text-xs" style={{ color: "var(--soma-muted)" }}>
                                <Clock size={11} /> {lesson.duration_min}min
                              </span>
                            )}
                            <ChevronDown size={14} className={`transition-transform ${isLessonOpen ? "rotate-180" : ""}`} style={{ color: "var(--soma-muted)" }} />
                          </div>
                        </button>

                        {/* Conteúdo da aula */}
                        {isLessonOpen && (
                          <div className="px-5 pb-6 pt-4 space-y-5 border-t" style={{ borderColor: "rgba(245,166,35,0.1)" }}>

                            {/* Vídeo */}
                            {lesson.video_url && (() => {
                              const ytId = lesson.video_url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                              const embed = ytId ? `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1` : lesson.video_url;
                              return (
                                <div className="rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: "16/9", backgroundColor: "#000" }}>
                                  <iframe src={embed} className="w-full h-full" allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                                </div>
                              );
                            })()}

                            {/* Material de leitura */}
                            {lesson.content && (
                              <div className="rounded-xl p-5" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                                <p className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: "#f5a623" }}>
                                  <BookOpen size={13} /> Material de leitura
                                </p>
                                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--soma-muted)" }}>
                                  {lesson.content}
                                </div>
                              </div>
                            )}

                            {/* Ferramentas interativas */}
                            <div className="grid grid-cols-2 gap-2">
                              <AcademyAI lessonTitle={lesson.title} lessonContent={lesson.content ?? ""} trilhaTitle={trilha.title} />
                              <LessonNotes lessonId={lesson.id} />
                              <LessonComments lessonId={lesson.id} />
                              <Glossary sector={trilha.sector} />
                            </div>

                            {/* Badges do usuário */}
                            {user && (
                              <BadgesPanel userId={user.id} />
                            )}

                            {/* Botão concluir */}
                            {!isDone ? (
                              <button onClick={() => handleCompleteLesson(lesson.id)}
                                className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                style={{ backgroundColor: "#f5a623", color: "#000" }}>
                                <CheckCircle2 size={16} /> Marcar aula como concluída
                              </button>
                            ) : (
                              <div className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                                style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>
                                <CheckCircle2 size={16} /> Aula concluída! ✨
                              </div>
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