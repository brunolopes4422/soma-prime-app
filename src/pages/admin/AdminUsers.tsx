import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import {
  X, Check, Pencil, Trash2, UserPlus, Mail,
  Eye, EyeOff, Search, RefreshCw, BookOpen,
  ChevronDown, ChevronUp, Lock, AlertTriangle, RotateCcw
} from "lucide-react";

interface UserProfile {
  id: string; full_name: string; company: string;
  role: string; sector: string | null; email: string;
}
interface Trilha { id: string; title: string; sector: string; level: number; }

const COMPANIES = [
  { key: "soma_prime", label: "Soma Prime" },
  { key: "ph_consult", label: "PH Consult Pro" },
];
const ROLES = [
  { key: "collaborator", label: "Colaborador" },
  { key: "manager",      label: "Gestor" },
  { key: "admin",        label: "Admin" },
];
const SECTORS = [
  { key: "cs",             label: "CS / Atendimento" },
  { key: "fiscal",         label: "Fiscal" },
  { key: "dp",             label: "Dep. Pessoal" },
  { key: "contabil",       label: "Contábil" },
  { key: "societario",     label: "Societário" },
  { key: "omie",           label: "OMIE / Financeiro" },
  { key: "informatica",    label: "Informática" },
  { key: "rh",             label: "RH" },
  { key: "tributario",     label: "Tributário" },
  { key: "administrativo", label: "Administrativo" },
  { key: "bpo",            label: "BPO / Financeiro" },
];
const LEVEL_LABEL: Record<number, string> = { 1:"Júnior", 2:"Pleno", 3:"Sênior", 4:"Gestor" };
const emptyForm = { full_name:"", email:"", password:"", newPassword:"", company:"soma_prime", role:"collaborator", sector:"cs" };

const inp: React.CSSProperties = {
  backgroundColor:"var(--soma-bg)", border:"1px solid var(--soma-border)",
  color:"var(--soma-text)", borderRadius:8, padding:"9px 12px",
  fontSize:13, width:"100%", outline:"none",
};
const lbl: React.CSSProperties = {
  display:"block", fontSize:11, fontWeight:600, color:"var(--soma-muted)", marginBottom:4,
};

function TrilhaSelector({ userId, company }: { userId: string; company: string }) {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [access, setAccess]   = useState<string[]>([]);
  const [open, setOpen]       = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [loadingT, setLoadingT] = useState(false);
  const sectorLabel: Record<string,string> = { cs:"CS", fiscal:"Fiscal", dp:"DP", contabil:"Contábil", omie:"OMIE", informatica:"Informática", societario:"Societário" };

  useEffect(() => {
    if (!open) return;
    setLoadingT(true);
    Promise.all([
      supabase.from("trilhas").select("id,title,sector,level").eq("company", company).order("sector").order("level"),
      supabase.from("user_trilha_access").select("trilha_id").eq("user_id", userId),
    ]).then(([{ data: t }, { data: a }]) => {
      setTrilhas(t ?? []); setAccess((a ?? []).map((x: any) => x.trilha_id)); setLoadingT(false);
    });
  }, [open, userId, company]);

  async function saveAccess() {
    setSaving(true);
    await supabase.from("user_trilha_access").delete().eq("user_id", userId);
    if (access.length > 0)
      await supabase.from("user_trilha_access").insert(access.map(trilha_id => ({ user_id: userId, trilha_id })));
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  const grouped = trilhas.reduce((acc, t) => {
    if (!acc[t.sector]) acc[t.sector] = []; acc[t.sector].push(t); return acc;
  }, {} as Record<string, Trilha[]>);

  return (
    <div>
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg mt-1 transition-all hover:opacity-80"
        style={{ backgroundColor:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ade80" }}>
        <BookOpen size={11} /> {access.length}/{trilhas.length} trilhas liberadas
        {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>
      {open && (
        <div className="mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor:"var(--soma-card)", borderColor:"var(--soma-border)" }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor:"var(--soma-border)", backgroundColor:"var(--soma-bg)" }}>
            <p className="text-xs font-semibold" style={{ color:"var(--soma-text)" }}>Acesso às trilhas</p>
            <div className="flex gap-3 text-xs">
              <button onClick={() => { setAccess(trilhas.map(t => t.id)); setSaved(false); }} style={{ color:"#f5a623" }}>Todas</button>
              <button onClick={() => { setAccess([]); setSaved(false); }} style={{ color:"var(--soma-muted)" }}>Nenhuma</button>
            </div>
          </div>
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
            {loadingT ? <p className="text-xs text-center py-4 animate-pulse" style={{ color:"var(--soma-muted)" }}>Carregando...</p>
              : Object.entries(grouped).map(([sector, items]) => (
                <div key={sector}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:"var(--soma-muted)" }}>
                    {sectorLabel[sector] ?? sector} · {items.filter(t => access.includes(t.id)).length}/{items.length}
                  </p>
                  <div className="space-y-1">
                    {items.map(t => (
                      <label key={t.id} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                        style={{ backgroundColor: access.includes(t.id) ? "rgba(245,166,35,0.06)" : "transparent", border:`1px solid ${access.includes(t.id) ? "rgba(245,166,35,0.2)" : "transparent"}` }}>
                        <input type="checkbox" checked={access.includes(t.id)}
                          onChange={() => { setAccess(p => p.includes(t.id) ? p.filter(x => x !== t.id) : [...p, t.id]); setSaved(false); }}
                          className="w-3.5 h-3.5 accent-yellow-500 shrink-0" />
                        <span className="text-xs flex-1" style={{ color:"var(--soma-text)" }}>{t.title}</span>
                        <span className="text-xs shrink-0 px-1.5 py-0.5 rounded" style={{ backgroundColor:"var(--soma-bg)", color:"var(--soma-muted)" }}>{LEVEL_LABEL[t.level]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor:"var(--soma-border)" }}>
            <p className="text-xs" style={{ color:"var(--soma-muted)" }}>💡 Admin e Gestores veem todas.</p>
            <button onClick={saveAccess} disabled={saving}
              className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg font-semibold disabled:opacity-50 shrink-0 ml-3"
              style={{ backgroundColor: saved ? "rgba(34,197,94,0.15)" : "#f5a623", color: saved ? "#22c55e" : "#000" }}>
              {saving ? <RefreshCw size={11} className="animate-spin" /> : <Check size={11} />}
              {saving ? "Salvando..." : saved ? "✅ Salvo!" : "Salvar acesso"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers]         = useState<UserProfile[]>([]);
  const [filtered, setFiltered]   = useState<UserProfile[]>([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState(emptyForm);
  const [showPass, setShowPass]   = useState(false);
  const [sendingReset, setSendingReset]           = useState<string | null>(null);
  const [expandedUser, setExpandedUser]           = useState<string | null>(null);
  const [resettingProgress, setResettingProgress] = useState<string | null>(null);

  async function loadUsers() {
    const { data } = await supabase.from("profiles").select("*").order("full_name");
    setUsers(data ?? []);
  }
  useEffect(() => { loadUsers(); }, []);
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(!q ? users : users.filter(u =>
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.sector?.toLowerCase().includes(q)
    ));
  }, [users, search]);

  function openNew() { setEditId(null); setForm(emptyForm); setError(""); setShowForm(true); }
  function openEdit(u: UserProfile) {
    setEditId(u.id);
    setForm({ full_name:u.full_name, email:u.email ?? "", password:"", company:u.company, role:u.role, sector:u.sector ?? "cs" });
    setError(""); setShowForm(true);
  }
  function closeForm() { setShowForm(false); setEditId(null); setForm(emptyForm); setShowPass(false); }
  function flash(msg: string, err = false) {
    if (err) { setError(msg); setTimeout(() => setError(""), 5000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); }
  }

  async function handleSave() {
    setError("");
    if (!form.full_name.trim()) return flash("Preencha o nome.", true);
    setLoading(true);

    if (!editId) {      if (!form.email.trim()) { setLoading(false); return flash("Preencha o e-mail.", true); }
      if (form.password.length < 6) { setLoading(false); return flash("Senha mínimo 6 caracteres.", true); }

      // Usa supabaseAdmin (service role) — cria usuário sem afetar sessão do admin
      const { data, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        email_confirm: true,
        user_metadata: { full_name: form.full_name.trim() },
      });

      // Ignora erro de e-mail — usuário é criado mesmo assim
      const userCreated = data?.user;
      if (!userCreated && authErr && !authErr.message?.includes("email")) {
        setLoading(false);
        return flash(
          authErr.message?.includes("already") ? "E-mail já cadastrado." : authErr.message ?? "Erro ao criar usuário.",
          true
        );
      }

      const userId = userCreated?.id;
      if (!userId) { setLoading(false); return flash("Erro ao criar usuário.", true); }

      await supabase.from("profiles").upsert({
        id: userId,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company,
        role: form.role,
        sector: form.sector || null,
      }, { onConflict: "id" });

      flash(`✅ Usuário ${form.full_name} criado! Pode fazer login com a senha informada.`);

    } else {
      await supabase.from("profiles").update({
        full_name: form.full_name.trim(),
        company: form.company,
        role: form.role,
        sector: form.sector || null,
      }).eq("id", editId);

      // Troca senha se preenchida
      if (form.newPassword.trim()) {
        if (form.newPassword.length < 6) { setLoading(false); return flash("Nova senha mínimo 6 caracteres.", true); }
        const { error: pwErr } = await supabaseAdmin.auth.admin.updateUserById(editId, {
          password: form.newPassword,
        });
        if (pwErr) flash("Perfil atualizado, mas erro ao trocar senha: " + pwErr.message, true);
        else flash("✅ Usuário e senha atualizados!");
      } else {
        flash("✅ Usuário atualizado!");
      }
    }
    closeForm(); loadUsers(); setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remover "${name}"? Não pode ser desfeito.`)) return;
    await supabaseAdmin.auth.admin.deleteUser(id);
    await supabase.from("profiles").delete().eq("id", id);
    if (expandedUser === id) setExpandedUser(null);
    flash(`Usuário ${name} removido.`);
    loadUsers();
  }

  async function handleResetPassword(email: string, name: string) {
    if (!email) return flash("Sem e-mail cadastrado.", true);
    setSendingReset(email);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/set-password`,
    });
    setSendingReset(null);
    if (err) flash("Erro: " + err.message, true);
    else flash(`📧 Link enviado para ${name} (${email})`);
  }

  async function handleResetProgress(userId: string, name: string) {
    if (!confirm(`Resetar TODO o progresso de "${name}"?\n\n• Aulas concluídas\n• Quizzes e avaliações\n• Certificados\n\nNão pode ser desfeito!`)) return;
    setResettingProgress(userId);
    await supabase.from("lesson_progress").delete().eq("user_id", userId);
    await supabase.from("trilha_quiz_results").delete().eq("user_id", userId);
    await supabase.from("certificates").delete().eq("user_id", userId);
    setResettingProgress(null);
    flash(`✅ Progresso de ${name} resetado!`);
  }

  const roleLabel    = (r: string) => ROLES.find(x => x.key === r)?.label ?? r;
  const sectorLabel  = (s: string | null) => SECTORS.find(x => x.key === s)?.label ?? s ?? "—";
  const companyLabel = (c: string) => COMPANIES.find(x => x.key === c)?.label ?? c;
  const roleColor    = (r: string) =>
    r === "admin"   ? { bg:"rgba(168,85,247,0.1)", color:"#a855f7", border:"rgba(168,85,247,0.25)" } :
    r === "manager" ? { bg:"rgba(245,166,35,0.1)",  color:"#f5a623", border:"rgba(245,166,35,0.25)" } :
                      { bg:"rgba(96,165,250,0.1)",   color:"#60a5fa", border:"rgba(96,165,250,0.25)" };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color:"var(--soma-text)" }}>👥 Usuários</h1>
          <p className="text-sm mt-0.5" style={{ color:"var(--soma-muted)" }}>{users.length} usuário{users.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadUsers} className="w-9 h-9 flex items-center justify-center rounded-xl hover:opacity-70"
            style={{ border:"1px solid var(--soma-border)", color:"var(--soma-muted)" }}>
            <RefreshCw size={15} />
          </button>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90"
            style={{ backgroundColor:"#f5a623", color:"#000" }}>
            <UserPlus size={15} /> Novo usuário
          </button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", color:"#22c55e" }}>
          <Check size={14} /> {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.25)", color:"#f87171" }}>
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--soma-muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou setor..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none" style={inp} />
      </div>

      {showForm && (
        <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor:"var(--soma-card)", borderColor:"#f5a623" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-bold text-sm" style={{ color:"var(--soma-text)" }}>
                {editId ? "✏️ Editar usuário" : "➕ Novo usuário"}
              </h2>
              <p className="text-xs mt-0.5" style={{ color:"var(--soma-muted)" }}>
                {editId ? "Atualize os dados. Para senha use o botão 'Senha' na listagem."
                        : "Preencha os dados. O colaborador pode fazer login imediatamente."}
              </p>
            </div>
            <button onClick={closeForm} style={{ color:"var(--soma-muted)" }}><X size={18} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label style={lbl}>Nome completo *</label>
              <input style={inp} type="text" value={form.full_name} placeholder="Ex: João Silva"
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
            <div>
              <label style={lbl}>E-mail {!editId && "*"}</label>
              <input style={{ ...inp, opacity: editId ? 0.6 : 1 }} type="email" value={form.email}
                placeholder="colaborador@somaprime.com" readOnly={!!editId}
                onChange={e => !editId && setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            {!editId ? (
              <div>
                <label style={lbl}>Senha *</label>
                <div className="relative">
                  <input style={{ ...inp, paddingRight:36 }} type={showPass ? "text" : "password"}
                    value={form.password} placeholder="Mínimo 6 caracteres"
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:"var(--soma-muted)" }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label style={lbl}>Nova senha <span style={{ color:"var(--soma-muted)" }}>(opcional)</span></label>
                <div className="relative">
                  <input style={{ ...inp, paddingRight:36 }} type={showPass ? "text" : "password"}
                    value={form.newPassword} placeholder="Deixe vazio para não alterar"
                    onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:"var(--soma-muted)" }}>
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}
            <div>
              <label style={lbl}>Empresa</label>
              <select style={inp} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}>
                {COMPANIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Cargo</label>
              <select style={inp} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label style={lbl}>Setor</label>
              <select style={inp} value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
                {SECTORS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:opacity-90"
              style={{ backgroundColor:"#f5a623", color:"#000" }}>
              <Check size={14} /> {loading ? "Salvando..." : editId ? "Salvar" : "Criar usuário"}
            </button>
            <button onClick={closeForm} className="px-5 py-2.5 rounded-xl text-sm hover:opacity-70"
              style={{ border:"1px solid var(--soma-border)", color:"var(--soma-muted)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-14 rounded-2xl border" style={{ borderColor:"var(--soma-border)" }}>
            <p className="text-sm" style={{ color:"var(--soma-muted)" }}>
              {search ? "Nenhum usuário encontrado." : "Nenhum usuário cadastrado."}
            </p>
          </div>
        )}
        {filtered.map(u => {
          const rc = roleColor(u.role);
          const isExpanded = expandedUser === u.id;
          return (
            <div key={u.id} className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor:"var(--soma-card)", borderColor: isExpanded ? "#f5a623" : "var(--soma-border)" }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor:"rgba(245,166,35,0.15)", color:"#f5a623" }}>
                  {u.full_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color:"var(--soma-text)" }}>{u.full_name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor:rc.bg, color:rc.color, border:`1px solid ${rc.border}` }}>
                      {roleLabel(u.role)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs flex items-center gap-1" style={{ color: u.email ? "var(--soma-muted)" : "#f87171" }}>
                      <Mail size={10} /> {u.email || "sem e-mail"}
                    </span>
                    <span className="text-xs" style={{ color:"var(--soma-muted)" }}>
                      {sectorLabel(u.sector)} · {companyLabel(u.company)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  <button onClick={() => openEdit(u)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-80"
                    style={{ backgroundColor:"rgba(245,166,35,0.1)", border:"1px solid rgba(245,166,35,0.2)", color:"#f5a623" }}>
                    <Pencil size={11} /> Editar
                  </button>
                  <button onClick={() => handleResetPassword(u.email, u.full_name)}
                    disabled={sendingReset === u.email}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-80 disabled:opacity-40"
                    style={{ backgroundColor:"rgba(96,165,250,0.1)", border:"1px solid rgba(96,165,250,0.2)", color:"#60a5fa" }}>
                    {sendingReset === u.email ? <RefreshCw size={11} className="animate-spin" /> : <Lock size={11} />}
                    Senha
                  </button>
                  <button onClick={() => handleResetProgress(u.id, u.full_name)}
                    disabled={resettingProgress === u.id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-80 disabled:opacity-40"
                    style={{ backgroundColor:"rgba(245,166,35,0.1)", border:"1px solid rgba(245,166,35,0.2)", color:"#f5a623" }}>
                    {resettingProgress === u.id ? <RefreshCw size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                    Reset
                  </button>
                  <button onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-80"
                    style={{ backgroundColor:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.2)", color:"#4ade80" }}>
                    <BookOpen size={11} /> Trilhas {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  </button>
                  <button onClick={() => handleDelete(u.id, u.full_name)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:opacity-80"
                    style={{ backgroundColor:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", color:"#f87171" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              {isExpanded && (
                <div className="px-4 pb-4 border-t" style={{ borderColor:"var(--soma-border)" }}>
                  <TrilhaSelector userId={u.id} company={u.company} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {users.length > 0 && (
        <div className="text-xs space-y-1" style={{ color:"var(--soma-muted)" }}>
          <p>🔒 <strong>Senha</strong> — envia link de redefinição por e-mail</p>
          <p>🔄 <strong>Reset</strong> — apaga progresso, quizzes e certificados</p>
          <p>📚 <strong>Trilhas</strong> — controla acesso às trilhas</p>
        </div>
      )}
    </div>
  );
}