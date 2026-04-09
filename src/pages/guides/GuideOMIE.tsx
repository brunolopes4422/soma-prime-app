import { useState } from "react";
import { Calculator, CreditCard, TrendingUp, HelpCircle, ChevronDown, Search, CheckCircle2, Copy, Check } from "lucide-react";
import GuideLayout from "../../components/ui/GuideLayout";
import GuideCard from "../../components/ui/GuideCard";

// ─── COMPONENTES REUTILIZÁVEIS ───────────────────────────────────────────────
function Steps({ items }: { items: { title: string; desc: string; tip?: string; warn?: string }[] }) {
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
                  {item.tip && <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">💡 <strong>Dica:</strong> {item.tip}</div>}
                  {item.warn && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800">⚠️ <strong>Atenção:</strong> {item.warn}</div>}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Campo({ nome, desc, obrigatorio = true }: { nome: string; desc: string; obrigatorio?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-soma-border last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{nome}</span>
          {obrigatorio
            ? <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-medium">Obrigatório</span>
            : <span className="text-xs px-1.5 py-0.5 rounded bg-soma-bg text-soma-text/50 font-medium">Opcional</span>}
        </div>
        <p className="text-xs opacity-60 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── ABA 1 — CONTAS A PAGAR ─────────────────────────────────────────────────
function TabPagar() {
  return (
    <div className="space-y-6">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        💳 Contas a pagar são todas as despesas da sua empresa — fornecedores, aluguel, energia, impostos. Lançar corretamente no OMIE garante controle total do seu financeiro.
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">📍 Como acessar</h3>
        <div className="bg-soma-bg border border-soma-border rounded-xl p-4 text-sm space-y-2">
          <p className="font-mono text-xs bg-white border border-soma-border rounded-lg px-3 py-2">
            Menu lateral → <strong>Financeiro</strong> → <strong>Contas a Pagar</strong> → <strong>Novo Lançamento</strong>
          </p>
          <p className="text-xs opacity-60">Ou use o atalho: clique no <strong>+</strong> no canto superior direito e selecione "Conta a Pagar".</p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">📋 Campos do formulário</h3>
        <div className="card-base border border-soma-border bg-white">
          <Campo nome="Fornecedor" desc="Nome da empresa ou pessoa para quem você está pagando. Deve estar cadastrado no OMIE." />
          <Campo nome="Valor" desc="Valor exato da conta. Para parcelado, informe o valor total e use a opção de parcelamento." />
          <Campo nome="Vencimento" desc="Data em que a conta deve ser paga. Use a data do boleto ou da fatura." />
          <Campo nome="Categoria financeira" desc="Classifica o tipo de despesa (ex: Fornecedores, Aluguel, Energia). Essencial para os relatórios." />
          <Campo nome="Projeto" desc="Vincula a despesa a um projeto específico da empresa." obrigatorio={false} />
          <Campo nome="Centro de custo" desc="Departamento ou área responsável pela despesa." obrigatorio={false} />
          <Campo nome="Observações" desc="Informações adicionais sobre a conta. Ex: número do boleto, referência." obrigatorio={false} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">🔢 Passo a passo completo</h3>
        <Steps items={[
          { title: "Acessar Contas a Pagar", desc: "No menu lateral, clique em Financeiro → Contas a Pagar. Em seguida clique em 'Novo Lançamento' no canto superior direito.", tip: "Você também pode duplicar um lançamento anterior clicando nos três pontos ao lado de uma conta similar." },
          { title: "Preencher o fornecedor", desc: "Digite o nome do fornecedor no campo de busca. Se não aparecer, clique em 'Novo Fornecedor' para cadastrá-lo antes de continuar.", warn: "Nunca deixe o campo fornecedor em branco. Sem fornecedor o sistema não permite salvar." },
          { title: "Informar valor e vencimento", desc: "Digite o valor exato (sem arredondamentos) e a data de vencimento. Para boleto, use a data impressa no documento.", tip: "Para contas que vencem todo mês no mesmo dia, use a opção 'Recorrente' para criar automaticamente." },
          { title: "Escolher a categoria financeira", desc: "Selecione a categoria que melhor descreve a despesa. Se tiver dúvida, consulte seu contador — a categoria certa é fundamental para o DRE.", warn: "Categoria errada compromete todos os seus relatórios financeiros." },
          { title: "Anexar o documento", desc: "Clique em 'Anexos' e faça upload do boleto, NF ou comprovante. PDF ou imagem são aceitos.", tip: "Manter o documento anexado evita retrabalho quando o contador solicitar comprovação." },
          { title: "Salvar o lançamento", desc: "Clique em 'Salvar'. A conta aparecerá na lista de pendentes até ser baixada após o pagamento." },
          { title: "Registrar o pagamento (baixa)", desc: "Após pagar, volte ao lançamento, clique em 'Registrar Pagamento', informe a data e a conta bancária utilizada. Isso marca a conta como paga.", tip: "A baixa pode ser automática se você tiver integração bancária ativa no OMIE." },
        ]} />
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">🔄 Como lançar parcelas</h3>
        <div className="card-base border border-soma-border bg-white space-y-3">
          <p className="text-sm opacity-70">Para compras parceladas, o OMIE cria automaticamente uma conta para cada parcela:</p>
          <Steps items={[
            { title: "Informe o valor total", desc: "No campo valor, digite o total da compra (não o valor da parcela)." },
            { title: "Clique em 'Parcelamento'", desc: "Abaixo do campo de valor, clique na opção 'Parcelamento'." },
            { title: "Configure as parcelas", desc: "Informe o número de parcelas e o intervalo (mensal, quinzenal, etc). O OMIE divide automaticamente.", tip: "Confira se o valor de cada parcela está correto antes de salvar." },
          ]} />
        </div>
      </div>
    </div>
  );
}

// ─── ABA 2 — CONTAS A RECEBER ───────────────────────────────────────────────
function TabReceber() {
  return (
    <div className="space-y-6">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        💰 Contas a receber são todas as entradas esperadas na sua empresa — vendas, serviços prestados, aluguéis recebidos. Controlar corretamente garante que você saiba exatamente o que vai entrar no caixa.
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">📍 Como acessar</h3>
        <div className="bg-soma-bg border border-soma-border rounded-xl p-4 text-sm">
          <p className="font-mono text-xs bg-white border border-soma-border rounded-lg px-3 py-2">
            Menu lateral → <strong>Financeiro</strong> → <strong>Contas a Receber</strong> → <strong>Novo Lançamento</strong>
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">📋 Campos do formulário</h3>
        <div className="card-base border border-soma-border bg-white">
          <Campo nome="Cliente" desc="Nome do cliente que deve pagar. Deve estar cadastrado no OMIE." />
          <Campo nome="Valor" desc="Valor a ser recebido." />
          <Campo nome="Vencimento" desc="Data prevista para o recebimento." />
          <Campo nome="Categoria financeira" desc="Tipo de receita (ex: Venda de produtos, Prestação de serviços). Essencial para os relatórios." />
          <Campo nome="Projeto" desc="Vincula a receita a um projeto específico." obrigatorio={false} />
          <Campo nome="Número do documento" desc="Número da NF ou contrato relacionado." obrigatorio={false} />
        </div>
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">🔢 Passo a passo completo</h3>
        <Steps items={[
          { title: "Acessar Contas a Receber", desc: "Menu lateral → Financeiro → Contas a Receber → Novo Lançamento." },
          { title: "Informar o cliente", desc: "Digite o nome do cliente. Se não estiver cadastrado, clique em 'Novo Cliente'.", warn: "Sempre vincule o recebimento ao cliente correto para que o histórico fique organizado." },
          { title: "Preencher valor e vencimento", desc: "Informe o valor e a data combinada para pagamento.", tip: "Para serviços recorrentes (mensalidades), use a opção 'Recorrente' para gerar automaticamente todo mês." },
          { title: "Selecionar categoria financeira", desc: "Escolha a categoria que identifica a origem da receita. Isso aparecerá no seu DRE.", warn: "Categoria errada classifica sua receita incorretamente no relatório." },
          { title: "Emitir boleto (se disponível)", desc: "Se sua empresa tem carteira de cobrança ativa no OMIE, clique em 'Emitir Boleto'. O boleto é gerado e pode ser enviado ao cliente.", tip: "Consulte seu contador para verificar se sua empresa pode usar a cobrança bancária do OMIE." },
          { title: "Registrar o recebimento (baixa)", desc: "Quando o cliente pagar, abra o lançamento e clique em 'Registrar Recebimento'. Informe data, valor recebido e conta bancária.", tip: "Se o cliente pagou valor diferente (desconto ou multa), use a opção 'Baixa Parcial' ou ajuste o valor no momento da baixa." },
        ]} />
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">⚡ Recebimento parcial</h3>
        <div className="card-base border border-soma-border bg-white space-y-3">
          <p className="text-sm opacity-70">Quando o cliente pagar apenas parte do valor:</p>
          <Steps items={[
            { title: "Abra o lançamento", desc: "Localize a conta a receber e clique para abrir." },
            { title: "Clique em 'Baixa Parcial'", desc: "Informe o valor recebido parcialmente. O OMIE mantém o saldo em aberto automaticamente." },
            { title: "Acompanhe o saldo", desc: "O lançamento ficará com status 'Parcialmente Recebido' até a quitação total.", tip: "Comunique ao seu contador sobre recebimentos parciais para correto controle." },
          ]} />
        </div>
      </div>
    </div>
  );
}

// ─── ABA 3 — CONCILIAÇÃO ────────────────────────────────────────────────────
function TabConciliacao() {
  return (
    <div className="space-y-6">
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-soma-text/70">
        🏦 A conciliação bancária compara o extrato da sua conta bancária com os lançamentos no OMIE. É o processo que garante que o sistema reflete exatamente o que aconteceu no banco.
      </div>

      <div>
        <h3 className="font-bold text-sm mb-3">📍 Como acessar</h3>
        <div className="bg-soma-bg border border-soma-border rounded-xl p-4">
          <p className="font-mono text-xs bg-white border border-soma-border rounded-lg px-3 py-2">
            Menu lateral → <strong>Financeiro</strong> → <strong>Conciliação Bancária</strong>
          </p>
        </div>
      </div>

      <Steps items={[
        { title: "Selecionar conta bancária e período", desc: "Escolha a conta bancária e o mês que deseja conciliar. Recomenda-se conciliar mensalmente.", tip: "Faça a conciliação logo no início de cada mês referente ao mês anterior." },
        { title: "Importar extrato bancário", desc: "Exporte o extrato do seu banco em formato OFX e importe no OMIE. A maioria dos bancos oferece essa opção no internet banking.", tip: "Procure no seu internet banking por 'Exportar extrato' ou 'OFX/Formato para software'." },
        { title: "Conciliar lançamentos automáticos", desc: "O OMIE vai cruzar automaticamente os lançamentos do sistema com o extrato. Os que baterem ficam verdes.", tip: "Comece pelos lançamentos automáticos — geralmente são a maioria." },
        { title: "Tratar os não conciliados", desc: "Para cada lançamento sem correspondência, identifique: foi lançado no OMIE? Se não, crie o lançamento. Se sim, pode haver diferença de valor ou data.", warn: "Não deixe lançamentos sem conciliar. Cada diferença representa um erro no seu financeiro." },
        { title: "Finalizar a conciliação", desc: "Quando todos os lançamentos estiverem conciliados, clique em 'Finalizar Conciliação'. O saldo do OMIE deve bater com o saldo do extrato.", tip: "Guarde o comprovante de conciliação. Seu contador vai precisar para o fechamento contábil." },
      ]} />

      <div>
        <h3 className="font-bold text-sm mb-3">❓ Diferenças comuns na conciliação</h3>
        {[
          { situacao: "Lançamento no extrato sem correspondência no OMIE", solucao: "Crie o lançamento no OMIE com a data e valor do extrato. Informe seu contador sobre o que representa." },
          { situacao: "Valores diferentes entre OMIE e extrato", solucao: "Verifique se houve juros, multa ou desconto não lançado. Ajuste o valor no OMIE conforme o extrato." },
          { situacao: "Lançamento no OMIE sem correspondência no extrato", solucao: "Pode ser um pagamento ainda não compensado. Aguarde 1 dia útil. Se persistir, verifique se o pagamento foi realmente efetuado." },
        ].map(({ situacao, solucao }) => (
          <div key={situacao} className="card-base border border-soma-border bg-white mb-3">
            <p className="text-sm font-semibold mb-1">🔍 {situacao}</p>
            <p className="text-xs opacity-60 leading-relaxed">→ {solucao}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ABA 4 — FAQ ────────────────────────────────────────────────────────────
function TabFAQ() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "Lancei com valor errado, como corrigir?", a: "Abra o lançamento, clique em 'Editar' e corrija o valor. Se já foi baixado (pago/recebido), você precisará estornar a baixa primeiro, editar e dar baixa novamente." },
    { q: "Como ver o que está em aberto (não pago)?", a: "Em Contas a Pagar ou Contas a Receber, use o filtro 'Status = Em aberto'. Você verá todas as contas pendentes com os vencimentos." },
    { q: "O que é categoria financeira e como escolher?", a: "A categoria classifica o tipo de receita ou despesa para os relatórios. Ex: 'Fornecedores' para compras, 'Energia Elétrica' para a conta de luz. Se tiver dúvida sobre qual usar, consulte seu contador — a classificação impacta diretamente o DRE." },
    { q: "Como exportar um relatório de contas?", a: "Em Contas a Pagar ou Receber, use os filtros para selecionar o período desejado. Em seguida clique em 'Exportar' (ícone de planilha) no canto superior direito. Você pode exportar em Excel ou PDF." },
    { q: "Como conciliar com o extrato bancário?", a: "Acesse Financeiro → Conciliação Bancária. Exporte o extrato do seu banco em formato OFX e importe no OMIE. O sistema cruza automaticamente os lançamentos." },
    { q: "Posso lançar uma conta sem fornecedor/cliente cadastrado?", a: "Não. O OMIE exige que o fornecedor ou cliente esteja cadastrado antes de criar o lançamento. Acesse o cadastro de fornecedores/clientes e adicione o registro." },
    { q: "Como lançar uma despesa que se repete todo mês?", a: "Ao criar o lançamento, marque a opção 'Recorrente' e defina a frequência (mensal, semanal). O OMIE criará automaticamente os próximos lançamentos." },
    { q: "O cliente pagou a mais, como registro?", a: "Na baixa do recebimento, informe o valor exato recebido. O sistema registrará a diferença como crédito do cliente, que pode ser abatido em cobranças futuras ou devolvido." },
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
export default function GuideOMIE() {
  return (
    <GuideLayout
      title="OMIE — Guia do Cliente"
      subtitle="Como usar o OMIE para controlar seu financeiro"
      icon={Calculator}
      tabs={[
        { key: "pagar",       label: "Contas a Pagar",   icon: CreditCard,  content: <TabPagar /> },
        { key: "receber",     label: "Contas a Receber", icon: TrendingUp,  content: <TabReceber /> },
        { key: "conciliacao", label: "Conciliação",      icon: CheckCircle2, content: <TabConciliacao /> },
        { key: "faq",         label: "FAQ",              icon: HelpCircle,  content: <TabFAQ /> },
      ]}
    />
  );
}