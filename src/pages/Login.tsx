import { useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { user, signIn } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Se já logado, manda pra home
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError("E-mail ou senha incorretos.");
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-ph-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / título */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-gold-light tracking-wide">
            GUIA OPERACIONAL
          </span>
          <p className="text-ph-text/50 text-sm mt-1">Acesse com sua conta</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-ph-card border border-ph-border rounded-2xl p-8 space-y-5"
        >
          {/* E-mail */}
          <div className="space-y-1.5">
            <label className="text-sm text-ph-text/70 font-medium">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-ph-bg border border-ph-border rounded-lg px-4 py-2.5
                         text-ph-text text-sm placeholder:text-ph-text/30
                         focus:outline-none focus:border-gold-light transition-colors"
            />
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label className="text-sm text-ph-text/70 font-medium">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-ph-bg border border-ph-border rounded-lg px-4 py-2.5
                         text-ph-text text-sm placeholder:text-ph-text/30
                         focus:outline-none focus:border-gold-light transition-colors"
            />
          </div>

          {/* Erro */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-light hover:bg-gold text-white font-semibold
                       py-2.5 rounded-lg transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-ph-text/30 text-xs mt-6">
          Problemas para acessar? Fale com seu gestor.
        </p>
      </div>
    </div>
  );
}