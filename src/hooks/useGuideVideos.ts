import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface GuideVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration: string | null;
  order_num: number;
}

export function useGuideVideos(guideKey: string, tabKey: string) {
  const [videos, setVideos] = useState<GuideVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Busca tab pelo guia e aba
      const { data: tabs } = await supabase
        .from("guide_tabs")
        .select("id, guides(sector_key)")
        .eq("key", tabKey)
        .filter("guides.sector_key", "eq", guideKey);

      const tabIds = (tabs ?? []).map((t: any) => t.id);

      if (tabIds.length === 0) { setVideos([]); setLoading(false); return; }

      const { data } = await supabase
        .from("guide_videos")
        .select("*")
        .in("tab_id", tabIds)
        .order("order_num");

      setVideos(data ?? []);
      setLoading(false);
    }
    load();
  }, [guideKey, tabKey]);

  return { videos, loading };
}