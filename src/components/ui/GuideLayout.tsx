import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export interface GuideTab {
  key: string;
  label: string;
  icon: LucideIcon;
  content: React.ReactNode;
}

interface GuideLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tabs: GuideTab[];
}

export default function GuideLayout({ title, subtitle, icon: Icon, tabs }: GuideLayoutProps) {
  const [active, setActive] = useState(tabs[0]?.key);

  const current = tabs.find(t => t.key === active);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header do guia */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gold/10">
          <Icon size={24} className="text-gold" />
        </div>
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-sm opacity-50">{subtitle}</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b border-current/10 overflow-x-auto pb-px">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                        border-b-2 transition-colors duration-150 -mb-px
                        ${active === tab.key
                          ? "border-gold text-gold"
                          : "border-transparent opacity-50 hover:opacity-80"
                        }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div>
        {current?.content}
      </div>

    </div>
  );
}