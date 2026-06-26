import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieCover, getMovieMeta, stripHtml } from "../lib/movie-format";

interface HotMovieHeroProps {
  movies: RemoteMovieDto[];
}

export function HotMovieHero({ movies }: HotMovieHeroProps) {
  const featuredMovie = movies[0];

  if (!featuredMovie) {
    return null;
  }

  const meta = getMovieMeta(featuredMovie);

  return (
    <section className="movies-home-hero">
      <div className="movies-home-hero__backdrop">
        <img alt={featuredMovie.name} src={getMovieCover(featuredMovie)} />
      </div>
      <div className="movies-home-hero__overlay" />
      <div className="movies-home-hero__content">
        <div className="movies-home-badge">Backend movies feed</div>
        <h2>{featuredMovie.name}</h2>
        <div className="movies-home-subtitle">{featuredMovie.origin_name}</div>
        <div className="movie-meta-row movie-meta-row--hero">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p>{stripHtml(featuredMovie.description)}</p>
      </div>
      <div className="movies-home-hero__thumbnails">
        {movies.slice(0, 6).map((movie) => (
          <div className="movies-home-thumb" key={movie.id}>
            <img alt={movie.name} src={movie.thumbnail || movie.poster} />
          </div>
        ))}
      </div>
    </section>
  );
}
