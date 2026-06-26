import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieCover, getMovieMeta } from "../lib/movie-format";

interface MoviePosterCardProps {
  movie: RemoteMovieDto;
}

export function MoviePosterCard({ movie }: MoviePosterCardProps) {
  const meta = getMovieMeta(movie);

  return (
    <article className="movie-poster-card">
      <div className="movie-poster-media">
        <img alt={movie.name} src={getMovieCover(movie)} />
        <span className="movie-pill">{movie.type}</span>
      </div>
      <div className="movie-poster-body">
        <h3>{movie.name}</h3>
        <p>{movie.origin_name}</p>
        <div className="movie-meta-row">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
