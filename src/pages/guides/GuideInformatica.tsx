import { useState } from "react";
import { Monitor, Folder, Keyboard, Archive, Globe, Shield, Lock, Mail, Search, ChevronDown } from "lucide-react";

import GuideCard from "../../components/ui/GuideCard";
import { useChecklist } from "../../hooks/useChecklist";

const GUIDE_KEY = "informatica";

const tabs = [
  { id: "windows",    label: "Windows",     icon: Monitor  },
  { id: "arquivos",   label: "Arquivos",    icon: Folder   },
  { id: "atalhos",    label: "Atalhos",     icon: Keyboard },
  { id: "arquivar",   label: "Compactação", icon: Archive  },
  { id: "internet",   label: "Internet",    icon: Globe    },
  { id: "certificado",label: "Certificado", icon: Lock     },
  { id: "email",      label: "E-mail",      icon: Mail     },
  { id: "seguranca",  label: "Segurança",   icon: Shield   },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    { q: "Qual navegador devo usar para acessar os sistemas da Receita Federal?", a: "Google Chrome é o mais compatível. Em caso de problemas, tente o Microsoft Edge. Nunca use Internet Explorer." },
    { q: "Como instalo o certificado digital A1?", a: "Clique duas vezes no arquivo .pfx → selecione 'Usuário atual' → insira a senha → marque 'Chave exportável' → repositório 'Pessoal' → Concluir." },
    { q: "O token não é reconhecido — o que fazer?", a: "1) Tente outra porta USB. 2) Reinstale o driver (SafeNet Authentication Client). 3) Reinicie o computador com o token plugado apenas após a inicialização." },
    { q: "Como compactar arquivos para enviar por e-mail?", a: "Selecione os arquivos → botão direito → 7-Zip → 'Adicionar ao arquivo' → escolha .zip → OK. Para arquivos de clientes, sempre coloque uma senha." },
    { q: "Como recuperar um arquivo deletado?", a: "Verifique a Lixeira primeiro. Se já esvaziou, clique com botão direito na pasta → 'Restaurar versões anteriores'. O OneDrive mantém histórico por 30 dias." },
    { q: "Como posso ter dois sistemas abertos lado a lado?", a: "Use Win+← para jogar uma janela para a esquerda e Win+→ para a outra direita. Ou no Windows 11, passe o mouse sobre o botão maximizar para ver os layouts de snap." },
    { q: "Como gero um PDF de qualquer programa?", a: "Ctrl+P para imprimir → selecione 'Microsoft Print to PDF' como impressora → clique em imprimir e escolha onde salvar." },
    { q: "Como identificar um e-mail falso da Receita Federal?", a: "Verifique o domínio do remetente — deve ser @fazenda.gov.br ou @receita.fazenda.gov.br. A Receita nunca pede para clicar em link para regularizar débitos. Na dúvida, acesse o site diretamente pelo favorito." },
  ];
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const filtered = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--soma-muted)" }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar dúvida..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-text)" }} />
      </div>
      <div className="space-y-2">
        {filtered.map((f, i) => (
          <div key={i} className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--soma-border)" }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left gap-3"
              style={{ backgroundColor: "var(--soma-card)" }}>
              <span className="text-sm font-medium" style={{ color: "var(--soma-text)" }}>{f.q}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} style={{ color: "var(--soma-muted)" }} />
            </button>
            {open === i && (
              <div className="px-4 py-3 text-sm leading-relaxed" style={{ backgroundColor: "var(--soma-bg)", color: "var(--soma-muted)" }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CHECKLIST ────────────────────────────────────────────────────────────────
const checklistItems = [
  "Extensões de arquivo visíveis no Windows Explorer",
  "Fuso horário configurado para Brasília (GMT-3)",
  "Chrome instalado e definido como padrão",
  "Pasta de favoritos 'Portais Fiscais' criada no Chrome",
  "7-Zip instalado",
  "Certificado digital instalado e testado no e-CAC",
  "OneDrive configurado para backup automático",
  "Gerenciador de senhas instalado (Bitwarden ou LastPass)",
  "Antivírus (Windows Defender) ativo e atualizado",
  "Estrutura de pastas de clientes seguindo padrão da Soma Prime",
  "Assinatura de e-mail profissional configurada",
  "Atalhos essenciais memorizados (Ctrl+C/V/Z, Win+E, Win+L)",
];

function Checklist() {
  const { checked, toggle } = useChecklist(GUIDE_KEY);
  const done = checklistItems.filter((_, i) => checked[`item_${i}`]).length;
  const pct  = Math.round((done / checklistItems.length) * 100);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs" style={{ color: "var(--soma-muted)" }}>
          <span>{done} de {checklistItems.length} itens</span>
          <span style={{ color: "#f5a623", fontWeight: 600 }}>{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--soma-bg)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? "#22c55e" : "#f5a623" }} />
        </div>
      </div>
      <div className="space-y-2">
        {checklistItems.map((label, i) => {
          const id = `item_${i}`;
          const isChecked = !!checked[id];
          return (
            <label key={id} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
              style={{ backgroundColor: isChecked ? "rgba(22,163,74,0.08)" : "var(--soma-card)", border: `1px solid ${isChecked ? "rgba(22,163,74,0.2)" : "var(--soma-border)"}` }}>
              <input type="checkbox" checked={isChecked} onChange={() => toggle(id)} className="mt-0.5 accent-green-500 shrink-0" />
              <span className="text-sm" style={{ color: isChecked ? "var(--soma-muted)" : "var(--soma-text)", textDecoration: isChecked ? "line-through" : "none" }}>
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ─── CONTEÚDO POR ABA ─────────────────────────────────────────────────────────
function TabWindows() {
  return (
    <div className="space-y-4">
      <GuideCard title="Windows 10 vs Windows 11" icon="🖥️">
        <p className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>
          A Soma Prime pode ter computadores com Windows 10 ou 11. As funções são as mesmas — o que muda é visual e alguns atalhos.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[
            { label: "Windows 10", items: ["Menu Iniciar no canto esquerdo", "Barra de tarefas tradicional", "Suporte até out/2025"] },
            { label: "Windows 11", items: ["Menu Iniciar centralizado", "Snap Layouts avançado", "Visual moderno e arredondado"] },
          ].map(({ label, items }) => (
            <div key={label} className="rounded-xl p-3" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
              <p className="font-bold text-xs mb-2" style={{ color: "#f5a623" }}>{label}</p>
              {items.map(i => <p key={i} className="text-xs" style={{ color: "var(--soma-muted)" }}>• {i}</p>)}
            </div>
          ))}
        </div>
      </GuideCard>

      <GuideCard title="Configurações obrigatórias" icon="⚙️">
        {[
          { titulo: "Mostrar extensões de arquivo", desc: "Explorador de Arquivos → Exibir → ✅ Extensões de nome de arquivo", urgente: true },
          { titulo: "Configurar fuso horário", desc: "Botão direito no relógio → Ajustar data/hora → Brasília (GMT-3) → Automático", urgente: true },
          { titulo: "Mostrar arquivos ocultos", desc: "Explorador de Arquivos → Exibir → ✅ Itens ocultos", urgente: false },
          { titulo: "Desativar sleep durante processamentos", desc: "Configurações → Sistema → Energia → aumentar tempo de suspensão", urgente: false },
        ].map(({ titulo, desc, urgente }) => (
          <div key={titulo} className="flex gap-3 p-3 rounded-xl mb-2" style={{ backgroundColor: "var(--soma-bg)", border: `1px solid ${urgente ? "rgba(245,166,35,0.3)" : "var(--soma-border)"}` }}>
            <span className="text-lg shrink-0">{urgente ? "⚠️" : "✅"}</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>{titulo}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--soma-muted)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </GuideCard>

      <GuideCard title="Gerenciador de Tarefas" icon="📊">
        <p className="text-sm mb-3" style={{ color: "var(--soma-muted)" }}>Abre com <strong>Ctrl + Shift + Esc</strong> — use quando o computador travar ou ficar lento.</p>
        {[
          { aba: "Processos", uso: "Ver o que está consumindo CPU e memória" },
          { aba: "Desempenho", uso: "Gráfico em tempo real do uso do computador" },
          { aba: "Inicialização", uso: "Programas que abrem sozinhos (desative os desnecessários)" },
        ].map(({ aba, uso }) => (
          <div key={aba} className="flex gap-2 mb-2">
            <span className="font-bold text-xs px-2 py-1 rounded shrink-0" style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>{aba}</span>
            <span className="text-xs self-center" style={{ color: "var(--soma-muted)" }}>{uso}</span>
          </div>
        ))}
      </GuideCard>

      <GuideCard title="Snap Layouts — janelas lado a lado" icon="⬜">
        <p className="text-sm mb-3" style={{ color: "var(--soma-muted)" }}>Trabalhe com e-CAC, GClick e sistema contábil ao mesmo tempo sem se perder.</p>
        <div className="space-y-2">
          {[
            { atalho: "Win + ←", desc: "Janela ocupa metade esquerda" },
            { atalho: "Win + →", desc: "Janela ocupa metade direita" },
            { atalho: "Win + ↑", desc: "Maximiza a janela" },
            { atalho: "Win + Tab", desc: "Visão geral de todas as janelas" },
          ].map(({ atalho, desc }) => (
            <div key={atalho} className="flex items-center gap-3">
              <code className="text-xs px-2 py-1 rounded font-mono font-bold" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "#f5a623" }}>{atalho}</code>
              <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3 p-2 rounded-lg" style={{ backgroundColor: "rgba(245,166,35,0.08)", color: "#f5a623" }}>
          💡 Win+11: passe o mouse no botão maximizar para ver layouts prontos
        </p>
      </GuideCard>
    </div>
  );
}

function TabArquivos() {
  return (
    <div className="space-y-4">
      <GuideCard title="Estrutura de pastas padrão Soma Prime" icon="📁">
        <div className="rounded-xl p-4 font-mono text-xs leading-relaxed" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
          <p style={{ color: "#f5a623" }}>12345678000195_NomeEmpresa/</p>
          <p>  ├── Fiscal/</p>
          <p>  │   ├── DAS/</p>
          <p>  │   ├── DARF/</p>
          <p>  │   ├── Declaracoes/</p>
          <p>  │   └── Certidoes/</p>
          <p>  ├── DP/</p>
          <p>  │   ├── Folha/</p>
          <p>  │   ├── FGTS/</p>
          <p>  │   └── eSocial/</p>
          <p>  ├── Contabil/</p>
          <p>  │   ├── Balancetes/</p>
          <p>  │   └── DRE/</p>
          <p>  └── Contratos/</p>
        </div>
      </GuideCard>

      <GuideCard title="Padrão de nomenclatura" icon="📄">
        <p className="text-sm mb-3 font-mono font-bold" style={{ color: "#f5a623" }}>CNPJ_TipoDocumento_MesAno.pdf</p>
        <div className="space-y-2">
          {[
            { ex: "12345678_DAS_Maio2026.pdf", ok: true },
            { ex: "12345678_CND_Validade20261101.pdf", ok: true },
            { ex: "12345678_FolhaPagamento_Abril2026.pdf", ok: true },
            { ex: "DAS.pdf", ok: false },
            { ex: "guia (2).pdf", ok: false },
            { ex: "documento_final_v3_FINAL.pdf", ok: false },
          ].map(({ ex, ok }) => (
            <div key={ex} className="flex items-center gap-2">
              <span>{ok ? "✅" : "❌"}</span>
              <code className="text-xs font-mono" style={{ color: ok ? "#4ade80" : "#f87171" }}>{ex}</code>
            </div>
          ))}
        </div>
      </GuideCard>

      <GuideCard title="Dicas do Explorador de Arquivos" icon="🔍">
        {[
          { titulo: "Ctrl+F", desc: "Busca dentro da pasta atual" },
          { titulo: "F2", desc: "Renomear arquivo/pasta" },
          { titulo: "Win+E", desc: "Abre o Explorador de qualquer lugar" },
          { titulo: "Ctrl+Shift+6", desc: "Modo detalhes (melhor para contabilidade)" },
          { titulo: "Clique direito → Fixar no Acesso Rápido", desc: "Para acessar pastas frequentes rapidamente" },
        ].map(({ titulo, desc }) => (
          <div key={titulo} className="flex items-center gap-3 mb-2">
            <code className="text-xs px-2 py-1 rounded font-bold shrink-0" style={{ backgroundColor: "rgba(245,166,35,0.15)", color: "#f5a623" }}>{titulo}</code>
            <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{desc}</span>
          </div>
        ))}
      </GuideCard>

      <GuideCard title="Backup — nunca perca um documento" icon="☁️">
        <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <p className="text-xs font-bold" style={{ color: "#f87171" }}>⚠️ Regra 3-2-1: 3 cópias · 2 mídias diferentes · 1 fora do local (nuvem)</p>
        </div>
        <p className="text-sm mb-2" style={{ color: "var(--soma-muted)" }}>Configure o OneDrive agora:</p>
        <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Ícone da nuvem na barra → Configurações → Backup → Gerenciar backup → Selecione Documentos e Área de Trabalho</p>
      </GuideCard>
    </div>
  );
}

function TabAtalhos() {
  const groups = [
    {
      titulo: "Universais",
      atalhos: [
        ["Ctrl+C", "Copiar"], ["Ctrl+X", "Recortar"], ["Ctrl+V", "Colar"],
        ["Ctrl+Z", "Desfazer"], ["Ctrl+S", "Salvar"], ["Ctrl+A", "Selecionar tudo"],
        ["Ctrl+F", "Buscar"], ["Ctrl+P", "Imprimir"], ["F2", "Renomear"],
      ]
    },
    {
      titulo: "Windows",
      atalhos: [
        ["Win+E", "Explorador de Arquivos"], ["Win+L", "Bloquear computador"],
        ["Win+D", "Mostrar área de trabalho"], ["Win+R", "Executar"],
        ["Win+PrtSc", "Captura de tela"], ["Alt+F4", "Fechar programa"],
        ["Alt+Tab", "Alternar janelas"], ["Ctrl+Shift+Esc", "Gerenciador de Tarefas"],
      ]
    },
    {
      titulo: "Chrome",
      atalhos: [
        ["Ctrl+T", "Nova aba"], ["Ctrl+W", "Fechar aba"],
        ["Ctrl+Shift+T", "Reabrir aba fechada"], ["Ctrl+Tab", "Próxima aba"],
        ["Ctrl+Shift+N", "Janela anônima"], ["Ctrl+Shift+R", "Recarregar sem cache"],
        ["Ctrl+D", "Salvar favorito"], ["Ctrl+L", "Focar na barra de endereços"],
      ]
    },
    {
      titulo: "Excel",
      atalhos: [
        ["Ctrl+Home", "Ir para A1"], ["Ctrl+End", "Última célula com dados"],
        ["F2", "Editar célula"], ["Ctrl+1", "Formatar célula"],
        ["Ctrl+Shift+$", "Formato moeda"], ["F4", "Referência absoluta / Repetir ação"],
        ["Ctrl+Shift+L", "Ativar filtros"], ["Alt+Enter", "Quebra de linha na célula"],
      ]
    },
  ];

  return (
    <div className="space-y-4">
      {groups.map(({ titulo, atalhos }) => (
        <GuideCard key={titulo} title={titulo} icon="⌨️">
          <div className="grid grid-cols-2 gap-2">
            {atalhos.map(([tecla, desc]) => (
              <div key={tecla} className="flex items-center gap-2">
                <code className="text-xs px-2 py-1 rounded font-mono font-bold shrink-0"
                  style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "#f5a623" }}>
                  {tecla}
                </code>
                <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </GuideCard>
      ))}
    </div>
  );
}

function TabArquivar() {
  return (
    <div className="space-y-4">
      <GuideCard title="Formatos de compactação" icon="📦">
        {[
          { formato: ".zip", desc: "Universal — Windows abre sem programa extra. Ideal para enviar por e-mail.", rec: true },
          { formato: ".rar", desc: "Proprietário — precisa do WinRAR para abrir. Comum em arquivos recebidos.", rec: false },
          { formato: ".7z", desc: "Melhor compressão — gratuito com 7-Zip. Recomendado para arquivos grandes.", rec: true },
        ].map(({ formato, desc, rec }) => (
          <div key={formato} className="flex gap-3 p-3 rounded-xl mb-2" style={{ backgroundColor: "var(--soma-bg)", border: `1px solid ${rec ? "rgba(245,166,35,0.3)" : "var(--soma-border)"}` }}>
            <code className="font-mono font-bold text-sm shrink-0" style={{ color: "#f5a623" }}>{formato}</code>
            <div>
              <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{desc}</p>
              {rec && <p className="text-xs mt-0.5 font-semibold" style={{ color: "#4ade80" }}>✅ Recomendado</p>}
            </div>
          </div>
        ))}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Download gratuito:</p>
          <a href="https://www.7-zip.org/download.html" target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: "#f5a623" }}>7-Zip: www.7-zip.org</a>
        </div>
      </GuideCard>

      <GuideCard title="Como descompactar com 7-Zip" icon="📂">
        {[
          { passo: "1", desc: "Clique com botão direito no arquivo .zip/.rar/.7z" },
          { passo: "2", desc: '7-Zip → "Extrair para [nome da pasta]" (cria pasta com o nome do arquivo)' },
          { passo: "3", desc: 'OU "Extrair aqui" para extrair na pasta atual' },
        ].map(({ passo, desc }) => (
          <div key={passo} className="flex gap-3 mb-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: "#f5a623", color: "#000" }}>{passo}</span>
            <p className="text-xs self-center" style={{ color: "var(--soma-muted)" }}>{desc}</p>
          </div>
        ))}
        <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)" }}>
          <p className="text-xs" style={{ color: "#f5a623" }}>💡 Para arquivos de cliente, use sempre "Extrair para [pasta]" — evita bagunça na pasta atual</p>
        </div>
      </GuideCard>

      <GuideCard title="PDF — dicas práticas" icon="📄">
        {[
          { titulo: "Gerar PDF de qualquer programa", desc: "Ctrl+P → selecione 'Microsoft Print to PDF' → Imprimir" },
          { titulo: "Combinar PDFs gratuitamente", desc: "Use o PDF24 (instala no PC, mais seguro): pdf24.org — não use sites online para documentos de clientes" },
          { titulo: "Assinar PDF com certificado", desc: "Adobe Acrobat Reader → Ferramentas → Certificados → Assinar digitalmente" },
          { titulo: "Assinador Serpro (gratuito)", desc: "serpro.gov.br → busque 'Assinador Serpro' — ferramenta oficial do governo" },
        ].map(({ titulo, desc }) => (
          <div key={titulo} className="mb-3 p-3 rounded-xl" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
            <p className="font-semibold text-xs mb-1" style={{ color: "var(--soma-text)" }}>{titulo}</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{desc}</p>
          </div>
        ))}
      </GuideCard>
    </div>
  );
}

function TabInternet() {
  const portais = [
    { nome: "e-CAC", url: "https://cav.receita.fazenda.gov.br/" },
    { nome: "Portal Simples Nacional", url: "https://www8.receita.fazenda.gov.br/SimplesNacional/" },
    { nome: "CND (Certidão Negativa)", url: "https://solucoes.receita.fazenda.gov.br/Servicos/certidaointernet/PJ/Emitir" },
    { nome: "SICALC (DARF)", url: "https://sicalc.receita.fazenda.gov.br/" },
    { nome: "eSocial", url: "https://www.esocial.gov.br/" },
    { nome: "Consulta CNPJ", url: "https://servicos.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp" },
    { nome: "Conectividade Social (FGTS)", url: "https://conectividade.caixa.gov.br/" },
    { nome: "PGFN", url: "https://www.pgfn.gov.br/" },
  ];

  return (
    <div className="space-y-4">
      <GuideCard title="Instalar o Chrome" icon="🌐">
        <p className="text-sm mb-3" style={{ color: "var(--soma-muted)" }}>Chrome é o mais compatível com sistemas da Receita Federal.</p>
        <a href="https://www.google.com/chrome/" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "#f5a623", color: "#000" }}>
          🔗 Baixar Chrome
        </a>
        <div className="mt-4 space-y-2">
          {[
            "Instale como administrador (botão direito → Executar como administrador)",
            "Após instalar, defina como navegador padrão",
            "Crie uma pasta de favoritos 'Portais Fiscais'",
          ].map(i => <p key={i} className="text-xs" style={{ color: "var(--soma-muted)" }}>• {i}</p>)}
        </div>
      </GuideCard>

      <GuideCard title="Portais fiscais — salve nos favoritos" icon="🔖">
        <p className="text-xs mb-3" style={{ color: "var(--soma-muted)" }}>Sempre acesse pelos favoritos, nunca por link de e-mail.</p>
        <div className="space-y-2">
          {portais.map(({ nome, url }) => (
            <a key={nome} href={url} target="_blank" rel="noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl transition-all hover:opacity-80"
              style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
              <span className="text-sm font-medium" style={{ color: "var(--soma-text)" }}>{nome}</span>
              <span className="text-xs" style={{ color: "#f5a623" }}>Abrir →</span>
            </a>
          ))}
        </div>
      </GuideCard>

      <GuideCard title="Problemas comuns no Chrome" icon="🔧">
        {[
          { prob: "Página não carrega / trava", sol: "Ctrl+Shift+R para recarregar sem cache. Se persistir: chrome://settings/clearBrowserData" },
          { prob: "Erro de certificado", sol: "Verifique se o certificado digital está instalado e a data/hora do sistema está correta" },
          { prob: "Pop-up bloqueado", sol: "Alguns sistemas da Receita exigem pop-ups: Configurações → Privacidade → Configurações do site → Pop-ups → adicionar o site" },
          { prob: "Sistema não funciona no Chrome", sol: "Tente no Microsoft Edge — sistemas antigos do governo funcionam melhor no Edge" },
        ].map(({ prob, sol }) => (
          <div key={prob} className="mb-3 p-3 rounded-xl" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
            <p className="font-semibold text-xs mb-1" style={{ color: "#f87171" }}>❌ {prob}</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>✅ {sol}</p>
          </div>
        ))}
      </GuideCard>
    </div>
  );
}

function TabCertificado() {
  return (
    <div className="space-y-4">
      <GuideCard title="A1 vs A3 — qual a diferença?" icon="🔐">
        <div className="grid grid-cols-2 gap-3">
          {[
            { tipo: "A1", items: ["Arquivo .pfx no computador", "Mais prático", "Validade: 1 ano", "⚠️ Faça backup do arquivo!"] },
            { tipo: "A3", items: ["Token USB ou cartão", "Mais seguro", "Validade: 1 a 3 anos", "⚠️ Não perca o token!"] },
          ].map(({ tipo, items }) => (
            <div key={tipo} className="rounded-xl p-3" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
              <p className="font-bold text-sm mb-2" style={{ color: "#f5a623" }}>Certificado {tipo}</p>
              {items.map(i => <p key={i} className="text-xs mb-1" style={{ color: "var(--soma-muted)" }}>{i}</p>)}
            </div>
          ))}
        </div>
      </GuideCard>

      <GuideCard title="Instalando certificado A1 (.pfx)" icon="📥">
        {[
          { n: "1", desc: "Clique duas vezes no arquivo .pfx" },
          { n: "2", desc: "Selecione 'Usuário atual' (não Computador local)" },
          { n: "3", desc: "Digite a senha fornecida pela autoridade certificadora" },
          { n: "4", desc: "Marque 'Marcar esta chave como exportável'" },
          { n: "5", desc: "Repositório: selecione 'Pessoal'" },
          { n: "6", desc: "Clique em Concluir" },
          { n: "7", desc: "Teste em: cav.receita.fazenda.gov.br → Login com certificado" },
        ].map(({ n, desc }) => (
          <div key={n} className="flex gap-3 mb-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: "#f5a623", color: "#000" }}>{n}</span>
            <p className="text-xs self-center" style={{ color: "var(--soma-muted)" }}>{desc}</p>
          </div>
        ))}
        <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}>
          <p className="text-xs font-bold" style={{ color: "#f87171" }}>⚠️ Faça backup do arquivo .pfx em local seguro — se formatar sem o arquivo, perde o certificado!</p>
        </div>
      </GuideCard>

      <GuideCard title="Instalando token A3 (SafeNet/eToken)" icon="🔌">
        {[
          { n: "1", desc: "NÃO plugue o token ainda" },
          { n: "2", desc: "Baixe e instale o SafeNet Authentication Client" },
          { n: "3", desc: "Reinicie o computador" },
          { n: "4", desc: "Plugue o token na USB" },
          { n: "5", desc: "Abra o SafeNet Authentication Client e verifique se o certificado aparece" },
          { n: "6", desc: "Teste no e-CAC com Login por certificado" },
        ].map(({ n, desc }) => (
          <div key={n} className="flex gap-3 mb-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: "#f5a623", color: "#000" }}>{n}</span>
            <p className="text-xs self-center" style={{ color: "var(--soma-muted)" }}>{desc}</p>
          </div>
        ))}
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold" style={{ color: "var(--soma-muted)" }}>Downloads dos drivers:</p>
          <a href="https://support.thalesgroup.com/" target="_blank" rel="noreferrer" className="block text-xs underline" style={{ color: "#f5a623" }}>SafeNet Authentication Client (Thales)</a>
        </div>
      </GuideCard>

      <GuideCard title="Problemas comuns com certificado" icon="🔧">
        {[
          { prob: "Token não reconhecido", sol: "Tente outra porta USB → reinstale o driver → teste em outro computador" },
          { prob: "Senha bloqueada no token", sol: "⚠️ CUIDADO: 10 tentativas erradas bloqueiam permanentemente. Contate a autoridade certificadora." },
          { prob: "Certificado não aparece na lista", sol: "Feche e reabra o navegador. Verifique se o driver está instalado no Gerenciador de Dispositivos." },
          { prob: "Certificado expirado", sol: "Renove com a autoridade certificadora. Crie lembrete 30 dias antes do vencimento." },
        ].map(({ prob, sol }) => (
          <div key={prob} className="mb-3 p-3 rounded-xl" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
            <p className="font-semibold text-xs mb-1" style={{ color: "#f87171" }}>❌ {prob}</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>✅ {sol}</p>
          </div>
        ))}
      </GuideCard>
    </div>
  );
}

function TabEmail() {
  return (
    <div className="space-y-4">
      <GuideCard title="Estrutura de e-mail profissional" icon="✉️">
        <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", fontFamily: "monospace" }}>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "#f5a623" }}>ASSUNTO (obrigatório e específico):</p>
            <p className="text-xs" style={{ color: "#4ade80" }}>✅ DAS de maio/2026 — Empresa XYZ LTDA</p>
            <p className="text-xs" style={{ color: "#f87171" }}>❌ Segue / Olá / Documento</p>
          </div>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "#f5a623" }}>CORPO:</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Prezado(a) [Nome],</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>[Objetivo direto no 1º parágrafo]</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>[Detalhes: valor, vencimento, competência]</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Ficamos à disposição para dúvidas.</p>
            <p className="text-xs mt-2" style={{ color: "var(--soma-muted)" }}>[Assinatura completa]</p>
          </div>
        </div>
      </GuideCard>

      <GuideCard title="O que NUNCA enviar por e-mail" icon="⛔">
        {[
          "Senhas de qualquer sistema",
          "Dados bancários completos",
          "Reclamações sobre outros clientes",
          "Arquivos sem verificar se há vírus",
          "Opiniões pessoais sobre situação fiscal de terceiros",
        ].map(i => (
          <p key={i} className="text-sm mb-1.5" style={{ color: "var(--soma-muted)" }}>❌ {i}</p>
        ))}
      </GuideCard>

      <GuideCard title="Atalhos do Gmail" icon="⌨️">
        <p className="text-xs mb-3" style={{ color: "var(--soma-muted)" }}>Ative em: Configurações → Geral → Atalhos de teclado → Ativar</p>
        <div className="grid grid-cols-2 gap-2">
          {[["C", "Compor"], ["R", "Responder"], ["A", "Responder a todos"], ["F", "Encaminhar"], ["E", "Arquivar"], ["#", "Excluir"], ["/", "Buscar"], ["?", "Ver atalhos"]].map(([k, v]) => (
            <div key={k} className="flex items-center gap-2">
              <code className="text-xs px-2 py-1 rounded font-bold" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)", color: "#f5a623" }}>{k}</code>
              <span className="text-xs" style={{ color: "var(--soma-muted)" }}>{v}</span>
            </div>
          ))}
        </div>
      </GuideCard>
    </div>
  );
}

function TabSeguranca() {
  return (
    <div className="space-y-4">
      <GuideCard title="Senhas seguras" icon="🔑">
        <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#4ade80" }}>✅ Senha forte tem:</p>
          <p className="text-xs" style={{ color: "var(--soma-muted)" }}>• 12+ caracteres · Maiúsculas e minúsculas · Números · Caracteres especiais (!@#$%)</p>
          <p className="text-xs mt-1 font-mono" style={{ color: "#4ade80" }}>Exemplo: Soma@Prime2026!Fiscal</p>
        </div>
        <p className="text-xs font-bold mb-2" style={{ color: "#f87171" }}>❌ Nunca:</p>
        {["Usar a mesma senha em vários sistemas", "Salvar senha em arquivo .txt ou .xlsx", "Compartilhar senha por WhatsApp/e-mail", "Usar nome da empresa + ano"].map(i => (
          <p key={i} className="text-xs mb-1" style={{ color: "var(--soma-muted)" }}>• {i}</p>
        ))}
        <div className="mt-3 p-3 rounded-xl" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid var(--soma-border)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#f5a623" }}>💡 Gerenciador de senhas recomendado:</p>
          <a href="https://bitwarden.com/" target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: "#f5a623" }}>Bitwarden (gratuito): bitwarden.com</a>
        </div>
      </GuideCard>

      <GuideCard title="Como identificar phishing" icon="🎣">
        <p className="text-sm mb-3" style={{ color: "var(--soma-muted)" }}>Phishing são e-mails/sites falsos que imitam a Receita Federal ou bancos para roubar senhas.</p>
        {[
          { sinal: "Remetente com domínio estranho", ex: "receita@fazenda-br.com (FALSO) vs receita@fazenda.gov.br (OFICIAL)" },
          { sinal: "Link diferente do site oficial", ex: "Passe o mouse sobre o link sem clicar — veja o endereço real" },
          { sinal: "'Regularize débitos — clique aqui'", ex: "A Receita Federal NUNCA pede para clicar em link por e-mail" },
          { sinal: "Urgência exagerada", ex: "'Última chance' / 'Seu CNPJ será cancelado hoje'" },
        ].map(({ sinal, ex }) => (
          <div key={sinal} className="mb-3 p-3 rounded-xl" style={{ backgroundColor: "var(--soma-bg)", border: "1px solid rgba(220,38,38,0.2)" }}>
            <p className="font-semibold text-xs mb-1" style={{ color: "#f87171" }}>⚠️ {sinal}</p>
            <p className="text-xs" style={{ color: "var(--soma-muted)" }}>{ex}</p>
          </div>
        ))}
      </GuideCard>

      <GuideCard title="LGPD — proteção de dados dos clientes" icon="⚖️">
        <p className="text-sm mb-3" style={{ color: "var(--soma-muted)" }}>O escritório manipula dados pessoais de clientes. O descumprimento da LGPD pode gerar multa de até 2% do faturamento.</p>
        <p className="text-xs font-bold mb-2" style={{ color: "#4ade80" }}>✅ Obrigações do colaborador:</p>
        {[
          "Acesse só os dados necessários para o seu trabalho",
          "Nunca salve dados de clientes em dispositivos pessoais",
          "Não fotografe telas com dados de clientes",
          "Informe o gestor imediatamente se enviar documento para cliente errado",
        ].map(i => <p key={i} className="text-xs mb-1.5" style={{ color: "var(--soma-muted)" }}>• {i}</p>)}
      </GuideCard>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function GuideInformatica() {
  const [activeTab, setActiveTab] = useState("windows");

  const renderTab = () => {
    switch (activeTab) {
      case "windows":     return <TabWindows />;
      case "arquivos":    return <TabArquivos />;
      case "atalhos":     return <TabAtalhos />;
      case "arquivar":    return <TabArquivar />;
      case "internet":    return <TabInternet />;
      case "certificado": return <TabCertificado />;
      case "email":       return <TabEmail />;
      case "seguranca":   return <TabSeguranca />;
      case "checklist":   return <Checklist />;
      case "faq":         return <FAQ />;
      default:            return <TabWindows />;
    }
  };

  const allTabs = [...tabs, { id: "checklist", label: "Checklist", icon: Shield }, { id: "faq", label: "FAQ", icon: Search }];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: "rgba(245,166,35,0.12)" }}>
          <Monitor size={24} style={{ color: "#f5a623" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--soma-text)" }}>Informática para Contabilidade</h1>
          <p className="text-sm" style={{ color: "var(--soma-muted)" }}>Do básico ao avançado — tudo que você precisa dominar no computador para trabalhar com excelência na Soma Prime.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 flex-wrap border-b" style={{ borderColor: "var(--soma-border)" }}>
        {allTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all"
            style={{
              borderBottomColor: activeTab === id ? "#f5a623" : "transparent",
              color: activeTab === id ? "#f5a623" : "var(--soma-muted)",
            }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div>{renderTab()}</div>
    </div>
  );
}