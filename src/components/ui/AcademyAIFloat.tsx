// src/components/ui/AcademyAIFloat.tsx
// ─── IA TUTORA FLUTUANTE — disponível em todas as páginas ────────────────────

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Contexto automático baseado na página atual
function getPageContext(pathname: string): string {
  if (pathname.includes("/guias/cs"))      return "Guia de CS / Atendimento ao Cliente";
  if (pathname.includes("/guias/fiscal"))  return "Guia Fiscal";
  if (pathname.includes("/guias/dp"))      return "Guia de Departamento Pessoal";
  if (pathname.includes("/guias/contabil")) return "Guia Contábil";
  if (pathname.includes("/guias/omie"))    return "Guia OMIE / Financeiro";
  if (pathname.includes("/trilhas"))       return "Trilhas de Carreira da Soma Prime Academy";
  if (pathname.includes("/dashboard"))     return "Dashboard de Gestão";
  if (pathname.includes("/perfil"))        return "Perfil do Colaborador";
  return "Portal Operacional da Soma Prime";
}

const SUGGESTIONS: Record<string, string[]> = {
  "/guias/cs": [
    "Qual o SLA de primeira resposta?",
    "Como classifico uma reclamação?",
    "Quando devo escalar para o gestor?",
  ],
  "/guias/fiscal": [
    "Qual a diferença entre DAS e DARF?",
    "Quando vence o DAS do Simples?",
    "O que é ECD?",
  ],
  "/guias/dp": [
    "Como funciona o eSocial?",
    "O que é FGTS?",
    "Como calcular férias?",
  ],
  "/trilhas": [
    "Como funciona a progressão de carreira?",
    "Como emito um certificado?",
    "Quais trilhas estão disponíveis?",
  ],
  default: [
    "Como funciona o fluxo de atendimento?",
    "O que é DAS e como emitir?",
    "Como abrir um ticket no GClick?",
  ],
};

export default function AcademyAIFloat() {
  const { profile } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const pageContext = getPageContext(location.pathname);
  const suggestions = SUGGESTIONS[location.pathname] ?? SUGGESTIONS.default;

  // Para o pulse depois de 5 segundos
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // Scroll para última mensagem
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reseta conversa quando muda de página
  useEffect(() => {
    setMessages([]);
  }, [location.pathname]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("academy-ai", {
        body: {
          messages: newMessages,
          lessonTitle: pageContext,
          lessonContent: "",
          trilhaTitle: "Portal Operacional Soma Prime",
          isFloating: true,
          userName: profile?.full_name ?? "Colaborador",
        },
      });

      if (error) throw error;
      setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(m => [...m, {
        role: "assistant",
        content: "Ops! Não consegui responder agora. Tente novamente em instantes. 😅",
      }]);
    }
    setLoading(false);
  }

  // Não aparece em páginas do admin
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Botão flutuante */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {/* Balãozinho de chamada */}
          <div className={`rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-lg max-w-52 text-right transition-all duration-500 ${pulse ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
            style={{ backgroundColor: "var(--soma-card)", border: "1px solid rgba(168,85,247,0.4)", color: "#d8b4fe", boxShadow: "0 4px 20px rgba(168,85,247,0.2)" }}>
            💜 Dúvidas? Me chama que a gente acha a solução!
            <div className="absolute bottom-[-6px] right-5 w-3 h-3 rotate-45"
              style={{ backgroundColor: "var(--soma-card)", borderRight: "1px solid rgba(168,85,247,0.4)", borderBottom: "1px solid rgba(168,85,247,0.4)" }} />
          </div>

          {/* Botão principal */}
          <button onClick={() => { setOpen(true); setPulse(false); }}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 relative"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 8px 25px rgba(168,85,247,0.5)" }}>
            <Bot size={26} className="text-white" />
            {/* Indicador online */}
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 animate-pulse"
              style={{ backgroundColor: "#22c55e", borderColor: "var(--soma-bg)" }} />
          </button>
        </div>
      )}

      {/* Chat aberto */}
      {open && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${minimized ? "h-14 w-72" : "w-80 sm:w-96"}`}
          style={{
            backgroundColor: "var(--soma-card)",
            border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(168,85,247,0.1)",
            height: minimized ? 56 : "min(520px, 80vh)",
          }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 shrink-0 cursor-pointer"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))", borderBottom: "1px solid rgba(168,85,247,0.2)" }}
            onClick={() => setMinimized(!minimized)}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
              <Bot size={16} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border animate-pulse"
                style={{ backgroundColor: "#22c55e", borderColor: "var(--soma-card)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs" style={{ color: "#d8b4fe" }}>IA Tutora — Soma Prime</p>
              {!minimized && <p className="text-xs truncate" style={{ color: "var(--soma-muted)" }}>📍 {pageContext}</p>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={e => { e.stopPropagation(); setMinimized(!minimized); }}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ color: "var(--soma-muted)" }}>
                {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <button onClick={e => { e.stopPropagation(); setOpen(false); setMessages([]); }}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{ color: "var(--soma-muted)" }}>
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Corpo — oculto quando minimizado */}
          {!minimized && (
            <>
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {/* Boas-vindas */}
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs leading-relaxed max-w-[85%]"
                        style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>
                        Olá{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! 👋 Sou a tutora da Soma Prime Academy.
                        Estou aqui para tirar suas dúvidas sobre <strong style={{ color: "#d8b4fe" }}>{pageContext}</strong>.
                        <br /><br />
                        <span style={{ color: "#f5a623", fontWeight: 600 }}>⚠️ Importante:</span> Sempre confirme as informações que eu passar com seu gestor antes de aplicar!
                      </div>
                    </div>

                    {/* Sugestões */}
                    <div className="space-y-1.5 pl-9">
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

                {/* Histórico */}
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                        <Bot size={11} className="text-white" />
                      </div>
                    )}
                    <div className={`text-xs leading-relaxed rounded-2xl px-3 py-2.5 max-w-[82%] ${m.role === "user" ? "rounded-br-sm" : "rounded-tl-sm"}`}
                      style={m.role === "user"
                        ? { backgroundColor: "#7c3aed", color: "#fff" }
                        : { backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>
                      {m.content}
                    </div>
                  </div>
                ))}

                {/* Digitando */}
                {loading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                      <Bot size={11} className="text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm px-3 py-2.5 flex gap-1"
                      style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ backgroundColor: "#a855f7", animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Aviso gestor */}
              <div className="px-3 py-1.5 shrink-0 flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(245,166,35,0.05)", borderTop: "1px solid rgba(245,166,35,0.15)" }}>
                <Sparkles size={10} style={{ color: "#f5a623", shrink: 0 }} />
                <p className="text-xs" style={{ color: "rgba(245,166,35,0.7)" }}>
                  Confirme sempre com seu gestor antes de aplicar!
                </p>
              </div>

              {/* Input */}
              <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--soma-border)" }}>
                <div className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Digite sua dúvida..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none"
                    style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
                  <button onClick={() => send()} disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                    <Send size={13} className="text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}