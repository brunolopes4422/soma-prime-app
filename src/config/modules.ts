import {
  Users, FileText, Calculator, Briefcase,
  CreditCard, BarChart2, BookOpen, Settings,
  Building2, ClipboardList, DollarSign, Scale
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Module {
  key: string;
  to: string;
  title: string;
  shortTitle: string;
  desc: string;
  icon: LucideIcon;
  category: "operacional" | "fiscal" | "pessoal" | "financeiro" | "gestao";
  color: string;
  border: string;
  available: boolean; // false = em breve
}

export const MODULES: Module[] = [
  // OPERACIONAL
  {
    key: "cs",
    to: "/guias/cs",
    title: "CS / Atendimento",
    shortTitle: "CS",
    desc: "Fluxo de atendimento, scripts, ferramentas e rotinas do Customer Success.",
    icon: Users,
    category: "operacional",
    color: "from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    available: true,
  },
  {
    key: "onboarding",
    to: "/guias/onboarding",
    title: "Onboarding de Clientes",
    shortTitle: "Onboarding",
    desc: "Passo a passo para abertura e entrada de novos clientes na carteira.",
    icon: ClipboardList,
    category: "operacional",
    color: "from-amber-400/10 to-amber-500/5",
    border: "border-amber-400/20",
    available: false,
  },

  // FISCAL
  {
    key: "fiscal",
    to: "/guias/fiscal",
    title: "Fiscal",
    shortTitle: "Fiscal",
    desc: "Obrigações fiscais, prazos, regimes tributários e rotinas do departamento.",
    icon: FileText,
    category: "fiscal",
    color: "from-yellow-500/10 to-yellow-600/5",
    border: "border-yellow-500/20",
    available: true,
  },
  {
    key: "simples",
    to: "/guias/simples",
    title: "Simples Nacional",
    shortTitle: "Simples",
    desc: "Rotinas, obrigações e prazos específicos para empresas do Simples Nacional.",
    icon: Scale,
    category: "fiscal",
    color: "from-yellow-400/10 to-yellow-500/5",
    border: "border-yellow-400/20",
    available: false,
  },
  {
    key: "lucro_presumido",
    to: "/guias/lucro-presumido",
    title: "Lucro Presumido",
    shortTitle: "L. Presumido",
    desc: "Obrigações acessórias e rotinas para empresas do Lucro Presumido.",
    icon: Scale,
    category: "fiscal",
    color: "from-yellow-300/10 to-yellow-400/5",
    border: "border-yellow-300/20",
    available: false,
  },

  // PESSOAL
  {
    key: "dp",
    to: "/guias/dp",
    title: "Dep. Pessoal",
    shortTitle: "DP",
    desc: "Admissões, demissões, folha de pagamento e rotinas do departamento pessoal.",
    icon: Briefcase,
    category: "pessoal",
    color: "from-orange-500/10 to-orange-600/5",
    border: "border-orange-500/20",
    available: true,
  },
  {
    key: "esocial",
    to: "/guias/esocial",
    title: "eSocial",
    shortTitle: "eSocial",
    desc: "Eventos, prazos e obrigações do eSocial para todos os regimes.",
    icon: Building2,
    category: "pessoal",
    color: "from-orange-400/10 to-orange-500/5",
    border: "border-orange-400/20",
    available: false,
  },

  // FINANCEIRO
  {
    key: "omie",
    to: "/guias/omie",
    title: "OMIE",
    shortTitle: "OMIE",
    desc: "Contas a pagar, contas a receber e conciliação bancária no OMIE.",
    icon: Calculator,
    category: "financeiro",
    color: "from-gold/10 to-gold/5",
    border: "border-gold/20",
    available: true,
  },
  {
    key: "conciliacao",
    to: "/guias/conciliacao",
    title: "Conciliação Bancária",
    shortTitle: "Conciliação",
    desc: "Rotinas e checklist de conciliação bancária mensal.",
    icon: CreditCard,
    category: "financeiro",
    color: "from-gold-light/10 to-gold-light/5",
    border: "border-gold-light/20",
    available: false,
  },
  {
    key: "dre",
    to: "/guias/dre",
    title: "DRE / Relatórios",
    shortTitle: "DRE",
    desc: "Geração e análise de DRE, balanço e relatórios gerenciais.",
    icon: BarChart2,
    category: "financeiro",
    color: "from-amber-600/10 to-amber-700/5",
    border: "border-amber-600/20",
    available: false,
  },

  // GESTÃO
  {
    key: "qualidade",
    to: "/guias/qualidade",
    title: "Qualidade / SLA",
    shortTitle: "Qualidade",
    desc: "Padrões de qualidade, SLA por serviço e gestão de reclamações.",
    icon: Settings,
    category: "gestao",
    color: "from-stone-500/10 to-stone-600/5",
    border: "border-stone-500/20",
    available: false,
  },
  {
    key: "treinamento",
    to: "/guias/treinamento",
    title: "Treinamentos",
    shortTitle: "Treinamentos",
    desc: "Trilhas de treinamento, materiais e avaliações por cargo.",
    icon: BookOpen,
    category: "gestao",
    color: "from-stone-400/10 to-stone-500/5",
    border: "border-stone-400/20",
    available: false,
  },
  {
    key: "honorarios",
    to: "/guias/honorarios",
    title: "Honorários",
    shortTitle: "Honorários",
    desc: "Tabela de honorários, reajustes e procedimentos de cobrança.",
    icon: DollarSign,
    category: "gestao",
    color: "from-stone-300/10 to-stone-400/5",
    border: "border-stone-300/20",
    available: false,
  },
];

export const CATEGORIES: Record<Module["category"], string> = {
  operacional: "Operacional",
  fiscal: "Fiscal",
  pessoal: "Dep. Pessoal",
  financeiro: "Financeiro",
  gestao: "Gestão",
};

// Retorna só os módulos que a empresa tem acesso
export const getModules = (companyModules: string[]) =>
  MODULES.filter(m => companyModules.includes(m.key));

// Retorna módulos agrupados por categoria
export const getModulesByCategory = (companyModules: string[]) => {
  const available = getModules(companyModules);
  return Object.entries(CATEGORIES).reduce((acc, [cat, label]) => {
    const mods = available.filter(m => m.category === cat as Module["category"]);
    if (mods.length) acc[label] = mods;
    return acc;
  }, {} as Record<string, Module[]>);
};