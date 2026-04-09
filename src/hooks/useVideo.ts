import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export function useVideo(videoId: string) {
  const { user } = useAuth();
  const [watched, setWatched] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega se já assistiu
  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const { data } = await supabase
          .from("video_progress")
          .select("watched")
          .eq("user_id", user!.id)
          .eq("video_id", videoId)
          .single();
        setWatched(data?.watched ?? false);
      } catch {
        setWatched(false);
      }
      setLoading(false);
    }
    load();
  }, [user, videoId]);

  // Marca como assistido
  const markWatched = useCallback(async () => {
    if (!user || watched) return;
    setWatched(true);
    await supabase.from("video_progress").upsert({
      user_id:    user.id,
      video_id:   videoId,
      watched:    true,
      watched_at: new Date().toISOString(),
    }, { onConflict: "user_id,video_id" });
  }, [user, videoId, watched]);

  return { watched, loading, markWatched };
}