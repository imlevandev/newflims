import type { ReactNode } from "react";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieBackdrop } from "../lib/movie-catalog-format";

interface MovieDetailHeroProps {
  children?: ReactNode;
  movie: RemoteMovieDto;
}

export function MovieDetailHero({ children, movie }: MovieDetailHeroProps) {
  return (
    <section
      className="movie-detail-hero-banner"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(10, 14, 24, 0.52), rgba(10, 14, 24, 0.92)), url("${getMovieBackdrop(movie)}")`,
      }}
    >
      <div className="movie-detail-hero-banner__grain" />
      <div className="movie-detail-hero-banner__content">{children}</div>
    </section>
  );
}
