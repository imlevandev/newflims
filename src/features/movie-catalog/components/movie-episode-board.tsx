import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import Link from "next/link";

import type { MovieDetailDto } from "@/server/modules/movies/dto/movie.dto";

import { getPlayableEpisodeCount, isEpisodePlayable } from "../lib/movie-catalog-format";

interface MovieEpisodeBoardProps {
  currentEpisodeSlug?: string;
  currentServerSlug?: string;
  movieDetail: MovieDetailDto;
  watchMode?: boolean;
}

const tabs = ["Tập phim", "Bộ sưu tập", "Diễn viên", "Đề xuất"];

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
          <NotificationsActiveRoundedIcon sx={{ fontSize: 20 }} />
        </span>
        <p>
          {watchMode
            ? "Bạn vẫn có thể đổi server hoặc chuyển sang các tập đã có nguồn phát ở bên dưới."
            : `Hiện có ${playableEpisodes} tập xem được trong dữ liệu hiện tại. Bạn vẫn có thể mở ngay các tập đã phát.`}
        </p>
      </div>

      {activeServer ? (
        <div className="movie-episode-board__server-row">
          <div className="movie-episode-board__server-title">
            <StorageRoundedIcon sx={{ fontSize: 20 }} />
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
                <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
                <span>{item.name || `Tập ${index + 1}`}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="movie-player-empty">
          <h3>Chưa có tập phim khả dụng</h3>
          <p>Dữ liệu crawl hiện tại chưa có server hoặc danh sách tập cho phim này.</p>
        </div>
      )}
    </section>
  );
}

