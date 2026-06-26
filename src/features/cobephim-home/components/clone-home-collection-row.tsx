import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import type { CSSProperties } from "react";

import { getMovieCover } from "@/features/movies-home/lib/movie-format";
import type {
  HomepageMovieCollectionDto,
  RemoteMovieDto,
} from "@/server/modules/movies/dto/movie.dto";

interface CloneHomeCollectionRowProps {
  collection: HomepageMovieCollectionDto;
}

function getMovieLink(slug: string) {
  return `/phim/${slug}`;
}

function getEpisodeBadge(movie: RemoteMovieDto) {
  const latestEpisode = movie.latestEpisodes[0]?.name;
  return latestEpisode || movie.episode_current || movie.quality;
}

export function CloneHomeCollectionRow({
  collection,
}: CloneHomeCollectionRowProps) {
  return (
    <div className="cards-row cards-slide wide effect-fade-in">
      <div className="topics-list single mt-0">
        <div>
          <div className="row-topic">
            <div className="intro">
              <div className="heading-md text-gradient mb-0">{collection.name}</div>
              <div className="info">
                <a
                  aria-label={`Xem toàn bộ ${collection.name}`}
                  className="line-center"
                  href={`/c/${collection.slug}`}
                >
                  <span>Xem toàn bộ</span>
                  <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
                </a>
              </div>
            </div>
            <div className="row-content">
              <div className="cards-slide-wrapper relative">
                <div className="swiper swiper-initialized swiper-horizontal">
                  <div className="swiper-wrapper">
                    {collection.movies.slice(0, 8).map((movie, index) => {
                      const slideStyle: CSSProperties = {
                        marginRight: "16px",
                        width: "368px",
                      };

                      return (
                        <div
                          className={[
                            "swiper-slide",
                            index === 0 ? "swiper-slide-active" : "",
                            index === 1 ? "swiper-slide-next" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          key={movie.id}
                          style={slideStyle}
                        >
                          <div className="sw-cover single">
                            <a className="v-thumbnail v-thumbnail-hoz" href={getMovieLink(movie.slug)}>
                              <div className="pin-new m-pin-new">
                                <div className="line-center line-pd">
                                  <span />
                                  <strong>{getEpisodeBadge(movie)}</strong>
                                </div>
                              </div>
                              <div>
                                <img
                                  alt={movie.name}
                                  decoding="async"
                                  height="200"
                                  loading="lazy"
                                  src={getMovieCover(movie)}
                                  width="350"
                                />
                              </div>
                            </a>
                            <div className="h-item">
                              <div className="info">
                                <h4 className="item-title lim-1">
                                  <a href={getMovieLink(movie.slug)} title={movie.name}>
                                    {movie.name}
                                  </a>
                                </h4>
                                <h4 className="alias-title lim-1">
                                  <a href={getMovieLink(movie.slug)} title={movie.origin_name}>
                                    {movie.origin_name || movie.name}
                                  </a>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
