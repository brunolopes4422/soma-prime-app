import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useChecklist(guide: string) {
  const { user } = useAuth();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Carrega progresso do Supabase ao montar
  useEffect(() => {
    if (!user) return;
    async function load() {
      const { data } = await supabase
        .from("checklist_items")
        .select("item_id, completed")
        .eq("user_id", user!.id)
        .eq("guide", guide);

      if (data) {
        const map: Record<string, boolean> = {};
        data.forEach(row => { map[row.item_id] = row.completed; });
        setChecked(map);
      }
      setLoading(false);
    }
    load();
  }, [user, guide]);

  // Marca/desmarca item e salva no Supabase
  const toggle = useCallback(async (itemId: string) => {
    if (!user) return;
    const next = !checked[itemId];
    setChecked(c => ({ ...c, [itemId]: next }));

    await supabase.from("checklist_items").upsert({
      user_id:    user.id,
      guide,
      item_id:    itemId,
      completed:  next,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,guide,item_id" });
  }, [user, guide, checked]);

  return { checked, toggle, loading };
}