import { useState } from "react";
import { Calculator, CreditCard, TrendingUp, HelpCircle, ChevronDown, Search, CheckCircle2 } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import Steps from "../../components/ui/Steps";

function Campo({ nome, desc, obrigatorio = true }: { nome: string; desc: string; obrigatorio?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor: "var(--soma-border)" }}>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold" style={{ color: "var(--soma-text)" }}>{nome}</span>
          {obrigatorio
            ? <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(220,38,38,0.15)", color: "#f87171" }}>Obrigatório</span>
            : <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(128,128,128,0.15)", color: "var(--soma-muted)" }}>Opcional</span>}
        </div>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--soma-muted)" }}>{desc}</p>
      </div>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.2)", color: "var(--soma-muted)" }}>
      {children}
    </div>
  );
}

function CodePath({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
      <p className="font-mono text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--soma-card)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }}>
        {children}
      </p>
    </div>
  );
}

function TabPagar() {
  return (
    <div className="space-y-6">
      <InfoBox>💳 Contas a pagar são todas as despesas da sua empresa — fornecedores, aluguel, energia, impostos. Lançar corretamente no OMIE garante controle total do seu financeiro.</InfoBox>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>📍 Como acessar</h3>
        <CodePath>Menu lateral → <strong>Financeiro</strong> → <strong>Contas a Pagar</strong> → <strong>Novo Lançamento</strong></CodePath>
        <p className="text-xs mt-2" style={{ color: "var(--soma-muted)" }}>Ou use o atalho: clique no <strong>+</strong> no canto superior direito.</p>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>📋 Campos do formulário</h3>
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <Campo nome="Fornecedor" desc="Nome da empresa ou pessoa para quem você está pagando. Deve estar cadastrado no OMIE." />
          <Campo nome="Valor" desc="Valor exato da conta. Para parcelado, informe o valor total e use a opção de parcelamento." />
          <Campo nome="Vencimento" desc="Data em que a conta deve ser paga. Use a data do boleto ou da fatura." />
          <Campo nome="Categoria financeira" desc="Classifica o tipo de despesa (ex: Fornecedores, Aluguel, Energia). Essencial para os relatórios." />
          <Campo nome="Projeto" desc="Vincula a despesa a um projeto específico da empresa." obrigatorio={false} />
          <Campo nome="Centro de custo" desc="Departamento ou área responsável pela despesa." obrigatorio={false} />
          <Campo nome="Observações" desc="Informações adicionais sobre a conta." obrigatorio={false} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🔢 Passo a passo completo</h3>
        <Steps items={[
          { title: "Acessar Contas a Pagar", desc: "No menu lateral, clique em Financeiro → Contas a Pagar → Novo Lançamento.", tip: "Você também pode duplicar um lançamento anterior clicando nos três pontos ao lado de uma conta similar." },
          { title: "Preencher o fornecedor", desc: "Digite o nome do fornecedor. Se não aparecer, clique em 'Novo Fornecedor' para cadastrá-lo.", warn: "Nunca deixe o campo fornecedor em branco. Sem fornecedor o sistema não permite salvar." },
          { title: "Informar valor e vencimento", desc: "Digite o valor exato e a data de vencimento. Para boleto, use a data impressa no documento.", tip: "Para contas que vencem todo mês no mesmo dia, use a opção 'Recorrente'." },
          { title: "Escolher a categoria financeira", desc: "Selecione a categoria que melhor descreve a despesa. Se tiver dúvida, consulte seu contador.", warn: "Categoria errada compromete todos os seus relatórios financeiros." },
          { title: "Anexar o documento", desc: "Clique em 'Anexos' e faça upload do boleto, NF ou comprovante. PDF ou imagem são aceitos.", tip: "Manter o documento anexado evita retrabalho quando o contador solicitar comprovação." },
          { title: "Salvar o lançamento", desc: "Clique em 'Salvar'. A conta aparecerá na lista de pendentes até ser baixada após o pagamento." },
          { title: "Registrar o pagamento (baixa)", desc: "Após pagar, volte ao lançamento, clique em 'Registrar Pagamento', informe a data e a conta bancária.", tip: "A baixa pode ser automática se você tiver integração bancária ativa no OMIE." },
        ]} />
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🔄 Como lançar parcelas</h3>
        <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Para compras parceladas, o OMIE cria automaticamente uma conta para cada parcela:</p>
          <Steps items={[
            { title: "Informe o valor total", desc: "No campo valor, digite o total da compra (não o valor da parcela)." },
            { title: "Clique em 'Parcelamento'", desc: "Abaixo do campo de valor, clique na opção 'Parcelamento'." },
            { title: "Configure as parcelas", desc: "Informe o número de parcelas e o intervalo. O OMIE divide automaticamente.", tip: "Confira se o valor de cada parcela está correto antes de salvar." },
          ]} />
        </div>
      </div>
    </div>
  );
}

function TabReceber() {
  return (
    <div className="space-y-6">
      <InfoBox>💰 Contas a receber são todas as entradas esperadas — vendas, serviços, aluguéis. Controlar corretamente garante que você saiba exatamente o que vai entrar no caixa.</InfoBox>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>📍 Como acessar</h3>
        <CodePath>Menu lateral → <strong>Financeiro</strong> → <strong>Contas a Receber</strong> → <strong>Novo Lançamento</strong></CodePath>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>📋 Campos do formulário</h3>
        <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <Campo nome="Cliente" desc="Nome do cliente que deve pagar. Deve estar cadastrado no OMIE." />
          <Campo nome="Valor" desc="Valor a ser recebido." />
          <Campo nome="Vencimento" desc="Data prevista para o recebimento." />
          <Campo nome="Categoria financeira" desc="Tipo de receita (ex: Venda de produtos, Prestação de serviços). Essencial para os relatórios." />
          <Campo nome="Projeto" desc="Vincula a receita a um projeto específico." obrigatorio={false} />
          <Campo nome="Número do documento" desc="Número da NF ou contrato relacionado." obrigatorio={false} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>🔢 Passo a passo completo</h3>
        <Steps items={[
          { title: "Acessar Contas a Receber", desc: "Menu lateral → Financeiro → Contas a Receber → Novo Lançamento." },
          { title: "Informar o cliente", desc: "Digite o nome do cliente. Se não estiver cadastrado, clique em 'Novo Cliente'.", warn: "Sempre vincule ao cliente correto para que o histórico fique organizado." },
          { title: "Preencher valor e vencimento", desc: "Informe o valor e a data combinada para pagamento.", tip: "Para mensalidades, use 'Recorrente' para gerar automaticamente todo mês." },
          { title: "Selecionar categoria financeira", desc: "Escolha a categoria que identifica a origem da receita. Aparecerá no seu DRE.", warn: "Categoria errada classifica sua receita incorretamente no relatório." },
          { title: "Emitir boleto (se disponível)", desc: "Se sua empresa tem carteira de cobrança ativa, clique em 'Emitir Boleto'.", tip: "Consulte seu contador para verificar se pode usar a cobrança bancária do OMIE." },
          { title: "Registrar o recebimento (baixa)", desc: "Quando o cliente pagar, abra o lançamento e clique em 'Registrar Recebimento'.", tip: "Se pagou valor diferente, use 'Baixa Parcial' ou ajuste no momento da baixa." },
        ]} />
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>⚡ Recebimento parcial</h3>
        <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Quando o cliente pagar apenas parte do valor:</p>
          <Steps items={[
            { title: "Abra o lançamento", desc: "Localize a conta a receber e clique para abrir." },
            { title: "Clique em 'Baixa Parcial'", desc: "Informe o valor recebido. O OMIE mantém o saldo em aberto automaticamente." },
            { title: "Acompanhe o saldo", desc: "Ficará como 'Parcialmente Recebido' até a quitação total.", tip: "Comunique ao seu contador sobre recebimentos parciais." },
          ]} />
        </div>
      </div>
    </div>
  );
}

function TabConciliacao() {
  return (
    <div className="space-y-6">
      <InfoBox>🏦 A conciliação bancária compara o extrato da sua conta com os lançamentos no OMIE, garantindo que o sistema reflete exatamente o que aconteceu no banco.</InfoBox>

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>📍 Como acessar</h3>
        <CodePath>Menu lateral → <strong>Financeiro</strong> → <strong>Conciliação Bancária</strong></CodePath>
      </div>

      <Steps items={[
        { title: "Selecionar conta e período", desc: "Escolha a conta bancária e o mês que deseja conciliar. Recomenda-se conciliar mensalmente.", tip: "Faça no início de cada mês referente ao mês anterior." },
        { title: "Importar extrato bancário", desc: "Exporte o extrato do seu banco em formato OFX e importe no OMIE.", tip: "Procure no internet banking por 'Exportar extrato' ou 'OFX'." },
        { title: "Conciliar lançamentos automáticos", desc: "O OMIE cruza automaticamente os lançamentos. Os que baterem ficam verdes.", tip: "Comece pelos automáticos — geralmente são a maioria." },
        { title: "Tratar os não conciliados", desc: "Para cada lançamento sem correspondência, verifique se foi lançado no OMIE.", warn: "Não deixe lançamentos sem conciliar. Cada diferença é um erro no financeiro." },
        { title: "Finalizar a conciliação", desc: "Quando tudo conciliado, clique em 'Finalizar'. O saldo do OMIE deve bater com o extrato.", tip: "Guarde o comprovante — o contador vai precisar para o fechamento contábil." },
      ]} />

      <div>
        <h3 className="font-bold text-sm mb-3" style={{ color: "var(--soma-text)" }}>❓ Diferenças comuns</h3>
        <div className="space-y-3">
          {[
            { situacao: "Lançamento no extrato sem correspondência no OMIE", solucao: "Crie o lançamento no OMIE com a data e valor do extrato. Informe seu contador." },
            { situacao: "Valores diferentes entre OMIE e extrato", solucao: "Verifique se houve juros, multa ou desconto não lançado. Ajuste no OMIE." },
            { situacao: "Lançamento no OMIE sem correspondência no extrato", solucao: "Pode ser pagamento não compensado. Aguarde 1 dia útil e verifique." },
          ].map(({ situacao, solucao }) => (
            <div key={situacao} className="rounded-xl border p-4" style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--soma-text)" }}>🔍 {situacao}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--soma-muted)" }}>→ {solucao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Lancei com valor errado, como corrigir?", a: "Abra o lançamento, clique em 'Editar' e corrija. Se já foi baixado, estorne a baixa primeiro, edite e dê baixa novamente." },
    { q: "Como ver o que está em aberto?", a: "Em Contas a Pagar ou Receber, use o filtro 'Status = Em aberto'. Verá todas as contas pendentes com os vencimentos." },
    { q: "O que é categoria financeira e como escolher?", a: "Classifica o tipo de receita ou despesa para os relatórios. Ex: 'Fornecedores' para compras. Se tiver dúvida, consulte seu contador — impacta diretamente o DRE." },
    { q: "Como exportar um relatório de contas?", a: "Use os filtros para selecionar o período e clique em 'Exportar' no canto superior direito. Disponível em Excel ou PDF." },
    { q: "Como conciliar com o extrato bancário?", a: "Acesse Financeiro → Conciliação Bancária. Exporte o extrato em OFX e importe no OMIE. O sistema cruza automaticamente." },
    { q: "Posso lançar sem fornecedor/cliente cadastrado?", a: "Não. O OMIE exige cadastro prévio. Acesse o cadastro de fornecedores/clientes e adicione o registro." },
    { q: "Como lançar despesa recorrente?", a: "Ao criar o lançamento, marque 'Recorrente' e defina a frequência. O OMIE criará automaticamente os próximos." },
    { q: "O cliente pagou a mais, como registro?", a: "Informe o valor exato recebido na baixa. O sistema registrará a diferença como crédito do cliente." },
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

export default function GuideOMIE() {
  return (
    <GuideLayout
      title="OMIE — Guia do Cliente"
      subtitle="Como usar o OMIE para controlar seu financeiro"
      icon={Calculator}
      tabs={[
        { key: "pagar",       label: "Contas a Pagar",   icon: CreditCard,   content: <TabPagar /> },
        { key: "receber",     label: "Contas a Receber", icon: TrendingUp,   content: <TabReceber /> },
        { key: "conciliacao", label: "Conciliação",      icon: CheckCircle2, content: <TabConciliacao /> },
        { key: "faq",         label: "FAQ",              icon: HelpCircle,   content: <TabFAQ /> },
      ]}
    />
  );
}