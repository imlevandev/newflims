import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

import { CloneHomeCollectionRow } from "./clone-home-collection-row";
import { CloneHomeHero } from "./clone-home-hero";

interface CloneHomeFeedProps {
  feed: HomepageFeedDto;
}

export function CloneHomeFeed({ feed }: CloneHomeFeedProps) {
  return (
    <>
      <CloneHomeHero movies={feed.hotMovies} />
      <div className="wrapper-w-slide" id="wrapper">
        <div className="fluid-gap">
          {feed.collections.map((collection) => (
            <CloneHomeCollectionRow collection={collection} key={collection.id} />
          ))}
        </div>
      </div>
    </>
  );
}
