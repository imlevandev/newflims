import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Link from "next/link";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieMetaBadges, getMoviePoster } from "../lib/movie-catalog-format";

interface WatchMovieSidePanelProps {
  movie: RemoteMovieDto;
  recommendations: RemoteMovieDto[];
}

function getActorTone(name: string) {
  const palette = [
    "linear-gradient(135deg, #5d6df7, #7a8dff)",
    "linear-gradient(135deg, #f2b452, #ffde87)",
    "linear-gradient(135deg, #4bb98a, #7ce6b6)",
    "linear-gradient(135deg, #e16d8c, #f6a7bd)",
    "linear-gradient(135deg, #6b7388, #9ea6bb)",
  ];

  const index = name.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % palette.length;
  return palette[index];
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function WatchMovieSidePanel({
  movie,
  recommendations,
}: WatchMovieSidePanelProps) {
  const actors = (movie.actor ?? []).filter(Boolean).slice(0, 6);

  return (
    <aside className="watch-side-panel">
      <section className="watch-side-panel__section">
        <h3>Diễn viên</h3>

        {actors.length > 0 ? (
          <div className="watch-cast-grid">
            {actors.map((actor) => (
              <div className="watch-cast-card" key={actor}>
                <div
                  className="watch-cast-card__avatar"
                  style={{ background: getActorTone(actor) }}
                >
                  {getInitials(actor)}
                </div>
                <span>{actor}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="watch-side-panel__empty">Chưa có dữ liệu diễn viên cho phim này.</p>
        )}
      </section>

      <section className="watch-side-panel__section">
        <h3>Đề xuất cho bạn</h3>

        <div className="watch-recommendations">
          {recommendations.map((item) => (
            <Link className="watch-recommend-card" href={`/phim/${item.slug}`} key={item.id}>
              <img alt={item.name} className="watch-recommend-card__poster" src={getMoviePoster(item)} />

              <div className="watch-recommend-card__content">
                <strong>{item.name}</strong>
                <span>{item.origin_name || item.name}</span>
                <small>{getMovieMetaBadges(item).slice(0, 3).join(" • ")}</small>
              </div>

              <span className="watch-recommend-card__arrow">
                <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
