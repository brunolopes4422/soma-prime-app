import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface QuizOption {
  id: string;
  text: string;
  correct?: boolean;
}

interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  video_url: string | null;
  video_id: string | null;
  duration_min: number;
  content: string | null;
  order_num: number;

  quiz_data?: QuizQuestion[] | null;
}
interface Module {
  id: string;
  trilha_id: string;
  title: string;
  description: string;
  order_num: number;
  lessons: Lesson[];
}



export function useTrilha(trilhaId: string) {
  const { user } = useAuth();
  const [modules, setModules]       = useState<Module[]>([]);
  const [progress, setProgress]     = useState<Record<string, boolean>>({});
  const [hasCert, setHasCert]       = useState(false);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    if (!user || !trilhaId) return;
    async function load() {
      // Busca módulos e aulas
      const { data: modulesData } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("trilha_id", trilhaId)
        .order("order_num");

      // Ordena aulas dentro de cada módulo
      const sorted = (modulesData ?? []).map(m => ({
        ...m,
        lessons: (m.lessons ?? []).sort((a: Lesson, b: Lesson) => a.order_num - b.order_num),
      }));

      // Busca progresso do usuário
      const lessonIds = sorted.flatMap(m => m.lessons.map((l: Lesson) => l.id));
      if (lessonIds.length > 0) {
        const { data: progressData } = await supabase
          .from("lesson_progress")
          .select("lesson_id, completed")
          .eq("user_id", user!.id)
          .in("lesson_id", lessonIds);

        const map: Record<string, boolean> = {};
        (progressData ?? []).forEach(p => { map[p.lesson_id] = p.completed; });
        setProgress(map);
      }

      // Verifica certificado
      const { data: certData } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", user!.id)
        .eq("trilha_id", trilhaId)
        .single();

      setModules(sorted);
      setHasCert(!!certData);
      setLoading(false);
    }
    load();
  }, [user, trilhaId]);

  // Marca aula como concluída
  const completeLesson = useCallback(async (lessonId: string) => {
    if (!user) return;
    setProgress(p => ({ ...p, [lessonId]: true }));
    await supabase.from("lesson_progress").upsert({
      user_id:      user.id,
      lesson_id:    lessonId,
      completed:    true,
      completed_at: new Date().toISOString(),
    }, { onConflict: "user_id,lesson_id" });
  }, [user]);

  // Calcula progresso geral
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const doneLessons  = Object.values(progress).filter(Boolean).length;
  const pct          = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  return { modules, progress, hasCert, loading, completeLesson, totalLessons, doneLessons, pct };
}