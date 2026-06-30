import type { CSSProperties } from 'react';

import { getMovieCover } from '@/features/movies-home/lib/movie-format';
import type {
  HomepageMovieCollectionDto,
  RemoteMovieDto,
} from '@/server/modules/movies/dto/movie.dto';

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
  const displayMovies = collection.movies.slice(0, 12);

  if (displayMovies.length === 0) return null;

  return (
    <div className="cards-row cards-slide wide effect-fade-in">
      <div className="topics-list single mt-0">
        <div>
          <div className="row-topic">
            <div className="intro">
              <div className="heading-md text-gradient mb-0">{collection.name}</div>
              <div className="info">
                <a
                  aria-label={`Xem toan bo ${collection.name}`}
                  className="line-center"
                  href={`/c/${collection.slug}`}
                >
                  <span>Xem toan bo</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="row-content">
              <div className="cards-slide-wrapper relative">
                <div className="swiper swiper-initialized swiper-horizontal">
                  <div className="swiper-wrapper">
                    {displayMovies.map((movie, index) => {
                      const slideStyle: CSSProperties = {
                        marginRight: '16px',
                        width: '368px',
                      };

                      return (
                        <div
                          className={[
                            'swiper-slide',
                            'swiper-slide-visible',
                            'swiper-slide-fully-visible',
                            index === 0 ? 'swiper-slide-active' : '',
                            index === 1 ? 'swiper-slide-next' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
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
