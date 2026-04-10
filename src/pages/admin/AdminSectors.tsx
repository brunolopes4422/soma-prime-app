import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, X, Check, Layers, Pencil } from "lucide-react";

interface Sector {
  id: string;
  name: string;
  key: string;
  guide_key: string | null;
  active: boolean;
  company_id: string;
}

interface Company { id: string; name: string; key: string; }

const guideOptions = [
  { value: "",        label: "Sem guia vinculado" },
  { value: "cs",      label: "CS / Atendimento" },
  { value: "fiscal",  label: "Fiscal" },
  { value: "dp",      label: "Departamento Pessoal" },
  { value: "omie",    label: "OMIE" },
];

const emptyForm = { name: "", key: "", guide_key: "", company_id: "" };

export default function AdminSectors() {
  const [sectors, setSectors]     = useState<Sector[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");
  const [editId, setEditId]       = useState<string | null>(null);
  const [editForm, setEditForm]   = useState({ name: "", key: "", guide_key: "" });

  async function load() {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("sectors").select("*").order("name"),
      supabase.from("companies").select("*").order("name"),
    ]);
    setSectors(s ?? []);
    setCompanies(c ?? []);
    if (c && c.length > 0) setForm(f => ({ ...f, company_id: f.company_id || c[0].id }));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name || !form.key || !form.company_id) { setError("Preencha nome, chave e empresa."); return; }
    setSaving(true); setError("");
    const { error: err } = await supabase.from("sectors").insert({
      name: form.name, key: form.key.toLowerCase().replace(/\s+/g, "_"),
      guide_key: form.guide_key || null, company_id: form.company_id,
    });
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess(`Setor ${form.name} cadastrado!`);
    setForm({ ...emptyForm, company_id: form.company_id });
    setShowForm(false);
    setTimeout(() => setSuccess(""), 3000);
    load(); setSaving(false);
  }

  async function handleUpdate() {
    if (!editId) return;
    setSaving(true);
    await supabase.from("sectors").update({
      name: editForm.name, key: editForm.key, guide_key: editForm.guide_key || null,
    }).eq("id", editId);
    setEditId(null);
    setSuccess("Setor atualizado!");
    setTimeout(() => setSuccess(""), 3000);
    load(); setSaving(false);
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from("sectors").update({ active: !active }).eq("id", id);
    load();
  }

  const inputStyle = {
    backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)"
  };

  if (loading) return <div className="flex items-center justify-center py-20"><span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando...</span></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>📂 Setores</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--soma-muted)" }}>{sectors.length} setores cadastrados</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          <Plus size={16} /> Novo setor
        </button>
      </div>

      {success && <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>✅ {success}</div>}
      {error   && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#f87171" }}>⚠️ {error}</div>}

      {showForm && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "#f5a623" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>Novo setor</h2>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Nome do setor</label>
              <input type="text" placeholder="Ex: Contábil" value={form.name}
                onChange={e => {
                  const name = e.target.value;
                  const key = name.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
                  setForm(f => ({ ...f, name, key }));
                }}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
                onFocus={e => (e.target.style.borderColor = "#f5a623")}
                onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>
                Chave <span style={{ color: "var(--soma-muted)", fontWeight: 400 }}>(gerada automaticamente)</span>
              </label>
              <input type="text" value={form.key} readOnly
                className="w-full px-3 py-2.5 rounded-lg text-sm font-mono cursor-not-allowed"
                style={{ ...inputStyle, opacity: 0.6 }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Empresa</label>
              <select value={form.company_id} onChange={e => setForm(f => ({ ...f, company_id: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Guia vinculado</label>
              <select value={form.guide_key} onChange={e => setForm(f => ({ ...f, guide_key: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}>
                {guideOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Check size={16} /> {saving ? "Salvando..." : "Cadastrar"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }}
              className="px-5 py-2.5 rounded-lg text-sm" style={{ ...inputStyle, color: "var(--soma-muted)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {companies.map(company => {
        const companySectors = sectors.filter(s => s.company_id === company.id);
        if (companySectors.length === 0) return null;
        return (
          <div key={company.id}>
            <p className="text-xs uppercase tracking-widest mb-3 flex items-center gap-2" style={{ color: "var(--soma-muted)" }}>
              <Layers size={14} /> {company.name}
            </p>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--soma-border)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "var(--soma-card)", borderBottom: "1px solid var(--soma-border)" }}>
                    {["Setor", "Chave", "Guia vinculado", "Status", "Ações"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companySectors.map(s => (
                    <>
                      <tr key={s.id}
                        style={{ borderBottom: editId === s.id ? "none" : "1px solid var(--soma-border)", backgroundColor: "var(--soma-card)" }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(245,166,35,0.03)")}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--soma-card)")}>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--soma-text)" }}>{s.name}</td>
                        <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--soma-muted)" }}>{s.key}</td>
                        <td className="px-4 py-3 text-xs">
                          {s.guide_key
                            ? <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>{s.guide_key}</span>
                            : <span style={{ color: "var(--soma-muted)", opacity: 0.4 }}>—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: s.active ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)", color: s.active ? "#4ade80" : "#f87171" }}>
                            {s.active ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { setEditId(s.id); setEditForm({ name: s.name, key: s.key, guide_key: s.guide_key ?? "" }); }}
                              className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                              style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                              <Pencil size={12} /> Editar
                            </button>
                            <button onClick={() => toggleActive(s.id, s.active)}
                              className="text-xs px-3 py-1 rounded-lg"
                              style={{ ...inputStyle, color: "var(--soma-muted)" }}>
                              {s.active ? "Desativar" : "Ativar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {editId === s.id && (
                        <tr key={`edit-${s.id}`} style={{ borderBottom: "1px solid var(--soma-border)", backgroundColor: "rgba(245,166,35,0.03)" }}>
                          <td colSpan={5} className="px-4 py-4">
                            <div className="grid grid-cols-4 gap-3 items-end">
                              <div>
                                <label className="block text-xs mb-1" style={{ color: "var(--soma-muted)" }}>Nome</label>
                                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle}
                                  onFocus={e => (e.target.style.borderColor = "#f5a623")}
                                  onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                              </div>
                              <div>
                                <label className="block text-xs mb-1" style={{ color: "var(--soma-muted)" }}>Chave</label>
                                <input value={editForm.key} onChange={e => setEditForm(f => ({ ...f, key: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none font-mono" style={inputStyle}
                                  onFocus={e => (e.target.style.borderColor = "#f5a623")}
                                  onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
                              </div>
                              <div>
                                <label className="block text-xs mb-1" style={{ color: "var(--soma-muted)" }}>Guia vinculado</label>
                                <select value={editForm.guide_key} onChange={e => setEditForm(f => ({ ...f, guide_key: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={inputStyle}>
                                  {guideOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={handleUpdate} disabled={saving}
                                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-50"
                                  style={{ backgroundColor: "#f5a623", color: "#000" }}>
                                  <Check size={14} /> Salvar
                                </button>
                                <button onClick={() => setEditId(null)}
                                  className="px-3 py-2 rounded-lg text-xs" style={{ ...inputStyle, color: "var(--soma-muted)" }}>
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}