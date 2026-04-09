import { useNavigate, useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";

export default function ComingSoon() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const module = pathname.split("/").pop()?.replace(/-/g, " ") ?? "módulo";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="p-5 rounded-2xl bg-gold/10">
        <Construction size={40} className="text-gold" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold capitalize">{module}</h2>
        <p className="opacity-50 text-sm max-w-sm">
          Este módulo está em desenvolvimento e será disponibilizado em breve.
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-gold hover:opacity-80 transition-opacity"
      >
        <ArrowLeft size={16} /> Voltar para o início
      </button>
    </div>
  );
}