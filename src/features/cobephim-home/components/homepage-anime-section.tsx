'use client';

import { useEffect, useState } from 'react';

import {
  getMovieBackdrop,
  getMovieEpisodeLabel,
  getMoviePoster,
  stripMovieDescription,
} from '@/features/movie-catalog/lib/movie-catalog-format';
import type {
  HomepageMovieCollectionDto,
  RemoteMovieDto,
} from '@/server/modules/movies/dto/movie.dto';

interface HomepageAnimeSliderProps {
  collections: HomepageMovieCollectionDto[];
}

function getMovieLink(movie: RemoteMovieDto) {
  return `/phim/${movie.slug}`;
}

function getWatchLink(movie: RemoteMovieDto) {
  return `/xem-phim/${movie.slug}`;
}

function getMovieTags(movie: RemoteMovieDto) {
  return [
    movie.quality,
    movie.publish_year ? String(movie.publish_year) : null,
    movie.episode_total ? `Phan ${movie.episode_total}` : null,
    getMovieEpisodeLabel(movie),
  ].filter(Boolean) as string[];
}

export function HomepageAnimeSlider({ collections }: HomepageAnimeSliderProps) {
  const movies = collections
    .flatMap((c) => c.movies)
    .filter((m, i, arr) => arr.findIndex((x) => x.slug === m.slug) === i)
    .slice(0, 12);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % movies.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (movies.length === 0) return null;

  return (
    <div>
      <div className="effect-fade-in">
        <div>
          <div className="cards-row big-slide wide">
            <div className="row-header">
              <h2 className="category-name">Kho Tang Anime Moi Nhat</h2>
              <div className="cat-more">
                <a className="line-center" href="/c/kho-tang-anime-moi-nhat">
                  <span>Xem them</span>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em">
                    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="row-content">
              <div className="slide-wrapper big-slide-wrapper">
                <div className="swiper swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress top-slide-main">
                  <div className="swiper-wrapper">
                    {movies.map((movie, index) => {
                      const isActive = index === activeIndex;
                      const tags = getMovieTags(movie);
                      const topics = (movie.categories ?? []).slice(0, 4);
                      const imgLoading = isActive ? 'eager' : 'lazy';

                      return (
                        <div
                          className={[
                            'swiper-slide',
                            isActive ? 'swiper-slide-visible swiper-slide-fully-visible swiper-slide-active' : '',
                            index === (activeIndex + 1) % movies.length ? 'swiper-slide-next' : '',
                          ].filter(Boolean).join(' ')}
                          key={movie.id}
                          style={{ width: '100%', opacity: isActive ? 1 : 0 }}
                        >
                          <div className="slide-elements">
                            <a className="slide-url" href={getMovieLink(movie)} />
                            <div className="cover-fade">
                              <div className="cover-image">
                                <img
                                  alt={movie.name}
                                  loading={imgLoading}
                                  width="991"
                                  height="460"
                                  decoding="async"
                                  src={getMovieBackdrop(movie)}
                                  style={{ color: 'transparent' }}
                                />
                              </div>
                            </div>
                            <div className="safe-area">
                              <div className="slide-content">
                                <div className="media-item">
                                  <h3 className="media-title lim-1">
                                    <a title={movie.name} href={getMovieLink(movie)}>
                                      {movie.name}
                                    </a>
                                  </h3>
                                  <h3 className="media-alias-title">
                                    <a title={movie.origin_name || movie.name} href={getMovieLink(movie)}>
                                      {movie.origin_name || movie.name}
                                    </a>
                                  </h3>
                                  <div className="hl-tags">
                                    {movie.imdb_rating && movie.imdb_rating !== '0' ? (
                                      <div className="tag-imdb"><span>{movie.imdb_rating}</span></div>
                                    ) : null}
                                    {tags.map((tag, ti) => (
                                      <div className={ti === 0 ? 'tag-model' : 'tag-classic'} key={`${movie.id}-tag-${ti}`}>
                                        <span className={ti === 0 ? 'last' : ''}>{tag}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="hl-tags mb-4">
                                    {topics.map((topic) => (
                                      <a className="tag-topic" href={`/the-loai/${topic.slug}`} key={topic.id}>
                                        {topic.name}
                                      </a>
                                    ))}
                                  </div>
                                  <div className="description lim-3">
                                    {stripMovieDescription(movie.description || '')}
                                  </div>
                                  <div className="touch">
                                    <a className="button-play" href={getWatchLink(movie)}>
                                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 384 512" height="1em" width="1em">
                                        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                      </svg>
                                    </a>
                                    <div className="touch-group">
                                      <a href="#" className="item">
                                        <div className="inc-icon icon-20">
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em">
                                            <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                                          </svg>
                                        </div>
                                      </a>
                                      <a className="item" href={getMovieLink(movie)}>
                                        <div className="inc-icon icon-20">
                                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em">
                                            <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
                                          </svg>
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="swiper swiper-initialized swiper-horizontal swiper-watch-progress top-slide-small swiper-thumbs">
                  <div className="swiper-wrapper" style={{ transform: 'translate3d(0px, 0px, 0px)' }}>
                    {movies.map((movie, index) => {
                      const imgLoading = index < 6 ? 'eager' : 'lazy';
                      return (
                        <div
                          className={[
                            'swiper-slide',
                            index <= 12 ? 'swiper-slide-visible swiper-slide-fully-visible' : '',
                            index === activeIndex ? 'swiper-slide-active swiper-slide-thumb-active' : '',
                            index === (activeIndex + 1) % movies.length ? 'swiper-slide-next' : '',
                          ].filter(Boolean).join(' ')}
                          key={`thumb-${movie.id}`}
                          onClick={() => setActiveIndex(index)}
                          style={{ width: '200px', cursor: 'pointer' }}
                        >
                          <div className="v-thumbnail">
                            {movie.quality?.toUpperCase() === '4K' ? (
                              <span className="thumb-4k-badge" aria-label="Chat luong 4K">4K</span>
                            ) : null}
                            <img
                              alt={movie.name}
                              loading={imgLoading}
                              width="59"
                              height="89"
                              decoding="async"
                              src={getMoviePoster(movie)}
                              style={{ color: 'transparent' }}
                            />
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
      <div className="effect-fade-in" style={{ marginTop: '20px', marginBottom: '20px' }} />
    </div>
  );
}
