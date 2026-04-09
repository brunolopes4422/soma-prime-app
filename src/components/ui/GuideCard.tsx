import { useState } from "react";
import Modal from "./Modal";
import { ChevronRight } from "lucide-react";

interface GuideCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  modalTitle?: string;
  modalSubtitle?: string;
  children?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function GuideCard({
  icon,
  title,
  subtitle,
  modalTitle,
  modalSubtitle,
  children,
  badge,
  badgeColor = "bg-gold-light/10 text-gold-light border-gold-light/20",
}: GuideCardProps) {
  const [open, setOpen] = useState(false);
  const hasModal = !!children;

  return (
    <>
      <button
        onClick={() => hasModal && setOpen(true)}
        className={`w-full text-left card-base border border-ph-border bg-ph-card
                    flex items-center gap-4 group transition-all duration-200
                    ${hasModal ? "hover:border-gold-light/40 hover:shadow-sm cursor-pointer" : "cursor-default"}`}
      >
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-ph-text">{title}</span>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-ph-text/50 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {hasModal && (
          <ChevronRight
            size={16}
            className="text-ph-text/30 group-hover:text-gold-light transition-colors shrink-0"
          />
        )}
      </button>

      {hasModal && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={modalTitle ?? title}
          subtitle={modalSubtitle ?? subtitle}
          icon={icon}
        >
          {children}
        </Modal>
      )}
    </>
  );
}