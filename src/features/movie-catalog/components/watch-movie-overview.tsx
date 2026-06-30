import Link from "next/link";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import {
  getMovieMetaBadges,
  getMoviePoster,
  stripMovieDescription,
} from "../lib/movie-catalog-format";

interface WatchMovieOverviewProps {
  movie: RemoteMovieDto;
}

function ChevronIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function StarIconSmall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );
}

export function WatchMovieOverview({ movie }: WatchMovieOverviewProps) {
  const badges = getMovieMetaBadges(movie).slice(0, 5);
  const description = stripMovieDescription(movie.description);

  return (
    <section className="watch-overview-card">
      <div className="watch-overview-card__main">
        <img alt={movie.name} className="watch-overview-card__poster" src={getMoviePoster(movie)} />

        <div className="watch-overview-card__content">
          <div className="watch-overview-card__header">
            <div>
              <h2>{movie.name}</h2>
              <p>{movie.origin_name || movie.name}</p>
            </div>
          </div>

          <div className="watch-overview-card__badges">
            {badges.map((badge) => (
              <span key={`${movie.id}-${badge}`}>{badge}</span>
            ))}
          </div>

          <div className="watch-overview-card__topics">
            {movie.categories.slice(0, 4).map((category) => (
              <span key={category.id}>{category.name}</span>
            ))}
          </div>

          <div className="watch-overview-card__progress">
            Da chieu: {movie.episode_current || movie.episode_total || "Dang cap nhat"}
          </div>

          {movie.showtime ? (
            <div className="watch-overview-card__schedule">
              <ScheduleIcon />
              <span>Lich chieu tiep theo: {movie.showtime}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="watch-overview-card__summary">
        <p>{description || "Noi dung phim dang duoc cap nhat."}</p>
        <Link className="watch-overview-card__link" href={`/phim/${movie.slug}`}>
          Thong tin phim
          <ChevronIcon />
        </Link>
      </div>

      <aside className="watch-overview-card__side">
        <div className="watch-overview-card__stat">
          <StarIcon />
          <div>
            <strong>Danh gia</strong>
            <span>{movie.imdb_rating && movie.imdb_rating !== "0" ? movie.imdb_rating : "0.0"}</span>
          </div>
        </div>

        <div className="watch-overview-card__stat">
          <ChatIcon />
          <div>
            <strong>Binh luan</strong>
            <span>0</span>
          </div>
        </div>

        <div className="watch-overview-card__score-badge">
          <StarIconSmall />
          <strong>0 danh gia</strong>
        </div>
      </aside>
    </section>
  );
}
