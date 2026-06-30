'use client';

import { useEffect, useState } from 'react';

import { getMovieCover, stripHtml } from '@/features/movies-home/lib/movie-format';
import type { RemoteMovieDto } from '@/server/modules/movies/dto/movie.dto';

interface CloneHomeHeroProps {
  movies: RemoteMovieDto[];
}

function getMovieLink(slug: string) {
  return `/phim/${slug}`;
}

function getWatchLink(slug: string) {
  return `/xem-phim/${slug}`;
}

function getTitleLogo(movie: RemoteMovieDto) {
  return movie.image_name && movie.image_name.startsWith('http')
    ? movie.image_name
    : null;
}

function getHeroMeta(movie: RemoteMovieDto) {
  return [movie.imdb_rating || '0.0', movie.rating || movie.quality, movie.publish_year]
    .filter(Boolean)
    .map(String);
}

export function CloneHomeHero({ movies }: CloneHomeHeroProps) {
  const heroMovies = movies.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroMovies.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [heroMovies.length]);

  if (heroMovies.length === 0) return null;

  const featuredMovie = heroMovies[activeIndex];
  const featuredPoster = getMovieCover(featuredMovie);
  const featuredLogo = getTitleLogo(featuredMovie);

  return (
    <div id="top_slider">
      <div className="slide-wrapper top-slide-wrap">
        <div className="swiper swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress top-slide-main swiper-backface-hidden">
          <div className="swiper-wrapper">
            <div
              className="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-active"
              style={{ opacity: 1, width: '1440px' }}
            >
              <div className="slide-elements">
                <a
                  aria-label={`Xem phim ${featuredMovie.name}`}
                  className="slide-url"
                  href={getMovieLink(featuredMovie.slug)}
                />
                <div
                  className="background-fade"
                  style={{ backgroundImage: `url("${featuredPoster}")` }}
                />
                <div className="cover-fade">
                  <div className="cover-image">
                    <img
                      alt={featuredMovie.name}
                      className="fade-in visible"
                      decoding="async"
                      fetchPriority="high"
                      height="1080"
                      src={featuredPoster}
                      width="1920"
                    />
                  </div>
                </div>
                <div className="safe-area">
                  <div className="slide-content">
                    <div className="media-item">
                      {featuredLogo ? (
                        <div className="media-title-image">
                          <a href={getMovieLink(featuredMovie.slug)} title={featuredMovie.name}>
                            <img
                              alt={featuredMovie.name}
                              className="media-title-logo-img"
                              decoding="async"
                              height="130"
                              loading="lazy"
                              src={featuredLogo}
                              width="500"
                            />
                          </a>
                        </div>
                      ) : null}
                      <h3 className="media-title" style={{ display: featuredLogo ? 'none' : undefined }}>
                        <a href={getMovieLink(featuredMovie.slug)}>{featuredMovie.name}</a>
                      </h3>
                      <h3 className="media-alias-title">
                        <a href={getMovieLink(featuredMovie.slug)}>
                          {featuredMovie.origin_name || featuredMovie.name}
                        </a>
                      </h3>
                      <div className="hl-tags">
                        {getHeroMeta(featuredMovie).map((meta) => (
                          <div
                            className={meta === (featuredMovie.imdb_rating || '0.0') ? 'tag-imdb' : 'tag-classic'}
                            key={`${featuredMovie.id}-${meta}`}
                          >
                            <span>{meta}</span>
                          </div>
                        ))}
                        <div className="tag-classic">
                          <span>{featuredMovie.episode_time}</span>
                        </div>
                      </div>
                      <div className="hl-tags mb-4">
                        {featuredMovie.categories.slice(0, 4).map((category) => (
                          <a
                            className="tag-topic"
                            href={`/the-loai/${category.slug}`}
                            key={category.id}
                          >
                            {category.name}
                          </a>
                        ))}
                      </div>
                      <div className="description lim-3">
                        <p>{stripHtml(featuredMovie.description)}</p>
                      </div>
                      <div className="touch">
                        <a className="button-play" href={getWatchLink(featuredMovie.slug)}>
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                          </svg>
                        </a>
                        <div className="touch-group">
                          <button
                            aria-label="Them vao danh sach yeu thich"
                            className="item text-white"
                            type="button"
                          >
                            <div className="inc-icon icon-20">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </div>
                          </button>
                          <a className="item" href={getMovieLink(featuredMovie.slug)}>
                            <div className="inc-icon icon-20">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
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

        {/* Thumbnail row */}
        <div className="swiper swiper-initialized swiper-horizontal swiper-watch-progress top-slide-small swiper-backface-hidden">
          <div className="swiper-wrapper" style={{ transform: 'translate3d(0px, 0px, 0px)' }}>
            {heroMovies.map((movie, index) => (
              <div
                className={[
                  'swiper-slide',
                  'swiper-slide-visible',
                  'swiper-slide-fully-visible',
                  index === activeIndex ? 'swiper-slide-active swiper-slide-thumb-active' : '',
                  index === (activeIndex + 1) % heroMovies.length ? 'swiper-slide-next' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={`thumb-${movie.id}`}
                onClick={() => setActiveIndex(index)}
                style={{ marginRight: '5px', width: '70.8333px', cursor: 'pointer' }}
              >
                <img
                  alt={movie.name}
                  decoding="async"
                  height="1080"
                  src={getMovieCover(movie)}
                  width="1920"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
