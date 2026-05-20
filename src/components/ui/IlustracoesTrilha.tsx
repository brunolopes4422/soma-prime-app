// src/components/ui/IlustracoesTrilha.tsx
// Sistema de ilustrações para as trilhas
// Use [ILUSTRACAO:nome] no conteúdo da aula para renderizar automaticamente

import React from "react";

// ─── ILUSTRAÇÕES ──────────────────────────────────────────────────────────────

function IlustraAtalhos() {
  return (
    <div className="my-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f5a623" }}>📊 Ilustração: Atalhos essenciais</p>
      <svg viewBox="0 0 500 180" className="w-full rounded-xl" style={{ border: "1px solid var(--soma-border)" }}>
        <rect width="500" height="180" fill="var(--soma-bg)" rx="12" />
        {[
          { x:20,  y:20,  k1:"Ctrl", k2:"C", desc:"Copiar",    c1:"#f5a623", c2:"#4ade80" },
          { x:20,  y:70,  k1:"Ctrl", k2:"V", desc:"Colar",     c1:"#f5a623", c2:"#60a5fa" },
          { x:20,  y:120, k1:"Ctrl", k2:"Z", desc:"Desfazer",  c1:"#f5a623", c2:"#f87171" },
          { x:170, y:20,  k1:"Win",  k2:"E", desc:"Explorador",c1:"#a78bfa", c2:"#34d399" },
          { x:170, y:70,  k1:"Win",  k2:"L", desc:"Bloquear",  c1:"#a78bfa", c2:"#fb7185" },
          { x:170, y:120, k1:"Ctrl", k2:"S", desc:"Salvar",    c1:"#f5a623", c2:"#fbbf24" },
          { x:320, y:20,  k1:"Ctrl", k2:"F", desc:"Buscar",    c1:"#f5a623", c2:"#818cf8" },
          { x:320, y:70,  k1:"Alt",  k2:"F4",desc:"Fechar",    c1:"#94a3b8", c2:"#f87171" },
          { x:320, y:120, k1:"Ctrl", k2:"P", desc:"Imprimir",  c1:"#f5a623", c2:"#94a3b8" },
        ].map(({ x, y, k1, k2, desc, c1, c2 }) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="35" height="28" rx="6" fill={`${c1}15`} stroke={c1} strokeWidth="1.5" />
            <text x={x+17} y={y+18} textAnchor="middle" fill={c1} fontSize="9" fontWeight="bold" fontFamily="monospace">{k1}</text>
            <text x={x+47} y={y+5} fill="var(--soma-muted)" fontSize="12">+</text>
            <rect x={x+55} y={y} width="28" height="28" rx="6" fill={`${c2}15`} stroke={c2} strokeWidth="1.5" />
            <text x={x+69} y={y+18} textAnchor="middle" fill={c2} fontSize="9" fontWeight="bold" fontFamily="monospace">{k2}</text>
            <text x={x+90} y={y+18} fill="var(--soma-muted)" fontSize="10">{desc}</text>
          </g>
        ))}
        <text x="250" y="168" textAnchor="middle" fill="var(--soma-muted)" fontSize="9">Atalhos mais usados no dia a dia</text>
      </svg>
    </div>
  );
}

function IlustraFluxoAtendimento() {
  const steps = [
    { label: "1. Receber",      sub: "15 min",    color: "#60a5fa", y: 20  },
    { label: "2. Classificar",  sub: "tipo?",     color: "#a78bfa", y: 70  },
    { label: "3. Abrir ticket", sub: "GClick",    color: "#f5a623", y: 120 },
    { label: "4. Resolver",     sub: "30 min",    color: "#4ade80", y: 170 },
    { label: "5. Loop",         sub: "avisar",    color: "#34d399", y: 220 },
    { label: "6. Fechar",       sub: "descrever", color: "#22c55e", y: 270 },
  ];
  return (
    <div className="my-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f5a623" }}>📊 Ilustração: Fluxo de atendimento</p>
      <svg viewBox="0 0 500 330" className="w-full rounded-xl" style={{ border: "1px solid var(--soma-border)" }}>
        <rect width="500" height="330" fill="var(--soma-bg)" rx="12" />
        {steps.map(({ label, sub, color, y }, i) => (
          <g key={label}>
            <rect x="130" y={y} width="240" height="38" rx="8" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
            <circle cx="155" cy={y+19} r="12" fill={color} />
            <text x="155" y={y+23} textAnchor="middle" fill="#000" fontSize="10" fontWeight="bold">{i+1}</text>
            <text x="260" y={y+15} textAnchor="middle" fill="var(--soma-text)" fontSize="11" fontWeight="bold">{label}</text>
            <text x="260" y={y+30} textAnchor="middle" fill={color} fontSize="9">{sub}</text>
            {i < steps.length-1 && <path d="M 250 0 L 244 10 L 256 10 Z" transform={`translate(0,${y+40})`} fill={color} opacity="0.6" />}
          </g>
        ))}
      </svg>
    </div>
  );
}

function IlustraCertificado() {
  return (
    <div className="my-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f5a623" }}>📊 Ilustração: A1 vs A3</p>
      <svg viewBox="0 0 500 180" className="w-full rounded-xl" style={{ border: "1px solid var(--soma-border)" }}>
        <rect width="500" height="180" fill="var(--soma-bg)" rx="12" />
        <rect x="20" y="20" width="210" height="140" rx="10" fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5" />
        <text x="125" y="50" textAnchor="middle" fill="#60a5fa" fontSize="13" fontWeight="bold">Certificado A1</text>
        <rect x="95" y="60" width="60" height="70" rx="4" fill="rgba(96,165,250,0.2)" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M 140 60 L 155 75 L 140 75 Z" fill="#60a5fa" />
        <text x="125" y="110" textAnchor="middle" fill="#60a5fa" fontSize="10" fontFamily="monospace">.pfx</text>
        <text x="125" y="148" textAnchor="middle" fill="var(--soma-muted)" fontSize="9">Arquivo no computador</text>
        <text x="125" y="163" textAnchor="middle" fill="#f5a623" fontSize="9">⚠️ Faça backup!</text>
        
        <text x="250" y="95" textAnchor="middle" fill="var(--soma-muted)" fontSize="16" fontWeight="bold">VS</text>
        
        <rect x="270" y="20" width="210" height="140" rx="10" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.3)" strokeWidth="1.5" />
        <text x="375" y="50" textAnchor="middle" fill="#4ade80" fontSize="13" fontWeight="bold">Certificado A3</text>
        <rect x="345" y="60" width="60" height="24" rx="4" fill="rgba(74,222,128,0.2)" stroke="#4ade80" strokeWidth="1.5" />
        <rect x="370" y="52" width="12" height="10" rx="2" fill="#4ade80" />
        <rect x="349" y="92" width="52" height="28" rx="4" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1" />
        <text x="375" y="110" textAnchor="middle" fill="#4ade80" fontSize="8">TOKEN</text>
        <text x="375" y="148" textAnchor="middle" fill="var(--soma-muted)" fontSize="9">Dispositivo físico USB</text>
        <text x="375" y="163" textAnchor="middle" fill="#f5a623" fontSize="9">⚠️ Não perca!</text>
      </svg>
    </div>
  );
}

function IlustraEstruturaPastas() {
  return (
    <div className="my-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f5a623" }}>📊 Ilustração: Estrutura de pastas</p>
      <svg viewBox="0 0 500 260" className="w-full rounded-xl" style={{ border: "1px solid var(--soma-border)" }}>
        <rect width="500" height="260" fill="var(--soma-bg)" rx="12" />
        <line x1="35" y1="30" x2="35" y2="240" stroke="var(--soma-border)" strokeWidth="1" />
        <line x1="55" y1="55" x2="55" y2="185" stroke="var(--soma-border)" strokeWidth="1" />
        {[50,75,95,115].map(y => <line key={y} x1="35" y1={y} x2="50" y2={y} stroke="var(--soma-border)" strokeWidth="1" />)}
        {[75,95,115].map(y => <line key={y} x1="55" y1={y} x2="70" y2={y} stroke="var(--soma-border)" strokeWidth="1" />)}
        {[170,190].map(y => <line key={y} x1="55" y1={y} x2="70" y2={y} stroke="var(--soma-border)" strokeWidth="1" />)}
        {[145,215,238].map(y => <line key={y} x1="35" y1={y} x2="50" y2={y} stroke="var(--soma-border)" strokeWidth="1" />)}
        {[
          { x:20, y:20,  t:"📁 12345678000195_NomeEmpresa/", bold:true,  c:"#f5a623" },
          { x:40, y:50,  t:"📁 Fiscal/",   bold:false, c:"#60a5fa" },
          { x:60, y:75,  t:"📄 DAS/",      bold:false, c:"var(--soma-muted)" },
          { x:60, y:95,  t:"📄 DARF/",     bold:false, c:"var(--soma-muted)" },
          { x:60, y:115, t:"📄 Certidoes/",bold:false, c:"var(--soma-muted)" },
          { x:40, y:145, t:"📁 DP/",       bold:false, c:"#60a5fa" },
          { x:60, y:170, t:"📄 Folha/",    bold:false, c:"var(--soma-muted)" },
          { x:60, y:190, t:"📄 FGTS/",     bold:false, c:"var(--soma-muted)" },
          { x:40, y:215, t:"📁 Contabil/", bold:false, c:"#60a5fa" },
          { x:40, y:238, t:"📁 Contratos/",bold:false, c:"#60a5fa" },
        ].map(({ x, y, t, bold, c }) => (
          <text key={y} x={x} y={y} fill={c} fontSize={bold ? "11" : "10"} fontWeight={bold ? "bold" : "normal"} fontFamily="monospace">{t}</text>
        ))}
        <rect x="280" y="20" width="200" height="50" rx="8" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
        <text x="380" y="40" textAnchor="middle" fill="#4ade80" fontSize="10" fontWeight="bold">✅ Nomenclatura correta:</text>
        <text x="380" y="58" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace">12345678_DAS_Maio2026.pdf</text>
        <rect x="280" y="82" width="200" height="50" rx="8" fill="rgba(248,113,113,0.08)" stroke="rgba(248,113,113,0.3)" strokeWidth="1" />
        <text x="380" y="102" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">❌ Nome incorreto:</text>
        <text x="380" y="120" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="monospace">guia(2).pdf</text>
      </svg>
    </div>
  );
}

function IlustraSnap() {
  return (
    <div className="my-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f5a623" }}>📊 Ilustração: Snap Layout — janelas lado a lado</p>
      <svg viewBox="0 0 500 170" className="w-full rounded-xl" style={{ border: "1px solid var(--soma-border)" }}>
        <rect width="500" height="170" fill="var(--soma-bg)" rx="12" />
        <rect x="15" y="15" width="470" height="140" rx="8" fill="#0d1117" stroke="var(--soma-border)" strokeWidth="1.5" />
        <rect x="15" y="15" width="470" height="20" rx="8" fill="#161b22" />
        <circle cx="30" cy="25" r="4" fill="#f87171" />
        <circle cx="44" cy="25" r="4" fill="#fbbf24" />
        <circle cx="58" cy="25" r="4" fill="#4ade80" />
        <rect x="20" y="40" width="225" height="110" rx="4" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="20" y="40" width="225" height="18" rx="4" fill="#1e3a5f" />
        <text x="132" y="53" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace">e-CAC</text>
        {[66,82,98,114].map(y => <rect key={y} x="35" y={y} width={60+Math.random()*60} height="8" rx="3" fill="#1e3a5f" />)}
        <text x="132" y="145" textAnchor="middle" fill="#60a5fa" fontSize="8">Win + ←</text>
        <rect x="255" y="40" width="225" height="110" rx="4" fill="#0f1f0f" stroke="#4ade80" strokeWidth="1.5" />
        <rect x="255" y="40" width="225" height="18" rx="4" fill="#1a3a1a" />
        <text x="367" y="53" textAnchor="middle" fill="#4ade80" fontSize="9" fontFamily="monospace">GClick — Tickets</text>
        {[66,82,98,114].map(y => <rect key={y} x="270" y={y} width={50+Math.random()*80} height="8" rx="3" fill="#1a3a1a" />)}
        <text x="367" y="145" textAnchor="middle" fill="#4ade80" fontSize="8">Win + →</text>
        <text x="247" y="100" textAnchor="middle" fill="var(--soma-muted)" fontSize="12">⟷</text>
      </svg>
    </div>
  );
}

function IlustraPhishing() {
  return (
    <div className="my-4">
      <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "#f5a623" }}>📊 Ilustração: E-mail falso vs oficial</p>
      <svg viewBox="0 0 500 180" className="w-full rounded-xl" style={{ border: "1px solid var(--soma-border)" }}>
        <rect width="500" height="180" fill="var(--soma-bg)" rx="12" />
        <rect x="15" y="15" width="215" height="150" rx="8" fill="rgba(248,113,113,0.05)" stroke="rgba(248,113,113,0.4)" strokeWidth="1.5" />
        <rect x="15" y="15" width="215" height="28" rx="8" fill="rgba(248,113,113,0.15)" />
        <text x="122" y="33" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">❌ E-MAIL FALSO</text>
        <text x="30" y="62" fill="#f87171" fontSize="8" fontFamily="monospace">De: receita@fazenda-br.com</text>
        <rect x="30" y="72" width="180" height="36" rx="4" fill="rgba(248,113,113,0.1)" stroke="rgba(248,113,113,0.3)" strokeWidth="1" />
        <text x="120" y="88" textAnchor="middle" fill="#f87171" fontSize="9">⚠️ Regularize agora!</text>
        <text x="120" y="102" textAnchor="middle" fill="#f87171" fontSize="9">👉 Clique aqui</text>
        <text x="30" y="128" fill="#f87171" fontSize="8">• Domínio falso (-br, não .gov.br)</text>
        <text x="30" y="143" fill="#f87171" fontSize="8">• Urgência exagerada</text>
        <text x="30" y="158" fill="#f87171" fontSize="8">• Link suspeito</text>
        <text x="248" y="95" textAnchor="middle" fill="var(--soma-muted)" fontSize="14">VS</text>
        <rect x="270" y="15" width="215" height="150" rx="8" fill="rgba(74,222,128,0.05)" stroke="rgba(74,222,128,0.4)" strokeWidth="1.5" />
        <rect x="270" y="15" width="215" height="28" rx="8" fill="rgba(74,222,128,0.15)" />
        <text x="377" y="33" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">✅ E-MAIL OFICIAL</text>
        <text x="285" y="62" fill="#4ade80" fontSize="8" fontFamily="monospace">De: receita@fazenda.gov.br</text>
        <rect x="285" y="72" width="180" height="36" rx="4" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
        <text x="375" y="88" textAnchor="middle" fill="#4ade80" fontSize="9">Comunicado oficial</text>
        <text x="375" y="102" textAnchor="middle" fill="#4ade80" fontSize="8">Acesse: cav.receita.fazenda.gov.br</text>
        <text x="285" y="128" fill="#4ade80" fontSize="8">• Domínio .gov.br oficial</text>
        <text x="285" y="143" fill="#4ade80" fontSize="8">• Sem link de clique</text>
        <text x="285" y="158" fill="#4ade80" fontSize="8">• Sem urgência exagerada</text>
      </svg>
    </div>
  );
}

// ─── MAPA DE ILUSTRAÇÕES ──────────────────────────────────────────────────────
const ILUSTRACOES: Record<string, React.FC> = {
  atalhos_windows:    IlustraAtalhos,
  fluxo_atendimento:  IlustraFluxoAtendimento,
  certificado_a1_a3:  IlustraCertificado,
  estrutura_pastas:   IlustraEstruturaPastas,
  snap_layout:        IlustraSnap,
  phishing_email:     IlustraPhishing,
};

// ─── RENDERIZADOR ─────────────────────────────────────────────────────────────
// Processa o conteúdo da aula e substitui [ILUSTRACAO:nome] pelo componente SVG

interface Props { content: string; }

export default function ConteudoComIlustracoes({ content }: Props) {
  if (!content) return null;

  // Divide o conteúdo nas tags de ilustração
  const partes = content.split(/\[ILUSTRACAO:([^\]]+)\]/g);

  return (
    <div className="space-y-2">
      {partes.map((parte, i) => {
        // Partes pares = texto, partes ímpares = nome da ilustração
        if (i % 2 === 0) {
          if (!parte.trim()) return null;
          return (
            <div key={i} className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--soma-muted)" }}>
              {parte}
            </div>
          );
        } else {
          const Ilustracao = ILUSTRACOES[parte.trim()];
          if (!Ilustracao) return (
            <div key={i} className="text-xs p-2 rounded" style={{ color: "var(--soma-muted)", backgroundColor: "var(--soma-bg)" }}>
              [Ilustração: {parte}]
            </div>
          );
          return <Ilustracao key={i} />;
        }
      })}
    </div>
  );
}