"use client";

import type { MovieEpisodeServerDto } from "@/server/modules/movies/dto/movie.dto";

interface EpisodeSelectorProps {
  activeEpisodeSlug: string;
  activeServerId: string;
  onEpisodeChange: (episodeSlug: string) => void;
  onServerChange: (serverId: string) => void;
  servers: MovieEpisodeServerDto[];
}

export function EpisodeSelector({
  activeEpisodeSlug,
  activeServerId,
  onEpisodeChange,
  onServerChange,
  servers,
}: EpisodeSelectorProps) {
  const activeServer = servers.find((server) => server.id === activeServerId) || servers[0];

  if (!activeServer) {
    return null;
  }

  return (
    <div className="episode-selector">
      <div className="episode-selector__servers">
        {servers.map((server) => (
          <button
            className={server.id === activeServerId ? "is-active" : ""}
            key={server.id}
            onClick={() => onServerChange(server.id)}
            type="button"
          >
            {server.server_name}
          </button>
        ))}
      </div>
      <div className="episode-selector__episodes">
        {activeServer.items.map((item) => (
          <button
            className={item.slug === activeEpisodeSlug ? "is-active" : ""}
            key={`${activeServer.id}-${item.slug}`}
            onClick={() => onEpisodeChange(item.slug)}
            type="button"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
