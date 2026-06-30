import Link from "next/link";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieEpisodeLabel, getMovieMetaBadges, getMoviePoster, stripMovieDescription } from "../lib/movie-catalog-format";

interface MovieCardProps {
  movie: RemoteMovieDto;
}

export function MovieCard({ movie }: MovieCardProps) {
  const badges = getMovieMetaBadges(movie);
  const poster = getMoviePoster(movie);
  const desc = stripMovieDescription(movie.description || "").slice(0, 180);

  return (
    <article className="movie-card">
      <Link aria-label={`Xem chi tiết ${movie.name}`} className="movie-card__link" href={`/phim/${movie.slug}`}>
        <div className="movie-card__poster">
          <img
            alt={movie.name}
            className="movie-card__image"
            loading="lazy"
            src={poster}
          />
          <span className="movie-card__badge">{getMovieEpisodeLabel(movie)}</span>
          <span className="movie-card__play-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </span>
        </div>

        <div className="movie-card__body">
          <h3>{movie.name}</h3>
          <p className="movie-card__origin">{movie.origin_name || movie.name}</p>
          <div className="movie-card__meta">
            {badges.slice(0, 3).map((badge) => (
              <span key={`${movie.id}-${badge}`}>{badge}</span>
            ))}
          </div>
        </div>

        {/* Hover preview popup */}
        <div className="movie-card__preview">
          <div className="movie-card__preview-poster">
            <img alt={movie.name} loading="lazy" src={poster} />
            <span className="movie-card__preview-badge">{getMovieEpisodeLabel(movie)}</span>
          </div>
          <div className="movie-card__preview-body">
            <div className="movie-card__preview-meta">
              {badges.map((badge) => (
                <span key={`pv-${movie.id}-${badge}`}>{badge}</span>
              ))}
            </div>
            <div className="movie-card__preview-tags">
              {movie.categories?.slice(0, 3).map((cat) => (
                <span key={`cat-${cat.slug}`}>{cat.name}</span>
              ))}
            </div>
            {desc ? <p className="movie-card__preview-desc">{desc}{desc.length >= 180 ? "..." : ""}</p> : null}
            <div className="movie-card__preview-actions">
              <Link className="movie-card__preview-btn movie-card__preview-btn--watch" href={`/xem-phim/${movie.slug}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Xem phim
              </Link>
              <Link className="movie-card__preview-btn" href={`/phim/${movie.slug}`}>
                Chi tiết
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
