import { useState } from "react";
import {
  Users, Workflow, Wrench, FileCheck, HelpCircle, CheckCircle2,
  XCircle, ChevronDown, Search, Zap, AlertTriangle, BookOpen
} from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";
import VideoCard from "../../components/ui/VideoCard";
import Quiz from "../../components/ui/Quiz";
import Steps from "../../components/ui/Steps";
import { useChecklist } from "../../hooks/useChecklist";
import FluxoAtendimento from "../../components/ui/FluxoAtendimento";
import { useGuideVideos } from "../../hooks/useGuideVideos";

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
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

function InfoBox({ icon, text, strong }: { icon: string; text: string; strong?: string }) {
  return (
    <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
      {icon} {text}{strong && <strong style={{ color: "var(--soma-text)" }}> {strong}</strong>}
    </div>
  );
}

// ─── ABA 1: FLUXO ─────────────────────────────────────────────────────────────
function TabFluxo() {
  const { videos } = useGuideVideos("cs", "fluxo");
  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map(v => <VideoCard key={v.id} videoId={v.id} title={v.title} description={v.description ?? undefined} duration={v.duration ?? undefined} videoUrl={v.video_url ?? undefined} />)}
          </div>
        </div>
      )}

      <InfoBox icon="📋" text="O fluxo de atendimento é o coração do CS." strong="Nunca pule etapas. Cada passo existe por um motivo." />

      {/* Fluxograma interativo */}
      <FluxoAtendimento />

      <Steps items={[
        { title: "Receber o contato — SLA: 15 minutos", desc: "Todo contato chega via WhatsApp (OneCode), e-mail, telefone ou ticket (GClick). Você tem até 15 minutos para dar a primeira resposta no horário comercial.", tip: "Mesmo sem a resposta pronta, avise que recebeu e está verificando. O cliente precisa saber que foi ouvido." },
        { title: "Identificar e classificar a demanda", desc: "Antes de qualquer ação, classifique o tipo de demanda: dúvida simples, solicitação de documento, problema técnico, reclamação ou cancelamento. Cada tipo tem um caminho diferente.", tip: "Na dúvida sobre o tipo, pergunte mais ao cliente antes de agir. É melhor demorar 1 minuto a mais do que tomar a ação errada." },
        { title: "Abrir ticket no GClick", desc: "TODO atendimento vira ticket, sem exceção. Preencha: nome do cliente, CNPJ, tipo de demanda, canal de origem e descrição detalhada do que foi solicitado.", tip: "Abra o ticket enquanto ainda está na conversa com o cliente. Ticket aberto tarde = histórico perdido." },
        { title: "Resolver (até 30 min) ou encaminhar", desc: "Se você consegue resolver em até 30 minutos — resolve. Se é mais complexo, cria a tarefa no GClick com todos os detalhes e encaminha para o setor responsável (Fiscal, DP, Contábil).", tip: "Ao encaminhar, avise o cliente na hora: 'Estou encaminhando para o time de [setor], eles entrarão em contato em até [prazo]'." },
        { title: "Fechar o loop com o cliente", desc: "Sempre confirme com o cliente o que foi feito ou dê um prazo claro se ainda estiver em andamento. O cliente não deve ficar sem retorno em nenhum momento.", tip: "A sensação de 'ser ignorado' é a principal causa de reclamação. Um 'estamos trabalhando nisso' já muda tudo." },
        { title: "Fechar ou atualizar o ticket", desc: "Se resolvido, mude o status para 'Resolvido' no GClick. Se ainda em andamento, mantenha atualizado a cada 24h. Nunca deixe ticket parado sem atualização.", tip: "Sem retorno do cliente em 2 dias úteis, feche com 'Aguardou retorno do cliente' e registre o motivo." },
      ]} />

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>✅ Certo vs ❌ Errado</h3>
        <CertoErrado items={[
          { certo: "Abro o ticket imediatamente ao receber o contato, mesmo sem ter a resposta.", errado: "Espero resolver para só então abrir o ticket." },
          { certo: "Informo ao cliente que encaminhei para o setor X e dou um prazo.", errado: "Encaminho internamente e deixo o cliente sem saber o que aconteceu." },
          { certo: "Reclamações graves vão para o gestor ANTES de qualquer resposta ao cliente.", errado: "Tento resolver sozinho para não incomodar o gestor." },
          { certo: "Resolvo o que leva até 30 minutos. O resto crio tarefa e encaminho.", errado: "Tento resolver tudo sozinho, mesmo demorando horas." },
        ]} />
      </div>

      <Quiz guide="cs" tab="fluxo" title="🧠 Quiz — Fluxo de Atendimento" questions={[
        { q: "Um cliente manda mensagem às 19h reclamando. O que fazer?", options: ["Respondo na hora pedindo desculpas", "Respondo no próximo dia útil até as 9h e registro o caso", "Ignoro pois está fora do horário", "Encaminho para o gestor na hora"], correct: 1, explanation: "Fora do horário comercial, retorne no próximo dia útil. Mas registre o caso agora para não esquecer." },
        { q: "Uma solicitação vai levar 2 horas para resolver. O que fazer?", options: ["Resolve sozinho sem avisar", "Cria tarefa no GClick e encaminha para o setor responsável avisando o cliente", "Ignora e responde quando resolver", "Pede o cliente para ligar"], correct: 1, explanation: "Qualquer demanda acima de 30 minutos deve ser registrada no GClick e encaminhada, com o cliente informado." },
        { q: "Cliente pediu cancelamento. Qual é o primeiro passo?", options: ["Confirma o cancelamento imediatamente", "Tenta convencer o cliente a ficar", "Escala ao gestor SEM confirmar ou negar e registra no GClick", "Encaminha para o Fiscal"], correct: 2, explanation: "Cancelamento NUNCA é confirmado ou negado pelo CS. Sempre escala ao gestor primeiro." },
        { q: "Quando atualizar o status de um ticket aberto?", options: ["Só quando resolver", "A cada 24 horas", "A cada semana", "Quando o cliente perguntar"], correct: 1, explanation: "Todo ticket aberto deve ser atualizado a cada 24h, mesmo que o status seja 'em andamento'." },
      ]} />
    </div>
  );
}

// ─── ABA 2: TAREFAS RÁPIDAS ───────────────────────────────────────────────────
function TabTarefas() {
  const { videos } = useGuideVideos("cs", "tarefas");
  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map(v => <VideoCard key={v.id} videoId={v.id} title={v.title} description={v.description ?? undefined} duration={v.duration ?? undefined} videoUrl={v.video_url ?? undefined} />)}
          </div>
        </div>
      )}

      <InfoBox icon="⚡" text="Tarefas rápidas são resolvidas pelo CS sem precisar escalar." strong="Até 30 minutos — você resolve. Acima disso — cria tarefa e encaminha." />

      {[
        {
          icon: "📄", title: "Emissão de DAS — Simples Nacional", subtitle: "Para clientes MEI, ME e EPP",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O DAS é a guia unificada do Simples Nacional. O CS pode emitir para clientes que solicitam 2ª via ou perderam o boleto.</p>
            <Steps items={[
              { title: "Acessar o portal do Simples Nacional", desc: "Acesse simples.receita.fazenda.gov.br com o certificado digital da empresa ou procuração eletrônica.", tip: "Nunca use o login pessoal do cliente — use sempre a procuração do escritório." },
              { title: "Localizar o cliente pelo CNPJ", desc: "Informe o CNPJ da empresa e verifique a competência solicitada (mês/ano do DAS)." },
              { title: "Gerar o DAS", desc: "Selecione a competência e gere o boleto. Confira o valor, o CNPJ e a data de vencimento antes de enviar.", tip: "Se o DAS já estiver vencido, o sistema gera automaticamente com multa e juros." },
              { title: "Enviar ao cliente", desc: "Encaminhe o PDF pelo OneCode com o vencimento destacado. Use o script padrão de envio de documento.", tip: "Sempre destaque o prazo de pagamento. Cliente que não sabe o vencimento não paga." },
              { title: "Registrar no GClick e arquivar", desc: "Salve o DAS no Gestor: CNPJ_DAS_MesAno.pdf e marque o ticket como resolvido." },
            ]} />
          </div>
        },
        {
          icon: "📋", title: "Emissão de DARF", subtitle: "Para clientes Lucro Presumido e Lucro Real",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O DARF é usado para pagamento de tributos federais fora do Simples. O CS emite DARFs de tributos conhecidos, como IRRF e PIS/COFINS simples.</p>
            <Steps items={[
              { title: "Confirmar o tributo e período", desc: "Antes de emitir, confirme com o fiscal qual tributo, competência e valor. Nunca emita DARF sem confirmação do setor responsável.", warn: "DARF com valor errado gera débito fiscal. Sempre confirme com o Fiscal antes." },
              { title: "Acessar o SICALC (Receita Federal)", desc: "Acesse o SICALC em sicalc.receita.fazenda.gov.br para calcular com multa e juros se vencido." },
              { title: "Preencher os dados", desc: "Código do tributo, período de apuração, data de vencimento e valor principal. Confira duas vezes antes de gerar." },
              { title: "Gerar, enviar e arquivar", desc: "Encaminhe ao cliente pelo OneCode com todas as instruções de pagamento. Salve no Gestor de Documentos." },
            ]} />
          </div>
        },
        {
          icon: "📜", title: "Certidão Negativa de Débitos (CND)", subtitle: "Prova de regularidade fiscal federal",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>A CND comprova que a empresa está em dia com a Receita Federal. Clientes pedem para licitações, contratos e financiamentos.</p>
            <Steps items={[
              { title: "Verificar regularidade antes de emitir", desc: "Acesse o e-CAC com a procuração do cliente e verifique se há débitos pendentes. CND só sai se estiver tudo em dia.", tip: "Se tiver débito, informe o Fiscal ANTES de informar o cliente — pode ser parcelamento ou erro." },
              { title: "Emitir no portal da Receita", desc: "Acesse servicos.receita.fazenda.gov.br/servicos/certidao e emita com o CNPJ do cliente." },
              { title: "Conferir prazo de validade", desc: "A CND tem validade de 180 dias. Informe o cliente a data de validade junto com o envio.", tip: "Salve com o prazo no nome: CNPJ_CND_Validade20260401.pdf" },
              { title: "Enviar e arquivar", desc: "Encaminhe pelo OneCode com a data de validade destacada. Salve no Gestor de Documentos do cliente." },
            ]} />
          </div>
        },
        {
          icon: "📁", title: "Envio de Documentos pelo Gestor", subtitle: "Guias, contratos, declarações e relatórios",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Envio de qualquer documento arquivado no Gestor de Documentos para o cliente.</p>
            <Steps items={[
              { title: "Localizar o documento no Gestor", desc: "Acesse a pasta do cliente pelo CNPJ. Siga a estrutura: CNPJ → Fiscal / DP / Financeiro / Contratos.", tip: "Use a busca do Gestor com o padrão CNPJ_NomeDocumento para achar rápido." },
              { title: "Verificar se é o documento correto", desc: "Confira o nome, a competência e o conteúdo antes de enviar. Enviar documento errado gera retrabalho e constrangimento." },
              { title: "Enviar pelo canal correto", desc: "Envie pelo OneCode (WhatsApp) para o contato cadastrado. Para documentos confidenciais, use e-mail.", warn: "Nunca envie documentos para contatos não cadastrados sem autorização do gestor." },
              { title: "Registrar o envio no GClick", desc: "Abra um ticket ou atualize o existente com: 'Documento [nome] enviado para o contato [nome] em [data/hora]'." },
            ]} />
          </div>
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <Quiz guide="cs" tab="tarefas" title="🧠 Quiz — Tarefas Rápidas" questions={[
        { q: "O cliente pediu o DAS vencido há 3 meses. O que acontece ao emitir?", options: ["Sai sem multa", "Sai com multa e juros calculados automaticamente", "Não é possível emitir", "Precisa do Fiscal para emitir"], correct: 1, explanation: "O sistema calcula multa e juros automaticamente. Informe o cliente antes de enviar o valor." },
        { q: "Você precisa emitir um DARF mas não sabe o valor. O que fazer?", options: ["Emite com valor estimado", "Confirma com o setor Fiscal antes de emitir", "Pede o cliente para calcular", "Emite zerado"], correct: 1, explanation: "NUNCA emita DARF sem confirmação do Fiscal. Valor errado gera débito fiscal para o cliente." },
        { q: "Cliente pediu a CND mas tem débito no e-CAC. O que fazer?", options: ["Emite mesmo assim", "Informa o cliente que não tem CND disponível", "Informa o Fiscal primeiro, antes de falar com o cliente", "Aguarda o débito sumir"], correct: 2, explanation: "Sempre informe o Fiscal antes. Pode ser um débito em parcelamento, erro ou algo que precisa de tratamento." },
      ]} />
    </div>
  );
}

// ─── ABA 3: FERRAMENTAS ───────────────────────────────────────────────────────
function TabFerramentas() {
  const { videos } = useGuideVideos("cs", "ferramentas");
  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map(v => <VideoCard key={v.id} videoId={v.id} title={v.title} description={v.description ?? undefined} duration={v.duration ?? undefined} videoUrl={v.video_url ?? undefined} />)}
          </div>
        </div>
      )}

      <InfoBox icon="🛠️" text="Dominar as ferramentas é metade do trabalho do CS." strong="Quem conhece o sistema fundo entrega mais rápido e erra menos." />

      {[
        {
          icon: "💬", title: "OneCode", subtitle: "Central de WhatsApp corporativo", badge: "Principal",
          body: <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O OneCode centraliza todos os WhatsApps do escritório em um único painel. Todo atendimento via WhatsApp passa por aqui.</p>
            <Steps items={[
              { title: "Login individual", desc: "Cada analista tem seu próprio acesso. Nunca compartilhe login — cada conversa fica vinculada ao seu usuário.", warn: "Usar login de outro analista é falta grave. Em caso de problema técnico, chame o TI." },
              { title: "Etiquetas de conversa", desc: "Classifique toda conversa: 🟡 Em andamento | 🔵 Aguardando cliente | 🟢 Resolvido | 🔴 Escalado", tip: "Etiqueta desatualizada = situação invisível para o gestor." },
              { title: "Atalhos de mensagem", desc: "Configure atalhos para os scripts mais usados. Digite '/' para acessar. Economiza tempo e mantém o padrão de comunicação.", tip: "Crie atalhos para: primeiro contato, em andamento, resolvido, encaminhamento, ausência." },
              { title: "Arquivar conversa", desc: "Só arquive uma conversa quando o ticket no GClick estiver fechado. Nunca arquive sem registrar.", warn: "Conversa arquivada sem ticket = atendimento sem rastro." },
            ]} />
            <CertoErrado items={[
              { certo: "Uso o OneCode para 100% dos contatos via WhatsApp.", errado: "Uso meu WhatsApp pessoal porque é mais prático." },
              { certo: "Atualizo a etiqueta da conversa a cada mudança de status.", errado: "Deixo todas as conversas com a etiqueta 'Em andamento'." },
            ]} />
          </div>
        },
        {
          icon: "🎫", title: "GClick", subtitle: "Sistema de tickets e chamados", badge: "Principal",
          body: <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>O GClick é o centro de controle do CS. Tudo que acontece no atendimento precisa estar registrado aqui.</p>
            <div className="space-y-2">
              {[
                { status: "🔵 Aberto", desc: "Recebido, ainda não iniciado", color: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.3)", text: "#93c5fd" },
                { status: "🟡 Em andamento", desc: "Sendo tratado pelo CS ou setor", color: "rgba(234,179,8,0.15)", border: "rgba(234,179,8,0.3)", text: "#fde047" },
                { status: "🟠 Aguardando cliente", desc: "Esperando informação ou confirmação", color: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", text: "#fdba74" },
                { status: "🟣 Escalado", desc: "Encaminhado para outro setor", color: "rgba(168,85,247,0.15)", border: "rgba(168,85,247,0.3)", text: "#d8b4fe" },
                { status: "🔴 Cancelamento", desc: "Aguardando decisão do gestor", color: "rgba(220,38,38,0.15)", border: "rgba(220,38,38,0.3)", text: "#f87171" },
                { status: "🟢 Resolvido", desc: "Concluído e confirmado com o cliente", color: "rgba(22,163,74,0.15)", border: "rgba(22,163,74,0.3)", text: "#86efac" },
              ].map(({ status, desc, color, border, text }) => (
                <div key={status} className="flex items-center gap-3 p-2.5 rounded-lg text-xs" style={{ backgroundColor: color, border: `1px solid ${border}` }}>
                  <span className="font-bold w-44 shrink-0" style={{ color: text }}>{status}</span>
                  <span style={{ color: text, opacity: 0.8 }}>{desc}</span>
                </div>
              ))}
            </div>
            <Steps items={[
              { title: "Preencher o ticket corretamente", desc: "Cliente, CNPJ, canal de origem (WhatsApp/email/telefone), tipo de demanda, descrição detalhada. Quanto mais detalhes, mais fácil resolver.", tip: "Imagine que outro analista vai pegar esse ticket. Ele precisa entender tudo sem te perguntar nada." },
              { title: "Atualizar a cada 24h", desc: "Se o ticket não está resolvido, atualize com o status atual todos os dias.", warn: "Ticket parado por mais de 24h sem atualização aparece no relatório do gestor." },
              { title: "Fechar com observação", desc: "Ao fechar, descreva resumidamente o que foi feito: 'DAS emitido e enviado via WhatsApp em 10/04/2026'." },
            ]} />
          </div>
        },
        {
          icon: "📁", title: "Gestor de Documentos", subtitle: "Repositório de arquivos por cliente",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Todos os documentos dos clientes ficam organizados aqui. Estrutura padronizada facilita encontrar qualquer arquivo em segundos.</p>
            <div className="rounded-lg p-4 text-xs font-mono space-y-1" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
              <p>📁 <strong style={{ color: "var(--soma-text)" }}>12345678000199/</strong></p>
              <p className="pl-4">📂 Fiscal/</p>
              <p className="pl-8 text-xs">12345678_DAS_Abril2026.pdf</p>
              <p className="pl-4">📂 DP/</p>
              <p className="pl-4">📂 Financeiro/</p>
              <p className="pl-4">📂 Contratos/</p>
            </div>
            <Steps items={[
              { title: "Sempre salve na pasta correta", desc: "Pasta principal = CNPJ da empresa. Subpasta conforme o tipo: Fiscal, DP, Financeiro ou Contratos.", warn: "Documento salvo fora da pasta certa é documento perdido." },
              { title: "Siga o padrão de nomenclatura", desc: "CNPJ_NomeDocumento_MesAno.pdf — Ex: 12345678_DAS_Abril2026.pdf", tip: "Padrão correto = busca rápida para você e para qualquer colega." },
              { title: "Nunca substitua sem backup", desc: "Se precisar atualizar um documento, mantenha o anterior com sufixo _v1, _v2." },
            ]} />
          </div>
        },
      ].map(({ icon, title, subtitle, badge, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle} badge={badge}>{body}</GuideCard>
      ))}

      <Quiz guide="cs" tab="ferramentas" title="🧠 Quiz — Ferramentas" questions={[
        { q: "Padrão correto para nomear um arquivo de DAS de abril de 2026?", options: ["DAS_abril.pdf", "12345678_DAS_Abril2026.pdf", "DAS_cliente_2026.pdf", "NomeCliente_DAS.pdf"], correct: 1, explanation: "O padrão é CNPJ_NomeDocumento_MesAno.pdf. Facilita busca e identifica cliente sem abrir o arquivo." },
        { q: "Um ticket ficou 3 dias sem atualização. O que deveria ter acontecido?", options: ["Nada, é normal", "Atualizado a cada 24h com o status atual", "Fechado automaticamente", "Escalado ao gestor"], correct: 1, explanation: "Todo ticket aberto deve ser atualizado diariamente, mesmo que a resposta seja 'ainda em andamento'." },
        { q: "Qual ferramenta deve ser usada para TODO atendimento via WhatsApp?", options: ["WhatsApp pessoal", "WhatsApp Web da empresa", "OneCode", "GClick"], correct: 2, explanation: "O OneCode centraliza todos os WhatsApps. Usar WhatsApp pessoal é falta grave." },
      ]} />
    </div>
  );
}

// ─── ABA 4: SCRIPTS ───────────────────────────────────────────────────────────
function TabScripts() {
  const [copied, setCopied] = useState<string | null>(null);
  const [categoria, setCategoria] = useState("todos");

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const scripts = [
    { key: "primeiro", cat: "basico", icon: "👋", title: "Primeiro contato", quando: "Use ao iniciar qualquer atendimento.", texto: "Olá, [Nome]! 😊\nAqui é [Seu nome], da Soma Prime.\nComo posso te ajudar hoje?" },
    { key: "andamento", cat: "basico", icon: "⏳", title: "Solicitação em andamento", quando: "Quando precisa de tempo para resolver.", texto: "Olá, [Nome]! Recebemos sua solicitação e já estamos tratando. 👍\nPrazo previsto: [data/horário].\nAssim que tiver novidade, te aviso por aqui!" },
    { key: "resolvido", cat: "basico", icon: "✅", title: "Resolução concluída", quando: "Feche todo atendimento com esse script.", texto: "Olá, [Nome]! Sua solicitação foi concluída. ✅\n[Descreva o que foi feito]\nQualquer dúvida, é só chamar. Tenha um ótimo dia! 😊" },
    { key: "encaminhar", cat: "basico", icon: "📤", title: "Encaminhar para outro setor", quando: "Quando a demanda vai para Fiscal, DP ou Contábil.", texto: "Olá, [Nome]! Entendi sua solicitação.\nVou encaminhar para o nosso time de [Fiscal/DP/Contábil].\nEles entrarão em contato em até [prazo]. 😊" },
    { key: "ausencia", cat: "basico", icon: "🌙", title: "Mensagem de ausência", quando: "Configure no OneCode para fora do horário.", texto: "Olá! 😊 Nosso atendimento é de segunda a sexta, das 8h às 18h.\nRetornaremos no próximo dia útil. Obrigado!" },
    { key: "documento", cat: "documentos", icon: "📄", title: "Envio de documento", quando: "Ao enviar qualquer guia, certidão ou documento.", texto: "Olá, [Nome]! Segue em anexo [nome do documento] referente a [competência/período]. 📎\n⚠️ Prazo de pagamento/validade: [data]\nQualquer dúvida, estou à disposição! 😊" },
    { key: "das", cat: "documentos", icon: "📋", title: "Envio de DAS", quando: "Ao enviar o DAS do Simples Nacional.", texto: "Olá, [Nome]! Segue o DAS referente a [mês/ano]. 📎\n⚠️ Vencimento: [data]\n💰 Valor: R$ [valor]\nDisponível para pagamento em qualquer banco ou app. 😊" },
    { key: "cnd", cat: "documentos", icon: "📜", title: "Envio de Certidão (CND)", quando: "Ao enviar certidão negativa de débitos.", texto: "Olá, [Nome]! Segue a Certidão Negativa de Débitos da [nome da empresa]. 📎\n✅ Situação: Regular\n📅 Válida até: [data]\nQualquer dúvida, é só falar! 😊" },
    { key: "reclamacao", cat: "critico", icon: "😔", title: "Reclamação — Primeiro retorno", quando: "Primeira resposta a uma reclamação. Use APÓS orientação do gestor.", texto: "Olá, [Nome]. Recebemos seu contato e lamentamos muito pelo transtorno. 🙏\nJá estamos priorizando sua situação e retornaremos em até [prazo] com uma solução.\nObrigado pela sua compreensão." },
    { key: "atraso", cat: "critico", icon: "⏰", title: "Atraso na entrega", quando: "Quando um documento ou serviço atrasou.", texto: "Olá, [Nome]. Identificamos um atraso na entrega de [documento/serviço]. 🙏\nPedimos desculpas pelo inconveniente. Já estamos priorizando e retornaremos até [prazo].\nAgradecemos sua paciência." },
    { key: "cancelamento", cat: "critico", icon: "🔴", title: "Cancelamento — Recebimento", quando: "Apenas para confirmar o RECEBIMENTO do pedido. NÃO confirme o cancelamento.", texto: "Olá, [Nome]. Recebemos sua solicitação e já estamos verificando.\nEm breve nossa equipe entrará em contato para dar continuidade. 😊" },
    { key: "cobranca", cat: "critico", icon: "💰", title: "Cliente questiona cobrança", quando: "Quando o cliente não entende ou questiona o valor cobrado.", texto: "Olá, [Nome]! Entendo sua dúvida sobre a cobrança. 😊\nVou verificar os detalhes internamente e te retorno em breve com todas as informações.\nPode deixar comigo!" },
  ];

  const categorias = [
    { key: "todos", label: "Todos" },
    { key: "basico", label: "Básicos" },
    { key: "documentos", label: "Documentos" },
    { key: "critico", label: "⚠️ Críticos" },
  ];

  const filtrados = categoria === "todos" ? scripts : scripts.filter(s => s.cat === categoria);

  return (
    <div className="space-y-4">
      <InfoBox icon="💬" text="Scripts são guias, não robôs." strong="Adapte o tom para cada cliente — MEI pede linguagem simples, grande empresa pede mais formalidade." />

      {/* Filtro por categoria */}
      <div className="flex gap-2 flex-wrap">
        {categorias.map(c => (
          <button key={c.key} onClick={() => setCategoria(c.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: categoria === c.key ? "#f5a623" : "var(--soma-card)",
              color: categoria === c.key ? "#000" : "var(--soma-muted)",
              border: `1px solid ${categoria === c.key ? "#f5a623" : "var(--soma-border)"}`,
            }}>
            {c.label}
          </button>
        ))}
      </div>

      {filtrados.map(({ key, icon, title, texto, quando, cat }) => (
        <div key={key} className="rounded-xl border p-4 space-y-3" style={{
          backgroundColor: "var(--soma-card)",
          borderColor: cat === "critico" ? "rgba(220,38,38,0.3)" : "var(--soma-border)"
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <span className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{title}</span>
              {cat === "critico" && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(220,38,38,0.15)", color: "#f87171", border: "1px solid rgba(220,38,38,0.2)" }}>
                  Atenção
                </span>
              )}
            </div>
          </div>
          <p className="text-xs italic" style={{ color: "var(--soma-muted)" }}>📌 {quando}</p>
          <div className="rounded-lg p-4 text-sm font-mono leading-relaxed whitespace-pre-line"
            style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>
            {texto}
          </div>
          <button onClick={() => copy(texto, key)}
            className="w-full py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{
              backgroundColor: copied === key ? "rgba(22,163,74,0.2)" : "rgba(245,166,35,0.1)",
              color: copied === key ? "#4ade80" : "#f5a623",
              border: `1px solid ${copied === key ? "rgba(22,163,74,0.3)" : "rgba(245,166,35,0.2)"}`,
            }}>
            {copied === key ? "✅ Copiado!" : "📋 Copiar script"}
          </button>
        </div>
      ))}

      <Quiz guide="cs" tab="scripts" title="🧠 Quiz — Scripts" questions={[
        { q: "Cliente questiona um cancelamento. Qual script usar?", options: ["Script de resolução concluída", "Script de cancelamento — confirma o RECEBIMENTO sem confirmar o cancelamento", "Script de pedido de desculpas", "Script de primeiro contato"], correct: 1, explanation: "O script de cancelamento confirma apenas o recebimento. Nunca confirme ou negue o cancelamento — passe para o gestor." },
        { q: "Você enviou um DAS. O que DEVE estar destacado na mensagem?", options: ["Seu nome", "O vencimento e o valor", "O CNPJ da empresa", "O sistema usado para emitir"], correct: 1, explanation: "Cliente que não vê o vencimento não paga. Sempre destaque a data e o valor." },
        { q: "Cliente de grande porte reclamou. Como adaptar o script?", options: ["Usa o mesmo script de sempre", "Usa linguagem mais formal e objetiva, sem emojis em excesso", "Usa emojis para descontrair", "Não responde e passa direto para o gestor"], correct: 1, explanation: "Scripts são guias. Empresas maiores pedem tom mais formal. Adapte sem perder o padrão de conteúdo." },
      ]} />
    </div>
  );
}

// ─── ABA 5: PERFIL DE CLIENTES ────────────────────────────────────────────────
function TabClientes() {
  const { videos } = useGuideVideos("cs", "clientes");
  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map(v => <VideoCard key={v.id} videoId={v.id} title={v.title} description={v.description ?? undefined} duration={v.duration ?? undefined} videoUrl={v.video_url ?? undefined} />)}
          </div>
        </div>
      )}

      <InfoBox icon="👥" text="Cada porte de empresa tem um perfil diferente." strong="Atender um MEI do mesmo jeito que uma holding é erro garantido." />

      {[
        {
          icon: "🟢", title: "MEI — Microempreendedor Individual", subtitle: "Faturamento até R$ 81 mil/ano",
          body: <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)" }}>
                <p className="font-bold" style={{ color: "#4ade80" }}>✅ Como é</p>
                <ul className="space-y-1" style={{ color: "#4ade80", opacity: 0.9 }}>
                  <li>• Linguagem simples e direta</li>
                  <li>• Não entende termos técnicos</li>
                  <li>• Precisa de explicação passo a passo</li>
                  <li>• Muito sensível ao valor cobrado</li>
                  <li>• Responde rápido no WhatsApp</li>
                </ul>
              </div>
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)" }}>
                <p className="font-bold" style={{ color: "#f5a623" }}>💡 Como atender</p>
                <ul className="space-y-1" style={{ color: "#f5a623", opacity: 0.9 }}>
                  <li>• Evite jargões como "PGDAS" ou "CNAE"</li>
                  <li>• Explique o que é antes de pedir</li>
                  <li>• Destaque muito bem o vencimento</li>
                  <li>• Seja paciente com dúvidas básicas</li>
                  <li>• Use emoji com moderação 😊</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd" }}>
              📌 <strong>Demandas mais comuns:</strong> "Como pago meu DAS?", "Preciso de nota fiscal", "O que é essa cobrança?"
            </div>
          </div>
        },
        {
          icon: "🔵", title: "ME / Pequeno Porte", subtitle: "Faturamento até R$ 4,8 milhões/ano",
          body: <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)" }}>
                <p className="font-bold" style={{ color: "#93c5fd" }}>✅ Como é</p>
                <ul className="space-y-1" style={{ color: "#93c5fd", opacity: 0.9 }}>
                  <li>• Já tem algum conhecimento contábil</li>
                  <li>• Mais exigente com prazos</li>
                  <li>• Tem sócio ou contador próprio às vezes</li>
                  <li>• Prefere respostas completas</li>
                </ul>
              </div>
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)" }}>
                <p className="font-bold" style={{ color: "#f5a623" }}>💡 Como atender</p>
                <ul className="space-y-1" style={{ color: "#f5a623", opacity: 0.9 }}>
                  <li>• Tom profissional mas amigável</li>
                  <li>• Cumpra rigorosamente os prazos</li>
                  <li>• Confirme recebimentos</li>
                  <li>• Se comprometeu, entregue</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd" }}>
              📌 <strong>Demandas mais comuns:</strong> Guias e certidões, envio de relatórios, dúvidas sobre obrigações
            </div>
          </div>
        },
        {
          icon: "🟡", title: "Médio Porte", subtitle: "Faturamento de R$ 4,8M a R$ 78M/ano",
          body: <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <p className="font-bold" style={{ color: "#fde047" }}>✅ Como é</p>
                <ul className="space-y-1" style={{ color: "#fde047", opacity: 0.9 }}>
                  <li>• Tem equipe interna de financeiro</li>
                  <li>• Muito exigente com SLA</li>
                  <li>• Múltiplos contatos (sócios, gerentes)</li>
                  <li>• Documenta tudo por e-mail</li>
                </ul>
              </div>
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)" }}>
                <p className="font-bold" style={{ color: "#f5a623" }}>💡 Como atender</p>
                <ul className="space-y-1" style={{ color: "#f5a623", opacity: 0.9 }}>
                  <li>• Sempre confirme por e-mail</li>
                  <li>• Nunca prometa prazo que não cumpre</li>
                  <li>• Identifique quem é o decisor</li>
                  <li>• Escale rápido ao gestor</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", color: "#fde047" }}>
              📌 <strong>Demandas mais comuns:</strong> Relatórios gerenciais, certidões para licitação, obrigações acessórias complexas
            </div>
          </div>
        },
        {
          icon: "🔴", title: "Grande Porte / Holding", subtitle: "Faturamento acima de R$ 78M/ano",
          body: <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <p className="font-bold" style={{ color: "#f87171" }}>✅ Como é</p>
                <ul className="space-y-1" style={{ color: "#f87171", opacity: 0.9 }}>
                  <li>• Comunicação formal e por e-mail</li>
                  <li>• Prazos rígidos e documentados</li>
                  <li>• Múltiplas empresas no CNPJ</li>
                  <li>• Qualquer erro tem impacto alto</li>
                </ul>
              </div>
              <div className="rounded-lg p-3 space-y-2" style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)" }}>
                <p className="font-bold" style={{ color: "#f5a623" }}>💡 Como atender</p>
                <ul className="space-y-1" style={{ color: "#f5a623", opacity: 0.9 }}>
                  <li>• Linguagem 100% formal</li>
                  <li>• Tudo por e-mail com protocolo</li>
                  <li>• Qualquer dúvida — consulte o gestor</li>
                  <li>• Nunca tome decisão sozinho</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg p-3 text-xs" style={{ backgroundColor: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
              ⚠️ <strong>Atenção:</strong> Qualquer demanda de grande porte fora do padrão deve ser escalada ao gestor imediatamente.
            </div>
          </div>
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <Quiz guide="cs" tab="clientes" title="🧠 Quiz — Perfil de Clientes" questions={[
        { q: "Um MEI pergunta 'O que é DAS?'. Como você responde?", options: ["'É o Documento de Arrecadação do Simples Nacional, código 6014'", "'É o boleto mensal do seu CNPJ como MEI — você paga todo mês para manter sua empresa regularizada'", "'Acesse o portal do Simples e veja'", "'Fala com o Fiscal'"], correct: 1, explanation: "MEI precisa de linguagem simples. Explique o que é antes de qualquer ação técnica." },
        { q: "Um cliente médio porte pediu um prazo e você não tem certeza se consegue cumprir. O que fazer?", options: ["Promete o prazo para não deixar o cliente sem resposta", "Consulta o setor responsável e só confirma o prazo quando tiver certeza", "Não responde até ter certeza", "Passa para o gestor responder"], correct: 1, explanation: "Nunca prometa prazo que não pode cumprir. Verifique antes e confirme com segurança." },
        { q: "Grande porte pediu uma certidão urgente por WhatsApp. O que fazer?", options: ["Atende pelo WhatsApp normalmente", "Atende e depois confirma por e-mail formalmente", "Pede para enviar o pedido por e-mail antes de qualquer ação", "Ignora e espera e-mail"], correct: 2, explanation: "Grandes empresas documentam tudo. Solicite confirmação formal por e-mail antes de agir." },
      ]} />
    </div>
  );
}

// ─── ABA 6: RECLAMAÇÕES ───────────────────────────────────────────────────────
function TabReclamacoes() {
  const { videos } = useGuideVideos("cs", "reclamacoes");
  return (
    <div className="space-y-6">
      {videos.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🎬 Aulas em vídeo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {videos.map(v => <VideoCard key={v.id} videoId={v.id} title={v.title} description={v.description ?? undefined} duration={v.duration ?? undefined} videoUrl={v.video_url ?? undefined} />)}
          </div>
        </div>
      )}

      <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
        ⚠️ Reclamações são momentos críticos. <strong>A forma como você reage nos primeiros 15 minutos define se o cliente fica ou vai embora.</strong>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🚦 Protocolo de crise — 4 passos que nunca falham</h3>
        <Steps items={[
          { title: "1. Ouça antes de defender", desc: "Deixe o cliente falar tudo. Não interrompa, não explique, não justifique. Primeiro entenda o que aconteceu do ponto de vista dele.", tip: "Clientes que se sentem ouvidos já acalmam em 70% dos casos antes de qualquer solução." },
          { title: "2. Registre no GClick imediatamente", desc: "Antes de responder qualquer coisa, abra o ticket com todos os detalhes: o que aconteceu, o que o cliente disse, canal e horário.", warn: "Nunca dê uma resposta definitiva a uma reclamação sem registrar e sem consultar o gestor." },
          { title: "3. Informe o gestor antes de responder", desc: "Toda reclamação grave — atraso, erro em documento, cobrança indevida, ameaça de cancelamento — vai para o gestor ANTES de qualquer resposta ao cliente.", tip: "Isso não é fraqueza, é protocolo. O gestor tem informações que você pode não ter." },
          { title: "4. Retorne ao cliente com prazo claro", desc: "Use o script de reclamação. Confirme que recebeu, que está priorizando e dê um prazo real. Nunca prometa o que não pode cumprir.", tip: "Prazo cumprido = cliente satisfeito. Prazo descumprido = cliente furioso." },
        ]} />
      </div>

      {[
        {
          icon: "⏰", title: "Atraso na entrega de documento", subtitle: "Situação mais comum de reclamação",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Cliente aguardando guia, certidão ou relatório que não foi entregue no prazo combinado.</p>
            <Steps items={[
              { title: "Não negue e não justifique de imediato", desc: "A primeira reação nunca deve ser justificar. Reconheça o atraso antes de qualquer explicação." },
              { title: "Verifique internamente a situação real", desc: "Antes de dar qualquer prazo novo, verifique com o setor responsável o que aconteceu e quando consegue entregar.", warn: "Dar um prazo novo sem verificar é o erro mais comum — e o que mais irrita o cliente." },
              { title: "Retorne com prazo confirmado", desc: "Só volte para o cliente com um prazo que você tem certeza que será cumprido. Use o script de atraso.", tip: "Prefira um prazo maior e cumprir do que um prazo menor e furar." },
            ]} />
            <CertoErrado items={[
              { certo: "Reconheço o atraso, verifico internamente e retorno com prazo confirmado.", errado: "Peço desculpas e dou um prazo sem verificar com o setor responsável." },
            ]} />
          </div>
        },
        {
          icon: "⏱️", title: "Demora no atendimento", subtitle: "Cliente sentindo que está sendo ignorado",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Cliente mandou mensagem e não recebeu resposta no prazo de 15 minutos ou ficou sem retorno durante o dia.</p>
            <Steps items={[
              { title: "Responda imediatamente ao ser acionado", desc: "Mesmo que não tenha a solução, responda: 'Olá [Nome], vi sua mensagem e já estou verificando. Retorno em breve!'", tip: "O cliente que recebe uma resposta rápida — mesmo sem solução — quase nunca reclama de demora." },
              { title: "Defina e cumpra o prazo de retorno", desc: "Dê um horário real: 'Retorno até as 15h com a informação'. E cumpra.", warn: "Não responder dentro do prazo prometido é pior do que demorar para responder." },
              { title: "Revise seu fluxo pessoal", desc: "Se está sobrecarregado, comunique o gestor. É melhor pedir apoio do que deixar clientes sem resposta." },
            ]} />
          </div>
        },
        {
          icon: "💰", title: "Cliente não entende a cobrança", subtitle: "Questionamento sobre valores ou serviços cobrados",
          body: <div className="space-y-3">
            <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Cliente questiona um valor na fatura ou não entende por que está sendo cobrado por um serviço.</p>
            <Steps items={[
              { title: "Nunca justifique a cobrança sozinho", desc: "Você não tem todas as informações sobre o contrato e os serviços prestados. Consulte o gestor antes de qualquer explicação.", warn: "Dar uma explicação errada sobre cobrança pode gerar conflito contratual." },
              { title: "Informe o cliente que está verificando", desc: "Use o script de cobrança: confirme o recebimento da dúvida e dê um prazo para retornar com todas as informações." },
              { title: "Retorne com a explicação completa", desc: "Após alinhamento com o gestor, retorne com a explicação clara e, se necessário, com o contrato ou documento que justifica a cobrança." },
            ]} />
          </div>
        },
      ].map(({ icon, title, subtitle, body }) => (
        <GuideCard key={title} icon={icon} title={title} subtitle={subtitle}>{body}</GuideCard>
      ))}

      <Quiz guide="cs" tab="reclamacoes" title="🧠 Quiz — Reclamações" questions={[
        { q: "Cliente furioso reclama de atraso. Qual é o PRIMEIRO passo?", options: ["Justificar o motivo do atraso", "Pedir desculpas e dar um prazo", "Ouvir tudo, registrar no GClick e informar o gestor antes de responder", "Encaminhar para o Fiscal"], correct: 2, explanation: "Primeiro ouça, registre e consulte o gestor. Só então responda com prazo confirmado." },
        { q: "Você deu um prazo ao cliente reclamante mas não vai conseguir cumprir. O que fazer?", options: ["Espera e vê o que acontece", "Antecipa o contato, informa o novo prazo e pede desculpas pelo inconveniente", "Ignora e tenta resolver mais rápido", "Passa para o gestor sem avisar o cliente"], correct: 1, explanation: "Antecipar o atraso é muito melhor do que o cliente descobrir sozinho. Transparência gera confiança." },
        { q: "Cliente questiona uma cobrança que você não conhece os detalhes. O que fazer?", options: ["Explica com o que sabe", "Diz que não sabe e pede o cliente para ligar", "Confirma o recebimento e verifica com o gestor antes de dar qualquer explicação", "Encaminha para o Financeiro sem avisar o cliente"], correct: 2, explanation: "Cobrança é um tema sensível. Sempre verifique com o gestor antes de dar qualquer explicação." },
      ]} />
    </div>
  );
}

// ─── ABA 7: CHECKLIST ─────────────────────────────────────────────────────────
function TabChecklist() {
  const { checked, toggle, loading } = useChecklist("cs");

  const groups = [
    {
      group: "🖥️ Acesso aos sistemas",
      items: ["acesso-onecode", "acesso-gclick", "acesso-gestor-docs", "acesso-email", "acesso-workspace", "acesso-simples", "acesso-ecac"],
      labels: ["Login no OneCode configurado e testado", "Login no GClick configurado e testado", "Acesso ao Gestor de Documentos liberado", "E-mail corporativo ativo", "Acesso ao Google Workspace", "Acesso ao portal Simples Nacional", "Acesso ao e-CAC com procuração"],
    },
    {
      group: "📚 Treinamentos obrigatórios",
      items: ["treino-fluxo", "treino-ferramentas", "treino-scripts", "treino-clientes", "treino-reclamacoes", "treino-tarefas", "treino-quizzes"],
      labels: ["Estudou o fluxo completo de atendimento", "Domina o OneCode e o GClick", "Conhece todos os scripts por situação", "Entende o perfil de cada porte de cliente", "Sabe o protocolo de crise para reclamações", "Sabe emitir DAS, DARF e CND", "Completou todos os quizzes deste guia"],
    },
    {
      group: "👥 Conhecimento da carteira",
      items: ["carteira-lista", "carteira-servicos", "carteira-prazos", "carteira-contatos", "carteira-portes"],
      labels: ["Leu lista de clientes da carteira", "Entendeu serviços contratados por cada cliente", "Conhece os prazos críticos do mês", "Sabe os contatos principais de cada cliente", "Identificou o porte de cada cliente da carteira"],
    },
    {
      group: "✅ Primeiras semanas",
      items: ["dia1-apresentacao", "dia1-acompanhou", "dia1-primeiro", "semana1-das", "semana1-cnd", "semana1-reclamacao"],
      labels: ["Apresentou-se para a equipe", "Acompanhou atendimento completo com supervisor", "Fez primeiro atendimento supervisionado", "Emitiu primeiro DAS com supervisão", "Emitiu primeira CND com supervisão", "Assistiu tratamento de reclamação com supervisor"],
    },
  ];

  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done  = groups.reduce((a, g) => a + g.items.filter(id => checked[id]).length, 0);
  const pct   = Math.round((done / total) * 100);

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
        <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{done} de {total} itens concluídos</p>
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
          🎉 Parabéns! Onboarding do CS concluído! Você está pronto para atender!
        </div>
      )}
    </div>
  );
}

// ─── ABA 8: FAQ ───────────────────────────────────────────────────────────────
function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "O cliente não responde há 2 dias. O que faço?", a: "Tente um novo contato pelo mesmo canal. Se ainda sem resposta, mude o status do ticket para 'Aguardando cliente' e informe o gestor. Após 5 dias úteis sem resposta, feche o ticket com o motivo registrado." },
    { q: "Recebi uma reclamação grave. Como procedo?", a: "Não tente resolver sozinho. Registre imediatamente no GClick com todos os detalhes, informe o gestor e aguarde orientação antes de dar qualquer resposta definitiva ao cliente." },
    { q: "O cliente pediu cancelamento. O que faço?", a: "Nunca confirme ou negue. Use o script de cancelamento, confirme apenas o RECEBIMENTO do pedido e escale ao gestor imediatamente. Registre no GClick como 'Cancelamento — aguardando gestor'." },
    { q: "Não sei responder a dúvida técnica do cliente. O que faço?", a: "Informe que vai verificar e dê um prazo. Nunca invente ou chute respostas técnicas. Consulte o setor responsável (Fiscal, DP, Contábil) e retorne com a informação correta." },
    { q: "Posso usar meu WhatsApp pessoal para atender?", a: "Nunca. Todo atendimento via WhatsApp é obrigatoriamente pelo OneCode. Uso do pessoal é falta grave e pode gerar problemas contratuais com o cliente." },
    { q: "Como priorizo quando estou sobrecarregado?", a: "Prioridade: 1) Cancelamentos, 2) Reclamações graves, 3) Vencimentos do dia (DAS, DARF), 4) Solicitações de documentos urgentes, 5) Dúvidas simples. Em caso de sobrecarga, informe o gestor." },
    { q: "O que faço se o OneCode ou GClick cair?", a: "Registre manualmente tudo que está chegando. Informe o TI e o gestor. Continue atendendo pelo WhatsApp se possível e lance os tickets assim que o sistema voltar." },
    { q: "Posso resolver qualquer demanda sozinho?", a: "Apenas demandas de até 30 minutos. Emissão de DAS, DARF, CND e envio de documentos. Tudo que vai além disso cria uma tarefa no GClick e encaminha para o setor responsável." },
    { q: "Como saber se um cliente é MEI, ME ou Lucro Presumido?", a: "Consulte o cadastro do cliente no sistema ou no GClick. Em caso de dúvida, confirme com o setor Fiscal antes de emitir qualquer guia." },
    { q: "O cliente está insatisfeito mas não fez uma reclamação formal. O que faço?", a: "Registre a insatisfação no GClick mesmo assim e informe o gestor. Insatisfações não tratadas viram reclamações e depois cancelamentos. Aja preventivamente." },
    { q: "Quanto tempo tenho para dar a primeira resposta?", a: "15 minutos no horário comercial (segunda a sexta, 8h às 18h). Fora do horário, retorne no próximo dia útil até as 9h. Nunca deixe uma mensagem sem ao menos confirmar o recebimento dentro desse prazo." },
    { q: "O cliente pediu algo que não é responsabilidade do CS. O que faço?", a: "Explique gentilmente que vai encaminhar para o setor correto. Crie a tarefa no GClick, encaminhe e informe o cliente com um prazo estimado. Nunca diga simplesmente 'não é comigo'." },
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

      <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{filtered.length} pergunta{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}</p>

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

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────
export default function GuideCS() {
  return (
    <GuideLayout
      title="CS / Atendimento"
      subtitle="Guia operacional completo do Customer Success"
      icon={Users}
      tabs={[
        { key: "fluxo",        label: "Fluxo",           icon: Workflow,       content: <TabFluxo /> },
        { key: "tarefas",      label: "Tarefas Rápidas", icon: Zap,            content: <TabTarefas /> },
        { key: "ferramentas",  label: "Ferramentas",     icon: Wrench,         content: <TabFerramentas /> },
        { key: "scripts",      label: "Scripts",         icon: FileCheck,      content: <TabScripts /> },
        { key: "clientes",     label: "Clientes",        icon: BookOpen,       content: <TabClientes /> },
        { key: "reclamacoes",  label: "Reclamações",     icon: AlertTriangle,  content: <TabReclamacoes /> },
        { key: "checklist",    label: "Checklist",       icon: CheckCircle2,   content: <TabChecklist /> },
        { key: "faq",          label: "FAQ",             icon: HelpCircle,     content: <TabFAQ /> },
      ]}
    />
  );
}