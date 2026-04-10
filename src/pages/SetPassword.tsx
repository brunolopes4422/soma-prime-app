import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SetPassword() {
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [ready, setReady]         = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase processa o token da URL automaticamente
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
  }, []);

  async function handleSubmit() {
    if (password.length < 6) { setError("A senha deve ter no mínimo 6 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setLoading(true); setError("");

    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }

    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--soma-bg)" }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <img src="/logos/soma-logo.png" alt="Soma Prime" className="h-10 mx-auto mb-4 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>
            {ready ? "Defina sua senha" : "Verificando acesso..."}
          </h1>
          {ready && <p className="text-sm mt-1" style={{ color: "var(--soma-muted)" }}>Escolha uma senha segura para sua conta.</p>}
        </div>

        {!ready ? (
          <div className="text-center">
            <span className="animate-pulse text-sm" style={{ color: "#f5a623" }}>Carregando...</span>
          </div>
        ) : (
          <div className="rounded-2xl border p-8 space-y-5"
            style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--soma-muted)" }}>Nova senha</label>
              <input type="password" placeholder="Mínimo 6 caracteres" value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}
                onFocus={e => (e.target.style.borderColor = "#f5a623")}
                onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--soma-muted)" }}>Confirmar senha</label>
              <input type="password" placeholder="Repita a senha" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}
                onFocus={e => (e.target.style.borderColor = "#f5a623")}
                onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            </div>

            {error && <p className="text-sm text-center" style={{ color: "#f87171" }}>{error}</p>}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              {loading ? "Salvando..." : "Definir senha e entrar"}
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-6" style={{ color: "var(--soma-muted)" }}>
          Problemas? Fale com seu gestor.
        </p>
      </div>
    </div>
  );
}