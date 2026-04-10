import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Plus, X, Check, Building2 } from "lucide-react";

interface Company {
  id: string;
  name: string;
  key: string;
  active: boolean;
  created_at: string;
}

const emptyForm = { name: "", key: "" };

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");

  async function load() {
    const { data } = await supabase.from("companies").select("*").order("name");
    setCompanies(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.name || !form.key) { setError("Preencha nome e chave."); return; }
    setSaving(true); setError("");
    const { error: err } = await supabase.from("companies").insert({
      name: form.name,
      key: form.key.toLowerCase().replace(/\s+/g, "_"),
    });
    if (err) { setError(err.message); setSaving(false); return; }
    setSuccess(`${form.name} cadastrada!`);
    setForm(emptyForm); setShowForm(false);
    setTimeout(() => setSuccess(""), 3000);
    load(); setSaving(false);
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from("companies").update({ active: !active }).eq("id", id);
    load();
  }

  if (loading) return <div className="flex items-center justify-center py-20"><span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando...</span></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>🏢 Empresas</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--soma-muted)" }}>{companies.length} empresas cadastradas</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          <Plus size={16} /> Nova empresa
        </button>
      </div>

      {success && <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>✅ {success}</div>}
      {error   && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#f87171" }}>⚠️ {error}</div>}

      {showForm && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "#f5a623" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>Nova empresa</h2>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Nome da empresa</label>
              <input type="text" placeholder="Ex: Soma Prime" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none"
                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}
                onFocus={e => (e.target.style.borderColor = "#f5a623")}
                onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Chave única (sem espaços)</label>
              <input type="text" placeholder="Ex: soma_prime" value={form.key}
                onChange={e => setForm(f => ({ ...f, key: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none font-mono"
                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}
                onFocus={e => (e.target.style.borderColor = "#f5a623")}
                onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Check size={16} /> {saving ? "Salvando..." : "Cadastrar"}
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--soma-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--soma-card)", borderBottom: "1px solid var(--soma-border)" }}>
              {["Empresa", "Chave", "Status", "Ações"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--soma-border)", backgroundColor: "var(--soma-card)" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(245,166,35,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--soma-card)")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(245,166,35,0.15)" }}>
                      <Building2 size={16} style={{ color: "#f5a623" }} />
                    </div>
                    <span className="font-medium" style={{ color: "var(--soma-text)" }}>{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--soma-muted)" }}>{c.key}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: c.active ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)",
                      color: c.active ? "#4ade80" : "#f87171",
                    }}>
                    {c.active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(c.id, c.active)}
                    className="text-xs px-3 py-1 rounded-lg transition-colors"
                    style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
                    {c.active ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}