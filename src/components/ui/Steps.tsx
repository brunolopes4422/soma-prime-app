import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface StepItem {
  title: string;
  desc: string;
  tip?: string;
  warn?: string;
}

export default function Steps({ items }: { items: StepItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const open = active === i;
        return (
          <button key={i} onClick={() => setActive(open ? null : i)} className="w-full text-left">
            <div className="rounded-xl border overflow-hidden transition-all duration-200"
              style={{
                borderColor: open ? "#f5a623" : "var(--soma-border)",
                backgroundColor: open ? "rgba(245,166,35,0.05)" : "var(--soma-card)"
              }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                  style={{ backgroundColor: open ? "#f5a623" : "var(--soma-bg)", color: open ? "#000" : "var(--soma-muted)" }}>
                  {i + 1}
                </span>
                <span className="font-semibold text-sm flex-1" style={{ color: "var(--soma-text)" }}>
                  {item.title}
                </span>
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`}
                  style={{ color: "var(--soma-muted)" }} />
              </div>
              {open && (
                <div className="px-4 pb-4 pt-3 space-y-2 border-t"
                  style={{ borderColor: "rgba(245,166,35,0.2)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--soma-muted)" }}>
                    {item.desc}
                  </p>
                  {item.tip && (
                    <div className="px-3 py-2 rounded-lg text-xs"
                      style={{ backgroundColor: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#f5a623" }}>
                      💡 <strong>Dica:</strong> {item.tip}
                    </div>
                  )}
                  {item.warn && (
                    <div className="px-3 py-2 rounded-lg text-xs"
                      style={{ backgroundColor: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171" }}>
                      ⚠️ <strong>Atenção:</strong> {item.warn}
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