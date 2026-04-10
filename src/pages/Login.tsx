import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Login() {
  const { user, signIn } = useAuth();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [forgot, setForgot]       = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError("E-mail ou senha incorretos.");
    setLoading(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Digite seu e-mail primeiro."); return; }
    setLoading(true); setError("");
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/set-password`,
    });
    setResetSent(true); setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "var(--soma-bg)" }}>
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <img src="/logos/soma-logo.png" alt="Soma Prime" className="h-10 mx-auto mb-4 object-contain"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="text-2xl font-bold" style={{ color: "#f5a623" }}>GUIA OPERACIONAL</span>
          <p className="text-sm mt-1" style={{ color: "var(--soma-muted)" }}>
            {forgot ? "Recuperar acesso" : "Acesse com sua conta"}
          </p>
        </div>

        {resetSent ? (
          <div className="rounded-2xl border p-8 text-center space-y-4"
            style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
            <div className="text-4xl">📧</div>
            <p className="font-semibold" style={{ color: "var(--soma-text)" }}>E-mail enviado!</p>
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>
              Verifique sua caixa de entrada e clique no link para redefinir sua senha.
            </p>
            <button onClick={() => { setForgot(false); setResetSent(false); }}
              className="text-sm underline" style={{ color: "#f5a623" }}>
              Voltar ao login
            </button>
          </div>
        ) : (
          <form onSubmit={forgot ? handleForgot : handleSubmit}
            className="rounded-2xl border p-8 space-y-5"
            style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>

            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--soma-muted)" }}>E-mail</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
                style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}
                onFocus={e => (e.target.style.borderColor = "#f5a623")}
                onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
            </div>

            {!forgot && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--soma-muted)" }}>Senha</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-colors"
                  style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}
                  onFocus={e => (e.target.style.borderColor = "#f5a623")}
                  onBlur={e => (e.target.style.borderColor = "var(--soma-border)")} />
              </div>
            )}

            {error && <p className="text-sm text-center" style={{ color: "#f87171" }}>{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#f5a623", color: "#000" }}>
              {loading ? "Aguarde..." : forgot ? "Enviar link de recuperação" : "Entrar"}
            </button>

            <button type="button" onClick={() => { setForgot(!forgot); setError(""); }}
              className="w-full text-sm text-center transition-colors"
              style={{ color: "var(--soma-muted)" }}>
              {forgot ? "← Voltar ao login" : "Esqueci minha senha"}
            </button>
          </form>
        )}

        <p className="text-center text-xs mt-6" style={{ color: "var(--soma-muted)" }}>
          Problemas para acessar? Fale com seu gestor.
        </p>
      </div>
    </div>
  );
}