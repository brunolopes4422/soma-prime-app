import { useState } from "react";
import { FileText, Workflow, Calendar, ClipboardList, HelpCircle, CheckCircle2, ChevronDown, Search, XCircle } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import { useChecklist } from "../../hooks/useChecklist";
import { useQuiz } from "../../hooks/useQuiz";

// ─── COMPONENTES REUTILIZÁVEIS ───────────────────────────────────────────────
function Steps({ items }: { items: { title: string; desc: string; tip?: string }[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const open = active === i;
        return (
          <button key={i} onClick={() => setActive(open ? null : i)} className="w-full text-left">
            <div className={`rounded-xl border transition-all duration-200 overflow-hidden
              ${open ? "border-gold bg-gold/5" : "border-soma-border bg-white hover:border-gold/40"}`}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                  ${open ? "bg-gold text-white" : "bg-soma-bg text-soma-text/50"}`}>{i + 1}</span>
                <span className="font-semibold text-sm flex-1">{item.title}</span>
                <ChevronDown size={16} className={`opacity-40 transition-transform ${open ? "rotate-180" : ""}`} />
              </div>
              {open && (
                <div className="px-4 pb-4 space-y-2 border-t border-gold/20 pt-3">
                  <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
                  {item.tip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                      💡 <strong>Dica:</strong> {item.tip}
                    </div>
                  )}
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
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-green-700"><CheckCircle2 size={14} /> Certo</div>
            <p className="text-green-800 leading-relaxed">{certo}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-700"><XCircle size={14} /> Errado</div>
            <p className="text-red-800 leading-relaxed">{errado}</p>
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
        <div key={qi} className="card-base border border-soma-border bg-white space-y-3">
          <p className="font-semibold text-sm">{qi + 1}. {q.q}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[qi] === oi;
              const isCorrect = q.correct === oi;
              let cls = "border-soma-border bg-soma-bg text-soma-text/70";
              if (showResult && isCorrect) cls = "border-green-400 bg-green-50 text-green-800 font-semibold";
              else if (showResult && selected && !isCorrect) cls = "border-red-400 bg-red-50 text-red-800 line-through";
              else if (selected) cls = "border-gold bg-gold/10 text-gold font-semibold";
              return (
                <button key={oi} disabled={showResult} onClick={() => answer(qi, oi)}
                  className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all ${cls}`}>
                  {opt}
                </button>
              );
            })}
          </div>
          {showResult && <p className="text-xs bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-blue-800">💬 {q.explanation}</p>}
        </div>
      ))}
      {!showResult ? (
        <button onClick={() => submit(questions)} disabled={Object.keys(answers).length < questions.length}
          className="w-full py-2.5 rounded-xl bg-gold text-white font-semibold text-sm disabled:opacity-40 hover:bg-gold-dark transition-colors">
          Verificar respostas
        </button>
      ) : (
        <div className={`rounded-xl p-4 text-center border font-semibold text-sm
          ${score === questions.length ? "bg-green-50 border-green-300 text-green-800"
            : score >= questions.length / 2 ? "bg-yellow-50 border-yellow-300 text-yellow-800"
            : "bg-red-50 border-red-300 text-red-800"}`}>
          {score === questions.length ? "🏆 Perfeito!" : score >= questions.length / 2 ? "👍 Bom!" : "📚 Revise o conteúdo!"}&nbsp;
          {score}/{questions.length} corretas
          <button onClick={reset} className="block mx-auto mt-2 text-xs underline opacity-60">Tentar novamente</button>
        </div>
      )}
    </div>
  );
}

// ─── ABA 1 — ROTINA DIÁRIA ──────────────────────────────────────────────────
function TabRotina() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-sm mb-3">🎬 Aulas em vídeo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VideoCard
            videoId="fiscal-rotina-diaria"
            title="Rotina Diária do Fiscal"
            description="Como organizar o dia a dia do departamento fiscal sem perder prazos."
            duration="10 min"
            instructor="Analista Fiscal Sênior"
            comingSoon
          />
          <VideoCard
            videoId="fiscal-calendario"
            title="Calendário Fiscal na Prática"
            description="Entenda todos os prazos mensais e anuais do setor fiscal."
            duration="15 min"
            instructor="Analista Fiscal Sênior"
            comingSoon
          />
        </div>
      </div>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        📋 A rotina fiscal exige atenção constante aos prazos. Um único atraso pode gerar multa para o cliente. <strong>Consulte o calendário fiscal todos os dias.</strong>
      </div>
      <Steps items={[
        { title: "Abrir o calendário fiscal do dia", desc: "Antes de qualquer outra tarefa, verifique quais obrigações vencem hoje ou nos próximos 3 dias. Priorize o que vence primeiro.", tip: "Crie o hábito de checar o calendário logo ao abrir o computador, antes de responder mensagens." },
        { title: "Verificar pendências do dia anterior", desc: "Cheque se ficou alguma obrigação em aberto do dia anterior. Obrigações não concluídas viram prioridade máxima.", tip: "Mantenha uma lista de pendências atualizada. Nunca confie só na memória." },
        { title: "Processar documentos recebidos", desc: "Notas fiscais, extratos, guias e documentos enviados pelos clientes devem ser processados no dia do recebimento. Nunca acumule para o dia seguinte.", tip: "Organize os documentos por cliente assim que chegarem. Isso evita confusão na hora de processar." },
        { title: "Lançar e conferir obrigações", desc: "Para cada obrigação do dia: lance no sistema, confira os valores, gere a guia e salve no Gestor de Documentos com a nomenclatura correta.", tip: "Sempre faça uma dupla verificação dos valores antes de gerar a guia definitiva." },
        { title: "Comunicar o cliente", desc: "Após gerar guias ou apurações, encaminhe ao cliente pelo CS com prazo de pagamento e instruções claras.", tip: "Nunca envie guia sem prazo de vencimento destacado. O cliente precisa saber até quando pagar." },
        { title: "Registrar no sistema", desc: "Marque a obrigação como concluída no sistema de controle. Obrigação sem registro = obrigação perdida.", tip: "O registro é a prova do seu trabalho. Sem ele, não existe como rastrear o que foi feito." },
      ]} />
      <div>
        <h3 className="font-bold text-sm mb-3">✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Verifico o calendário fiscal toda manhã antes de começar.", errado: "Confio na memória para lembrar os vencimentos do dia." },
          { certo: "Processo documentos no mesmo dia que chegam.", errado: "Acumulo documentos para processar de uma vez no final da semana." },
          { certo: "Registro toda obrigação concluída no sistema imediatamente.", errado: "Deixo para registrar depois, quando der tempo." },
        ]} />
      </div>
      <div>
        <h3 className="font-bold text-sm mb-3">🧠 Quiz — Rotina Fiscal</h3>
        <Quiz guide="fiscal" tab="rotina" questions={[
          { q: "Qual deve ser o primeiro passo ao iniciar o dia no setor fiscal?", options: ["Responder e-mails dos clientes", "Verificar o calendário fiscal e os vencimentos do dia", "Processar as notas fiscais pendentes", "Reunião com a equipe"], correct: 1, explanation: "O calendário fiscal deve ser consultado diariamente antes de qualquer outra tarefa para garantir que nenhum prazo seja perdido." },
          { q: "Um documento do cliente chegou hoje mas você está ocupado. Quando deve ser processado?", options: ["No mesmo dia", "Em até 3 dias", "Na semana seguinte", "Quando o cliente cobrar"], correct: 0, explanation: "Documentos devem ser processados no dia do recebimento. Acumular documentos é uma das principais causas de erros e atrasos fiscais." },
          { q: "Você gerou uma guia de DAS. Qual é o próximo passo obrigatório?", options: ["Guardar no computador pessoal", "Salvar no Gestor de Documentos e comunicar o cliente", "Aguardar o cliente pedir", "Enviar por WhatsApp pessoal"], correct: 1, explanation: "Após gerar a guia, salve no Gestor de Documentos com a nomenclatura correta e comunique o cliente pelo CS com prazo destacado." },
        ]} />
      </div>
    </div>
  );
}

// ─── ABA 2 — OBRIGAÇÕES POR REGIME ──────────────────────────────────────────
function TabObrigacoes() {
  return (
    <div className="space-y-4">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        📑 Cada regime tributário tem suas próprias obrigações. Conhecer cada uma é fundamental para não perder prazos e evitar multas para os clientes.
      </div>

      {[
        {
          icon: "🟢", title: "Simples Nacional", subtitle: "MEI, ME e EPP optantes pelo Simples",
          body: (
            <div className="space-y-4">
              <div className="space-y-2">
                {[
                  { obrigacao: "DAS — Documento de Arrecadação do Simples", prazo: "Até dia 20 do mês seguinte", desc: "Guia unificada que reúne todos os impostos do Simples Nacional (IRPJ, CSLL, PIS, COFINS, IPI, CPP, ISS, ICMS).", tip: "Verifique se há sublimite de ICMS e ISS no estado antes de calcular." },
                  { obrigacao: "DEFIS — Declaração de Informações Socioeconômicas e Fiscais", prazo: "Até 31 de março do ano seguinte", desc: "Declaração anual obrigatória para todas as empresas do Simples Nacional.", tip: "Inicie a DEFIS em fevereiro para não deixar para a última semana." },
                  { obrigacao: "PGDAS-D — Programa Gerador do DAS", prazo: "Mensal — até dia 20", desc: "Cálculo mensal das receitas brutas por faixa de alíquota para geração do DAS.", tip: "Sempre confira a classificação correta das receitas antes de apurar." },
                ].map(({ obrigacao, prazo, desc, tip }) => (
                  <GuideCard key={obrigacao} icon="📄" title={obrigacao} subtitle={prazo} badge={prazo} badgeColor="bg-green-100 text-green-700 border-green-200">
                    <div className="space-y-3">
                      <p className="text-sm opacity-70">{desc}</p>
                      {tip && <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">💡 {tip}</div>}
                    </div>
                  </GuideCard>
                ))}
              </div>
            </div>
          )
        },
        {
          icon: "🟡", title: "Lucro Presumido", subtitle: "Empresas com receita até R$ 78 milhões",
          body: (
            <div className="space-y-2">
              {[
                { obrigacao: "DARF — IRPJ e CSLL", prazo: "Trimestral — último dia útil do mês seguinte ao trimestre", desc: "Recolhimento trimestral do IRPJ (15% + adicional de 10%) e CSLL (9%) sobre a base presumida.", tip: "Calcule as estimativas mensais para evitar surpresa no trimestral." },
                { obrigacao: "DARF — PIS e COFINS", prazo: "Até dia 25 do mês seguinte", desc: "PIS (0,65%) e COFINS (3%) sobre a receita bruta no regime cumulativo.", tip: "Fique atento às exclusões da base de cálculo permitidas pela legislação." },
                { obrigacao: "ECF — Escrituração Contábil Fiscal", prazo: "Até o último dia útil de julho do ano seguinte", desc: "Declaração anual que substitui a antiga DIPJ. Apresenta as informações fiscais e contábeis da empresa.", tip: "Comece a preparar a ECF em abril para ter tempo hábil de revisão." },
                { obrigacao: "EFD Contribuições", prazo: "Até o 10º dia útil do 2º mês seguinte", desc: "Escrituração das contribuições PIS/COFINS e da Contribuição Previdenciária sobre a Receita Bruta.", tip: "Valide o arquivo SPED antes de transmitir para evitar retificações." },
              ].map(({ obrigacao, prazo, desc, tip }) => (
                <GuideCard key={obrigacao} icon="📄" title={obrigacao} subtitle={prazo} badge={prazo} badgeColor="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <div className="space-y-3">
                    <p className="text-sm opacity-70">{desc}</p>
                    {tip && <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">💡 {tip}</div>}
                  </div>
                </GuideCard>
              ))}
            </div>
          )
        },
        {
          icon: "🔴", title: "Lucro Real", subtitle: "Empresas com receita acima de R$ 78 milhões ou obrigadas por lei",
          body: (
            <div className="space-y-2">
              {[
                { obrigacao: "DARF — IRPJ e CSLL (Estimativa Mensal)", prazo: "Até o último dia útil do mês seguinte", desc: "Recolhimento mensal por estimativa ou balancete de suspensão/redução.", tip: "Analise mensalmente se compensa recolher por estimativa ou por balancete." },
                { obrigacao: "SPED Contábil — ECD", prazo: "Até o último dia útil de junho do ano seguinte", desc: "Escrituração Contábil Digital — substitui os livros contábeis em papel.", tip: "Mantenha a contabilidade em dia mensalmente para não ter problema na hora da entrega." },
                { obrigacao: "ECF — Escrituração Contábil Fiscal", prazo: "Até o último dia útil de julho do ano seguinte", desc: "Declaração anual com informações fiscais e contábeis completas.", tip: "A ECF é gerada a partir da ECD — mantenha as duas alinhadas." },
                { obrigacao: "EFD ICMS/IPI", prazo: "Variável por estado — consultar legislação estadual", desc: "Escrituração fiscal digital das operações de ICMS e IPI.", tip: "Fique atento à legislação estadual de cada cliente pois os prazos variam." },
              ].map(({ obrigacao, prazo, desc, tip }) => (
                <GuideCard key={obrigacao} icon="📄" title={obrigacao} subtitle={prazo} badge={prazo} badgeColor="bg-red-100 text-red-700 border-red-200">
                  <div className="space-y-3">
                    <p className="text-sm opacity-70">{desc}</p>
                    {tip && <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">💡 {tip}</div>}
                  </div>
                </GuideCard>
              ))}
            </div>
          )
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <div>
        <h3 className="font-bold text-sm mb-3">🧠 Quiz — Obrigações</h3>
        <Quiz guide="fiscal" tab="obrigacoes" questions={[
          { q: "Qual é o prazo para pagamento do DAS no Simples Nacional?", options: ["Dia 10 do mês seguinte", "Dia 20 do mês seguinte", "Último dia útil do mês", "Dia 25 do mês seguinte"], correct: 1, explanation: "O DAS do Simples Nacional vence até o dia 20 do mês subsequente ao período de apuração." },
          { q: "Qual declaração anual substitui a DIPJ para empresas do Lucro Presumido e Lucro Real?", options: ["DEFIS", "DCTF", "ECF", "EFD Contribuições"], correct: 2, explanation: "A ECF (Escrituração Contábil Fiscal) substituiu a DIPJ e é obrigatória para empresas do Lucro Presumido e Lucro Real." },
          { q: "Uma empresa do Lucro Real tem receita acima de quanto por ano?", options: ["R$ 4,8 milhões", "R$ 48 milhões", "R$ 78 milhões", "R$ 100 milhões"], correct: 2, explanation: "Empresas com receita bruta anual superior a R$ 78 milhões são obrigadas a apurar pelo Lucro Real." },
        ]} />
      </div>
    </div>
  );
}

// ─── ABA 3 — CALENDÁRIO ─────────────────────────────────────────────────────
function TabCalendario() {
  const eventos = [
    { dia: "Dia 07", obrigacao: "FGTS — recolhimento mensal", regime: "Todos", urgencia: "alta" },
    { dia: "Dia 10", obrigacao: "Simples Nacional — transmissão PGDAS-D", regime: "Simples", urgencia: "alta" },
    { dia: "Dia 15", obrigacao: "INSS — recolhimento (Lucro Presumido/Real)", regime: "LP / LR", urgencia: "alta" },
    { dia: "Dia 20", obrigacao: "DAS — pagamento Simples Nacional", regime: "Simples", urgencia: "alta" },
    { dia: "Dia 20", obrigacao: "IRRF — retenções na fonte", regime: "LP / LR", urgencia: "alta" },
    { dia: "Dia 25", obrigacao: "DARF — PIS e COFINS (Lucro Presumido)", regime: "LP", urgencia: "media" },
    { dia: "Dia 25", obrigacao: "DARF — ISS municipal", regime: "Todos", urgencia: "media" },
    { dia: "Último dia útil", obrigacao: "DARF — IRPJ e CSLL estimativa (Lucro Real)", regime: "LR", urgencia: "alta" },
    { dia: "10º dia útil (2º mês)", obrigacao: "EFD Contribuições", regime: "LP / LR", urgencia: "media" },
    { dia: "Março/ano seguinte", obrigacao: "DEFIS — Simples Nacional", regime: "Simples", urgencia: "baixa" },
    { dia: "Junho/ano seguinte", obrigacao: "ECD — SPED Contábil", regime: "LR", urgencia: "baixa" },
    { dia: "Julho/ano seguinte", obrigacao: "ECF — Escrituração Contábil Fiscal", regime: "LP / LR", urgencia: "baixa" },
  ];

  const urgenciaStyle: Record<string, string> = {
    alta:  "bg-red-100 text-red-700 border-red-200",
    media: "bg-yellow-100 text-yellow-700 border-yellow-200",
    baixa: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="space-y-4">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        📅 Este calendário é uma referência geral. Sempre consulte a legislação atualizada e as especificidades de cada cliente.
      </div>

      <div className="flex gap-3 text-xs flex-wrap">
        {[["alta", "Prazo fixo"], ["media", "Prazo variável"], ["baixa", "Prazo anual"]].map(([u, l]) => (
          <span key={u} className={`px-2 py-1 rounded-full border font-medium ${urgenciaStyle[u]}`}>{l}</span>
        ))}
      </div>

      <div className="card-base border border-soma-border bg-white overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-soma-border bg-soma-bg">
              <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Prazo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Obrigação</th>
              <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Regime</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e, i) => (
              <tr key={i} className="border-b border-soma-border last:border-0 hover:bg-soma-bg/50">
                <td className="px-4 py-3 text-xs font-bold text-gold whitespace-nowrap">{e.dia}</td>
                <td className="px-4 py-3 text-xs font-medium">{e.obrigacao}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urgenciaStyle[e.urgencia]}`}>
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

// ─── ABA 4 — CHECKLIST ──────────────────────────────────────────────────────
function TabChecklist() {
  const { checked, toggle, loading } = useChecklist("fiscal");

  const groups = [
    {
      group: "🖥️ Acesso e configuração",
      items:  ["acesso-sistema-fiscal", "acesso-sped", "acesso-esocial", "acesso-receita", "acesso-gestor"],
      labels: ["Acesso ao sistema fiscal configurado", "Acesso ao SPED/eSocial liberado", "Acesso ao portal da Receita Federal", "Acesso ao portal Simples Nacional", "Acesso ao Gestor de Documentos"],
    },
    {
      group: "📚 Treinamentos obrigatórios",
      items:  ["treino-regimes", "treino-obrigacoes", "treino-prazos", "treino-sped", "treino-quizzes"],
      labels: ["Estudou os três regimes tributários", "Conhece as obrigações de cada regime", "Memorizou os prazos mensais principais", "Aprendeu a transmitir arquivos SPED", "Completou os quizzes deste guia"],
    },
    {
      group: "📋 Conhecimento operacional",
      items:  ["op-calendario", "op-clientes", "op-sistemas", "op-fluxo", "op-nomenclatura"],
      labels: ["Conhece o calendário fiscal completo", "Mapeou a carteira de clientes e regimes", "Sabe operar os sistemas fiscais da empresa", "Entendeu o fluxo de trabalho do setor", "Domina a nomenclatura de arquivos"],
    },
    {
      group: "✅ Primeiras semanas",
      items:  ["semana1-acompanhou", "semana1-processou", "semana1-guia", "semana1-transmitiu"],
      labels: ["Acompanhou rotina com analista sênior", "Processou documentos supervisionado", "Gerou primeira guia com supervisão", "Transmitiu primeira obrigação com supervisão"],
    },
  ];

  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done  = groups.reduce((a, g) => a + g.items.filter(id => checked[id]).length, 0);
  const pct   = Math.round((done / total) * 100);

  if (loading) return <div className="flex items-center justify-center py-12"><span className="text-gold animate-pulse text-sm">Carregando progresso...</span></div>;

  return (
    <div className="space-y-5">
      <div className="card-base border border-soma-border bg-white space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span>Progresso do onboarding</span>
          <span className="text-gold">{pct}%</span>
        </div>
        <div className="h-2.5 bg-soma-bg rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs opacity-50">{done} de {total} itens concluídos</p>
      </div>
      {groups.map(({ group, items, labels }) => (
        <div key={group} className="card-base border border-soma-border bg-white">
          <h3 className="font-semibold text-sm mb-3">{group}</h3>
          <ul className="space-y-2.5">
            {items.map((id, idx) => (
              <li key={id} onClick={() => toggle(id)} className="flex items-center gap-3 text-sm cursor-pointer group">
                <span className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all
                  ${checked[id] ? "bg-gold border-gold" : "border-soma-border bg-soma-bg group-hover:border-gold/50"}`}>
                  {checked[id] && <CheckCircle2 size={12} className="text-white" />}
                </span>
                <span className={checked[id] ? "line-through opacity-40" : ""}>{labels[idx]}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {pct === 100 && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4 text-center text-green-800 font-semibold text-sm">
          🎉 Parabéns! Onboarding do Fiscal concluído com sucesso!
        </div>
      )}
    </div>
  );
}

// ─── ABA 5 — FAQ ────────────────────────────────────────────────────────────
function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Como saber qual regime tributário o cliente está?", a: "Acesse o sistema fiscal da empresa ou consulte o cadastro do cliente. Em caso de dúvida, verifique no portal do Simples Nacional ou na Receita Federal com o CNPJ." },
    { q: "O cliente perdeu o prazo de pagamento, o que faço?", a: "Gere a guia com multa e juros pelo sistema. Informe o cliente imediatamente com o valor atualizado e oriente sobre as consequências. Registre o ocorrido no sistema de tickets." },
    { q: "Recebi uma notificação da Receita Federal para um cliente, o que faço?", a: "Nunca ignore. Leia o conteúdo completo, avalie a gravidade e informe imediatamente o gestor antes de tomar qualquer ação ou responder à Receita." },
    { q: "Como devo proceder com notas fiscais de entrada com erro?", a: "Solicite ao cliente que cancele e reemita a nota com as informações corretas. Nunca processe uma nota com dados incorretos." },
    { q: "O sistema SPED está rejeitando o arquivo, o que faço?", a: "Verifique o log de erros do sistema, corrija os campos apontados e retransmita. Se o erro persistir, consulte o analista sênior antes de acionar o suporte externo." },
    { q: "Posso fazer uma estimativa de imposto sem os documentos completos?", a: "Nunca. Sempre aguarde todos os documentos para apurar corretamente. Estimativas sem base documental podem gerar inconsistências e multas." },
    { q: "Qual a diferença entre DAS e DARF?", a: "DAS é o documento de arrecadação exclusivo do Simples Nacional, que unifica todos os tributos numa única guia. DARF é usado para recolher tributos federais de empresas do Lucro Presumido e Lucro Real separadamente." },
    { q: "Quando devo retificar uma obrigação?", a: "Sempre que identificar um erro em uma obrigação já transmitida. Faça a retificação o mais rápido possível para minimizar multas. Informe o gestor antes de retificar obrigações de valores relevantes." },
  ];

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar dúvida..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-soma-border bg-white text-sm focus:outline-none focus:border-gold transition-colors" />
      </div>
      {filtered.length === 0 && <p className="text-center text-sm opacity-40 py-8">Nenhuma dúvida encontrada.</p>}
      {filtered.map(({ q, a }, i) => (
        <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full text-left">
          <div className={`rounded-xl border transition-all overflow-hidden
            ${open === i ? "border-gold bg-gold/5" : "border-soma-border bg-white hover:border-gold/40"}`}>
            <div className="flex items-start gap-3 px-4 py-3">
              <span className="text-gold font-bold text-sm shrink-0">?</span>
              <span className="font-semibold text-sm flex-1 text-left">{q}</span>
              <ChevronDown size={16} className={`opacity-40 shrink-0 mt-0.5 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </div>
            {open === i && (
              <div className="px-4 pb-4 pt-2 border-t border-gold/20">
                <p className="text-sm opacity-70 leading-relaxed">{a}</p>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── PRINCIPAL ───────────────────────────────────────────────────────────────
export default function GuideFiscal() {
  return (
    <GuideLayout
      title="Fiscal"
      subtitle="Guia operacional do departamento fiscal"
      icon={FileText}
      tabs={[
        { key: "rotina",      label: "Rotina Diária",  icon: Workflow,      content: <TabRotina /> },
        { key: "obrigacoes",  label: "Obrigações",     icon: ClipboardList, content: <TabObrigacoes /> },
        { key: "calendario",  label: "Calendário",     icon: Calendar,      content: <TabCalendario /> },
        { key: "checklist",   label: "Checklist",      icon: CheckCircle2,  content: <TabChecklist /> },
        { key: "faq",         label: "FAQ",            icon: HelpCircle,    content: <TabFAQ /> },
      ]}
    />
  );
}