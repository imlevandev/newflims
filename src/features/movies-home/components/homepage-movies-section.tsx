import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

import { HotMovieHero } from "./hot-movie-hero";
import { MovieCollectionSection } from "./movie-collection-section";

interface HomepageMoviesSectionProps {
  feed: HomepageFeedDto;
}

export function HomepageMoviesSection({ feed }: HomepageMoviesSectionProps) {
  return (
    <section className="movies-home-shell">
      <div className="movies-home-shell__inner">
        <HotMovieHero movies={feed.hotMovies} />
        {feed.collections.map((collection) => (
          <MovieCollectionSection collection={collection} key={collection.id} />
        ))}
      </div>
    </section>
  );
}
