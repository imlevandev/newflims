import type { CSSProperties } from "react";

import type { HomepageMovieCollectionDto } from "@/server/modules/movies/dto/movie.dto";

import { MoviePosterCard } from "./movie-poster-card";

interface MovieCollectionSectionProps {
  collection: HomepageMovieCollectionDto;
}

export function MovieCollectionSection({
  collection,
}: MovieCollectionSectionProps) {
  return (
    <section className="movies-home-section">
      <div className="movies-home-section__header">
        <div>
          <div
            className="movies-home-badge"
            style={{ "--collection-color": `#${collection.color}` } as CSSProperties}
          >
            Collection
          </div>
          <h3>{collection.name}</h3>
        </div>
      </div>

      <div className="movie-poster-grid">
        {collection.movies.map((movie) => (
          <MoviePosterCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
