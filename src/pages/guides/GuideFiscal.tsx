import { useState } from "react";
import { FileText, Workflow, Calendar, ClipboardList, HelpCircle, CheckCircle2, ChevronDown, Search, XCircle } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import Quiz from "../../components/ui/Quiz";
import Steps from "../../components/ui/Steps";
import { useChecklist } from "../../hooks/useChecklist";
import { useGuideVideos } from "../../hooks/useGuideVideos";

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

function TabRotina() {
  const { videos } = useGuideVideos("fiscal", "rotina");
  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map(v => (
              <VideoCard key={v.id} videoId={v.id} title={v.title}
                description={v.description ?? undefined}
                duration={v.duration ?? undefined}
                videoUrl={v.video_url ?? undefined} />
            ))}
          </div>
        </div>
      )}
      <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
        📋 A rotina fiscal exige atenção constante aos prazos. Um único atraso pode gerar multa para o cliente. <strong style={{ color: "var(--soma-text)" }}>Consulte o calendário fiscal todos os dias.</strong>
      </div>
      <Steps items={[
        { title: "Abrir o calendário fiscal do dia", desc: "Antes de qualquer outra tarefa, verifique quais obrigações vencem hoje ou nos próximos 3 dias.", tip: "Crie o hábito de checar o calendário logo ao abrir o computador." },
        { title: "Verificar pendências do dia anterior", desc: "Cheque se ficou alguma obrigação em aberto. Obrigações não concluídas viram prioridade máxima.", tip: "Nunca confie só na memória." },
        { title: "Processar documentos recebidos", desc: "Notas fiscais, extratos e guias devem ser processados no dia do recebimento.", tip: "Organize os documentos por cliente assim que chegarem." },
        { title: "Lançar e conferir obrigações", desc: "Lance no sistema, confira os valores, gere a guia e salve no Gestor de Documentos.", tip: "Faça dupla verificação antes de gerar a guia definitiva." },
        { title: "Comunicar o cliente", desc: "Encaminhe ao cliente pelo CS com prazo de pagamento e instruções claras.", tip: "Nunca envie guia sem prazo de vencimento destacado." },
        { title: "Registrar no sistema", desc: "Marque a obrigação como concluída. Obrigação sem registro = obrigação perdida.", tip: "O registro é a prova do seu trabalho." },
      ]} />
      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Verifico o calendário fiscal toda manhã antes de começar.", errado: "Confio na memória para lembrar os vencimentos do dia." },
          { certo: "Processo documentos no mesmo dia que chegam.", errado: "Acumulo documentos para processar no final da semana." },
          { certo: "Registro toda obrigação concluída imediatamente.", errado: "Deixo para registrar depois, quando der tempo." },
        ]} />
      </div>
      <Quiz guide="fiscal" tab="rotina" title="🧠 Quiz — Rotina Fiscal" questions={[
        { q: "Qual deve ser o primeiro passo ao iniciar o dia no setor fiscal?", options: ["Responder e-mails", "Verificar o calendário fiscal", "Processar notas fiscais", "Reunião com a equipe"], correct: 1, explanation: "O calendário fiscal deve ser consultado antes de qualquer outra tarefa." },
        { q: "Um documento chegou hoje mas você está ocupado. Quando processar?", options: ["No mesmo dia", "Em até 3 dias", "Na semana seguinte", "Quando o cliente cobrar"], correct: 0, explanation: "Documentos devem ser processados no dia do recebimento." },
        { q: "Você gerou uma guia de DAS. Qual é o próximo passo?", options: ["Guardar no computador", "Salvar no Gestor e comunicar o cliente", "Aguardar o cliente pedir", "Enviar por WhatsApp pessoal"], correct: 1, explanation: "Salve no Gestor de Documentos e comunique o cliente com prazo destacado." },
      ]} />
    </div>
  );
}

function TabObrigacoes() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
        📑 Cada regime tributário tem suas próprias obrigações. Conhecer cada uma é fundamental para não perder prazos.
      </div>
      {[
        { icon: "🟢", title: "Simples Nacional", subtitle: "MEI, ME e EPP optantes pelo Simples",
          body: <div className="space-y-2">
            {[
              { obrigacao: "DAS — Documento de Arrecadação do Simples", prazo: "Até dia 20 do mês seguinte", desc: "Guia unificada que reúne todos os impostos do Simples Nacional.", tip: "Verifique sublimite de ICMS e ISS no estado antes de calcular." },
              { obrigacao: "DEFIS — Declaração de Informações Socioeconômicas e Fiscais", prazo: "Até 31 de março do ano seguinte", desc: "Declaração anual obrigatória para todas as empresas do Simples Nacional.", tip: "Inicie a DEFIS em fevereiro." },
              { obrigacao: "PGDAS-D — Programa Gerador do DAS", prazo: "Mensal — até dia 20", desc: "Cálculo mensal das receitas brutas por faixa de alíquota.", tip: "Confira a classificação correta das receitas antes de apurar." },
            ].map(({ obrigacao, prazo, desc, tip }) => (
              <GuideCard key={obrigacao} icon="📄" title={obrigacao} subtitle={prazo}>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{desc}</p>
                  {tip && <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>💡 {tip}</div>}
                </div>
              </GuideCard>
            ))}
          </div>
        },
        { icon: "🟡", title: "Lucro Presumido", subtitle: "Empresas com receita até R$ 78 milhões",
          body: <div className="space-y-2">
            {[
              { obrigacao: "DARF — IRPJ e CSLL", prazo: "Trimestral", desc: "Recolhimento trimestral do IRPJ (15% + adicional) e CSLL (9%) sobre a base presumida.", tip: "Calcule estimativas mensais para evitar surpresa no trimestral." },
              { obrigacao: "DARF — PIS e COFINS", prazo: "Até dia 25 do mês seguinte", desc: "PIS (0,65%) e COFINS (3%) sobre a receita bruta no regime cumulativo.", tip: "Fique atento às exclusões da base de cálculo." },
              { obrigacao: "ECF — Escrituração Contábil Fiscal", prazo: "Último dia útil de julho", desc: "Declaração anual que substitui a antiga DIPJ.", tip: "Comece a preparar em abril." },
              { obrigacao: "EFD Contribuições", prazo: "10º dia útil do 2º mês", desc: "Escrituração das contribuições PIS/COFINS.", tip: "Valide o SPED antes de transmitir." },
            ].map(({ obrigacao, prazo, desc, tip }) => (
              <GuideCard key={obrigacao} icon="📄" title={obrigacao} subtitle={prazo}>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{desc}</p>
                  {tip && <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>💡 {tip}</div>}
                </div>
              </GuideCard>
            ))}
          </div>
        },
        { icon: "🔴", title: "Lucro Real", subtitle: "Receita acima de R$ 78 milhões ou obrigadas por lei",
          body: <div className="space-y-2">
            {[
              { obrigacao: "DARF — IRPJ e CSLL (Estimativa Mensal)", prazo: "Último dia útil do mês", desc: "Recolhimento mensal por estimativa ou balancete.", tip: "Analise se compensa estimativa ou balancete mensalmente." },
              { obrigacao: "SPED Contábil — ECD", prazo: "Último dia útil de junho", desc: "Escrituração Contábil Digital — substitui livros em papel.", tip: "Mantenha a contabilidade em dia mensalmente." },
              { obrigacao: "ECF — Escrituração Contábil Fiscal", prazo: "Último dia útil de julho", desc: "Declaração anual com informações completas.", tip: "A ECF é gerada a partir da ECD." },
              { obrigacao: "EFD ICMS/IPI", prazo: "Variável por estado", desc: "Escrituração fiscal das operações de ICMS e IPI.", tip: "Verifique a legislação estadual de cada cliente." },
            ].map(({ obrigacao, prazo, desc, tip }) => (
              <GuideCard key={obrigacao} icon="📄" title={obrigacao} subtitle={prazo}>
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: "var(--soma-muted)" }}>{desc}</p>
                  {tip && <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>💡 {tip}</div>}
                </div>
              </GuideCard>
            ))}
          </div>
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}
      <Quiz guide="fiscal" tab="obrigacoes" title="🧠 Quiz — Obrigações" questions={[
        { q: "Prazo para pagamento do DAS no Simples Nacional?", options: ["Dia 10", "Dia 20", "Último dia útil", "Dia 25"], correct: 1, explanation: "O DAS vence até o dia 20 do mês subsequente." },
        { q: "Qual declaração substituiu a DIPJ?", options: ["DEFIS", "DCTF", "ECF", "EFD Contribuições"], correct: 2, explanation: "A ECF substituiu a DIPJ para Lucro Presumido e Real." },
        { q: "Lucro Real é obrigatório para receita acima de?", options: ["R$ 4,8 milhões", "R$ 48 milhões", "R$ 78 milhões", "R$ 100 milhões"], correct: 2, explanation: "Receita superior a R$ 78 milhões obriga o Lucro Real." },
      ]} />
    </div>
  );
}

function TabCalendario() {
  const eventos = [
    { dia: "Dia 07", obrigacao: "FGTS — recolhimento mensal", regime: "Todos", urgencia: "alta" },
    { dia: "Dia 10", obrigacao: "Simples Nacional — PGDAS-D", regime: "Simples", urgencia: "alta" },
    { dia: "Dia 15", obrigacao: "INSS — recolhimento", regime: "LP / LR", urgencia: "alta" },
    { dia: "Dia 20", obrigacao: "DAS — pagamento", regime: "Simples", urgencia: "alta" },
    { dia: "Dia 20", obrigacao: "IRRF — retenções na fonte", regime: "LP / LR", urgencia: "alta" },
    { dia: "Dia 25", obrigacao: "DARF — PIS e COFINS", regime: "LP", urgencia: "media" },
    { dia: "Dia 25", obrigacao: "DARF — ISS municipal", regime: "Todos", urgencia: "media" },
    { dia: "Último dia útil", obrigacao: "DARF — IRPJ e CSLL estimativa", regime: "LR", urgencia: "alta" },
    { dia: "10º dia útil (2º mês)", obrigacao: "EFD Contribuições", regime: "LP / LR", urgencia: "media" },
    { dia: "Março/ano seguinte", obrigacao: "DEFIS — Simples Nacional", regime: "Simples", urgencia: "baixa" },
    { dia: "Junho/ano seguinte", obrigacao: "ECD — SPED Contábil", regime: "LR", urgencia: "baixa" },
    { dia: "Julho/ano seguinte", obrigacao: "ECF — Escrituração Contábil Fiscal", regime: "LP / LR", urgencia: "baixa" },
  ];
  const urgStyle: Record<string, { bg: string; color: string }> = {
    alta:  { bg: "rgba(220,38,38,0.15)",  color: "#f87171" },
    media: { bg: "rgba(234,179,8,0.15)",  color: "#fde047" },
    baixa: { bg: "rgba(22,163,74,0.15)",  color: "#4ade80" },
  };
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
        📅 Calendário de referência geral. Consulte sempre a legislação atualizada.
      </div>
      <div className="flex gap-3 text-xs flex-wrap">
        {[["alta","Prazo fixo"],["media","Prazo variável"],["baixa","Prazo anual"]].map(([u,l]) => (
          <span key={u} className="px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: urgStyle[u].bg, color: urgStyle[u].color }}>{l}</span>
        ))}
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--soma-border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "var(--soma-card)", borderBottom: "1px solid var(--soma-border)" }}>
              {["Prazo","Obrigação","Regime"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--soma-muted)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {eventos.map((e, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--soma-border)", backgroundColor: "var(--soma-card)" }}>
                <td className="px-4 py-3 text-xs font-bold whitespace-nowrap" style={{ color: "#f5a623" }}>{e.dia}</td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: "var(--soma-text)" }}>{e.obrigacao}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: urgStyle[e.urgencia].bg, color: urgStyle[e.urgencia].color }}>
                    {e.regime}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabChecklist() {
  const { checked, toggle, loading } = useChecklist("fiscal");
  const groups = [
    { group: "🖥️ Acesso e configuração", items: ["acesso-sistema-fiscal","acesso-sped","acesso-esocial","acesso-receita","acesso-gestor"], labels: ["Acesso ao sistema fiscal configurado","Acesso ao SPED/eSocial liberado","Acesso ao portal da Receita Federal","Acesso ao portal Simples Nacional","Acesso ao Gestor de Documentos"] },
    { group: "📚 Treinamentos obrigatórios", items: ["treino-regimes","treino-obrigacoes","treino-prazos","treino-sped","treino-quizzes"], labels: ["Estudou os três regimes tributários","Conhece as obrigações de cada regime","Memorizou os prazos mensais principais","Aprendeu a transmitir arquivos SPED","Completou os quizzes deste guia"] },
    { group: "📋 Conhecimento operacional", items: ["op-calendario","op-clientes","op-sistemas","op-fluxo","op-nomenclatura"], labels: ["Conhece o calendário fiscal completo","Mapeou a carteira de clientes e regimes","Sabe operar os sistemas fiscais","Entendeu o fluxo de trabalho do setor","Domina a nomenclatura de arquivos"] },
    { group: "✅ Primeiras semanas", items: ["semana1-acompanhou","semana1-processou","semana1-guia","semana1-transmitiu"], labels: ["Acompanhou rotina com analista sênior","Processou documentos supervisionado","Gerou primeira guia com supervisão","Transmitiu primeira obrigação com supervisão"] },
  ];
  const total = groups.reduce((a,g) => a + g.items.length, 0);
  const done  = groups.reduce((a,g) => a + g.items.filter(id => checked[id]).length, 0);
  const pct   = Math.round((done/total)*100);
  if (loading) return <div className="flex items-center justify-center py-12"><span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando...</span></div>;
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
              <li key={id} onClick={() => toggle(id)} className="flex items-center gap-3 text-sm cursor-pointer">
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
      {pct === 100 && <div className="rounded-xl p-4 text-center text-sm font-semibold" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>🎉 Parabéns! Onboarding do Fiscal concluído!</div>}
    </div>
  );
}

function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Como saber qual regime tributário o cliente está?", a: "Acesse o sistema fiscal ou consulte o cadastro do cliente. Em dúvida, verifique no portal do Simples Nacional ou na Receita Federal com o CNPJ." },
    { q: "O cliente perdeu o prazo, o que faço?", a: "Gere a guia com multa e juros. Informe o cliente imediatamente com o valor atualizado e oriente sobre as consequências." },
    { q: "Recebi uma notificação da Receita Federal, o que faço?", a: "Nunca ignore. Leia o conteúdo, avalie a gravidade e informe o gestor antes de qualquer ação." },
    { q: "Como proceder com notas fiscais com erro?", a: "Solicite ao cliente que cancele e reemita. Nunca processe nota com dados incorretos." },
    { q: "O SPED está rejeitando o arquivo, o que faço?", a: "Verifique o log de erros, corrija e retransmita. Se persistir, consulte o analista sênior." },
    { q: "Posso estimar imposto sem documentos completos?", a: "Nunca. Aguarde todos os documentos. Estimativas sem base documental geram inconsistências e multas." },
    { q: "Qual a diferença entre DAS e DARF?", a: "DAS é exclusivo do Simples Nacional e unifica todos os tributos. DARF é usado para tributos federais do Lucro Presumido e Real separadamente." },
    { q: "Quando devo retificar uma obrigação?", a: "Sempre que identificar erro em obrigação já transmitida. Faça o quanto antes. Informe o gestor antes de retificar valores relevantes." },
  ];
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--soma-muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar dúvida..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
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

export default function GuideFiscal() {
  return (
    <GuideLayout
      title="Fiscal"
      subtitle="Guia operacional do departamento fiscal"
      icon={FileText}
      tabs={[
        { key: "rotina",     label: "Rotina Diária", icon: Workflow,      content: <TabRotina /> },
        { key: "obrigacoes", label: "Obrigações",    icon: ClipboardList, content: <TabObrigacoes /> },
        { key: "calendario", label: "Calendário",    icon: Calendar,      content: <TabCalendario /> },
        { key: "checklist",  label: "Checklist",     icon: CheckCircle2,  content: <TabChecklist /> },
        { key: "faq",        label: "FAQ",           icon: HelpCircle,    content: <TabFAQ /> },
      ]}
    />
  );
}