import { useState } from "react";
import { Users, Workflow, Wrench, FileCheck, HelpCircle, CheckCircle2, XCircle, ChevronDown, Search } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import { useChecklist } from "../../hooks/useChecklist";
import { useQuiz } from "../../hooks/useQuiz";

function Steps({ items }: { items: { title: string; desc: string; tip?: string }[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const open = active === i;
        return (
          <button key={i} onClick={() => setActive(open ? null : i)} className="w-full text-left">
            <div className={`rounded-xl border transition-all duration-200 overflow-hidden
              ${open ? "border-gold-light bg-gold-light/5" : "border-ph-border bg-ph-card hover:border-gold-light/40"}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${open ? "bg-gold-light text-white" : "bg-ph-bg text-ph-text/50"}`}>{i + 1}</span>
                <span className="font-semibold text-sm flex-1 text-ph-text">{item.title}</span>
                <ChevronDown size={16} className={`text-ph-text/40 transition-transform ${open ? "rotate-180" : ""}`} />
              </div>
              {open && (
                <div className="px-4 pb-4 space-y-2 border-t border-gold-light/20 pt-3">
                  <p className="text-sm text-ph-text/70 leading-relaxed">{item.desc}</p>
                  {item.tip && <div className="bg-gold-light/5 border border-gold-light/20 rounded-lg px-3 py-2 text-xs text-gold-light">💡 <strong>Dica:</strong> {item.tip}</div>}
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
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-green-400"><CheckCircle2 size={14} /> Certo</div>
            <p className="text-green-300/80 leading-relaxed">{certo}</p>
          </div>
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-400"><XCircle size={14} /> Errado</div>
            <p className="text-red-300/80 leading-relaxed">{errado}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Quiz({ questions, guide, tab }: {
  questions: { q: string; options: string[]; correct: number; explanation: string }[];
  guide: string; tab: string;
}) {
  const { answers, showResult, answer, submit, reset } = useQuiz(guide, tab);
  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  return (
    <div className="space-y-4">
      {questions.map((q, qi) => (
        <div key={qi} className="card-base border border-ph-border bg-ph-card space-y-3">
          <p className="font-semibold text-sm text-ph-text">{qi + 1}. {q.q}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = q.correct === oi;
              let cls = "border-ph-border bg-ph-bg text-ph-text/70";
              if (showResult && isCorrect) cls = "border-green-500/50 bg-green-900/20 text-green-300 font-semibold";
              else if (showResult && selected && !isCorrect) cls = "border-red-500/50 bg-red-900/20 text-red-300 line-through";
              else if (selected) cls = "border-gold-light bg-gold-light/10 text-gold-light font-semibold";
              return (
                <button key={oi} disabled={showResult} onClick={() => answer(qi, oi)}
                  className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {showResult && <p className="text-xs bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-300">💬 {q.explanation}</p>}
        </div>
      ))}
      {!showResult ? (
        <button onClick={() => submit(questions)} disabled={Object.keys(answers).length < questions.length}
          className="w-full py-2.5 rounded-xl bg-gold-light text-white font-semibold text-sm disabled:opacity-40 hover:bg-gold transition-colors">
          Verificar respostas
        </button>
      ) : (
        <div className={`rounded-xl p-4 text-center border font-semibold text-sm
          ${score === questions.length ? "bg-green-900/20 border-green-500/30 text-green-300"
            : score >= questions.length / 2 ? "bg-yellow-900/20 border-yellow-500/30 text-yellow-300"
            : "bg-red-900/20 border-red-500/30 text-red-300"}`}>
          {score === questions.length ? "🏆 Perfeito!" : score >= questions.length / 2 ? "👍 Bom!" : "📚 Revise o conteúdo!"}&nbsp;
          {score}/{questions.length} corretas
          <button onClick={reset} className="block mx-auto mt-2 text-xs underline opacity-60">Tentar novamente</button>
        </div>
      )}
    </div>
  );
}

function TabFluxo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-sm mb-3 text-ph-text">🎬 Aulas em vídeo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VideoCard videoId="cs-fluxo-atendimento" title="Fluxo de Atendimento na Prática" description="Aprenda o passo a passo completo do atendimento ao cliente do início ao fim." duration="12 min" instructor="CS Sênior" videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
          <VideoCard videoId="cs-gclick-tutorial" title="Como usar o GClick corretamente" description="Tutorial completo de abertura e gestão de tickets no GClick." duration="8 min" instructor="CS Sênior" comingSoon />
        </div>
      </div>
      <div className="bg-gold-light/5 border border-gold-light/20 rounded-xl p-4 text-sm text-ph-text/70 leading-relaxed">
        📋 O fluxo de atendimento é o coração do CS. Seguir a ordem correta garante qualidade, rastreabilidade e satisfação do cliente. <strong className="text-ph-text">Nunca pule etapas.</strong>
      </div>
      <Steps items={[
        { title: "Receber o contato", desc: "Todo contato chega via WhatsApp (OneCode) ou ticket (GClick). Responda em até 15 minutos no horário comercial. Após 18h, retorne no próximo dia útil até as 9h.", tip: "Mesmo que não tenha a resposta ainda, avise que recebeu e está verificando." },
        { title: "Identificar a demanda", desc: "Antes de responder, classifique: é dúvida simples? Documento? Problema fiscal? Reclamação? Cada tipo tem um caminho diferente.", tip: "Na dúvida, pergunte mais antes de responder." },
        { title: "Abrir ticket no GClick", desc: "TODO atendimento vira ticket, sem exceção. Preencha: cliente, CNPJ, tipo de demanda, canal de entrada e descrição detalhada.", tip: "Abra o ticket enquanto ainda está na conversa." },
        { title: "Resolver ou encaminhar", desc: "O CS resolve dúvidas simples, status de processos e envio de documentos prontos. Problemas fiscais vão para o Fiscal, questões de folha para o DP.", tip: "Ao encaminhar, já avise o cliente." },
        { title: "Retornar ao cliente", desc: "Sempre feche o loop. Confirme o que foi feito, dê prazo se ainda estiver em andamento.", tip: "O cliente precisa saber que você resolveu." },
        { title: "Fechar o ticket", desc: "Após confirmação do cliente, mude o status para 'Resolvido' no GClick. Nunca deixe ticket parado sem atualização por mais de 24h.", tip: "Se o cliente não responder em 2 dias úteis, feche com a observação 'Aguardou retorno'." },
      ]} />
      <div>
        <h3 className="font-bold text-sm mb-3 text-ph-text">✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Abro o ticket imediatamente ao receber o contato, mesmo sem ter a resposta ainda.", errado: "Espero resolver o problema para só então abrir o ticket." },
          { certo: "Informo ao cliente que encaminhei para o setor responsável e dou um prazo.", errado: "Encaminho internamente e deixo o cliente sem resposta esperando." },
          { certo: "Escalo reclamações graves para o gestor antes de responder ao cliente.", errado: "Tento resolver a reclamação sozinho para não incomodar o gestor." },
        ]} />
      </div>
      <div>
        <h3 className="font-bold text-sm mb-3 text-ph-text">🧠 Quiz — Fluxo de Atendimento</h3>
        <Quiz guide="cs" tab="fluxo" questions={[
          { q: "Um cliente manda mensagem às 19h. Quando você deve responder?", options: ["Respondo na hora", "Respondo no próximo dia útil até as 9h", "Ignoro", "Encaminho para o gestor"], correct: 1, explanation: "Fora do horário comercial, o retorno deve ser no próximo dia útil até as 9h." },
          { q: "Você recebeu uma reclamação grave. Qual é o primeiro passo?", options: ["Responder pedindo desculpas", "Tentar resolver sozinho", "Registrar no GClick e informar o gestor antes de responder", "Encaminhar para o Fiscal"], correct: 2, explanation: "Reclamações graves sempre devem ser escaladas ao gestor ANTES de qualquer resposta." },
          { q: "Quando você deve abrir o ticket no GClick?", options: ["Só depois de resolver", "Imediatamente ao receber o contato", "No final do dia", "Só se o cliente pedir"], correct: 1, explanation: "O ticket deve ser aberto imediatamente para garantir rastreabilidade." },
        ]} />
      </div>
    </div>
  );
}

function TabFerramentas() {
  return (
    <div className="space-y-6">
      <div className="bg-gold-light/5 border border-gold-light/20 rounded-xl p-4 text-sm text-ph-text/70">
        🛠️ Conhecer bem as ferramentas é fundamental. Um analista que domina os sistemas trabalha o dobro no mesmo tempo.
      </div>
      {[
        {
          icon: "💬", title: "OneCode", subtitle: "Gestão do WhatsApp corporativo", badge: "Principal",
          body: (
            <div className="space-y-4">
              <p className="text-sm text-ph-text/70">O OneCode centraliza todos os WhatsApps dos clientes em um painel único.</p>
              <Steps items={[
                { title: "Acesso", desc: "Entre pelo navegador ou app desktop com seu login individual. Nunca compartilhe seu acesso." },
                { title: "Etiquetas", desc: "Use etiquetas para classificar conversas: 'Aguardando cliente', 'Em andamento', 'Escalado'." },
                { title: "Atalhos de mensagem", desc: "Configure atalhos para os scripts mais usados. Economiza tempo e mantém o padrão." },
                { title: "Regra de ouro", desc: "Nunca arquive uma conversa sem o ticket correspondente no GClick estar aberto." },
              ]} />
              <CertoErrado items={[{ certo: "Uso o OneCode para todos os contatos com clientes.", errado: "Uso meu WhatsApp pessoal porque é mais prático." }]} />
            </div>
          )
        },
        {
          icon: "🎫", title: "GClick", subtitle: "Sistema de tickets e chamados", badge: "Principal",
          body: (
            <div className="space-y-4">
              <p className="text-sm text-ph-text/70">O GClick é a memória do CS — tudo que acontece precisa estar registrado aqui.</p>
              <div className="space-y-2">
                {[
                  { status: "Aberto", desc: "Recebido, ainda não iniciado", color: "bg-blue-900/20 text-blue-300 border-blue-500/30" },
                  { status: "Em andamento", desc: "Sendo tratado ativamente", color: "bg-yellow-900/20 text-yellow-300 border-yellow-500/30" },
                  { status: "Aguardando cliente", desc: "Retornamos, esperando resposta", color: "bg-orange-900/20 text-orange-300 border-orange-500/30" },
                  { status: "Escalado", desc: "Encaminhado para outro setor", color: "bg-purple-900/20 text-purple-300 border-purple-500/30" },
                  { status: "Resolvido", desc: "Concluído e confirmado", color: "bg-green-900/20 text-green-300 border-green-500/30" },
                ].map(({ status, desc, color }) => (
                  <div key={status} className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs ${color}`}>
                    <span className="font-bold w-32 shrink-0">{status}</span>
                    <span className="opacity-70">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        {
          icon: "📁", title: "Gestor de Documentos", subtitle: "Repositório de arquivos dos clientes",
          body: (
            <div className="space-y-4">
              <Steps items={[
                { title: "Estrutura de pastas", desc: "Pasta principal = CNPJ do cliente. Subpastas: Fiscal / DP / Financeiro / Contratos." },
                { title: "Nomenclatura de arquivos", desc: "Padrão: CNPJ_NomeDocumento_MesAno.pdf", tip: "Seguir o padrão permite que qualquer pessoa encontre o arquivo rapidamente." },
                { title: "Regra de ouro", desc: "Nunca salve documentos fora da pasta do cliente." },
              ]} />
            </div>
          )
        },
      ].map(({ icon, title, subtitle, badge, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle} badge={badge}>{body}</GuideCard>
      ))}
      <div>
        <h3 className="font-bold text-sm mb-3 text-ph-text">🧠 Quiz — Ferramentas</h3>
        <Quiz guide="cs" tab="ferramentas" questions={[
          { q: "Qual é o padrão correto para nomear um arquivo?", options: ["NomeCliente_Documento.pdf", "12345678_DAS_Março2025.pdf", "DAS_março.pdf", "Documento_novo.pdf"], correct: 1, explanation: "O padrão é CNPJ_NomeDocumento_MesAno.pdf." },
          { q: "Um ticket ficou 2 dias sem atualização. O que deveria ter acontecido?", options: ["Nada, tickets podem ficar parados", "Deveria ter sido atualizado a cada 24h", "Fechado automaticamente", "Só atualiza quando resolver"], correct: 1, explanation: "Todo ticket aberto precisa de atualização a cada 24h." },
        ]} />
      </div>
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
    { key: "resolvido", icon: "✅", title: "Resolução concluída", quando: "Feche todo atendimento com esse script.", texto: "Olá, [Nome]! Sua solicitação foi concluída. ✅\n[Descreva brevemente o que foi feito]\nQualquer dúvida, é só chamar. Tenha um ótimo dia! 😊" },
    { key: "encaminhar", icon: "📞", title: "Encaminhar para outro setor", quando: "Quando a demanda não é do CS.", texto: "Olá, [Nome]! Entendi sua solicitação.\nVou encaminhar para o nosso time de [Fiscal/DP/Financeiro]\nque é o responsável por esse tipo de demanda.\nEm breve entrarão em contato. 😊" },
    { key: "desculpas", icon: "😔", title: "Pedido de desculpas", quando: "Quando houve erro ou atraso da nossa parte.", texto: "Olá, [Nome]. Pedimos desculpas pelo transtorno. 🙏\nEntendemos a importância disso para você e\njá estamos priorizando sua solicitação.\nRetornaremos em até [prazo]. Obrigado pela compreensão." },
    { key: "ausencia", icon: "🌙", title: "Mensagem de ausência", quando: "Configure no OneCode para resposta automática fora do horário.", texto: "Olá! 😊 Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.\nRetornaremos sua mensagem no próximo dia útil. Obrigado!" },
  ];
  return (
    <div className="space-y-4">
      <div className="bg-gold-light/5 border border-gold-light/20 rounded-xl p-4 text-sm text-ph-text/70">
        💬 Scripts são guias, não engessamentos. Adapte o tom conforme o cliente, mas mantenha a estrutura.
      </div>
      {scripts.map(({ key, icon, title, texto, quando }) => (
        <div key={key} className="card-base border border-ph-border bg-ph-card space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold text-sm text-ph-text">{title}</span>
          </div>
          <p className="text-xs text-ph-text/50 italic">{quando}</p>
          <div className="bg-ph-bg rounded-lg p-4 text-sm border border-ph-border font-mono leading-relaxed whitespace-pre-line text-ph-text/80">{texto}</div>
          <button onClick={() => copy(texto, key)}
            className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors
              ${copied === key ? "bg-green-900/30 text-green-400 border border-green-500/30" : "bg-gold-light/10 text-gold-light border border-gold-light/20 hover:bg-gold-light/20"}`}>
            {copied === key ? "✅ Copiado!" : "📋 Copiar script"}
          </button>
        </div>
      ))}
      <div>
        <h3 className="font-bold text-sm mb-3 text-ph-text">🧠 Quiz — Scripts</h3>
        <Quiz guide="cs" tab="scripts" questions={[
          { q: "O cliente mandou reclamação às 20h. Qual script usar?", options: ["Pedido de desculpas", "Mensagem de ausência", "Solicitação em andamento", "Primeiro contato"], correct: 1, explanation: "A mensagem de ausência é para resposta automática fora do horário." },
          { q: "Você resolveu o problema. Qual o próximo passo?", options: ["Arquivar conversa", "Fechar o ticket no GClick como Resolvido", "Aguardar 5 dias", "Encaminhar para o gestor"], correct: 1, explanation: "Após o retorno ao cliente, o ticket deve ser fechado no GClick." },
        ]} />
      </div>
    </div>
  );
}

function TabChecklist() {
  const { checked, toggle, loading } = useChecklist("cs");
  const groups = [
    { group: "🖥️ Acesso aos sistemas", items: ["acesso-onecode", "acesso-gclick", "acesso-gestor-docs", "acesso-email", "acesso-workspace"], labels: ["Login no OneCode configurado e testado", "Login no GClick configurado e testado", "Acesso ao Gestor de Documentos liberado", "E-mail corporativo ativo e funcionando", "Acesso ao Google Workspace"] },
    { group: "📚 Treinamentos obrigatórios", items: ["treino-video", "treino-politica", "treino-simulacao", "treino-senior", "treino-quizzes"], labels: ["Assistiu vídeo de boas-vindas da empresa", "Leu a política de atendimento completa", "Simulou 3 atendimentos com supervisor", "Tirou dúvidas com CS Sênior da equipe", "Completou os quizzes deste guia"] },
    { group: "👥 Conhecimento da carteira", items: ["carteira-lista", "carteira-servicos", "carteira-prazos", "carteira-contatos"], labels: ["Leu a lista completa de clientes da carteira", "Entendeu os serviços contratados por cada cliente", "Conhece os prazos críticos do mês atual", "Sabe quem são os contatos principais"] },
    { group: "✅ Primeiro dia", items: ["dia1-apresentacao", "dia1-acompanhou", "dia1-primeiro-atendimento"], labels: ["Apresentou-se para a equipe", "Acompanhou um atendimento real com o supervisor", "Fez seu primeiro atendimento supervisionado"] },
  ];
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done  = groups.reduce((a, g) => a + g.items.filter(id => checked[id]).length, 0);
  const pct   = Math.round((done / total) * 100);

  if (loading) return <div className="flex items-center justify-center py-12"><span className="text-gold-light animate-pulse text-sm">Carregando progresso...</span></div>;

  return (
    <div className="space-y-5">
      <div className="card-base border border-ph-border bg-ph-card space-y-2">
        <div className="flex justify-between text-sm font-semibold text-ph-text">
          <span>Progresso do onboarding</span>
          <span className="text-gold-light">{pct}%</span>
        </div>
        <div className="h-2.5 bg-ph-bg rounded-full overflow-hidden">
          <div className="h-full bg-gold-light rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-ph-text/50">{done} de {total} itens concluídos</p>
      </div>
      {groups.map(({ group, items, labels }) => (
        <div key={group} className="card-base border border-ph-border bg-ph-card">
          <h3 className="font-semibold text-sm mb-3 text-gold-light">{group}</h3>
          <ul className="space-y-2.5">
            {items.map((id, idx) => (
              <li key={id} onClick={() => toggle(id)} className="flex items-center gap-3 text-sm cursor-pointer group">
                <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all
                  ${checked[id] ? "bg-gold-light border-gold-light" : "border-ph-border bg-ph-bg group-hover:border-gold-light/50"}`}>
                  {checked[id] && <CheckCircle2 size={12} className="text-white" />}
                </span>
                <span className={checked[id] ? "line-through text-ph-text/40" : "text-ph-text/80"}>{labels[idx]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {pct === 100 && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 text-center text-green-300 font-semibold text-sm">
          🎉 Parabéns! Onboarding do CS concluído com sucesso!
        </div>
      )}
    </div>
  );
}

function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "O cliente não responde, o que faço?", a: "Aguarde 2 dias úteis e tente um segundo contato. Se não houver resposta, registre no ticket como 'Aguardando cliente' e informe o gestor." },
    { q: "Recebi uma reclamação grave, como procedo?", a: "Não tente resolver sozinho. Registre tudo no GClick imediatamente, informe o gestor e aguarde orientação antes de responder." },
    { q: "O cliente pediu cancelamento, o que faço?", a: "Nunca confirme ou negue o cancelamento. Escale imediatamente para o gestor e registre o ticket como 'Cancelamento - aguardando gestor'." },
    { q: "Não sei responder a dúvida do cliente, o que faço?", a: "Informe ao cliente que vai verificar e retorna em breve. Nunca invente ou suponha respostas." },
    { q: "Posso usar meu WhatsApp pessoal para falar com clientes?", a: "Nunca. Toda comunicação deve ser pelo OneCode, sem exceções. O uso de número pessoal é considerado falta grave." },
    { q: "Como priorizo atendimentos quando estou sobrecarregado?", a: "Priorize: 1) Reclamações e cancelamentos, 2) Vencimentos do dia, 3) Demandas fiscais urgentes, 4) Dúvidas simples." },
    { q: "O que faço se o sistema estiver fora do ar?", a: "Registre manualmente em planilha de contingência, informe o TI e o gestor. Continue atendendo pelo WhatsApp." },
  ];
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ph-text/40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar dúvida..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-ph-border bg-ph-card text-ph-text text-sm focus:outline-none focus:border-gold-light transition-colors placeholder:text-ph-text/30" />
      </div>
      {filtered.length === 0 && <p className="text-center text-sm text-ph-text/40 py-8">Nenhuma dúvida encontrada.</p>}
      {filtered.map(({ q, a }, i) => (
        <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full text-left">
          <div className={`rounded-xl border transition-all overflow-hidden
            ${open === i ? "border-gold-light bg-gold-light/5" : "border-ph-border bg-ph-card hover:border-gold-light/40"}`}>
            <div className="flex items-start gap-3 px-4 py-3">
              <span className="text-gold-light font-bold text-sm shrink-0">?</span>
              <span className="font-semibold text-sm flex-1 text-left text-ph-text">{q}</span>
              <ChevronDown size={16} className={`text-ph-text/40 shrink-0 mt-0.5 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </div>
            {open === i && (
              <div className="px-4 pb-4 pt-2 border-t border-gold-light/20">
                <p className="text-sm text-ph-text/70 leading-relaxed">{a}</p>
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