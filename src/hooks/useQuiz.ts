import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useQuiz(guide: string, tab: string) {
  const { user } = useAuth();
  const [answers, setAnswers]     = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const answer = useCallback((qi: number, oi: number) => {
    setAnswers(a => ({ ...a, [qi]: oi }));
  }, []);

  const submit = useCallback(async (questions: { correct: number }[]) => {
    const score = questions.filter((q, i) => answers[i] === q.correct).length;
    setShowResult(true);

    if (!user) return;
    await supabase.from("quiz_results").insert({
      user_id:      user.id,
      guide,
      tab,
      score,
      total:        questions.length,
      attempted_at: new Date().toISOString(),
    });
  }, [user, guide, tab, answers]);

  const reset = useCallback(() => {
    setAnswers({});
    setShowResult(false);
  }, []);

  return { answers, showResult, answer, submit, reset };
}