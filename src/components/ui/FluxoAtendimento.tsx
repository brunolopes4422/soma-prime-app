// src/components/ui/FluxoAtendimento.tsx
// Fluxograma animado do fluxo de atendimento CS

import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ArrowDown } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: "📱",
    title: "Receber o contato",
    subtitle: "SLA: 15 minutos",
    desc: "WhatsApp (OneCode), e-mail, telefone ou ticket (GClick)",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.15)",
    border: "rgba(59,130,246,0.3)",
  },
  {
    id: 2,
    icon: "🔍",
    title: "Classificar a demanda",
    subtitle: "Antes de qualquer ação",
    desc: "Dúvida / Documento / Problema / Reclamação / Cancelamento",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.15)",
    border: "rgba(245,166,35,0.3)",
  },
  {
    id: 3,
    icon: "🎫",
    title: "Abrir ticket no GClick",
    subtitle: "Imediatamente — sem exceção",
    desc: "Todo atendimento vira ticket. Abra enquanto está na conversa.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.15)",
    border: "rgba(139,92,246,0.3)",
  },
  {
    id: 4,
    icon: "⚡",
    title: "Resolver ou encaminhar",
    subtitle: "Regra dos 30 minutos",
    desc: "Até 30min → você resolve. Acima → cria tarefa e encaminha.",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.15)",
    border: "rgba(245,166,35,0.3)",
    branches: [
      { label: "✅ Até 30min", desc: "CS resolve", color: "#22c55e", bg: "rgba(22,163,74,0.15)" },
      { label: "⏰ Acima de 30min", desc: "Cria tarefa e encaminha para o setor", color: "#f87171", bg: "rgba(220,38,38,0.15)" },
    ],
  },
  {
    id: 5,
    icon: "🔁",
    title: "Fechar o loop",
    subtitle: "Cliente sempre informado",
    desc: "Confirme o que foi feito ou dê um prazo claro.",
    color: "#22c55e",
    bg: "rgba(22,163,74,0.15)",
    border: "rgba(22,163,74,0.3)",
  },
  {
    id: 6,
    icon: "✅",
    title: "Fechar o ticket",
    subtitle: "Com descrição do que foi feito",
    desc: "Mude para 'Resolvido'. Nunca deixe ticket parado por +24h.",
    color: "#22c55e",
    bg: "rgba(22,163,74,0.15)",
    border: "rgba(22,163,74,0.3)",
  },
];

const tiposMap = [
  { tipo: "Dúvida simples", acao: "CS responde na hora", cor: "#22c55e", bg: "rgba(22,163,74,0.12)" },
  { tipo: "Solicitar documento", acao: "CS emite (até 30min) ou encaminha", cor: "#f5a623", bg: "rgba(245,166,35,0.12)" },
  { tipo: "Problema Fiscal/DP", acao: "Cria tarefa → encaminha setor", cor: "#fdba74", bg: "rgba(249,115,22,0.12)" },
  { tipo: "Reclamação grave", acao: "Gestor ANTES de responder", cor: "#f87171", bg: "rgba(220,38,38,0.12)" },
  { tipo: "Cancelamento", acao: "NUNCA confirma → gestor imediato", cor: "#d8b4fe", bg: "rgba(168,85,247,0.12)" },
];

export default function FluxoAtendimento() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [tab, setTab] = useState<"fluxo" | "tipos">("fluxo");

  return (
    <div className="rounded-2xl border p-5 space-y-4"
      style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>🔄 Fluxo de Atendimento CS</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>Clique em cada etapa para ver os detalhes</p>
        </div>
        <div className="flex gap-1">
          {(["fluxo", "tipos"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: tab === t ? "#f5a623" : "var(--soma-bg)",
                color: tab === t ? "#000" : "var(--soma-muted)",
                border: `1px solid ${tab === t ? "#f5a623" : "var(--soma-border)"}`,
              }}>
              {t === "fluxo" ? "Fluxo" : "Tipos"}
            </button>
          ))}
        </div>
      </div>

      {/* Fluxo */}
      {tab === "fluxo" && (
        <div className="space-y-1">
          {steps.map((step, idx) => (
            <div key={step.id}>
              <button className="w-full text-left transition-all duration-200"
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}>
                <div className="rounded-xl p-3 flex items-center gap-3 transition-all"
                  style={{
                    backgroundColor: activeStep === step.id ? step.bg : "var(--soma-bg)",
                    border: `1px solid ${activeStep === step.id ? step.border : "var(--soma-border)"}`,
                  }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ backgroundColor: step.bg, color: step.color, border: `1px solid ${step.border}` }}>
                    {step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: "var(--soma-text)" }}>
                        {step.icon} {step.title}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: step.bg, color: step.color }}>
                        {step.subtitle}
                      </span>
                    </div>
                    {activeStep === step.id && (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs leading-relaxed" style={{ color: "var(--soma-muted)" }}>{step.desc}</p>
                        {step.branches && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {step.branches.map(b => (
                              <div key={b.label} className="rounded-lg p-2.5 text-xs"
                                style={{ backgroundColor: b.bg, border: `1px solid ${b.color}33` }}>
                                <p className="font-bold mb-0.5" style={{ color: b.color }}>{b.label}</p>
                                <p style={{ color: b.color, opacity: 0.8 }}>{b.desc}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "var(--soma-muted)" }}>
                    {activeStep === step.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>
              {idx < steps.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown size={14} style={{ color: "var(--soma-muted)", opacity: 0.4 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tipos de demanda */}
      {tab === "tipos" && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>
            Tipo de demanda → Ação correta
          </p>
          {tiposMap.map(({ tipo, acao, cor, bg }) => (
            <div key={tipo} className="rounded-xl p-3 flex items-center gap-3"
              style={{ backgroundColor: bg, border: `1px solid ${cor}33` }}>
              <span className="font-bold text-xs w-36 shrink-0" style={{ color: cor }}>{tipo}</span>
              <span className="text-xs" style={{ color: cor, opacity: 0.85 }}>→ {acao}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}