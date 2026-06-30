import Link from "next/link";

import type { MovieDetailDto } from "@/server/modules/movies/dto/movie.dto";

import { getPlayableEpisodeCount, isEpisodePlayable } from "../lib/movie-catalog-format";

interface MovieEpisodeBoardProps {
  currentEpisodeSlug?: string;
  currentServerSlug?: string;
  movieDetail: MovieDetailDto;
  watchMode?: boolean;
}

const tabs = ["Tap phim", "Bo suu tap", "Dien vien", "De xuat"];

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}

function StorageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
    </svg>
  );
}

export function MovieEpisodeBoard({
  currentEpisodeSlug,
  currentServerSlug,
  movieDetail,
  watchMode = false,
}: MovieEpisodeBoardProps) {
  const firstServer = movieDetail.episodes[0];
  const activeServer =
    movieDetail.episodes.find((server) => server.server_slug === currentServerSlug) ||
    firstServer;

  const playableEpisodes = getPlayableEpisodeCount(movieDetail.episodes);

  return (
    <section className="movie-episode-board">
      {watchMode ? null : (
        <div className="movie-episode-board__tabs">
          {tabs.map((tab, index) => (
            <button className={index === 0 ? "is-active" : ""} key={tab} type="button">
              {tab}
            </button>
          ))}
        </div>
      )}

      <div className="movie-episode-board__notice">
        <span className="movie-episode-board__notice-bell">
          <BellIcon />
        </span>
        <p>
          {watchMode
            ? "Ban van co the doi server hoac chuyen sang cac tap da co nguon phat o ben duoi."
            : `Hien co ${playableEpisodes} tap xem duoc trong du lieu hien tai. Ban van co the mo ngay cac tap da phat.`}
        </p>
      </div>

      {activeServer ? (
        <div className="movie-episode-board__server-row">
          <div className="movie-episode-board__server-title">
            <StorageIcon />
            <strong>{activeServer.server_name}</strong>
          </div>

          <div className="movie-episode-board__server-tabs">
            {movieDetail.episodes.map((server) => (
              <Link
                className={server.server_slug === activeServer.server_slug ? "is-active" : ""}
                href={
                  watchMode
                    ? `/xem-phim/${movieDetail.movie.slug}?server=${server.server_slug}`
                    : `/phim/${movieDetail.movie.slug}?server=${server.server_slug}`
                }
                key={server.id}
              >
                {server.server_name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {activeServer ? (
        <div className="movie-episode-board__grid">
          {activeServer.items.map((item, index) => {
            const isPlayable = isEpisodePlayable(item);
            const isEmbedOnly = Boolean(item.embed && !item.m3u8);

            return (
              <Link
                className={[
                  item.slug === currentEpisodeSlug ? "is-active" : "",
                  !isPlayable ? "is-pending" : "",
                  isEmbedOnly && isPlayable ? "is-embed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={`/xem-phim/${movieDetail.movie.slug}?server=${activeServer.server_slug}&episode=${item.slug}`}
                data-episode-slug={watchMode ? item.slug : undefined}
                data-server-slug={watchMode ? activeServer.server_slug : undefined}
                data-watch-episode-link={watchMode ? "true" : undefined}
                key={`${activeServer.id}-${item.slug}`}
              >
                <PlayIcon />
                <span>{item.name || `Tap ${index + 1}`}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="movie-player-empty">
          <h3>Chua co tap phim kha dung</h3>
          <p>Du lieu crawl hien tai chua co server hoac danh sach tap cho phim nay.</p>
        </div>
      )}
    </section>
  );
}
