import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { X, Check, Pencil, Trash2, UserPlus } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  company: string;
  role: string;
  sector: string | null;
}

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
  { key: "cs",         label: "CS / Atendimento" },
  { key: "fiscal",     label: "Fiscal" },
  { key: "dp",         label: "Dep. Pessoal" },
  { key: "contabil",   label: "Contábil" },
  { key: "societario", label: "Societário" },
  { key: "omie",       label: "OMIE / Financeiro" },
];

const emptyForm = { full_name: "", email: "", password: "", company: "soma_prime", role: "collaborator", sector: "cs" };

export default function AdminUsers() {
  const [users, setUsers]     = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState(emptyForm);

  const inputStyle = {
    backgroundColor: "var(--soma-bg)",
    border: "1px solid var(--soma-border)",
    color: "var(--soma-text)",
  };

  async function loadUsers() {
    const { data } = await supabase.from("profiles").select("*").order("full_name");
    setUsers(data ?? []);
  }

  useEffect(() => { loadUsers(); }, []);

  function openNew() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEdit(u: UserProfile) {
    setEditId(u.id);
    setForm({ full_name: u.full_name, email: "", password: "", company: u.company, role: u.role, sector: u.sector ?? "cs" });
    setError("");
    setShowForm(true);
  }

  async function handleSave() {
    setError("");
    if (!form.full_name.trim()) { setError("Preencha o nome completo."); return; }

    setLoading(true);

    if (!editId) {
      // ── CRIAR NOVO USUÁRIO ─────────────────────────────────────────────────
      if (!form.email.trim())    { setError("Preencha o e-mail."); setLoading(false); return; }
      if (!form.password.trim()) { setError("Preencha a senha."); setLoading(false); return; }
      if (form.password.length < 6) { setError("A senha precisa ter pelo menos 6 caracteres."); setLoading(false); return; }

      // Cria o usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: form.email.trim(),
        password: form.password,
        email_confirm: true,
      });

      if (authError || !authData.user) {
        setError(authError?.message ?? "Erro ao criar usuário.");
        setLoading(false); return;
      }

      // Cria o perfil
      await supabase.from("profiles").upsert({
        id:        authData.user.id,
        full_name: form.full_name.trim(),
        company:   form.company,
        role:      form.role,
        sector:    form.sector || null,
      });

      setSuccess(`Usuário ${form.full_name} criado com sucesso!`);

    } else {
      // ── EDITAR USUÁRIO EXISTENTE ───────────────────────────────────────────
      await supabase.from("profiles").update({
        full_name: form.full_name.trim(),
        company:   form.company,
        role:      form.role,
        sector:    form.sector || null,
      }).eq("id", editId);

      setSuccess("Usuário atualizado!");
    }

    setShowForm(false);
    setEditId(null);
    setForm(emptyForm);
    setTimeout(() => setSuccess(""), 3000);
    loadUsers();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este usuário? Esta ação não pode ser desfeita.")) return;
    await supabase.from("profiles").delete().eq("id", id);
    loadUsers();
  }

  const roleLabel    = (r: string) => ROLES.find(x => x.key === r)?.label ?? r;
  const sectorLabel  = (s: string | null) => SECTORS.find(x => x.key === s)?.label ?? s ?? "—";
  const companyLabel = (c: string) => COMPANIES.find(x => x.key === c)?.label ?? c;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>👥 Usuários</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--soma-muted)" }}>Gerencie os colaboradores do sistema</p>
      </div>

      {success && <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>✅ {success}</div>}
      {error   && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#f87171" }}>⚠️ {error}</div>}

      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{users.length} usuários cadastrados</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          <UserPlus size={16} /> Novo usuário
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "#f5a623" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>
              {editId ? "Editar usuário" : "Criar novo usuário"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditId(null); }} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Nome completo *</label>
              <input type="text" value={form.full_name} placeholder="Ex: João Silva"
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle} />
            </div>

            {!editId && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>E-mail *</label>
                  <input type="email" value={form.email} placeholder="colaborador@somaprime.com"
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Senha *</label>
                  <input type="password" value={form.password} placeholder="Mínimo 6 caracteres"
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle} />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Empresa</label>
              <select value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                {COMPANIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Cargo</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                {ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Setor</label>
              <select value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm" style={inputStyle}>
                {SECTORS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Check size={16} /> {loading ? "Salvando..." : editId ? "Salvar alterações" : "Criar usuário"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); }}
              className="px-5 py-2.5 rounded-lg text-sm" style={{ ...inputStyle, color: "var(--soma-muted)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--soma-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--soma-card)", borderBottom: "1px solid var(--soma-border)" }}>
              {["Nome", "Empresa", "Cargo", "Setor", "Ações"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--soma-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-sm" style={{ color: "var(--soma-muted)" }}>
                Nenhum usuário cadastrado ainda.
              </td></tr>
            )}
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--soma-border)", backgroundColor: "var(--soma-card)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
                      {u.full_name?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <span className="font-medium text-sm" style={{ color: "var(--soma-text)" }}>{u.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--soma-muted)" }}>{companyLabel(u.company)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "rgba(245,166,35,0.1)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.2)" }}>
                    {roleLabel(u.role)}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--soma-muted)" }}>{sectorLabel(u.sector)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(u)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => handleDelete(u.id)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}