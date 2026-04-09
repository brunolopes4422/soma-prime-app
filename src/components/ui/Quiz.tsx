import { useQuiz } from "../../hooks/useQuiz";

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  guide: string;
  tab: string;
  title?: string;
}

export default function Quiz({ questions, guide, tab, title }: QuizProps) {
  const { answers, showResult, answer, submit, reset } = useQuiz(guide, tab);
  const score = questions.filter((q, i) => answers[i] === q.correct).length;

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="font-bold text-sm" style={{ color: "var(--soma-text)" }}>{title}</h3>
      )}

      {questions.map((q, qi) => (
        <div key={qi} className="rounded-xl border p-4 space-y-3"
          style={{ backgroundColor: "var(--soma-card)", borderColor: "var(--soma-border)" }}>
          <p className="font-semibold text-sm" style={{ color: "var(--soma-text)" }}>
            {qi + 1}. {q.q}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected  = answers[qi] === oi;
              const isCorrect = q.correct === oi;

              let bg     = "transparent";
              let border = "var(--soma-border)";
              let color  = "var(--soma-muted)";

              if (showResult && isCorrect) {
                bg = "#16a34a"; border = "#16a34a"; color = "#ffffff";
              } else if (showResult && selected && !isCorrect) {
                bg = "#dc2626"; border = "#dc2626"; color = "#ffffff";
              } else if (selected) {
                bg = "#f5a623"; border = "#f5a623"; color = "#000000";
              }

              return (
                <button
                  key={oi}
                  disabled={showResult}
                  onClick={() => answer(qi, oi)}
                  className="w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all duration-150"
                  style={{ backgroundColor: bg, borderColor: border, color,
                    textDecoration: showResult && selected && !isCorrect ? "line-through" : "none" }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="text-xs px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#93c5fd" }}>
              💬 {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!showResult ? (
        <button
          onClick={() => submit(questions)}
          disabled={Object.keys(answers).length < questions.length}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40"
          style={{ backgroundColor: "#f5a623", color: "#000" }}
        >
          Verificar respostas
        </button>
      ) : (
        <div className="rounded-xl p-4 text-center text-sm font-semibold border"
          style={{
            backgroundColor: score === questions.length ? "rgba(22,163,74,0.15)"
              : score >= questions.length / 2 ? "rgba(234,179,8,0.15)"
              : "rgba(220,38,38,0.15)",
            borderColor: score === questions.length ? "rgba(22,163,74,0.4)"
              : score >= questions.length / 2 ? "rgba(234,179,8,0.4)"
              : "rgba(220,38,38,0.4)",
            color: score === questions.length ? "#4ade80"
              : score >= questions.length / 2 ? "#fbbf24"
              : "#f87171",
          }}
        >
          {score === questions.length ? "🏆 Perfeito!" : score >= questions.length / 2 ? "👍 Bom!" : "📚 Revise o conteúdo!"}&nbsp;
          {score}/{questions.length} corretas
          <button onClick={reset} className="block mx-auto mt-2 text-xs underline opacity-60">
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
}