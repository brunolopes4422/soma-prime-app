import { useRef } from "react";
import { Download, X, Trophy } from "lucide-react";

interface CertificadoProps {
  colaborador: string;
  trilha: string;
  sector: string;
  nivel: string;
  empresa?: string;
  dataEmissao: string;
  nota?: number;
  onClose: () => void;
}

export default function Certificado({ colaborador, trilha, sector, nivel, dataEmissao, nota, onClose }: CertificadoProps) {
  const certRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Converte logos para base64 para funcionar no PDF
    async function toBase64(url: string): Promise<string> {
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } catch { return ""; }
    }

    const logoSClaroBase64 = await toBase64("/logos/SomaSTemaclaro.png");
    const sDarkBase64 = await toBase64("/logos/soma-s.png");

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Certificado — ${colaborador}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; background: #fff; }
    @page { size: A4 landscape; margin: 0; }
    .cert {
      width: 297mm; height: 210mm;
      background: #fff;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 18mm 28mm;
    }
    .border-outer { position: absolute; inset: 8mm; border: 3px solid #f5a623; border-radius: 4mm; }
    .border-inner { position: absolute; inset: 11mm; border: 1px solid rgba(245,166,35,0.25); border-radius: 3mm; }
    .watermark-s {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 185mm; height: 185mm;
      object-fit: contain;
      opacity: 0.15;
      pointer-events: none;
    }
    .logo-topo { display: flex; flex-direction: column; align-items: center; margin-bottom: 6mm; }
    .logo-s-img { height: 22mm; width: 22mm; object-fit: contain; margin-bottom: 3mm; }
    .logo-nome { font-size: 14pt; letter-spacing: 6px; color: #f5a623; font-weight: bold; font-family: Arial, sans-serif; margin-bottom: 1mm; }
    .subtitulo { font-size: 7pt; letter-spacing: 3px; color: #999; font-family: Arial, sans-serif; margin-bottom: 8mm; text-transform: uppercase; }
    .certifica { font-size: 9pt; letter-spacing: 2px; color: #888; font-family: Arial, sans-serif; margin-bottom: 3mm; text-transform: uppercase; }
    .nome { font-size: 30pt; color: #1a1a1a; margin-bottom: 5mm; font-style: italic; }
    .descricao { font-size: 9pt; color: #666; font-family: Arial, sans-serif; text-align: center; max-width: 180mm; line-height: 1.6; margin-bottom: 5mm; }
    .trilha-nome { font-size: 16pt; color: #f5a623; font-family: Arial, sans-serif; font-weight: bold; margin-bottom: 2mm; text-align: center; }
    .nivel { font-size: 8pt; color: #aaa; font-family: Arial, sans-serif; letter-spacing: 2px; margin-bottom: 7mm; text-transform: uppercase; }
    .divider { width: 50mm; height: 1px; background: linear-gradient(90deg, transparent, #f5a623, transparent); margin: 0 auto 7mm; }
    .nota-badge { background: #fffbf0; border: 1px solid #f5a623; border-radius: 20px; padding: 1.5mm 6mm; font-size: 8pt; color: #f5a623; font-family: Arial, sans-serif; font-weight: bold; margin-bottom: 6mm; }
    .rodape { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; max-width: 220mm; }
    .assinatura { text-align: center; }
    .linha-ass { width: 65mm; height: 1px; background: #ddd; margin-bottom: 2mm; }
    .ass-nome { font-size: 8pt; color: #555; font-family: Arial, sans-serif; font-weight: bold; }
    .ass-cargo { font-size: 7pt; color: #aaa; font-family: Arial, sans-serif; }
    .data-center { text-align: center; font-size: 7pt; color: #bbb; font-family: Arial, sans-serif; line-height: 1.6; }
  </style>
</head>
<body>
<div class="cert">
  <div class="border-outer"></div>
  <div class="border-inner"></div>

  <!-- S como marca d'água gigante -->
  ${sDarkBase64 ? `<img class="watermark-s" src="${sDarkBase64}" alt="" />` : ""}

  <!-- Logo topo: S + SOMA PRIME -->
  <div class="logo-topo">
    ${logoSClaroBase64 ? `<img class="logo-s-img" src="${logoSClaroBase64}" alt="S" />` : ""}
    <div class="logo-nome">SOMA PRIME</div>
  </div>

  <div class="subtitulo">Portal Operacional · Escola de Desenvolvimento</div>

  <div class="certifica">Certifica que</div>
  <div class="nome">${colaborador}</div>
  <div class="descricao">concluiu com aprovação a trilha de desenvolvimento profissional</div>

  <div class="trilha-nome">${trilha}</div>
  <div class="nivel">${sector.toUpperCase()} · ${nivel}</div>

  ${nota !== undefined ? `<div class="nota-badge">Nota final: ${nota}%</div>` : ""}

  <div class="divider"></div>

  <div class="rodape">
    <div class="assinatura">
      <div class="linha-ass"></div>
      <div class="ass-nome">Direção Soma Prime</div>
      <div class="ass-cargo">Empresa</div>
    </div>
    <div class="data-center">
      Emitido em ${dataEmissao}<br>
      Portal Operacional Soma Prime
    </div>
    <div class="assinatura">
      <div class="linha-ass"></div>
      <div class="ass-nome">Gestor de ${sector.toUpperCase()}</div>
      <div class="ass-cargo">Responsável do Setor</div>
    </div>
  </div>
</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  }

  // const levelColor: Record<string, string> = { Júnior: "#22c55e", Pleno: "#60a5fa", Sênior: "#a855f7", Gestor: "#f5a623" };
  // const lc = levelColor[nivel] ?? "#f5a623";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--soma-card)", border: "1px solid rgba(245,166,35,0.3)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--soma-border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(245,166,35,0.15)" }}>
              <Trophy size={16} style={{ color: "#f5a623" }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>Certificado de Conclusão</p>
              <p className="text-xs" style={{ color: "var(--soma-muted)" }}>Clique em Baixar para salvar em PDF</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "var(--soma-muted)" }}><X size={18} /></button>
        </div>

        {/* Preview do certificado */}
        <div ref={certRef} className="mx-6 my-5 rounded-xl overflow-hidden relative"
          style={{ background: "#fff", border: "3px solid #f5a623", aspectRatio: "1.414", minHeight: 320 }}>

          {/* Borda interna */}
          <div className="absolute inset-2 rounded-lg" style={{ border: "1px solid rgba(245,166,35,0.25)" }} />

          {/* S como marca d'água — forte */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <img src="/logos/soma-s.png" alt=""
              style={{ width: "85%", height: "85%", objectFit: "contain", opacity: 0.18 }}
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>

          {/* Conteúdo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
              <img src="/logos/SomaSTemaclaro.png" alt="S"
                style={{ height: 52, width: 52, objectFit: "contain", marginBottom: 5 }}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <p style={{ fontSize: 13, letterSpacing: 6, color: "#f5a623", fontWeight: 700, marginBottom: 3 }}>SOMA PRIME</p>
              <p style={{ fontSize: 6, letterSpacing: 2, color: "#bbb" }}>PORTAL OPERACIONAL · ESCOLA DE DESENVOLVIMENTO</p>
            </div>

            <p style={{ fontSize: 8, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 4 }}>Certifica que</p>
            <p style={{ fontSize: 22, color: "#1a1a1a", fontFamily: "Georgia, serif", fontStyle: "italic", marginBottom: 4 }}>
              {colaborador}
            </p>

            <p style={{ fontSize: 8, color: "#666", maxWidth: 300, lineHeight: 1.5, marginBottom: 8 }}>
              concluiu com aprovação a trilha de desenvolvimento profissional
            </p>

            <p style={{ fontSize: 13, color: "#f5a623", fontWeight: 700, marginBottom: 2 }}>{trilha}</p>
            <p style={{ fontSize: 7, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              {sector} · {nivel}
            </p>

            {nota !== undefined && (
              <div className="px-3 py-1 rounded-full mb-8" style={{ backgroundColor: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)" }}>
                <p style={{ fontSize: 8, color: "#f5a623", fontWeight: 700 }}>Nota final: {nota}%</p>
              </div>
            )}

            <div style={{ width: 60, height: 1, backgroundColor: "#f5a623", margin: "0 auto 12px" }} />

            <div className="flex justify-between w-full" style={{ maxWidth: 400 }}>
              <div className="text-center">
                <div style={{ width: 80, height: 1, backgroundColor: "#ccc", marginBottom: 4 }} />
                <p style={{ fontSize: 7, color: "#555" }}>Direção Soma Prime</p>
              </div>
              <div className="text-center">
                <p style={{ fontSize: 6, color: "#aaa" }}>Emitido em {dataEmissao}</p>
              </div>
              <div className="text-center">
                <div style={{ width: 80, height: 1, backgroundColor: "#ccc", marginBottom: 4 }} />
                <p style={{ fontSize: 7, color: "#555" }}>Gestor de {sector}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info da nota */}
        {nota !== undefined && (
          <div className="mx-6 mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: nota >= 70 ? "rgba(34,197,94,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${nota >= 70 ? "rgba(34,197,94,0.2)" : "rgba(248,113,113,0.2)"}` }}>
            <span className="text-sm font-bold" style={{ color: nota >= 70 ? "#22c55e" : "#f87171" }}>
              {nota >= 70 ? "✅" : "❌"}
            </span>
            <div>
              <p className="text-xs font-semibold" style={{ color: nota >= 70 ? "#22c55e" : "#f87171" }}>
                {nota >= 70 ? `Aprovado com ${nota}% — mínimo exigido: 70%` : `Reprovado — ${nota}% (mínimo: 70%)`}
              </p>
              <p className="text-xs" style={{ color: "var(--soma-muted)" }}>
                Nota calculada com base na avaliação final da trilha
              </p>
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "#f5a623", color: "#000" }}>
            <Download size={16} /> Baixar Certificado (PDF)
          </button>
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm transition-all hover:opacity-70"
            style={{ border: "1px solid var(--soma-border)", color: "var(--soma-muted)" }}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}