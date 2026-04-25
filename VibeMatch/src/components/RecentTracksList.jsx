import { motion } from "framer-motion";

export default function RecentTracksList({ recentTracks = [] }) {
  function getTimeAgo(dateString) {
    const now = new Date();
    const playedAt = new Date(dateString);
    const diff = Math.floor((now - playedAt) / 1000);

    if (diff < 60) return "agora";
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`;
    return `${Math.floor(diff / 86400)} d atrás`;
  }
  return (
    <div>
      <p className="mb-5 text-xs uppercase tracking-[0.2em] text-white/40">
        Ouvidas recentemente
      </p>

      {recentTracks.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/45">
          Nenhuma música recente encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-8">
          {recentTracks.slice(0, 24).map((item, index) => {
            const track = item.track || item;
            const playedAt = item.played_at;

            return (
              <motion.div
                key={track.id || index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-black/20 transition hover:bg-white/10"
              >
                {/* IMAGEM */}
                <div className="relative">
                  {track.album?.images?.[0]?.url ? (
                    <img
                      src={track.album.images[0].url}
                      alt={track.name}
                      className="h-28 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-full items-center justify-center bg-white/10">
                      🎵
                    </div>
                  )}

                  {/* overlay hover */}
                  <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/30" />
                </div>

                {/* INFO */}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {track.name}
                  </p>
                  <p className="truncate text-xs text-white/40">
                    {track.artists?.map((a) => a.name).join(", ")}
                  </p>
                  <p className="mt-1 text-[11px] text-green-400/70">
                    {playedAt ? getTimeAgo(playedAt) : ""}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
