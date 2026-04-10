import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, X, Check, Pencil, Trash2, ChevronDown } from "lucide-react";

interface GuideVideo {
  id: string;
  tab_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string | null;
  order_num: number;
}

interface GuideFaq {
  id: string;
  guide_key: string;
  question: string;
  answer: string;
  order_num: number;
  active: boolean;
}

interface GuideTab {
  id: string;
  guide_id: string;
  key: string;
  title: string;
}

interface Guide {
  id: string;
  title: string;
  sector_key: string;
}

const STATIC_GUIDES = [
  { key: "cs",       label: "CS / Atendimento",    tabs: ["fluxo", "ferramentas", "scripts", "checklist", "faq"] },
  { key: "fiscal",   label: "Fiscal",               tabs: ["rotina", "obrigacoes", "calendario", "checklist", "faq"] },
  { key: "dp",       label: "Departamento Pessoal", tabs: ["rotina", "processos", "calendario", "checklist", "faq"] },
  { key: "omie",     label: "OMIE",                 tabs: ["pagar", "receber", "conciliacao", "faq"] },
  { key: "contabil", label: "Contábil",             tabs: ["rotina", "checklist", "faq"] },
  { key: "societario", label: "Societário",         tabs: ["rotina", "checklist", "faq"] },
  { key: "financeiro", label: "Financeiro",         tabs: ["rotina", "checklist", "faq"] },
  { key: "rh",       label: "RH",                   tabs: ["rotina", "checklist", "faq"] },
  { key: "comercial", label: "Comercial",           tabs: ["rotina", "checklist", "faq"] },
  { key: "marketing", label: "Marketing",           tabs: ["rotina", "checklist", "faq"] },
];

const TAB_LABELS: Record<string, string> = {
  fluxo: "Fluxo", ferramentas: "Ferramentas", scripts: "Scripts",
  checklist: "Checklist", faq: "FAQ", rotina: "Rotina Diária",
  obrigacoes: "Obrigações", calendario: "Calendário", processos: "Processos",
  pagar: "Contas a Pagar", receber: "Contas a Receber", conciliacao: "Conciliação",
};

export default function AdminGuides() {
  const [activeGuide, setActiveGuide] = useState("cs");
  const [activeTab, setActiveTab]     = useState<"videos" | "faq">("videos");
  const [videos, setVideos]           = useState<GuideVideo[]>([]);
  const [faqs, setFaqs]               = useState<GuideFaq[]>([]);
  const [loading, setLoading]         = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");

  // Estados vídeo
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editVideoId, setEditVideoId]     = useState<string | null>(null);
  const [videoForm, setVideoForm]         = useState({ tab_key: "fluxo", title: "", description: "", video_url: "", duration: "" });

  // Estados FAQ
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editFaqId, setEditFaqId]     = useState<string | null>(null);
  const [faqForm, setFaqForm]         = useState({ question: "", answer: "" });

  const guide = STATIC_GUIDES.find(g => g.key === activeGuide)!;

  async function loadVideos() {
    // Busca tabs vinculadas ao guia ativo
    const { data: tabs } = await supabase
      .from("guide_tabs")
      .select("id, key, guide_id, guides(sector_key)")
      .filter("guides.sector_key", "eq", activeGuide);

    const tabIds = (tabs ?? []).map((t: any) => t.id);

    if (tabIds.length === 0) { setVideos([]); return; }

    const { data } = await supabase
      .from("guide_videos")
      .select("*")
      .in("tab_id", tabIds)
      .order("order_num");

    setVideos(data ?? []);
  }

  async function loadFaqs() {
    const { data } = await supabase
      .from("guide_faqs")
      .select("*")
      .eq("guide_key", activeGuide)
      .order("order_num");
    setFaqs(data ?? []);
  }

  useEffect(() => {
    loadVideos();
    loadFaqs();
  }, [activeGuide]);

  const inputStyle = {
    backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)"
  };

  // ─── VÍDEOS ───────────────────────────────────────────────────────────────
  async function handleSaveVideo() {
    if (!videoForm.title || !videoForm.video_url) { setError("Preencha título e URL do vídeo."); return; }
    setLoading(true); setError("");

    if (editVideoId) {
      await supabase.from("guide_videos").update({
        title: videoForm.title, description: videoForm.description || null,
        video_url: videoForm.video_url, duration: videoForm.duration || null,
      }).eq("id", editVideoId);
      setEditVideoId(null);
    } else {
      // Busca ou cria tab
      let { data: tabData } = await supabase
        .from("guide_tabs")
        .select("id")
        .eq("key", videoForm.tab_key)
        .single();

      if (!tabData) {
        // Busca guia
        let { data: guideData } = await supabase
          .from("guides")
          .select("id")
          .eq("sector_key", activeGuide)
          .single();

        if (!guideData) {
          const { data: newGuide } = await supabase
            .from("guides")
            .insert({ sector_key: activeGuide, title: guide.label, company_id: null })
            .select().single();
          guideData = newGuide;
        }

        const { data: newTab } = await supabase
          .from("guide_tabs")
          .insert({ guide_id: guideData!.id, key: videoForm.tab_key, title: TAB_LABELS[videoForm.tab_key] ?? videoForm.tab_key })
          .select().single();
        tabData = newTab;
      }

      await supabase.from("guide_videos").insert({
        tab_id: tabData!.id, title: videoForm.title,
        description: videoForm.description || null,
        video_url: videoForm.video_url, duration: videoForm.duration || null,
        order_num: videos.length,
      });
    }

    setVideoForm({ tab_key: "fluxo", title: "", description: "", video_url: "", duration: "" });
    setShowVideoForm(false);
    setSuccess("Vídeo salvo!");
    setTimeout(() => setSuccess(""), 3000);
    loadVideos(); setLoading(false);
  }

  async function handleDeleteVideo(id: string) {
    if (!confirm("Remover este vídeo?")) return;
    await supabase.from("guide_videos").delete().eq("id", id);
    loadVideos();
  }

  // ─── FAQ ──────────────────────────────────────────────────────────────────
  async function handleSaveFaq() {
    if (!faqForm.question || !faqForm.answer) { setError("Preencha pergunta e resposta."); return; }
    setLoading(true); setError("");

    if (editFaqId) {
      await supabase.from("guide_faqs").update({
        question: faqForm.question, answer: faqForm.answer,
      }).eq("id", editFaqId);
      setEditFaqId(null);
    } else {
      await supabase.from("guide_faqs").insert({
        guide_key: activeGuide, question: faqForm.question,
        answer: faqForm.answer, order_num: faqs.length,
      });
    }

    setFaqForm({ question: "", answer: "" });
    setShowFaqForm(false);
    setSuccess("FAQ salvo!");
    setTimeout(() => setSuccess(""), 3000);
    loadFaqs(); setLoading(false);
  }

  async function handleDeleteFaq(id: string) {
    if (!confirm("Remover esta pergunta?")) return;
    await supabase.from("guide_faqs").delete().eq("id", id);
    loadFaqs();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>📖 Guias</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--soma-muted)" }}>Gerencie vídeos e FAQ dos guias</p>
      </div>

      {/* Seletor de guia */}
      <div className="flex gap-2 flex-wrap">
        {STATIC_GUIDES.map(g => (
          <button key={g.key} onClick={() => { setActiveGuide(g.key); setShowVideoForm(false); setShowFaqForm(false); }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: activeGuide === g.key ? "#f5a623" : "var(--soma-card)",
              color: activeGuide === g.key ? "#000" : "var(--soma-muted)",
              border: `1px solid ${activeGuide === g.key ? "#f5a623" : "var(--soma-border)"}`,
            }}>
            {g.label}
          </button>
        ))}
      </div>

      {/* Tabs Vídeos / FAQ */}
      <div className="flex gap-1 border-b" style={{ borderColor: "var(--soma-border)" }}>
        {(["videos", "faq"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px"
            style={{
              borderColor: activeTab === t ? "#f5a623" : "transparent",
              color: activeTab === t ? "#f5a623" : "var(--soma-muted)",
            }}>
            {t === "videos" ? "🎬 Vídeos" : "❓ FAQ"}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {success && <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>✅ {success}</div>}
      {error   && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#f87171" }}>⚠️ {error}</div>}

      {/* ─── VÍDEOS ─── */}
      {activeTab === "videos" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{videos.length} vídeos cadastrados</p>
            <button onClick={() => { setShowVideoForm(true); setEditVideoId(null); setVideoForm({ tab_key: "fluxo", title: "", description: "", video_url: "", duration: "" }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Plus size={16} /> Novo vídeo
            </button>
          </div>

          {showVideoForm && (
            <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "#f5a623" }}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>{editVideoId ? "Editar vídeo" : "Novo vídeo"}</h2>
                <button onClick={() => { setShowVideoForm(false); setEditVideoId(null); }} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Aba do guia</label>
                  <select value={videoForm.tab_key} onChange={e => setVideoForm(f => ({ ...f, tab_key: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                    {guide.tabs.map(t => <option key={t} value={t}>{TAB_LABELS[t] ?? t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Duração (ex: 8 min)</label>
                  <input type="text" placeholder="Ex: 8 min" value={videoForm.duration}
                    onChange={e => setVideoForm(f => ({ ...f, duration: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#f5a623")}
                    onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Título</label>
                  <input type="text" placeholder="Ex: Fluxo de Atendimento na Prática" value={videoForm.title}
                    onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#f5a623")}
                    onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>URL do YouTube</label>
                  <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={videoForm.video_url}
                    onChange={e => setVideoForm(f => ({ ...f, video_url: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#f5a623")}
                    onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Descrição (opcional)</label>
                  <textarea placeholder="Descreva o conteúdo do vídeo..." value={videoForm.description}
                    onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))} rows={2}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#f5a623")}
                    onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveVideo} disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#f5a623", color: "#000" }}>
                  <Check size={16} /> {loading ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => { setShowVideoForm(false); setEditVideoId(null); }}
                  className="px-5 py-2.5 rounded-lg text-sm" style={{ ...inputStyle, color: "var(--soma-muted)" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de vídeos */}
          <div className="space-y-3">
            {videos.length === 0 && (
              <div className="text-center py-10 text-sm" style={{ color: "var(--soma-muted)" }}>
                Nenhum vídeo cadastrado para este guia ainda.
              </div>
            )}
            {videos.map(v => (
              <div key={v.id} className="rounded-xl border p-4 flex items-start gap-4"
                style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: "var(--soma-bg)" }}>
                  {v.video_url && (
                    <img
                      src={`https://img.youtube.com/vi/${v.video_url.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/)?.[1]}/hqdefault.jpg`}
                      alt="" className="w-full h-full object-cover"
                      onError={e => (e.target as HTMLImageElement).style.display = "none"}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{v.title}</span>
                    {v.duration && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>{v.duration}</span>}
                  </div>
                  {v.description && <p className="text-xs mt-1 truncate" style={{ color: "var(--soma-muted)" }}>{v.description}</p>}
                  {v.video_url && <p className="text-xs mt-1 truncate" style={{ color: "var(--soma-muted)" }}>{v.video_url}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => {
                    setEditVideoId(v.id);
                    setVideoForm({ tab_key: "fluxo", title: v.title, description: v.description ?? "", video_url: v.video_url ?? "", duration: v.duration ?? "" });
                    setShowVideoForm(true);
                  }} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                    <Pencil size={12} /> Editar
                  </button>
                  <button onClick={() => handleDeleteVideo(v.id)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── FAQ ─── */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{faqs.length} perguntas cadastradas</p>
            <button onClick={() => { setShowFaqForm(true); setEditFaqId(null); setFaqForm({ question: "", answer: "" }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Plus size={16} /> Nova pergunta
            </button>
          </div>

          {showFaqForm && (
            <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "#f5a623" }}>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>{editFaqId ? "Editar pergunta" : "Nova pergunta"}</h2>
                <button onClick={() => { setShowFaqForm(false); setEditFaqId(null); }} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Pergunta</label>
                  <input type="text" placeholder="Ex: O que fazer quando o cliente não responde?" value={faqForm.question}
                    onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#f5a623")}
                    onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Resposta</label>
                  <textarea placeholder="Digite a resposta completa..." value={faqForm.answer}
                    onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} rows={4}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none resize-none" style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = "#f5a623")}
                    onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSaveFaq} disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#f5a623", color: "#000" }}>
                  <Check size={16} /> {loading ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => { setShowFaqForm(false); setEditFaqId(null); }}
                  className="px-5 py-2.5 rounded-lg text-sm" style={{ ...inputStyle, color: "var(--soma-muted)" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {faqs.length === 0 && (
              <div className="text-center py-10 text-sm" style={{ color: "var(--soma-muted)" }}>
                Nenhuma pergunta cadastrada para este guia ainda.
              </div>
            )}
            {faqs.map(f => (
              <div key={f.id} className="rounded-xl border p-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>❓ {f.question}</p>
                    <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--soma-muted)" }}>{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => { setEditFaqId(f.id); setFaqForm({ question: f.question, answer: f.answer }); setShowFaqForm(true); }}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => handleDeleteFaq(f.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}