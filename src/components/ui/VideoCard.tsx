import { useState } from "react";
import { Play, X, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { useVideo } from "../../hooks/useVideo";

interface VideoCardProps {
  videoId: string;         // ID único do vídeo (ex: "cs-fluxo-atendimento")
  title: string;
  description?: string;
  duration?: string;
  instructor?: string;
  videoUrl?: string;
  thumbnail?: string;
  comingSoon?: boolean;
}

export default function VideoCard({
  videoId,
  title,
  description,
  duration,
  instructor,
  videoUrl,
  thumbnail,
  comingSoon = false,
}: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const { watched, markWatched } = useVideo(videoId);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match?.[1] ?? null;
  };

  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null;
  const embedUrl  = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : videoUrl;

  function handleOpen() {
    if (comingSoon) return;
    setOpen(true);
    // Marca como assistido ao abrir
    markWatched();
  }

  return (
    <>
      <div
        onClick={handleOpen}
        className={`relative rounded-2xl border overflow-hidden transition-all duration-200 group
          ${comingSoon
            ? "border-soma-border bg-soma-bg cursor-default opacity-60"
            : watched
              ? "border-green-400/50 bg-white cursor-pointer hover:border-green-400 hover:shadow-md"
              : "border-gold/30 bg-white cursor-pointer hover:border-gold hover:shadow-md hover:scale-[1.01]"
          }`}
      >
        {/* Thumbnail */}
        <div className="relative h-36 bg-gradient-to-br from-soma-text/10 to-gold/20 flex items-center justify-center overflow-hidden">
          {(thumbnail || youtubeId) && !comingSoon ? (
            <img
              src={thumbnail ?? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 opacity-40">
              <BookOpen size={32} />
              <span className="text-xs font-medium">{comingSoon ? "Em breve" : "Vídeo disponível"}</span>
            </div>
          )}

          {/* Overlay escuro na thumbnail */}
          {!comingSoon && <div className="absolute inset-0 bg-black/20" />}

          {/* Botão play */}
          {!comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg
                              group-hover:scale-110 transition-transform duration-200
                              ${watched ? "bg-green-500" : "bg-gold"}`}>
                {watched
                  ? <CheckCircle2 size={22} className="text-white" />
                  : <Play size={20} className="text-white ml-0.5" fill="white" />
                }
              </div>
            </div>
          )}

          {/* Badge assistido */}
          {watched && (
            <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 size={10} /> Assistido
            </div>
          )}

          {/* Badge em breve */}
          {comingSoon && (
            <div className="absolute top-2 right-2 bg-soma-text/80 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Em breve
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <p className="font-semibold text-sm leading-tight">{title}</p>
          {description && <p className="text-xs opacity-50 leading-relaxed line-clamp-2">{description}</p>}
          <div className="flex items-center gap-3 pt-1">
            {duration && (
              <span className="flex items-center gap-1 text-xs opacity-40">
                <Clock size={11} /> {duration}
              </span>
            )}
            {instructor && <span className="text-xs opacity-40">👤 {instructor}</span>}
          </div>
        </div>
      </div>

      {/* Modal player */}
      {open && embedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <X size={16} />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-ph-card">
              <p className="font-semibold text-ph-text text-sm">{title}</p>
              {description && <p className="text-xs text-ph-text/50 mt-0.5">{description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}