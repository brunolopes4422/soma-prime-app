import { useState } from "react";
import { Users, Workflow, Wrench, FileCheck, HelpCircle, CheckCircle2, XCircle, ChevronDown, Search } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import Quiz from "../../components/ui/Quiz";
import { useChecklist } from "../../hooks/useChecklist";

function Steps({ items }: { items: { title: string; desc: string; tip?: string }[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const open = active === i;
        return (
          <button key={i} onClick={() => setActive(open ? null : i)} className="w-full text-left">
            <div className="rounded-xl border overflow-hidden transition-all duration-200"
              style={{ borderColor: open ? "#f5a623" : "var(--soma-border)", backgroundColor: open ? "rgba(245,166,35,0.05)" : "var(--soma-card)" }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ backgroundColor: open ? "#f5a623" : "var(--soma-bg)", color: open ? "#000" : "var(--soma-muted)" }}>{i + 1}</span>
                <span className="font-semibold text-sm flex-1" style={{ color: "var(--soma-text)" }}>{item.title}</span>
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "var(--soma-muted)" }} />
              </div>
              {open && (
                <div className="px-4 pb-4 pt-3 space-y-2 border-t" style={{ borderColor: "rgba(245,166,35,0.2)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>{item.desc}</p>
                  {item.tip && <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>💡 <strong>Dica:</strong> {item.tip}</div>}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CertoErrado({ items }: { items: { certo: string; errado: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map(({ certo, errado }, i) => (
        <div key={i} className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3 text-xs space-y-1" style={{ backgroundColor: "#16a34a", border: "1px solid #15803d" }}>
            <div className="flex items-center gap-1.5 font-bold text-white"><CheckCircle2 size={14} /> Certo</div>
            <p className="text-white/90 leading-relaxed">{certo}</p>
          </div>
          <div className="rounded-xl p-3 text-xs space-y-1" style={{ backgroundColor: "#dc2626", border: "1px solid #b91c1c" }}>
            <div className="flex items-center gap-1.5 font-bold text-white"><XCircle size={14} /> Errado</div>
            <p className="text-white/90 leading-relaxed">{errado}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabFluxo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VideoCard videoId="cs-fluxo-atendimento" title="Fluxo de Atendimento na Prática" description="Aprenda o passo a passo completo do atendimento." duration="12 min" instructor="CS Sênior" videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
          <VideoCard videoId="cs-gclick-tutorial" title="Como usar o GClick corretamente" description="Tutorial completo de abertura e gestão de tickets." duration="8 min" instructor="CS Sênior" comingSoon />
        </div>
      </div>
      <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
        📋 O fluxo de atendimento é o coração do CS. <strong style={{ color: "var(--soma-text)" }}>Nunca pule etapas.</strong>
      </div>
      <Steps items={[
        { title: "Receber o contato", desc: "Todo contato chega via WhatsApp (OneCode) ou ticket (GClick). Responda em até 15 minutos no horário comercial.", tip: "Mesmo sem resposta, avise que recebeu e está verificando." },
        { title: "Identificar a demanda", desc: "Classifique antes de responder: dúvida simples, documento, problema fiscal ou reclamação.", tip: "Na dúvida, pergunte mais antes de responder." },
        { title: "Abrir ticket no GClick", desc: "TODO atendimento vira ticket. Preencha: cliente, CNPJ, tipo de demanda, canal e descrição.", tip: "Abra o ticket enquanto ainda está na conversa." },
        { title: "Resolver ou encaminhar", desc: "CS resolve dúvidas simples. Fiscal, DP e reclamações graves vão para os responsáveis.", tip: "Ao encaminhar, avise o cliente imediatamente." },
        { title: "Retornar ao cliente", desc: "Sempre feche o loop. Confirme o que foi feito ou dê prazo se ainda estiver em andamento.", tip: "O cliente precisa saber que você resolveu." },
        { title: "Fechar o ticket", desc: "Após confirmação, mude para 'Resolvido' no GClick. Nunca deixe ticket parado por mais de 24h.", tip: "Sem retorno em 2 dias úteis, feche com 'Aguardou retorno'." },
      ]} />
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Abro o ticket imediatamente ao receber o contato.", errado: "Espero resolver para só então abrir o ticket." },
          { certo: "Informo ao cliente que encaminhei e dou um prazo.", errado: "Encaminho internamente e deixo o cliente sem resposta." },
          { certo: "Escalo reclamações graves ao gestor antes de responder.", errado: "Tento resolver sozinho para não incomodar o gestor." },
        ]} />
      </div>
      <Quiz guide="cs" tab="fluxo" title="🧠 Quiz — Fluxo de Atendimento" questions={[
        { q: "Um cliente manda mensagem às 19h. Quando você deve responder?", options: ["Respondo na hora", "Próximo dia útil até as 9h", "Ignoro", "Encaminho para o gestor"], correct: 1, explanation: "Fora do horário comercial, retorne no próximo dia útil até as 9h." },
        { q: "Você recebeu uma reclamação grave. Qual é o primeiro passo?", options: ["Pedir desculpas imediatamente", "Tentar resolver sozinho", "Registrar no GClick e informar o gestor antes de responder", "Encaminhar ao Fiscal"], correct: 2, explanation: "Reclamações graves sempre devem ser escaladas ao gestor ANTES de qualquer resposta." },
        { q: "Quando abrir o ticket no GClick?", options: ["Só depois de resolver", "Imediatamente ao receber o contato", "No final do dia", "Só se o cliente pedir"], correct: 1, explanation: "O ticket deve ser aberto imediatamente para garantir rastreabilidade." },
      ]} />
    </div>
  );
}

function TabFerramentas() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
        🛠️ Um analista que domina os sistemas trabalha o dobro no mesmo tempo.
      </div>
      {[
        { icon: "💬", title: "OneCode", subtitle: "Gestão do WhatsApp corporativo", badge: "Principal",
          body: <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Centraliza todos os WhatsApps em um painel único.</p>
            <Steps items={[
              { title: "Acesso", desc: "Login individual pelo navegador ou app. Nunca compartilhe seu acesso." },
              { title: "Etiquetas", desc: "Classifique conversas: 'Aguardando cliente', 'Em andamento', 'Escalado'." },
              { title: "Atalhos", desc: "Configure atalhos para scripts frequentes. Economiza tempo e mantém padrão." },
              { title: "Regra de ouro", desc: "Nunca arquive conversa sem ticket aberto no GClick." },
            ]} />
            <CertoErrado items={[{ certo: "Uso o OneCode para todos os contatos.", errado: "Uso meu WhatsApp pessoal porque é mais prático." }]} />
          </div>
        },
        { icon: "🎫", title: "GClick", subtitle: "Sistema de tickets e chamados", badge: "Principal",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Tudo que acontece precisa estar registrado aqui.</p>
            {[
              { status: "Aberto", desc: "Recebido, não iniciado", color: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.3)", text: "#93c5fd" },
              { status: "Em andamento", desc: "Sendo tratado", color: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.3)", text: "#fde047" },
              { status: "Aguardando cliente", desc: "Esperando resposta", color: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", text: "#fdba74" },
              { status: "Escalado", desc: "Encaminhado para outro setor", color: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", text: "#d8b4fe" },
              { status: "Resolvido", desc: "Concluído e confirmado", color: "rgba(22,163,74,0.15)", border: "rgba(22,163,74,0.3)", text: "#86efac" },
            ].map(({ status, desc, color, border, text }) => (
              <div key={status} className="flex items-center gap-3 p-2.5 rounded-lg text-xs" style={{ backgroundColor: color, border: `1px solid ${border}` }}>
                <span className="font-bold w-36 shrink-0" style={{ color: text }}>{status}</span>
                <span style={{ color: text, opacity: 0.8 }}>{desc}</span>
              </div>
            ))}
          </div>
        },
        { icon: "📁", title: "Gestor de Documentos", subtitle: "Repositório de arquivos dos clientes",
          body: <Steps items={[
            { title: "Estrutura", desc: "Pasta principal = CNPJ. Subpastas: Fiscal / DP / Financeiro / Contratos." },
            { title: "Nomenclatura", desc: "Padrão: CNPJ_NomeDocumento_MesAno.pdf", tip: "Facilita encontrar qualquer arquivo rapidamente." },
            { title: "Regra de ouro", desc: "Nunca salve documentos fora da pasta do cliente." },
          ]} />
        },
      ].map(({ icon, title, subtitle, badge, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle} badge={badge}>{body}</GuideCard>
      ))}
      <Quiz guide="cs" tab="ferramentas" title="🧠 Quiz — Ferramentas" questions={[
        { q: "Padrão correto para nomear arquivo?", options: ["NomeCliente_Documento.pdf", "12345678_DAS_Março2025.pdf", "DAS_março.pdf", "Documento_novo.pdf"], correct: 1, explanation: "O padrão é CNPJ_NomeDocumento_MesAno.pdf." },
        { q: "Ticket ficou 2 dias sem atualização. O que deveria ter acontecido?", options: ["Nada, pode ficar parado", "Atualizado a cada 24h", "Fechado automaticamente", "Só atualiza ao resolver"], correct: 1, explanation: "Todo ticket aberto precisa de atualização a cada 24h." },
      ]} />
    </div>
  );
}

function TabScripts() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };
  const scripts = [
    { key: "primeiro", icon: "👋", title: "Primeiro contato", quando: "Use ao iniciar qualquer atendimento.", texto: "Olá, [Nome do cliente]! 😊\nAqui é [Seu nome], da Soma Prime.\nComo posso te ajudar hoje?" },
    { key: "andamento", icon: "⏳", title: "Solicitação em andamento", quando: "Quando a demanda precisa de prazo.", texto: "Olá, [Nome]! Recebemos sua solicitação e já estamos tratando.\nPrazo previsto: [data/horário].\nAssim que tiver novidade, te aviso por aqui. 👍" },
    { key: "resolvido", icon: "✅", title: "Resolução concluída", quando: "Feche todo atendimento com esse script.", texto: "Olá, [Nome]! Sua solicitação foi concluída. ✅\n[Descreva o que foi feito]\nQualquer dúvida, é só chamar. Tenha um ótimo dia! 😊" },
    { key: "encaminhar", icon: "📞", title: "Encaminhar para outro setor", quando: "Quando a demanda não é do CS.", texto: "Olá, [Nome]! Entendi sua solicitação.\nVou encaminhar para o nosso time de [Fiscal/DP/Financeiro].\nEm breve entrarão em contato. 😊" },
    { key: "desculpas", icon: "😔", title: "Pedido de desculpas", quando: "Quando houve erro ou atraso.", texto: "Olá, [Nome]. Pedimos desculpas pelo transtorno. 🙏\nJá estamos priorizando sua solicitação.\nRetornaremos em até [prazo]. Obrigado pela compreensão." },
    { key: "ausencia", icon: "🌙", title: "Mensagem de ausência", quando: "Configure no OneCode para fora do horário.", texto: "Olá! 😊 Nosso atendimento é de segunda a sexta, das 8h às 18h.\nRetornaremos no próximo dia útil. Obrigado!" },
  ];
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
        💬 Scripts são guias, não engessamentos. Adapte o tom conforme o cliente.
      </div>
      {scripts.map(({ key, icon, title, texto, quando }) => (
        <div key={key} className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{title}</span>
          </div>
          <p className="text-xs italic" style={{ color: "var(--soma-muted)" }}>{quando}</p>
          <div className="rounded-lg p-4 text-sm font-mono leading-relaxed whitespace-pre-line"
            style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>{texto}</div>
          <button onClick={() => copy(texto, key)}
            className="w-full py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{ backgroundColor: copied === key ? "rgba(22,163,74,0.2)" : "rgba(245,166,35,0.1)", color: copied === key ? "#4ade80" : "#f5a623", border: `1px solid ${copied === key ? "rgba(22,163,74,0.3)" : "rgba(245,166,35,0.2)"}` }}>
            {copied === key ? "✅ Copiado!" : "📋 Copiar script"}
          </button>
        </div>
      ))}
      <Quiz guide="cs" tab="scripts" title="🧠 Quiz — Scripts" questions={[
        { q: "Cliente reclamou às 20h. Qual script usar?", options: ["Pedido de desculpas", "Mensagem de ausência", "Solicitação em andamento", "Primeiro contato"], correct: 1, explanation: "Mensagem de ausência é para resposta automática fora do horário." },
        { q: "Você resolveu o problema. Próximo passo?", options: ["Arquivar conversa", "Fechar ticket no GClick como Resolvido", "Aguardar 5 dias", "Encaminhar ao gestor"], correct: 1, explanation: "Após retorno ao cliente, feche o ticket no GClick." },
      ]} />
    </div>
  );
}

function TabChecklist() {
  const { checked, toggle, loading } = useChecklist("cs");
  const groups = [
    { group: "🖥️ Acesso aos sistemas", items: ["acesso-onecode", "acesso-gclick", "acesso-gestor-docs", "acesso-email", "acesso-workspace"], labels: ["Login no OneCode configurado e testado", "Login no GClick configurado e testado", "Acesso ao Gestor de Documentos liberado", "E-mail corporativo ativo", "Acesso ao Google Workspace"] },
    { group: "📚 Treinamentos", items: ["treino-video", "treino-politica", "treino-simulacao", "treino-senior", "treino-quizzes"], labels: ["Assistiu vídeo de boas-vindas", "Leu a política de atendimento", "Simulou 3 atendimentos com supervisor", "Tirou dúvidas com CS Sênior", "Completou os quizzes deste guia"] },
    { group: "👥 Conhecimento da carteira", items: ["carteira-lista", "carteira-servicos", "carteira-prazos", "carteira-contatos"], labels: ["Leu lista de clientes da carteira", "Entendeu serviços de cada cliente", "Conhece prazos críticos do mês", "Sabe contatos principais de cada cliente"] },
    { group: "✅ Primeiro dia", items: ["dia1-apresentacao", "dia1-acompanhou", "dia1-primeiro-atendimento"], labels: ["Apresentou-se para a equipe", "Acompanhou atendimento com supervisor", "Fez primeiro atendimento supervisionado"] },
  ];
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done  = groups.reduce((a, g) => a + g.items.filter(id => checked[id]).length, 0);
  const pct   = Math.round((done / total) * 100);

  if (loading) return <div className="flex items-center justify-center py-12"><span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando progresso...</span></div>;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border p-4 space-y-2" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
        <div className="flex justify-between text-sm font-semibold">
          <span style={{ color: "var(--soma-text)" }}>Progresso do onboarding</span>
          <span style={{ color: "#f5a623" }}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: "#f5a623" }} />
        </div>
        <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{done} de {total} itens</p>
      </div>
      {groups.map(({ group, items, labels }) => (
        <div key={group} className="rounded-xl border p-5" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <h3 className="font-semibold text-sm mb-3" style={{ color: "#f5a623" }}>{group}</h3>
          <ul className="space-y-2.5">
            {items.map((id, idx) => (
              <li key={id} onClick={() => toggle(id)} className="flex items-center gap-3 text-sm cursor-pointer group">
                <span className="w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all"
                  style={{ backgroundColor: checked[id] ? "#f5a623" : "var(--soma-bg)", borderColor: checked[id] ? "#f5a623" : "var(--soma-border)" }}>
                  {checked[id] && <CheckCircle2 size={12} color="#000" />}
                </span>
                <span style={{ color: checked[id] ? "var(--soma-muted)" : "var(--soma-text)", textDecoration: checked[id] ? "line-through" : "none" }}>{labels[idx]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {pct === 100 && (
        <div className="rounded-xl p-4 text-center text-sm font-semibold" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>
          🎉 Parabéns! Onboarding do CS concluído!
        </div>
      )}
    </div>
  );
}

function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "O cliente não responde, o que faço?", a: "Aguarde 2 dias úteis e tente novo contato. Sem resposta, registre como 'Aguardando cliente' e informe o gestor. Após 5 dias, pode fechar." },
    { q: "Recebi uma reclamação grave, como procedo?", a: "Não tente resolver sozinho. Registre no GClick, informe o gestor e aguarde orientação antes de responder." },
    { q: "O cliente pediu cancelamento, o que faço?", a: "Nunca confirme ou negue. Escale ao gestor imediatamente e registre como 'Cancelamento - aguardando gestor'." },
    { q: "Não sei responder a dúvida do cliente, o que faço?", a: "Informe que vai verificar e retorna em breve. Nunca invente respostas. Consulte o setor responsável antes." },
    { q: "Posso usar meu WhatsApp pessoal?", a: "Nunca. Toda comunicação deve ser pelo OneCode. Uso pessoal é falta grave." },
    { q: "Como priorizo quando estou sobrecarregado?", a: "1) Reclamações/cancelamentos, 2) Vencimentos do dia, 3) Demandas fiscais urgentes, 4) Dúvidas simples." },
    { q: "O que faço se o sistema cair?", a: "Registre manualmente, informe TI e gestor. Continue pelo WhatsApp e lance os tickets quando o sistema voltar." },
  ];
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--soma-muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar dúvida..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors"
          style={{ backgroundColor: "var(--soma-card)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
      </div>
      {filtered.length === 0 && <p className="text-center text-sm py-8" style={{ color: "var(--soma-muted)" }}>Nenhuma dúvida encontrada.</p>}
      {filtered.map(({ q, a }, i) => (
        <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full text-left">
          <div className="rounded-xl border overflow-hidden transition-all"
            style={{ borderColor: open === i ? "#f5a623" : "var(--soma-border)", backgroundColor: open === i ? "rgba(245,166,35,0.05)" : "var(--soma-card)" }}>
            <div className="flex items-start gap-3 px-4 py-3">
              <span className="font-bold text-sm shrink-0" style={{ color: "#f5a623" }}>?</span>
              <span className="font-semibold text-sm flex-1" style={{ color: "var(--soma-text)" }}>{q}</span>
              <ChevronDown size={16} className={`shrink-0 mt-0.5 transition-transform ${open === i ? "rotate-180" : ""}`} style={{ color: "var(--soma-muted)" }} />
            </div>
            {open === i && (
              <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor: "rgba(245,166,35,0.2)" }}>
                <p className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>{a}</p>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default function GuideCS() {
  return (
    <GuideLayout
      title="CS / Atendimento"
      subtitle="Guia operacional do setor de Customer Success"
      icon={Users}
      tabs={[
        { key: "fluxo",       label: "Fluxo",      icon: Workflow,   content: <TabFluxo /> },
        { key: "ferramentas", label: "Ferramentas", icon: Wrench,     content: <TabFerramentas /> },
        { key: "scripts",     label: "Scripts",     icon: FileCheck,  content: <TabScripts /> },
        { key: "checklist",   label: "Checklist",   icon: FileCheck,  content: <TabChecklist /> },
        { key: "faq",         label: "FAQ",         icon: HelpCircle, content: <TabFAQ /> },
      ]}
    />
  );
}