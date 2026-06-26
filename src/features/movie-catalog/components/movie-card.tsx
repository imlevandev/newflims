import Link from "next/link";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieEpisodeLabel, getMovieMetaBadges, getMoviePoster } from "../lib/movie-catalog-format";

interface MovieCardProps {
  movie: RemoteMovieDto;
}

export function MovieCard({ movie }: MovieCardProps) {
  const badges = getMovieMetaBadges(movie);

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <Link aria-label={`Xem chi tiết ${movie.name}`} href={`/phim/${movie.slug}`}>
          <img
            alt={movie.name}
            className="movie-card__image"
            loading="lazy"
            src={getMoviePoster(movie)}
          />
        </Link>
        <span className="movie-card__badge">{getMovieEpisodeLabel(movie)}</span>
        <Link className="movie-card__play" href={`/xem-phim/${movie.slug}`}>
          <span>Xem phim</span>
        </Link>
      </div>
      <div className="movie-card__body">
        <h3>
          <Link href={`/phim/${movie.slug}`}>{movie.name}</Link>
        </h3>
        <p>{movie.origin_name || movie.name}</p>
        <div className="movie-card__meta">
          {badges.slice(0, 3).map((badge) => (
            <span key={`${movie.id}-${badge}`}>{badge}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
