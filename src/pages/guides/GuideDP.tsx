import { useState } from "react";
import { Briefcase, Workflow, Calendar, ClipboardList, HelpCircle, CheckCircle2, ChevronDown, Search, XCircle } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import { useChecklist } from "../../hooks/useChecklist";
import Quiz from "../../components/ui/Quiz";
import Steps from "../../components/ui/Steps";

// ─── COMPONENTES REUTILIZÁVEIS ───────────────────────────────────────────────


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


// ─── ABA 1 — ROTINA ─────────────────────────────────────────────────────────
function TabRotina() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-sm mb-3">🎬 Aulas em vídeo</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <VideoCard
            videoId="dp-rotina-diaria"
            title="Rotina Diária do DP"
            description="Como organizar admissões, demissões e folha sem perder nenhum prazo."
            duration="12 min"
            instructor="Analista DP Sênior"
            comingSoon
          />
          <VideoCard
            videoId="dp-esocial-pratica"
            title="eSocial na Prática"
            description="Aprenda a transmitir os principais eventos do eSocial corretamente."
            duration="18 min"
            instructor="Analista DP Sênior"
            comingSoon
          />
        </div>
      </div>

      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        👥 O DP lida com a vida das pessoas — admissões, demissões, férias e salários. <strong>Cada erro aqui afeta diretamente o bolso do colaborador do cliente.</strong>
      </div>
      <Steps items={[
        { title: "Verificar movimentações do dia", desc: "Cheque admissões, demissões, afastamentos e férias previstas para o dia. Movimentações não processadas no prazo geram multas e problemas trabalhistas.", tip: "Mantenha uma planilha de controle de movimentações atualizada diariamente." },
        { title: "Processar documentos recebidos", desc: "Documentos de admissão, atestados, rescisões e comunicados devem ser processados no dia do recebimento. Organize por cliente e tipo de documento.", tip: "Atestados médicos têm prazo para lançamento no eSocial. Não deixe acumular." },
        { title: "Verificar prazos do eSocial", desc: "Consulte os eventos pendentes no eSocial. Admissões devem ser transmitidas antes do início das atividades. Demissões têm prazo de 10 dias.", tip: "Configure alertas no sistema para eventos próximos do prazo." },
        { title: "Atualizar folha de pagamento", desc: "Lançar horas extras, faltas, descontos e benefícios do período. Cada lançamento deve ter documentação de suporte.", tip: "Nunca lance horas extras sem a autorização formal do empregador." },
        { title: "Comunicar pendências ao cliente", desc: "Se faltar documentação ou autorização para processar alguma movimentação, comunique o cliente imediatamente pelo CS.", tip: "Uma ligação rápida pode evitar dias de atraso. Não espere o cliente perguntar." },
        { title: "Registrar e arquivar", desc: "Todo documento processado deve ser arquivado no Gestor de Documentos na pasta correta do cliente.", tip: "Documentos trabalhistas devem ser guardados por no mínimo 5 anos." },
      ]} />
      <div>
        <h3 className="font-bold text-sm mb-3">✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Transmito a admissão no eSocial antes do colaborador iniciar as atividades.", errado: "Transmito a admissão depois que o colaborador já começou a trabalhar." },
          { certo: "Documento todo lançamento de hora extra com autorização formal.", errado: "Lanço horas extras baseado só no que o cliente fala por WhatsApp." },
          { certo: "Comunico imediatamente quando falta documentação para processar.", errado: "Espero acumular todas as pendências para comunicar de uma vez." },
        ]} />
      </div>
      <div>
        <h3 className="font-bold text-sm mb-3">🧠 Quiz — Rotina DP</h3>
        <Quiz guide="dp" tab="rotina" questions={[
          { q: "Qual é o prazo para transmitir uma admissão no eSocial?", options: ["Até 5 dias após a admissão", "Até 10 dias após a admissão", "Antes do início das atividades do colaborador", "No fechamento da folha do mês"], correct: 2, explanation: "A admissão deve ser transmitida no eSocial antes do colaborador iniciar as atividades. Transmitir após o início configura infração." },
          { q: "Por quanto tempo documentos trabalhistas devem ser guardados?", options: ["1 ano", "2 anos", "5 anos", "10 anos"], correct: 2, explanation: "Documentos trabalhistas devem ser guardados por no mínimo 5 anos para fins de auditoria e defesa em eventuais reclamações trabalhistas." },
          { q: "Um cliente enviou um atestado médico hoje. Quando deve ser lançado?", options: ["No fechamento da folha", "Em até 3 dias úteis", "No mesmo dia", "Só se o colaborador solicitar"], correct: 2, explanation: "Atestados têm prazo para lançamento no eSocial. Devem ser processados no dia do recebimento para não perder o prazo." },
        ]} />
      </div>
    </div>
  );
}

// ─── ABA 2 — PROCESSOS ──────────────────────────────────────────────────────
function TabProcessos() {
  return (
    <div className="space-y-4">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        ⚙️ Conheça os principais processos do DP. Cada um tem documentação específica e prazos que não podem ser ignorados.
      </div>

      {[
        {
          icon: "🟢", title: "Admissão", subtitle: "Contratação de novo colaborador",
          body: (
            <div className="space-y-3">
              <p className="text-sm opacity-70 font-semibold">Documentos obrigatórios:</p>
              <ul className="space-y-1 text-sm">
                {["RG e CPF (ou CNH)", "PIS/PASEP", "Carteira de Trabalho (CTPS)", "Título de Eleitor", "Comprovante de residência", "Certidão de nascimento/casamento", "Diploma ou certificado (se exigido)", "Atestado de saúde ocupacional (ASO)"].map(d => (
                  <li key={d} className="flex gap-2"><span className="text-gold">✓</span>{d}</li>
                ))}
              </ul>
              <Steps items={[
                { title: "Receber e conferir documentos", desc: "Solicite todos os documentos ao cliente antes da data de admissão. Sem documentação completa, não há como fazer a admissão corretamente." },
                { title: "Cadastrar no eSocial", desc: "Transmita o evento S-2200 (Cadastramento Inicial do Vínculo) antes do início das atividades.", tip: "Verifique o CNPJ/CPF do colaborador antes de cadastrar para evitar duplicidade." },
                { title: "Assinar CTPS", desc: "Registre na Carteira de Trabalho: função, data de admissão, salário e CBO.", tip: "A CTPS digital é integrada ao eSocial. Para CTPS física, assine no prazo de 48h." },
                { title: "Incluir na folha", desc: "Cadastre o colaborador no sistema de folha com todos os dados corretos: salário, benefícios, carga horária e centro de custo." },
              ]} />
            </div>
          )
        },
        {
          icon: "🔴", title: "Demissão / Rescisão", subtitle: "Desligamento de colaborador",
          body: (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { tipo: "Sem justa causa", verba: "Aviso prévio + FGTS + 40% multa + saldo + férias + 13º prop." },
                  { tipo: "Com justa causa", verba: "Apenas saldo de salário e férias vencidas." },
                  { tipo: "Pedido de demissão", verba: "Saldo + férias + 13º prop. (sem aviso e sem multa FGTS)." },
                  { tipo: "Acordo (§ 6º CLT)", verba: "Metade do aviso + 20% multa FGTS + saldo + férias + 13º." },
                ].map(({ tipo, verba }) => (
                  <div key={tipo} className="bg-soma-bg border border-soma-border rounded-lg p-3 text-xs">
                    <p className="font-bold mb-1">{tipo}</p>
                    <p className="opacity-60 leading-relaxed">{verba}</p>
                  </div>
                ))}
              </div>
              <Steps items={[
                { title: "Confirmar tipo de desligamento", desc: "Verifique com o cliente o motivo do desligamento para calcular as verbas corretamente.", tip: "Sempre confirme por escrito (e-mail ou mensagem) para ter documentação." },
                { title: "Calcular rescisão", desc: "Calcule todas as verbas rescisórias no sistema e gere o TRCT (Termo de Rescisão do Contrato de Trabalho).", tip: "Revise o cálculo duas vezes antes de enviar ao cliente." },
                { title: "Transmitir no eSocial", desc: "Envie o evento S-2299 (Desligamento) em até 10 dias após o desligamento.", tip: "Não perca o prazo — a multa por atraso é significativa." },
                { title: "Homologar rescisão", desc: "Para contratos acima de 1 ano, a rescisão deve ser homologada no sindicato da categoria.", tip: "Verifique a convenção coletiva da categoria para procedimentos específicos." },
              ]} />
            </div>
          )
        },
        {
          icon: "🟡", title: "Férias", subtitle: "Concessão e controle de férias",
          body: (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                ⚠️ <strong>Férias vencidas</strong> geram pagamento em dobro. Acompanhe o controle de período aquisitivo de todos os colaboradores.
              </div>
              <Steps items={[
                { title: "Controlar período aquisitivo", desc: "Cada colaborador tem 12 meses de período aquisitivo para ganhar 30 dias de férias. O período concessivo é de mais 12 meses para usufruir.", tip: "Alerte o cliente 60 dias antes de vencer o período concessivo." },
                { title: "Receber aviso de férias", desc: "O empregador deve comunicar as férias ao colaborador com 30 dias de antecedência por escrito.", tip: "Guarde o comprovante de entrega do aviso de férias." },
                { title: "Calcular e pagar", desc: "O pagamento das férias deve ser feito até 2 dias antes do início. Inclui 1/3 constitucional sobre o valor.", tip: "Verifique se há abonos ou conversão de 1/3 das férias em dinheiro." },
                { title: "Lançar no eSocial", desc: "Transmita o evento S-2230 (Afastamento Temporário) para férias individuais.", tip: "Para férias coletivas, o evento é diferente — S-2230 com código específico." },
              ]} />
            </div>
          )
        },
        {
          icon: "💰", title: "Folha de Pagamento", subtitle: "Processamento mensal",
          body: (
            <div className="space-y-3">
              <Steps items={[
                { title: "Coletar variáveis do mês", desc: "Solicite ao cliente: horas extras, faltas, atestados, comissões, adiantamentos e quaisquer outros eventos do mês.", tip: "Envie uma planilha padrão para o cliente preencher. Padroniza e economiza tempo." },
                { title: "Lançar na folha", desc: "Processe todos os eventos no sistema de folha. Confira cada lançamento com o documento de suporte.", tip: "Nunca lance sem documento. Qualquer lançamento sem suporte é um risco trabalhista." },
                { title: "Calcular e conferir", desc: "Calcule a folha, confira os totais de INSS, IRRF, FGTS e líquido a pagar. Compare com o mês anterior para identificar variações.", tip: "Variações acima de 20% merecem análise — pode ser erro de lançamento." },
                { title: "Enviar ao cliente", desc: "Envie o holerite, o resumo da folha e as guias de INSS, FGTS e IRRF com os prazos de pagamento.", tip: "Envie sempre com antecedência mínima de 3 dias úteis antes dos vencimentos." },
              ]} />
            </div>
          )
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <div>
        <h3 className="font-bold text-sm mb-3">🧠 Quiz — Processos DP</h3>
        <Quiz guide="dp" tab="processos" questions={[
          { q: "Numa demissão sem justa causa, qual é a multa sobre o FGTS?", options: ["20%", "30%", "40%", "50%"], correct: 2, explanation: "Na demissão sem justa causa, o empregador deve pagar 40% sobre o saldo do FGTS como multa ao colaborador." },
          { q: "Com quantos dias de antecedência o colaborador deve ser avisado das férias?", options: ["7 dias", "15 dias", "30 dias", "45 dias"], correct: 2, explanation: "A legislação trabalhista exige que o colaborador seja comunicado das férias com pelo menos 30 dias de antecedência, por escrito." },
          { q: "O que acontece se o colaborador não tirar férias dentro do período concessivo?", options: ["Perde o direito às férias", "As férias são pagas em dobro", "As férias são transferidas para o ano seguinte", "O empregador paga multa para o governo"], correct: 1, explanation: "Se o empregador não conceder as férias dentro do período concessivo, fica obrigado a pagar em dobro quando forem tiradas." },
        ]} />
      </div>
    </div>
  );
}

// ─── ABA 3 — CALENDÁRIO ─────────────────────────────────────────────────────
function TabCalendario() {
  const eventos = [
    { dia: "Antes de iniciar atividades", obrigacao: "eSocial S-2200 — Admissão", tipo: "Admissão", urgencia: "alta" },
    { dia: "Dia 07", obrigacao: "FGTS — recolhimento mensal (Caixa Econômica)", tipo: "Folha", urgencia: "alta" },
    { dia: "Dia 07", obrigacao: "GPS — INSS patronal e empregado", tipo: "Folha", urgencia: "alta" },
    { dia: "Dia 10", obrigacao: "DARF — IRRF sobre folha de pagamento", tipo: "Folha", urgencia: "alta" },
    { dia: "Até dia 20", obrigacao: "Envio da folha de pagamento ao cliente", tipo: "Folha", urgencia: "media" },
    { dia: "Até dia 10 (mês seguinte)", obrigacao: "eSocial — fechamento da folha (S-1299)", tipo: "eSocial", urgencia: "alta" },
    { dia: "Até 10 dias após desligamento", obrigacao: "eSocial S-2299 — Desligamento", tipo: "Demissão", urgencia: "alta" },
    { dia: "Até 2 dias antes das férias", obrigacao: "Pagamento das férias + 1/3", tipo: "Férias", urgencia: "alta" },
    { dia: "Novembro", obrigacao: "13º salário — 1ª parcela (50% até 30/11)", tipo: "13º", urgencia: "alta" },
    { dia: "Dezembro", obrigacao: "13º salário — 2ª parcela (até 20/12)", tipo: "13º", urgencia: "alta" },
    { dia: "Abril/ano seguinte", obrigacao: "RAIS — Relação Anual de Informações Sociais", tipo: "Anual", urgencia: "baixa" },
    { dia: "Março/ano seguinte", obrigacao: "DIRF — Declaração de IR Retido na Fonte", tipo: "Anual", urgencia: "baixa" },
  ];

  const urgenciaStyle: Record<string, string> = {
    alta:  "bg-red-100 text-red-700 border-red-200",
    media: "bg-yellow-100 text-yellow-700 border-yellow-200",
    baixa: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="space-y-4">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        📅 Calendário de referência do DP. Prazos podem variar conforme convenção coletiva e categoria profissional — sempre verifique.
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
              <th className="text-left px-4 py-3 text-xs font-semibold opacity-50">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((e, i) => (
              <tr key={i} className="border-b border-soma-border last:border-0 hover:bg-soma-bg/50">
                <td className="px-4 py-3 text-xs font-bold text-gold whitespace-nowrap">{e.dia}</td>
                <td className="px-4 py-3 text-xs font-medium">{e.obrigacao}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${urgenciaStyle[e.urgencia]}`}>{e.tipo}</span>
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
  const { checked, toggle, loading } = useChecklist("dp");

  const groups = [
    {
      group: "🖥️ Acesso e configuração",
      items:  ["acesso-folha", "acesso-esocial", "acesso-caixa", "acesso-receita", "acesso-gestor"],
      labels: ["Acesso ao sistema de folha de pagamento", "Acesso ao portal eSocial", "Acesso ao portal Caixa (FGTS)", "Acesso ao portal da Receita Federal (IRRF)", "Acesso ao Gestor de Documentos"],
    },
    {
      group: "📚 Treinamentos obrigatórios",
      items:  ["treino-clt", "treino-esocial", "treino-folha", "treino-rescisao", "treino-quizzes"],
      labels: ["Estudou os principais artigos da CLT aplicados ao DP", "Aprendeu a transmitir eventos no eSocial", "Treinou processamento de folha de pagamento", "Estudou os tipos de rescisão e verbas", "Completou os quizzes deste guia"],
    },
    {
      group: "📋 Conhecimento operacional",
      items:  ["op-calendario", "op-clientes", "op-convencoes", "op-fluxo", "op-nomenclatura"],
      labels: ["Conhece o calendário do DP completo", "Mapeou a carteira de clientes e categorias", "Verificou as convenções coletivas de cada cliente", "Entendeu o fluxo de trabalho do setor", "Domina a nomenclatura de arquivos do DP"],
    },
    {
      group: "✅ Primeiras semanas",
      items:  ["semana1-admissao", "semana1-folha", "semana1-esocial", "semana1-rescisao"],
      labels: ["Processou uma admissão com supervisão", "Processou uma folha completa com supervisão", "Transmitiu eventos no eSocial com supervisão", "Calculou uma rescisão com supervisão"],
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
          🎉 Parabéns! Onboarding do DP concluído com sucesso!
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
    { q: "Qual é o prazo para pagar a rescisão?", a: "Para aviso prévio trabalhado: até o 1º dia útil após o término. Para aviso prévio indenizado: até o 10º dia após a notificação. Para pedido de demissão sem aviso: até o 10º dia após a saída." },
    { q: "O colaborador faltou sem justificativa. O que fazer?", a: "Registre a falta no sistema. Se houver mais de 30 dias de faltas injustificadas no período de 12 meses, pode configurar abandono de emprego. Informe o cliente para que notifique o colaborador formalmente." },
    { q: "O cliente quer demitir por justa causa. Como proceder?", a: "Solicite ao cliente toda a documentação que embasa a justa causa (advertências, relatórios de ocorrência). Nunca processe demissão por justa causa sem documentação. Consulte o gestor antes de prosseguir." },
    { q: "Como funciona o aviso prévio proporcional?", a: "Pela Lei 12.506/2011, ao aviso prévio de 30 dias acrescentam-se 3 dias por ano de serviço completado, até o máximo de 60 dias adicionais. Total máximo: 90 dias." },
    { q: "O colaborador apresentou atestado médico. O que fazer?", a: "Lance o afastamento no eSocial (S-2230). Para afastamentos de até 15 dias, a empresa paga o salário. A partir do 16º dia, o INSS assume (auxílio-doença). Guarde o atestado original." },
    { q: "O cliente não quer pagar o FGTS, o que faço?", a: "Explique que o FGTS é obrigação legal e a multa por não recolhimento é de 10% sobre o valor não depositado. Informe o gestor se o cliente persistir. Nunca omita o recolhimento." },
    { q: "O que é o eSocial e quais eventos preciso conhecer?", a: "O eSocial é o sistema do governo que unifica o envio de informações trabalhistas. Os eventos principais são: S-2200 (admissão), S-2205 (alteração cadastral), S-2230 (afastamento), S-2299 (desligamento) e S-1299 (fechamento de folha)." },
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
export default function GuideDP() {
  return (
    <GuideLayout
      title="Departamento Pessoal"
      subtitle="Guia operacional do departamento pessoal"
      icon={Briefcase}
      tabs={[
        { key: "rotina",    label: "Rotina Diária", icon: Workflow,      content: <TabRotina /> },
        { key: "processos", label: "Processos",     icon: ClipboardList, content: <TabProcessos /> },
        { key: "calendario",label: "Calendário",    icon: Calendar,      content: <TabCalendario /> },
        { key: "checklist", label: "Checklist",     icon: CheckCircle2,  content: <TabChecklist /> },
        { key: "faq",       label: "FAQ",           icon: HelpCircle,    content: <TabFAQ /> },
      ]}
    />
  );
}