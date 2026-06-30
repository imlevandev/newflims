'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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
    movie.episode_total ? `Phần ${movie.episode_total}` : null,
    getMovieEpisodeLabel(movie),
  ].filter(Boolean) as string[];
}

const FALLBACK_BACKDROP = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22991%22 height=%22460%22 viewBox=%220 0 991 460%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 stop-color=%22%2314161e%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%2311161d%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23g)%22 width=%22991%22 height=%22460%22/%3E%3C/svg%3E';

export function HomepageAnimeSlider({ collections }: HomepageAnimeSliderProps) {
  const movies = useMemo(() =>
    collections
      .flatMap((c) => c.movies)
      .filter((m, i, arr) => arr.findIndex((x) => x.slug === m.slug) === i)
      .slice(0, 12),
    [collections]
  );

  const moviesLen = movies.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-rotate
  useEffect(() => {
    if (moviesLen <= 1) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % moviesLen);
    }, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [moviesLen]);

  if (moviesLen === 0) return null;

  const activeMovie = movies[activeIndex];
  const backdrop = getMovieBackdrop(activeMovie) || FALLBACK_BACKDROP;
  const tags = getMovieTags(activeMovie);
  const topics = (activeMovie.categories ?? []).slice(0, 4);

  // Preload next image
  const nextIndex = (activeIndex + 1) % moviesLen;
  const nextBackdrop = getMovieBackdrop(movies[nextIndex]) || FALLBACK_BACKDROP;

  return (
    <div>
      <div className="effect-fade-in">
        <div>
          <div className="cards-row big-slide wide">
            <div className="row-header">
              <h2 className="category-name">Kho Tàng Anime Mới Nhất</h2>
              <div className="cat-more">
                <a className="line-center" href="/c/kho-tang-anime-moi-nhat">
                  <span>Xem thêm</span>
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em">
                    <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="row-content">
              <div className="slide-wrapper big-slide-wrapper">
                {/* Main slide - only render ONE at a time, faster */}
                <div className="swiper swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress top-slide-main">
                  <div className="swiper-wrapper" style={{ position: 'relative', minHeight: '460px' }}>
                    <div className="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-active"
                      key={activeMovie.id}
                      style={{ width: '100%', position: 'absolute', inset: 0, zIndex: 1 }}
                    >
                      <div className="slide-elements">
                        <a className="slide-url" href={getMovieLink(activeMovie)} />
                        <div className="cover-fade">
                          <div className="cover-image">
                            <img
                              alt={activeMovie.name}
                              loading="eager"
                              width="991" height="460"
                              decoding="async"
                              src={backdrop}
                              onError={(e) => {
                                const img = e.currentTarget;
                                if (img.src !== FALLBACK_BACKDROP) img.src = FALLBACK_BACKDROP;
                              }}
                              style={{ color: 'transparent', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        </div>
                        <div className="safe-area">
                          <div className="slide-content">
                            <div className="media-item">
                              <h3 className="media-title lim-1">
                                <a title={activeMovie.name} href={getMovieLink(activeMovie)}>{activeMovie.name}</a>
                              </h3>
                              <h3 className="media-alias-title">
                                <a title={activeMovie.origin_name || activeMovie.name} href={getMovieLink(activeMovie)}>
                                  {activeMovie.origin_name || activeMovie.name}
                                </a>
                              </h3>
                              <div className="hl-tags">
                                {activeMovie.imdb_rating && activeMovie.imdb_rating !== '0' ? (
                                  <div className="tag-imdb"><span>{activeMovie.imdb_rating}</span></div>
                                ) : null}
                                {tags.map((tag, ti) => (
                                  <div className={ti === 0 ? 'tag-model' : 'tag-classic'} key={`${activeMovie.id}-tag-${ti}`}>
                                    <span className={ti === 0 ? 'last' : ''}>{tag}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="hl-tags mb-4">
                                {topics.map((topic) => (
                                  <a className="tag-topic" href={`/the-loai/${topic.slug}`} key={topic.id}>{topic.name}</a>
                                ))}
                              </div>
                              <div className="description lim-3">
                                {stripMovieDescription(activeMovie.description || '')}
                              </div>
                              <div className="touch">
                                <a className="button-play" href={getWatchLink(activeMovie)}>
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
                                  <a className="item" href={getMovieLink(activeMovie)}>
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
                  </div>
                </div>

                {/* Preload next image (hidden) */}
                <img src={nextBackdrop} alt="" style={{ display: 'none' }} />

                {/* Thumbnails */}
                <div className="swiper swiper-initialized swiper-horizontal swiper-watch-progress top-slide-small swiper-thumbs">
                  <div className="swiper-wrapper" style={{ transform: 'translate3d(0px, 0px, 0px)' }}>
                    {movies.map((movie, index) => {
                      const poster = getMoviePoster(movie) || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2259%22 height=%2289%22%3E%3Crect fill=%22%231a1c24%22 width=%2259%22 height=%2289%22/%3E%3C/svg%3E';
                      return (
                        <div
                          className={[
                            'swiper-slide',
                            index <= 12 ? 'swiper-slide-visible swiper-slide-fully-visible' : '',
                            index === activeIndex ? 'swiper-slide-active swiper-slide-thumb-active' : '',
                          ].filter(Boolean).join(' ')}
                          key={`thumb-${movie.id}`}
                          onClick={() => {
                            clearInterval(intervalRef.current!);
                            setActiveIndex(index);
                            intervalRef.current = setInterval(() => {
                              setActiveIndex((prev) => (prev + 1) % moviesLen);
                            }, 10000);
                          }}
                          style={{ width: '200px', cursor: 'pointer' }}
                        >
                          <div className="v-thumbnail">
                            {movie.quality?.toUpperCase() === '4K' ? (
                              <span className="thumb-4k-badge" aria-label="Chất lượng 4K">4K</span>
                            ) : null}
                            <img
                              alt={movie.name}
                              loading={index < 6 ? 'eager' : 'lazy'}
                              width="59" height="89"
                              decoding="async"
                              src={poster}
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
