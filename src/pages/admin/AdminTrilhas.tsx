import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Plus, Trash2, ChevronDown, ChevronUp, Save, X,
  BookOpen, Video, FileText, HelpCircle,
  GripVertical, Check, AlertTriangle, Pencil
} from "lucide-react";

// ─── TIPOS ────────────────────────────────────────────────────────────────────
interface QuizOption { id: string; text: string; correct: boolean; }
interface Quiz { question: string; options: QuizOption[]; }
interface Lesson {
  id?: string; title: string; description: string;
  content: string; video_url: string; duration_min: number;
  order_num: number; quiz?: Quiz | null;
}
interface Module {
  id?: string; title: string; description: string;
  order_num: number; lessons: Lesson[];
}
interface TrilhaForm {
  id?: string; title: string; description: string;
  sector: string; level: number; company: string; order_num: number;
  modules: Module[];
}

const SECTORS = [
  { key: "cs", label: "Customer Success" },
  { key: "fiscal", label: "Fiscal" },
  { key: "dp", label: "Departamento Pessoal" },
  { key: "contabil", label: "Contábil" },
  { key: "omie", label: "OMIE / Financeiro" },
  { key: "informatica", label: "Informática" },
  { key: "societario", label: "Societário" },
  { key: "rh", label: "RH" },
];
const LEVELS = [
  { v: 1, l: "Júnior" }, { v: 2, l: "Pleno" },
  { v: 3, l: "Sênior" }, { v: 4, l: "Gestor" },
];
const COMPANIES = [
  { key: "soma_prime", label: "Soma Prime" },
  { key: "ph_consult", label: "PH Consult Pro" },
];

function emptyLesson(order: number): Lesson {
  return { title: "", description: "", content: "", video_url: "", duration_min: 10, order_num: order, quiz: null };
}
function emptyModule(order: number): Module {
  return { title: "", description: "", order_num: order, lessons: [emptyLesson(1)] };
}
function emptyTrilha(): TrilhaForm {
  return { title: "", description: "", sector: "cs", level: 1, company: "soma_prime", order_num: 1, modules: [emptyModule(1)] };
}
function emptyQuiz(): Quiz {
  return { question: "", options: [
    { id: "a", text: "", correct: true },
    { id: "b", text: "", correct: false },
    { id: "c", text: "", correct: false },
  ]};
}

const inputStyle = {
  backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)",
  color: "var(--soma-text)", borderRadius: 8, padding: "8px 12px",
  fontSize: 13, width: "100%", outline: "none",
};
const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--soma-muted)", display: "block", marginBottom: 4 };

// ─── EDITOR DE QUIZ ───────────────────────────────────────────────────────────
function QuizEditor({ quiz, onChange, onRemove }: {
  quiz: Quiz; onChange: (q: Quiz) => void; onRemove: () => void;
}) {
  return (
    <div className="rounded-xl p-4 space-y-3"
      style={{ backgroundColor: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#a855f7" }}>
          <HelpCircle size={12} className="inline mr-1" /> Quiz da aula
        </p>
        <button onClick={onRemove} className="text-xs" style={{ color: "#f87171" }}>Remover quiz</button>
      </div>
      <div>
        <label style={labelStyle}>Pergunta *</label>
        <input style={inputStyle} value={quiz.question} placeholder="Digite a pergunta..."
          onChange={e => onChange({ ...quiz, question: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label style={labelStyle}>Alternativas (marque a correta)</label>
        {quiz.options.map((opt, i) => (
          <div key={opt.id} className="flex items-center gap-2">
            <button onClick={() => onChange({ ...quiz, options: quiz.options.map((o, j) => ({ ...o, correct: j === i })) })}
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: opt.correct ? "#22c55e" : "var(--soma-border)", backgroundColor: opt.correct ? "#22c55e" : "transparent" }}>
              {opt.correct && <Check size={10} color="#000" />}
            </button>
            <input style={{ ...inputStyle, flex: 1 }} value={opt.text} placeholder={`Opção ${opt.id.toUpperCase()}`}
              onChange={e => onChange({ ...quiz, options: quiz.options.map((o, j) => j === i ? { ...o, text: e.target.value } : o) })} />
            {quiz.options.length > 2 && (
              <button onClick={() => onChange({ ...quiz, options: quiz.options.filter((_, j) => j !== i) })}
                style={{ color: "var(--soma-muted)" }}><X size={14} /></button>
            )}
          </div>
        ))}
        {quiz.options.length < 5 && (
          <button onClick={() => onChange({ ...quiz, options: [...quiz.options, { id: String.fromCharCode(97 + quiz.options.length), text: "", correct: false }] })}
            className="text-xs flex items-center gap-1 mt-1" style={{ color: "#a855f7" }}>
            <Plus size={12} /> Adicionar opção
          </button>
        )}
      </div>
    </div>
  );
}

// ─── EDITOR DE AULA ───────────────────────────────────────────────────────────
function LessonEditor({ lesson, onChange, onRemove, canRemove }: {
  lesson: Lesson; onChange: (l: Lesson) => void; onRemove: () => void; canRemove: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"content" | "video" | "quiz">("content");

  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
      {/* Header da aula */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical size={14} style={{ color: "var(--soma-muted)" }} />
        <button onClick={() => setOpen(v => !v)} className="flex-1 flex items-center gap-2 text-left">
          <BookOpen size={14} style={{ color: "#f5a623" }} />
          <span className="text-sm font-medium flex-1 min-w-0 truncate"
            style={{ color: lesson.title ? "var(--soma-text)" : "var(--soma-muted)" }}>
            {lesson.title || "Nova aula — clique para editar"}
          </span>
          {lesson.video_url && <Video size={12} style={{ color: "#60a5fa" }} />}
          {lesson.quiz && <HelpCircle size={12} style={{ color: "#a855f7" }} />}
          {open ? <ChevronUp size={14} style={{ color: "var(--soma-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--soma-muted)" }} />}
        </button>
        {canRemove && (
          <button onClick={onRemove} className="shrink-0 w-6 h-6 flex items-center justify-center rounded hover:opacity-70"
            style={{ color: "#f87171" }}><Trash2 size={13} /></button>
        )}
      </div>

      {/* Conteúdo expansível */}
      {open && (
        <div className="border-t px-4 py-4 space-y-4" style={{ borderColor: "var(--soma-border)" }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label style={labelStyle}>Título da aula *</label>
              <input style={inputStyle} value={lesson.title} placeholder="Ex: Como emitir um DAS"
                onChange={e => onChange({ ...lesson, title: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label style={labelStyle}>Descrição curta</label>
              <input style={inputStyle} value={lesson.description} placeholder="Uma linha sobre o que o colaborador vai aprender"
                onChange={e => onChange({ ...lesson, description: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Duração (min)</label>
              <input style={inputStyle} type="number" min={1} max={120} value={lesson.duration_min}
                onChange={e => onChange({ ...lesson, duration_min: parseInt(e.target.value) || 10 })} />
            </div>
            <div>
              <label style={labelStyle}>URL do vídeo (YouTube)</label>
              <input style={inputStyle} value={lesson.video_url} placeholder="https://youtube.com/watch?v=..."
                onChange={e => onChange({ ...lesson, video_url: e.target.value })} />
            </div>
          </div>

          {/* Tabs de conteúdo */}
          <div>
            <div className="flex gap-0 border-b mb-3" style={{ borderColor: "var(--soma-border)" }}>
              {[
                { id: "content", label: "Conteúdo", icon: FileText },
                { id: "quiz",    label: "Quiz",     icon: HelpCircle },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id as any)}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-all"
                  style={{ borderBottomColor: tab === id ? "#f5a623" : "transparent", color: tab === id ? "#f5a623" : "var(--soma-muted)" }}>
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>

            {tab === "content" && (
              <div>
                <label style={labelStyle}>Material de leitura</label>
                <p className="text-xs mb-2" style={{ color: "var(--soma-muted)" }}>
                  Use • para bullets, 1. para passos numerados, ⚠️ para alertas, ━ para títulos de seção
                </p>
                <textarea
                  style={{ ...inputStyle, minHeight: 200, resize: "vertical", fontFamily: "monospace", lineHeight: 1.6 }}
                  value={lesson.content} placeholder={`━━━ Como emitir o DAS ━━━\n\n1. Acesse o portal do Simples Nacional\n2. Informe o CNPJ da empresa\n3. Selecione a competência\n\n⚠️ Atenção: nunca emita sem verificar antes no e-CAC\n\n• Link oficial: https://www8.receita.fazenda.gov.br/SimplesNacional/`}
                  onChange={e => onChange({ ...lesson, content: e.target.value })} />
              </div>
            )}

            {tab === "quiz" && (
              <div>
                {lesson.quiz ? (
                  <QuizEditor quiz={lesson.quiz} onChange={q => onChange({ ...lesson, quiz: q })} onRemove={() => onChange({ ...lesson, quiz: null })} />
                ) : (
                  <button onClick={() => onChange({ ...lesson, quiz: emptyQuiz() })}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm w-full justify-center transition-all hover:opacity-80"
                    style={{ backgroundColor: "rgba(168,85,247,0.08)", border: "1px dashed rgba(168,85,247,0.3)", color: "#a855f7" }}>
                    <Plus size={15} /> Adicionar quiz a esta aula
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EDITOR DE MÓDULO ─────────────────────────────────────────────────────────
function ModuleEditor({ mod, onChange, onRemove, canRemove }: {
  mod: Module; onChange: (m: Module) => void; onRemove: () => void; canRemove: boolean;
}) {
  const [open, setOpen] = useState(true);

  function addLesson() {
    onChange({ ...mod, lessons: [...mod.lessons, emptyLesson(mod.lessons.length + 1)] });
  }
  function updateLesson(i: number, l: Lesson) {
    const lessons = mod.lessons.map((x, j) => j === i ? l : x);
    onChange({ ...mod, lessons });
  }
  function removeLesson(i: number) {
    onChange({ ...mod, lessons: mod.lessons.filter((_, j) => j !== i) });
  }

  return (
    <div className="rounded-2xl border overflow-hidden"
      style={{ backgroundColor: "var(--soma-bg)", borderColor: "var(--soma-border)" }}>
      {/* Header módulo */}
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ backgroundColor: "var(--soma-card)", borderBottom: open ? `1px solid var(--soma-border)` : "none" }}>
        <GripVertical size={16} style={{ color: "var(--soma-muted)" }} />
        <button onClick={() => setOpen(v => !v)} className="flex-1 flex items-center gap-3 text-left">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
            {mod.order_num}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate"
              style={{ color: mod.title ? "var(--soma-text)" : "var(--soma-muted)" }}>
              {mod.title || "Novo módulo"}
            </p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{mod.lessons.length} aulas</p>
          </div>
          {open ? <ChevronUp size={16} style={{ color: "var(--soma-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--soma-muted)" }} />}
        </button>
        {canRemove && (
          <button onClick={onRemove} className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-70"
            style={{ color: "#f87171" }}><Trash2 size={15} /></button>
        )}
      </div>

      {open && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label style={labelStyle}>Nome do módulo *</label>
              <input style={inputStyle} value={mod.title} placeholder="Ex: Fundamentos do CS"
                onChange={e => onChange({ ...mod, title: e.target.value })} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label style={labelStyle}>Descrição</label>
              <input style={inputStyle} value={mod.description} placeholder="O que o colaborador aprende neste módulo"
                onChange={e => onChange({ ...mod, description: e.target.value })} />
            </div>
          </div>

          {/* Aulas */}
          <div className="space-y-2">
            {mod.lessons.map((lesson, i) => (
              <LessonEditor key={i} lesson={lesson}
                onChange={l => updateLesson(i, l)}
                onRemove={() => removeLesson(i)}
                canRemove={mod.lessons.length > 1} />
            ))}
          </div>

          <button onClick={addLesson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm w-full justify-center transition-all hover:opacity-80"
            style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px dashed rgba(245,166,35,0.3)", color: "#f5a623" }}>
            <Plus size={15} /> Adicionar aula
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FORMULÁRIO DE TRILHA ─────────────────────────────────────────────────────
function TrilhaForm({ initial, onSave, onCancel }: {
  initial: TrilhaForm; onSave: (t: TrilhaForm) => Promise<void>; onCancel: () => void;
}) {
  const [form, setForm] = useState<TrilhaForm>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function addModule() {
    setForm(f => ({ ...f, modules: [...f.modules, emptyModule(f.modules.length + 1)] }));
  }
  function updateModule(i: number, m: Module) {
    setForm(f => ({ ...f, modules: f.modules.map((x, j) => j === i ? m : x) }));
  }
  function removeModule(i: number) {
    setForm(f => ({ ...f, modules: f.modules.filter((_, j) => j !== i) }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Preencha o título da trilha."); return; }
    if (form.modules.some(m => !m.title.trim())) { setError("Todos os módulos precisam ter título."); return; }
    if (form.modules.some(m => m.lessons.some(l => !l.title.trim()))) { setError("Todas as aulas precisam ter título."); return; }
    setError(""); setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Header do form */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--soma-text)" }}>
            {initial.id ? "Editar Trilha" : "Nova Trilha"}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>
            Preencha os dados, módulos e aulas. Salve ao final.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90"
            style={{ backgroundColor: "#f5a623", color: "#000" }}>
            <Save size={15} /> {saving ? "Salvando..." : "Salvar trilha"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}>
          <AlertTriangle size={15} /> {error}
        </div>
      )}

      {/* Dados da trilha */}
      <div className="rounded-2xl border p-5 space-y-4"
        style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#f5a623" }}>Informações da trilha</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label style={labelStyle}>Título *</label>
            <input style={inputStyle} value={form.title} placeholder="Ex: CS Júnior — Fundamentos do Atendimento"
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label style={labelStyle}>Descrição</label>
            <input style={inputStyle} value={form.description} placeholder="Descreva o que o colaborador vai aprender nesta trilha"
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Setor</label>
            <select style={inputStyle} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
              {SECTORS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nível</label>
            <select style={inputStyle} value={form.level} onChange={e => setForm(f => ({ ...f, level: parseInt(e.target.value) }))}>
              {LEVELS.map(l => <option key={l.v} value={l.v}>{l.l}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Empresa</label>
            <select style={inputStyle} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}>
              {COMPANIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ordem de exibição</label>
            <input style={inputStyle} type="number" min={1} value={form.order_num}
              onChange={e => setForm(f => ({ ...f, order_num: parseInt(e.target.value) || 1 }))} />
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>
          Módulos ({form.modules.length})
        </p>
        {form.modules.map((mod, i) => (
          <ModuleEditor key={i} mod={{ ...mod, order_num: i + 1 }}
            onChange={m => updateModule(i, m)}
            onRemove={() => removeModule(i)}
            canRemove={form.modules.length > 1} />
        ))}
        <button onClick={addModule}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm w-full justify-center transition-all hover:opacity-80"
          style={{ backgroundColor: "var(--soma-card)", border: "2px dashed var(--soma-border)", color: "var(--soma-muted)" }}>
          <Plus size={16} /> Adicionar módulo
        </button>
      </div>

      {/* Salvar final */}
      <div className="flex justify-end gap-3 pt-4" style={{ borderTop: "1px solid var(--soma-border)" }}>
        <button onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-sm transition-all hover:opacity-80"
          style={{ border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
          Cancelar
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          <Save size={15} /> {saving ? "Salvando..." : "Salvar trilha completa"}
        </button>
      </div>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function AdminTrilhas() {
  const [trilhas, setTrilhas]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [view, setView]         = useState<"list" | "form">("list");
  const [editing, setEditing]   = useState<TrilhaForm | null>(null);
  const [success, setSuccess]   = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function loadTrilhas() {
    const { data } = await supabase.from("trilhas").select("*").order("sector").order("order_num");
    setTrilhas(data ?? []);
    setLoading(false);
  }

  useEffect(() => { loadTrilhas(); }, []);

  async function handleSave(form: TrilhaForm) {
    if (form.id) {
      // Editar trilha existente
      await supabase.from("trilhas").update({
        title: form.title, description: form.description,
        sector: form.sector, level: form.level,
        company: form.company, order_num: form.order_num,
      }).eq("id", form.id);

      // Deletar módulos/aulas antigos e recriar
      const { data: oldMods } = await supabase.from("modules").select("id").eq("trilha_id", form.id);
      if (oldMods?.length) {
        await supabase.from("lessons").delete().in("module_id", oldMods.map(m => m.id));
        await supabase.from("modules").delete().eq("trilha_id", form.id);
      }

      await saveModulesAndLessons(form.id, form.modules);
    } else {
      // Criar nova trilha
      const { data: trilha } = await supabase.from("trilhas").insert({
        title: form.title, description: form.description,
        sector: form.sector, level: form.level,
        company: form.company, order_num: form.order_num,
      }).select().single();

      if (trilha) await saveModulesAndLessons(trilha.id, form.modules);
    }

    setSuccess(form.id ? "Trilha atualizada!" : "Trilha criada com sucesso!");
    setTimeout(() => setSuccess(""), 3000);
    setView("list"); setEditing(null);
    loadTrilhas();
  }

  async function saveModulesAndLessons(trilhaId: string, modules: Module[]) {
    for (const mod of modules) {
      const { data: savedMod } = await supabase.from("modules").insert({
        trilha_id: trilhaId, title: mod.title,
        description: mod.description, order_num: mod.order_num,
      }).select().single();

      if (savedMod) {
        for (const lesson of mod.lessons) {
          await supabase.from("lessons").insert({
            module_id: savedMod.id, title: lesson.title,
            description: lesson.description, content: lesson.content,
            video_url: lesson.video_url || null,
            duration_min: lesson.duration_min,
            order_num: lesson.order_num,
          });
        }
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deletar esta trilha e todo o conteúdo? Esta ação não pode ser desfeita.")) return;
    setDeleting(id);
    const { data: mods } = await supabase.from("modules").select("id").eq("trilha_id", id);
    if (mods?.length) {
      await supabase.from("lessons").delete().in("module_id", mods.map(m => m.id));
      await supabase.from("modules").delete().eq("trilha_id", id);
    }
    await supabase.from("trilhas").delete().eq("id", id);
    setDeleting(null);
    loadTrilhas();
  }

  async function handleEdit(trilha: any) {
    // Carrega módulos e aulas da trilha
    const { data: mods } = await supabase.from("modules").select("*, lessons(*)")
      .eq("trilha_id", trilha.id).order("order_num");

    const modules: Module[] = (mods ?? []).map((m: any) => ({
      id: m.id, title: m.title, description: m.description, order_num: m.order_num,
      lessons: (m.lessons ?? []).sort((a: any, b: any) => a.order_num - b.order_num).map((l: any) => ({
        id: l.id, title: l.title, description: l.description,
        content: l.content ?? "", video_url: l.video_url ?? "",
        duration_min: l.duration_min ?? 10, order_num: l.order_num, quiz: null,
      })),
    }));

    setEditing({ ...trilha, modules: modules.length ? modules : [emptyModule(1)] });
    setView("form");
  }

  const levelLabel: Record<number, string> = { 1: "Júnior", 2: "Pleno", 3: "Sênior", 4: "Gestor" };
  const levelColor: Record<number, string> = { 1: "#22c55e", 2: "#60a5fa", 3: "#a855f7", 4: "#f5a623" };
  const grouped = trilhas.reduce((acc, t) => { if (!acc[t.sector]) acc[t.sector] = []; acc[t.sector].push(t); return acc; }, {} as Record<string, any[]>);
  const sectorLabel: Record<string, string> = { cs: "Customer Success", fiscal: "Fiscal", dp: "Dep. Pessoal", contabil: "Contábil", omie: "OMIE", informatica: "Informática", societario: "Societário", rh: "RH" };

  if (view === "form") {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <TrilhaForm
          initial={editing ?? emptyTrilha()}
          onSave={handleSave}
          onCancel={() => { setView("list"); setEditing(null); }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>🎓 Trilhas de Carreira</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--soma-muted)" }}>
            {trilhas.length} trilhas cadastradas
          </p>
        </div>
        <button onClick={() => { setEditing(null); setView("form"); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          <Plus size={16} /> Nova trilha
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>
          <Check size={15} /> {success}
        </div>
      )}

      {loading ? (
        <p className="text-sm animate-pulse" style={{ color: "var(--soma-muted)" }}>Carregando...</p>
      ) : (
        Object.entries(grouped).map(([sector, items]) => (
          <div key={sector}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--soma-muted)" }}>
              {sectorLabel[sector] ?? sector}
            </p>
            <div className="space-y-2">
              {(items as any[]).map(t => (
                <div key={t.id} className="rounded-2xl border p-4 flex items-center gap-4"
                  style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ backgroundColor: `${levelColor[t.level]}15`, color: levelColor[t.level], border: `1px solid ${levelColor[t.level]}30` }}>
                        {levelLabel[t.level]}
                      </span>
                      <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{t.company}</span>
                    </div>
                    <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{t.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--soma-muted)" }}>{t.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleEdit(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                      style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80 disabled:opacity-40"
                      style={{ backgroundColor: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                      <Trash2 size={12} /> {deleting === t.id ? "..." : "Deletar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {trilhas.length === 0 && !loading && (
        <div className="text-center py-16 rounded-2xl border" style={{ borderColor: "var(--soma-border)" }}>
          <BookOpen size={36} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium" style={{ color: "var(--soma-text)" }}>Nenhuma trilha cadastrada ainda</p>
          <p className="text-xs mt-1 mb-4" style={{ color: "var(--soma-muted)" }}>Clique em "Nova trilha" para começar</p>
          <button onClick={() => setView("form")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#f5a623", color: "#000" }}>
            Criar primeira trilha
          </button>
        </div>
      )}
    </div>
  );
}