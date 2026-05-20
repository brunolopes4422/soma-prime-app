export type CompanyKey = "soma_prime" | "ph_consult";

export interface Theme {
  name: string;
  logo: string;
  fallback: string;
  bg: string;
  card: string;
  text: string;
  sidebar: string;
  accent: string;
  badge: string;
  modules: string[];
}

export const themes: Record<CompanyKey, Theme> = {
  soma_prime: {
    name: "Soma Prime",
    logo: "/logos/soma-prime.png",
    fallback: "SOMA PRIME",
    bg:      "bg-soma-bg",
    card:    "bg-soma-card border-soma-border",
    text:    "text-soma-text",
    sidebar: "bg-soma-card border-soma-border",
    accent:  "text-gold-light",
    badge:   "bg-gold-light/10 text-gold-light border border-gold-light/30",
    modules: ["cs", "fiscal", "dp", "omie", "contabil", "informatica", "onboarding"],
  },
  ph_consult: {
    name: "PH Consult Pro",
    logo: "/logos/ph-consult.png",
    fallback: "PH CONSULT PRO",
    bg:      "bg-soma-bg",
    card:    "bg-soma-card border-soma-border",
    text:    "text-soma-text",
    sidebar: "bg-soma-card border-soma-border",
    accent:  "text-gold-light",
    badge:   "bg-gold-light/10 text-gold-light border border-gold-light/30",
    modules: ["cs", "fiscal", "dp", "omie", "contabil", "informatica", "onboarding"],
  },
};

export const getTheme = (companyKey: CompanyKey): Theme =>
  themes[companyKey] ?? themes.soma_prime;