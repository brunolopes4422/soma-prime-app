// src/components/ui/AcademyAIFloat.tsx
// Chama Gemini direto do frontend — sem Edge Function
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useLocation } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function getPageContext(pathname: string): string {
  if (pathname.includes("/guias/cs"))       return "Guia de CS / Atendimento ao Cliente";
  if (pathname.includes("/guias/fiscal"))   return "Guia Fiscal";
  if (pathname.includes("/guias/dp"))       return "Guia de Departamento Pessoal";
  if (pathname.includes("/guias/contabil")) return "Guia Contábil";
  if (pathname.includes("/guias/omie"))     return "Guia OMIE / Financeiro";
  if (pathname.includes("/trilhas"))        return "Trilhas de Carreira — Soma Prime Academy";
  return "Portal Operacional da Soma Prime";
}

const SUGGESTIONS: Record<string, string[]> = {
  "/guias/cs":      ["Qual o SLA de primeira resposta?", "Como classifico uma reclamação?", "Quando escalar para o gestor?"],
  "/guias/fiscal":  ["Qual a diferença entre DAS e DARF?", "Quando vence o DAS?", "O que é ECD?"],
  "/guias/dp":      ["Como funciona o eSocial?", "O que é FGTS?", "Como calcular férias?"],
  "/trilhas":       ["Como funciona a progressão?", "Como emito um certificado?", "Quais trilhas existem?"],
  default:          ["Como emito um DAS?", "O que é SLA?", "Como abrir um ticket no GClick?"],
};

// Chave do Groq — coloca no .env como VITE_GROQ_API_KEY
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";

export default function AcademyAIFloat() {
  const { profile } = useAuth();
  const location = useLocation();
  const [open, setOpen]           = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [pulse, setPulse]         = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const pageContext = getPageContext(location.pathname);
  const suggestions = SUGGESTIONS[location.pathname] ?? SUGGESTIONS.default;

  useEffect(() => { const t = setTimeout(() => setPulse(false), 6000); return () => clearTimeout(t); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { setMessages([]); }, [location.pathname]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "Você é a Tutora da Soma Prime Academy — especialista em contabilidade com domínio completo de rotinas fiscais, departamento pessoal, contabilidade societária e customer success para empresas de pequeno, médio e grande porte.\n\nSeu papel é capacitar os colaboradores da Soma Prime com conhecimento técnico sólido e postura profissional de excelência.\n\nPERSONALIDADE:\n- Educada e acolhedora no tom, mas firme e rigorosa no conteúdo\n- Não normaliza erros, atrasos ou procedimentos incorretos\n- Quando o assunto envolve multas, prazos críticos, penalidades ou riscos ao cliente, seja DIRETA e SÉRIA: deixe claro que esses erros têm consequências reais para o cliente e para o escritório\n- O cliente contratou a Soma Prime para ECONOMIZAR e estar SEGURO — qualquer erro que gere multa ou penalidade é uma falha grave que precisa ser evitada a todo custo\n- Nunca use frases como 'isso acontece', 'é normal', 'não se preocupe' para situações de erro ou atraso — seja construtiva mas deixe claro o peso da responsabilidade\n\nREGRAS QUE NUNCA QUEBRA:\n1. Responda SEMPRE em português brasileiro\n2. Seja didática e use exemplos reais do dia a dia contábil\n3. Máximo 3 parágrafos por resposta\n4. Use emojis com moderação\n5. SEMPRE oriente a consultar os manuais oficiais do governo (Receita Federal, e-CAC, Portal do Simples Nacional, eSocial) quando a dúvida envolver legislação\n6. NUNCA passe informação como definitiva sem recomendar confirmação com o chefe do setor ou superior direto\n7. SEMPRE finalize com: ⚠️ Consulte os manuais oficiais e confirme com o responsável do setor antes de aplicar qualquer procedimento!\n\nLembre-se: você é uma tutora rigorosa porque se importa — erro contábil não é detalhe, é prejuízo real para o cliente." + pageContext + ". Colaborador: " + (profile?.full_name ?? "Colaborador") },
              ...newMessages.map((m: any) => ({ role: m.role, content: m.content }))
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      const data = await res.json();
      let reply = data.choices?.[0]?.message?.content ?? "";
      if (!reply) reply = "Não consegui responder agora. Tente novamente!";
      if (!reply.includes("gestor")) reply += "\n\n⚠️ Confirme com seu gestor antes de aplicar!";

      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error("IA error:", e);
      setMessages(m => [...m, { role: "assistant", content: "Ops! Não consegui responder agora. Tente novamente. 😅" }]);
    }
    setLoading(false);
  }

  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {!open && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {pulse && (
            <div className="rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-lg max-w-52 text-right relative"
              style={{ backgroundColor: "var(--soma-card)", border: "1px solid rgba(168,85,247,0.4)", color: "#d8b4fe" }}>
              💜 Dúvidas? Me chama que a gente acha a solução!
              <div className="absolute bottom-[-6px] right-5 w-3 h-3 rotate-45"
                style={{ backgroundColor: "var(--soma-card)", borderRight: "1px solid rgba(168,85,247,0.4)", borderBottom: "1px solid rgba(168,85,247,0.4)" }} />
            </div>
          )}
          <button onClick={() => { setOpen(true); setPulse(false); }}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 relative"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 8px 25px rgba(168,85,247,0.5)" }}>
            <Bot size={26} className="text-white" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 animate-pulse"
              style={{ backgroundColor: "#22c55e", borderColor: "var(--soma-bg)" }} />
          </button>
        </div>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden w-80 sm:w-96"
          style={{
            backgroundColor: "var(--soma-card)",
            border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
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
                className="w-6 h-6 rounded flex items-center justify-center" style={{ color: "var(--soma-muted)" }}>
                {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <button onClick={e => { e.stopPropagation(); setOpen(false); setMessages([]); }}
                className="w-6 h-6 rounded flex items-center justify-center" style={{ color: "var(--soma-muted)" }}>
                <X size={12} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                        <Bot size={13} className="text-white" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs leading-relaxed max-w-[85%]"
                        style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>
                        Olá{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}! 👋
                        Estou aqui para ajudar com <strong style={{ color: "#d8b4fe" }}>{pageContext}</strong>.
                        <br /><br />
                        <span style={{ color: "#f5a623", fontWeight: 600 }}>⚠️</span> Sempre confirme com seu gestor antes de aplicar!
                      </div>
                    </div>
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

                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    {m.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                        <Bot size={11} className="text-white" />
                      </div>
                    )}
                    <div className="text-xs leading-relaxed rounded-2xl px-3 py-2.5 max-w-[82%] whitespace-pre-wrap"
                      style={m.role === "user"
                        ? { backgroundColor: "#7c3aed", color: "#fff", borderBottomRightRadius: 4 }
                        : { backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)", borderBottomLeftRadius: 4 }}>
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
                      <Bot size={11} className="text-white" />
                    </div>
                    <div className="rounded-2xl px-3 py-2.5 flex gap-1"
                      style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                          style={{ backgroundColor: "#a855f7", animationDelay: `${i*150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="px-3 py-1.5 shrink-0 flex items-center gap-1.5"
                style={{ backgroundColor: "rgba(245,166,35,0.05)", borderTop: "1px solid rgba(245,166,35,0.15)" }}>
                <Sparkles size={10} style={{ color: "#f5a623" }} />
                <p className="text-xs" style={{ color: "rgba(245,166,35,0.7)" }}>
                  Confirme sempre com seu gestor antes de aplicar!
                </p>
              </div>

              <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--soma-border)" }}>
                <div className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder="Digite sua dúvida..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none"
                    style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
                  <button onClick={() => send()} disabled={loading || !input.trim()}
                    className="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40"
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