import { useState } from "react";
import {
  BookOpen, Workflow, ClipboardList, Calendar,
  CheckCircle2, HelpCircle, XCircle, ChevronDown, Search, Monitor
} from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import Quiz from "../../components/ui/Quiz";
import Steps from "../../components/ui/Steps";
import { useChecklist } from "../../hooks/useChecklist";
import { useGuideVideos } from "../../hooks/useGuideVideos";

// ─── Componente CertoErrado ───────────────────────────────────────────────────
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

// ─── ABA: ROTINA DIÁRIA ───────────────────────────────────────────────────────
function TabRotina() {
  const { videos } = useGuideVideos("contabil", "rotina");
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
        📋 A contabilidade é a linguagem financeira da empresa. <strong style={{ color: "var(--soma-text)" }}>Um lançamento errado hoje vira problema no balanço amanhã.</strong>
      </div>

      <Steps items={[
        {
          title: "Verificar documentos recebidos",
          desc: "Cheque diariamente os documentos enviados pelos clientes: notas fiscais, extratos bancários, recibos e comprovantes. Organize por cliente e competência antes de qualquer lançamento.",
          tip: "Crie uma pasta no Gestor de Documentos: CNPJ_Competência antes de começar.",
        },
        {
          title: "Classificar os documentos",
          desc: "Cada documento pertence a uma conta contábil. Classifique corretamente: receitas, despesas, ativos, passivos. Em dúvida, consulte o plano de contas do cliente.",
          tip: "Nunca lance sem saber exatamente em qual conta vai.",
          warn: "Classificação errada gera distorção no DRE e no Balanço Patrimonial.",
        },
        {
          title: "Lançar no sistema contábil",
          desc: "Realize os lançamentos no sistema (Domínio/Contabilizei). Débito e crédito sempre devem estar em equilíbrio. Verifique CNPJ, data de competência e valor antes de salvar.",
          tip: "Sempre use a data de competência, não a data do documento.",
        },
        {
          title: "Conciliar contas bancárias",
          desc: "Compare o extrato bancário com os lançamentos no sistema. Toda diferença precisa de justificativa. Conciliação em dia evita surpresas no fechamento mensal.",
          tip: "Concilie diariamente se o volume de transações for alto.",
        },
        {
          title: "Verificar pendências do dia anterior",
          desc: "Confira se ficou algum lançamento em aberto ou documento sem classificação. Pendências acumulam e comprometem o fechamento do mês.",
          warn: "Nunca feche o dia com lançamentos pendentes sem ao menos registrá-los.",
        },
        {
          title: "Registrar e arquivar",
          desc: "Salve todos os documentos processados no Gestor de Documentos seguindo o padrão de nomenclatura: CNPJ_NomeDocumento_MesAno.pdf.",
          tip: "Documento digital bem organizado vale tanto quanto o físico.",
        },
      ]} />

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Classifico cada documento antes de lançar, consultando o plano de contas.", errado: "Lanço tudo em contas genéricas para não perder tempo." },
          { certo: "Uso sempre a data de competência do documento.", errado: "Uso a data em que recebi o documento porque é mais fácil." },
          { certo: "Concilio o banco diariamente para não acumular diferenças.", errado: "Deixo a conciliação para o final do mês." },
        ]} />
      </div>

      <Quiz guide="contabil" tab="rotina" title="🧠 Quiz — Rotina Contábil" questions={[
        { q: "Qual data deve ser usada nos lançamentos contábeis?", options: ["Data de recebimento do documento", "Data de competência", "Data atual", "Data de vencimento"], correct: 1, explanation: "Sempre use a data de competência — o período em que o fato gerador ocorreu." },
        { q: "O extrato bancário mostra R$1.000 a mais que o sistema. O que fazer?", options: ["Ignorar a diferença", "Lançar a diferença em conta de resultado", "Investigar e justificar a diferença antes de qualquer lançamento", "Excluir o extrato"], correct: 2, explanation: "Toda diferença de conciliação precisa de justificativa antes de qualquer ajuste." },
        { q: "Você recebeu notas fiscais mas não sabe em qual conta lançar. O que fazer?", options: ["Lança em qualquer conta para não atrasar", "Consulta o plano de contas e, em dúvida, pergunta ao sênior", "Devolve o documento ao cliente", "Espera o cliente orientar"], correct: 1, explanation: "Na dúvida, consulte o plano de contas. Se ainda incerto, pergunte ao analista sênior antes de lançar errado." },
      ]} />
    </div>
  );
}

// ─── ABA: ESCRITURAÇÃO ────────────────────────────────────────────────────────
function TabEscrituração() {
  const { videos } = useGuideVideos("contabil", "escrituracao");
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
        📒 Escrituração é o registro formal e cronológico de todos os fatos contábeis. <strong style={{ color: "var(--soma-text)" }}>É a prova documental da vida financeira da empresa.</strong>
      </div>

      {[
        {
          icon: "📒", title: "Livro Diário", subtitle: "Registro cronológico de todos os lançamentos",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O Livro Diário registra todos os fatos contábeis em ordem cronológica. É obrigatório para todas as empresas com obrigação de escrituração contábil.</p>
            <Steps items={[
              { title: "Registrar diariamente", desc: "Todos os lançamentos do dia devem ser registrados no Livro Diário, sem rasuras ou omissões." },
              { title: "Autenticar o livro", desc: "O Livro Diário deve ser autenticado na Junta Comercial ou CRC antes de ser utilizado.", tip: "Escrituração digital via SPED dispensa autenticação em papel." },
              { title: "Guardar por 5 anos", desc: "Os livros contábeis devem ser guardados pelo prazo mínimo de 5 anos.", warn: "Para empresas com débitos tributários, guarde pelo prazo prescricional." },
            ]} />
          </div>
        },
        {
          icon: "📗", title: "Livro Razão", subtitle: "Controle por conta contábil",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O Razão agrupa os lançamentos por conta contábil, permitindo acompanhar o saldo de cada conta individualmente.</p>
            <Steps items={[
              { title: "Acompanhar saldos por conta", desc: "Use o Razão para verificar o saldo atual de qualquer conta: caixa, bancos, clientes, fornecedores." },
              { title: "Identificar lançamentos indevidos", desc: "Um saldo anormal numa conta é sinal de lançamento errado. Investigue antes do fechamento.", tip: "Analise o Razão semanalmente para detectar erros cedo." },
            ]} />
          </div>
        },
        {
          icon: "💻", title: "SPED Contábil (ECD)", subtitle: "Escrituração Contábil Digital — obrigatório para LP e LR",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>A ECD substitui os livros contábeis em papel para empresas do Lucro Presumido e Lucro Real. É transmitida anualmente ao SPED.</p>
            <Steps items={[
              { title: "Manter contabilidade em dia", desc: "A ECD é gerada a partir dos lançamentos do sistema. Contabilidade atrasada = ECD com erros.", warn: "ECD transmitida com atraso gera multa de R$500 por mês." },
              { title: "Gerar e validar o arquivo", desc: "Use o PVA (Programa Validador e Assinador) para gerar e validar o arquivo antes de transmitir.", tip: "Valide o arquivo com antecedência — não deixe para o último dia." },
              { title: "Assinar digitalmente e transmitir", desc: "O arquivo deve ser assinado com certificado digital do contador e do representante legal da empresa." },
            ]} />
            <div className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
              ⚠️ Prazo: último dia útil de junho do ano seguinte
            </div>
          </div>
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <Quiz guide="contabil" tab="escrituracao" title="🧠 Quiz — Escrituração" questions={[
        { q: "O que substitui os livros contábeis em papel para o Lucro Real?", options: ["DEFIS", "ECD (SPED Contábil)", "ECF", "DAS"], correct: 1, explanation: "A ECD — Escrituração Contábil Digital — substitui os livros Diário e Razão em papel." },
        { q: "Prazo de transmissão da ECD?", options: ["Último dia útil de março", "Último dia útil de maio", "Último dia útil de junho", "31 de dezembro"], correct: 2, explanation: "A ECD deve ser transmitida até o último dia útil de junho do ano seguinte." },
        { q: "Por quanto tempo mínimo guardar os livros contábeis?", options: ["1 ano", "3 anos", "5 anos", "10 anos"], correct: 2, explanation: "O prazo mínimo de guarda é de 5 anos, podendo ser maior para empresas com débitos tributários." },
      ]} />
    </div>
  );
}

// ─── ABA: DEMONSTRAÇÕES ───────────────────────────────────────────────────────
function TabDemonstracoes() {
  const { videos } = useGuideVideos("contabil", "demonstracoes");
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
        📊 As demonstrações contábeis são o produto final da contabilidade. <strong style={{ color: "var(--soma-text)" }}>São elas que o cliente, o banco e o Fisco analisam.</strong>
      </div>

      {[
        {
          icon: "⚖️", title: "Balanço Patrimonial", subtitle: "Fotografia da empresa em determinada data",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O Balanço mostra o que a empresa tem (Ativo), o que deve (Passivo) e o patrimônio dos sócios (PL). A equação fundamental: <strong>Ativo = Passivo + PL</strong>.</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { title: "ATIVO", color: "rgba(22,163,74,0.15)", border: "rgba(22,163,74,0.3)", text: "#4ade80", items: ["Caixa e bancos", "Contas a receber", "Estoques", "Imobilizado", "Intangível"] },
                { title: "PASSIVO + PL", color: "rgba(220,38,38,0.15)", border: "rgba(220,38,38,0.3)", text: "#f87171", items: ["Fornecedores", "Empréstimos", "Obrigações fiscais", "Capital social", "Lucros acumulados"] },
              ].map(({ title, color, border, text, items }) => (
                <div key={title} className="rounded-lg p-3 space-y-2" style={{ backgroundColor: color, border: `1px solid ${border}` }}>
                  <p className="font-bold" style={{ color: text }}>{title}</p>
                  {items.map(i => <p key={i} style={{ color: text, opacity: 0.85 }}>• {i}</p>)}
                </div>
              ))}
            </div>
          </div>
        },
        {
          icon: "📈", title: "DRE — Demonstração do Resultado", subtitle: "Lucro ou prejuízo do período",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>A DRE mostra se a empresa lucrou ou teve prejuízo no período. Parte da Receita Bruta e chega ao Lucro Líquido deduzindo custos, despesas e impostos.</p>
            <Steps items={[
              { title: "Receita Bruta", desc: "Tudo que a empresa faturou no período, antes de qualquer dedução." },
              { title: "(-) Deduções", desc: "Impostos sobre receita (ISS, PIS, COFINS, ICMS), devoluções e abatimentos." },
              { title: "= Receita Líquida", desc: "Receita Bruta menos as deduções." },
              { title: "(-) CPV / CSP", desc: "Custo do Produto Vendido ou Custo do Serviço Prestado.", tip: "Separar custo de despesa é fundamental para uma DRE correta." },
              { title: "= Lucro Bruto", desc: "Resultado antes das despesas operacionais." },
              { title: "(-) Despesas Operacionais", desc: "Despesas administrativas, comerciais, financeiras." },
              { title: "= Lucro Líquido", desc: "O resultado final do período — o que sobra para os sócios ou para reinvestimento." },
            ]} />
          </div>
        },
        {
          icon: "💸", title: "DFC — Demonstração do Fluxo de Caixa", subtitle: "Movimentação real de dinheiro",
          body: <div className="space-y-2">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>A DFC mostra de onde veio e para onde foi o dinheiro. É obrigatória para empresas de grande porte e muito útil para todas.</p>
            {[
              { tipo: "Atividades Operacionais", desc: "Caixa gerado ou consumido pela atividade principal da empresa.", color: "rgba(22,163,74,0.1)", border: "rgba(22,163,74,0.2)", text: "#4ade80" },
              { tipo: "Atividades de Investimento", desc: "Compra/venda de ativos imobilizados e investimentos.", color: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)", text: "#93c5fd" },
              { tipo: "Atividades de Financiamento", desc: "Empréstimos, pagamento de dívidas, aporte dos sócios.", color: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)", text: "#d8b4fe" },
            ].map(({ tipo, desc, color, border, text }) => (
              <div key={tipo} className="rounded-lg p-3 text-xs" style={{ backgroundColor: color, border: `1px solid ${border}` }}>
                <p className="font-bold mb-1" style={{ color: text }}>{tipo}</p>
                <p style={{ color: text, opacity: 0.85 }}>{desc}</p>
              </div>
            ))}
          </div>
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <Quiz guide="contabil" tab="demonstracoes" title="🧠 Quiz — Demonstrações" questions={[
        { q: "A equação fundamental do Balanço Patrimonial é:", options: ["Ativo = Passivo - PL", "Ativo = Passivo + PL", "PL = Ativo + Passivo", "Passivo = Ativo + PL"], correct: 1, explanation: "Ativo = Passivo + Patrimônio Líquido. É o princípio básico da contabilidade." },
        { q: "O que a DRE demonstra?", options: ["O saldo bancário da empresa", "O lucro ou prejuízo do período", "O fluxo de caixa", "O patrimônio dos sócios"], correct: 1, explanation: "A DRE mostra o resultado econômico — se a empresa lucrou ou teve prejuízo no período." },
        { q: "Qual a diferença entre lucro e caixa?", options: ["São a mesma coisa", "Lucro é econômico, caixa é financeiro — podem ser diferentes", "Caixa é sempre maior que o lucro", "Lucro só existe para Lucro Real"], correct: 1, explanation: "Uma empresa pode ter lucro contábil e caixa negativo (ou vice-versa) por conta do regime de competência." },
      ]} />
    </div>
  );
}

// ─── ABA: SISTEMAS ────────────────────────────────────────────────────────────
function TabSistemas() {
  const { videos } = useGuideVideos("contabil", "sistemas");
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
        💻 Dominar os sistemas é tão importante quanto dominar a teoria. <strong style={{ color: "var(--soma-text)" }}>Um analista que conhece bem as ferramentas entrega o dobro no mesmo tempo.</strong>
      </div>

      {[
        {
          icon: "🖥️", title: "Sistema Contábil (Domínio / Contabilizei)", subtitle: "Sistema principal de escrituração",
          body: <Steps items={[
            { title: "Configurar o cliente", desc: "Cadastre corretamente o cliente: CNPJ, regime tributário, plano de contas, atividade econômica (CNAE).", warn: "Configuração errada do regime gera lançamentos incorretos em todo o sistema." },
            { title: "Importar documentos fiscais", desc: "Importe as notas fiscais eletrônicas (XML) diretamente do sistema. Reduz retrabalho e erros de digitação.", tip: "Configure a importação automática de XML pelo email ou portal do cliente." },
            { title: "Realizar lançamentos manuais", desc: "Para documentos sem XML (recibos, extratos, planilhas), lance manualmente com atenção ao débito/crédito e à conta contábil correta." },
            { title: "Gerar balancetes e relatórios", desc: "Ao final de cada mês, gere o balancete de verificação para conferir se os saldos estão corretos antes do fechamento.", tip: "Nunca feche o mês sem revisar o balancete." },
            { title: "Exportar para o SPED", desc: "Gere os arquivos SPED (ECD, ECF) a partir do sistema contábil. Valide no PVA antes de transmitir." },
          ]} />
        },
        {
          icon: "📡", title: "SPED / PVA", subtitle: "Transmissão de obrigações digitais",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O SPED (Sistema Público de Escrituração Digital) centraliza obrigações contábeis e fiscais da Receita Federal.</p>
            {[
              { sigla: "ECD", nome: "Escrituração Contábil Digital", prazo: "Último dia útil de junho", quem: "LP e LR" },
              { sigla: "ECF", nome: "Escrituração Contábil Fiscal", prazo: "Último dia útil de julho", quem: "LP e LR" },
              { sigla: "EFD Contribuições", nome: "PIS/COFINS e CPRB", prazo: "10º dia útil do 2º mês", quem: "LP e LR" },
            ].map(({ sigla, nome, prazo, quem }) => (
              <div key={sigla} className="rounded-lg p-3 text-xs space-y-1" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
                <div className="flex items-center gap-2">
                  <span className="font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>{sigla}</span>
                  <span className="font-semibold" style={{ color: "var(--soma-text)" }}>{nome}</span>
                </div>
                <p style={{ color: "var(--soma-muted)" }}>📅 {prazo} &nbsp;|&nbsp; 👥 {quem}</p>
              </div>
            ))}
            <Steps items={[
              { title: "Gerar o arquivo no sistema contábil", desc: "Exporte o arquivo no formato .txt do sistema para o tipo de SPED correspondente." },
              { title: "Validar no PVA", desc: "Abra o PVA (Programa Validador e Assinador da Receita Federal), importe o arquivo e corrija todos os erros antes de prosseguir.", warn: "Não transmita com erros pendentes — a transmissão será rejeitada." },
              { title: "Assinar com certificado digital", desc: "Assine o arquivo com o certificado digital do contador responsável e do representante legal da empresa." },
              { title: "Transmitir e guardar o recibo", desc: "Transmita pelo portal SPED e salve o recibo de entrega. Sem recibo, não há prova de envio.", tip: "Salve o recibo no Gestor de Documentos: CNPJ_ECD_Ano.pdf" },
            ]} />
          </div>
        },
        {
          icon: "🏛️", title: "Gov.br / e-CAC", subtitle: "Portal da Receita Federal",
          body: <Steps items={[
            { title: "Acessar como contador", desc: "Use a procuração eletrônica do cliente para acessar o e-CAC em nome da empresa. Nunca use login pessoal do cliente.", warn: "Acesso sem procuração pode gerar problemas legais." },
            { title: "Consultar situação fiscal", desc: "Verifique regularidade de CNPJ, pendências, declarações entregues e débitos em aberto." },
            { title: "Acompanhar intimações", desc: "Verifique regularmente a Caixa Postal do e-CAC — intimações não respondidas geram auto de infração.", tip: "Configure alertas de email para novas mensagens na Caixa Postal." },
            { title: "Emitir certidões", desc: "Certidão Negativa de Débitos (CND) e CND para fins de licitação são emitidas pelo e-CAC ou por simples.receita.fazenda.gov.br." },
          ]} />
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <Quiz guide="contabil" tab="sistemas" title="🧠 Quiz — Sistemas" questions={[
        { q: "Antes de transmitir o SPED, o que é obrigatório?", options: ["Pagar uma taxa", "Validar no PVA e corrigir todos os erros", "Enviar por email para a Receita", "Imprimir o arquivo"], correct: 1, explanation: "O arquivo deve ser validado no PVA e sem erros antes da transmissão." },
        { q: "O que fazer ao receber uma intimação na Caixa Postal do e-CAC?", options: ["Ignorar se for de baixo valor", "Responder dentro do prazo após consultar o gestor", "Esperar o cliente avisar", "Deletar se não for relevante"], correct: 1, explanation: "Toda intimação deve ser respondida dentro do prazo. Consulte o gestor antes de responder." },
        { q: "Ao configurar um cliente novo no sistema, qual dado é mais crítico?", options: ["Cor do tema do sistema", "Regime tributário e plano de contas", "Nome do contador responsável", "Data de cadastro"], correct: 1, explanation: "O regime tributário define todas as obrigações e lançamentos. Configuração errada compromete tudo." },
      ]} />
    </div>
  );
}

// ─── ABA: CHECKLIST ───────────────────────────────────────────────────────────
function TabChecklist() {
  const { checked, toggle, loading } = useChecklist("contabil");

  const groups = [
    {
      group: "🖥️ Acesso e configuração",
      items: ["acesso-sistema-contabil", "acesso-sped-pva", "acesso-ecac", "acesso-gestor", "acesso-certificado"],
      labels: ["Acesso ao sistema contábil (Domínio/Contabilizei)", "PVA instalado e configurado", "Acesso ao e-CAC com procuração eletrônica", "Acesso ao Gestor de Documentos", "Certificado digital do escritório configurado"],
    },
    {
      group: "📚 Treinamentos obrigatórios",
      items: ["treino-plano-contas", "treino-lancamentos", "treino-conciliacao", "treino-sped", "treino-demonstracoes", "treino-quizzes"],
      labels: ["Estudou o plano de contas padrão", "Entendeu débito, crédito e partidas dobradas", "Aprendeu conciliação bancária", "Sabe gerar e transmitir SPED", "Conhece as principais demonstrações contábeis", "Completou os quizzes deste guia"],
    },
    {
      group: "📋 Conhecimento operacional",
      items: ["op-competencia", "op-clientes", "op-regimes", "op-nomenclatura", "op-prazos"],
      labels: ["Entende regime de competência vs caixa", "Mapeou carteira de clientes e regimes", "Conhece obrigações por regime tributário", "Domina nomenclatura de arquivos", "Conhece os prazos do SPED"],
    },
    {
      group: "✅ Primeiras semanas",
      items: ["semana1-acompanhou", "semana1-lancou", "semana1-conciliou", "semana1-sped"],
      labels: ["Acompanhou fechamento com analista sênior", "Realizou lançamentos supervisionado", "Fez primeira conciliação bancária com supervisão", "Acompanhou transmissão de SPED"],
    },
  ];

  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done = groups.reduce((a, g) => a + g.items.filter(id => checked[id]).length, 0);
  const pct = Math.round((done / total) * 100);

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando...</span>
    </div>
  );

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
                <span style={{ color: checked[id] ? "var(--soma-muted)" : "var(--soma-text)", textDecoration: checked[id] ? "line-through" : "none" }}>
                  {labels[idx]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {pct === 100 && (
        <div className="rounded-xl p-4 text-center text-sm font-semibold" style={{ backgroundColor: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.3)", color: "#4ade80" }}>
          🎉 Parabéns! Onboarding do Contábil concluído!
        </div>
      )}
    </div>
  );
}

// ─── ABA: FAQ ─────────────────────────────────────────────────────────────────
function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Qual a diferença entre regime de competência e regime de caixa?", a: "Regime de competência registra receitas e despesas no período em que ocorrem, independente do pagamento. Regime de caixa registra apenas quando o dinheiro entra ou sai. A contabilidade formal usa o regime de competência." },
    { q: "O cliente não enviou todos os documentos, o que faço?", a: "Não feche o mês com documentos faltando. Entre em contato com o cliente via CS, registre a pendência e aguarde. Informe o gestor se o cliente não responder em 2 dias úteis." },
    { q: "Encontrei um lançamento errado do mês anterior, como corrigir?", a: "Faça um lançamento de estorno (inverso ao errado) e depois o lançamento correto. Nunca delete ou altere um lançamento já fechado sem autorização do gestor." },
    { q: "O balancete não fecha — débitos ≠ créditos. O que faço?", a: "Revisar todos os lançamentos do período, um a um se necessário. A diferença sempre tem origem num lançamento mal feito. Nunca lance uma 'diferença' para equilibrar." },
    { q: "Quando é necessário fazer lançamento de depreciação?", a: "Todo mês, para todos os bens do ativo imobilizado que estejam em uso. A depreciação é calculada com base na vida útil do bem conforme tabela da Receita Federal." },
    { q: "Qual a diferença entre custo e despesa?", a: "Custo está diretamente ligado à produção do bem ou serviço (matéria-prima, mão de obra direta). Despesa é gasto necessário para administrar o negócio (aluguel, salário administrativo, energia). Essa distinção impacta diretamente o DRE." },
    { q: "O cliente pediu um balanço para o banco. O que entregar?", a: "Entregue o Balanço Patrimonial e a DRE do último exercício encerrado, assinados pelo contador com CRC. Informe o gestor antes de emitir para fins bancários — pode precisar de ajustes." },
    { q: "O SPED foi rejeitado na transmissão, o que fazer?", a: "Abra o PVA, verifique o log de erros, corrija cada problema apontado e retransmita. Se o erro for de sistema, acione o suporte técnico. Registre tudo e informe o gestor se estiver próximo do prazo." },
    { q: "Posso fazer lançamentos sem ter todos os documentos?", a: "Nunca. Lançamento sem documento de suporte é infração contábil. Provisões são permitidas mas devem ser claramente identificadas e revertidas quando o documento chegar." },
  ];

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--soma-muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar dúvida..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ backgroundColor: "var(--soma-card)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm py-8" style={{ color: "var(--soma-muted)" }}>Nenhuma dúvida encontrada.</p>
      )}

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

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────
export default function GuideContabil() {
  return (
    <GuideLayout
      title="Contábil"
      subtitle="Guia operacional do departamento contábil"
      icon={BookOpen}
      tabs={[
        { key: "rotina",         label: "Rotina Diária",    icon: Workflow,      content: <TabRotina /> },
        { key: "escrituracao",   label: "Escrituração",     icon: ClipboardList, content: <TabEscrituração /> },
        { key: "demonstracoes",  label: "Demonstrações",    icon: Calendar,      content: <TabDemonstracoes /> },
        { key: "sistemas",       label: "Sistemas",         icon: Monitor,       content: <TabSistemas /> },
        { key: "checklist",      label: "Checklist",        icon: CheckCircle2,  content: <TabChecklist /> },
        { key: "faq",            label: "FAQ",              icon: HelpCircle,    content: <TabFAQ /> },
      ]}
    />
  );
}