import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { KeyRound, User, Camera } from "lucide-react";

export default function Profile() {
  const { profile } = useAuth();
  const [name, setName]             = useState(profile?.full_name ?? "");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [avatar, setAvatar]         = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState("");
  const [error, setError]           = useState("");
  const fileRef                     = useRef<HTMLInputElement>(null);

  const inputStyle = {
    backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)"
  };

  // Carrega avatar salvo no Supabase
  useEffect(() => {
    if (!profile) return;
    const { data } = supabase.storage.from("avatars").getPublicUrl(`${profile.id}.jpg`);
    setAvatar(data.publicUrl + "?t=" + Date.now());
  }, [profile]);

  // Seleciona foto — só mostra preview local
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("A foto deve ter no máximo 2MB."); return; }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  // Salva foto no Supabase Storage
  async function handleSaveAvatar() {
    if (!avatarFile || !profile) return;
    setLoading(true); setError("");

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(`${profile.id}.jpg`, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadErr) { setError("Erro ao salvar foto: " + uploadErr.message); setLoading(false); return; }

    const { data } = supabase.storage.from("avatars").getPublicUrl(`${profile.id}.jpg`);
    setAvatar(data.publicUrl + "?t=" + Date.now());
    setAvatarFile(null);
    setSuccess("Foto atualizada!");
    setTimeout(() => setSuccess(""), 3000);
    setLoading(false);
  }

  async function handleSaveName() {
    if (!name.trim()) { setError("Nome não pode ser vazio."); return; }
    setLoading(true); setError("");
    await supabase.from("profiles").update({ full_name: name }).eq("id", profile!.id);
    setSuccess("Nome atualizado!");
    setTimeout(() => setSuccess(""), 3000);
    setLoading(false);
  }

  async function handleChangePassword() {
    if (password.length < 6) { setError("A senha deve ter no mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess("Senha alterada!");
    setPassword(""); setConfirm("");
    setTimeout(() => setSuccess(""), 4000);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>Meu Perfil</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--soma-muted)" }}>Gerencie suas informações e segurança</p>
      </div>

      {success && <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>✅ {success}</div>}
      {error   && <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", color: "#f87171" }}>⚠️ {error}</div>}

      {/* Avatar + Nome */}
      <div className="rounded-2xl border p-6 space-y-5" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
        <div className="flex items-center gap-2">
          <User size={16} style={{ color: "#f5a623" }} />
          <h2 className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>Informações pessoais</h2>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>
              <img
                src={avatar ?? ""}
                alt="avatar"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.target as HTMLImageElement).parentElement!.innerText =
                    profile?.full_name?.[0]?.toUpperCase() ?? "U";
                }}
              />
            </div>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              <Camera size={12} />
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium" style={{ color: "var(--soma-text)" }}>{profile?.full_name}</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>
              {profile?.role === "manager" ? "Gestor" : profile?.role === "admin" ? "Admin" : "Colaborador"} · {profile?.sector?.toUpperCase() ?? "—"}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-xs underline" style={{ color: "#f5a623" }}>
                Selecionar foto
              </button>
              {avatarFile && (
                <button type="button" onClick={handleSaveAvatar} disabled={loading}
                  className="text-xs px-3 py-1 rounded-lg font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "#f5a623", color: "#000" }}>
                  {loading ? "Salvando..." : "💾 Salvar foto"}
                </button>
              )}
            </div>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Máx. 2MB · JPG, PNG ou WebP</p>
          </div>

          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
            className="hidden" onChange={handleAvatarChange} />
        </div>

        {/* Nome */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Nome / Apelido</label>
          <div className="flex gap-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#f5a623")}
              onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            <button onClick={handleSaveName} disabled={loading}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              Salvar
            </button>
          </div>
        </div>

        {/* Info somente leitura */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: "var(--soma-border)" }}>
          {[
            { label: "Empresa", value: profile?.company },
            { label: "Setor", value: profile?.sector?.toUpperCase() ?? "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs mb-0.5" style={{ color: "var(--soma-muted)" }}>{label}</p>
              <p className="text-sm font-medium" style={{ color: "var(--soma-text)" }}>{value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Para alterar empresa ou setor, solicite ao seu gestor.</p>
      </div>

      {/* Trocar senha */}
      <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
        <div className="flex items-center gap-2">
          <KeyRound size={16} style={{ color: "#f5a623" }} />
          <h2 className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>Alterar senha</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Nova senha</label>
            <input type="password" placeholder="Mínimo 6 caracteres" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#f5a623")}
              onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--soma-muted)" }}>Confirmar senha</label>
            <input type="password" placeholder="Repita a senha" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleChangePassword()}
              className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = "#f5a623")}
              onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
          </div>
        </div>
        <button onClick={handleChangePassword} disabled={loading}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          {loading ? "Salvando..." : "Alterar senha"}
        </button>
      </div>
    </div>
  );
}