import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import type { CSSProperties } from "react";

import { getMovieCover, stripHtml } from "@/features/movies-home/lib/movie-format";
import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

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
  return movie.image_name && movie.image_name.startsWith("http")
    ? movie.image_name
    : null;
}

function getHeroMeta(movie: RemoteMovieDto) {
  return [movie.imdb_rating || "0.0", movie.rating || movie.quality, movie.publish_year]
    .filter(Boolean)
    .map(String);
}

export function CloneHomeHero({ movies }: CloneHomeHeroProps) {
  const heroMovies = movies.slice(0, 6);

  return (
    <div id="top_slider">
      <div className="slide-wrapper top-slide-wrap">
        <div className="swiper swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress top-slide-main swiper-backface-hidden">
          <div className="swiper-wrapper">
            {heroMovies.map((movie, index) => {
              const poster = getMovieCover(movie);
              const logo = getTitleLogo(movie);
              const slideStyle: CSSProperties = {
                opacity: index === 0 ? 1 : 0,
                transform: `translate3d(${-1440 * index}px, 0px, 0px)`,
                width: "1440px",
              };

              return (
                <div
                  className={[
                    "swiper-slide",
                    index === 0 ? "swiper-slide-visible swiper-slide-fully-visible swiper-slide-active" : "",
                    index === 1 ? "swiper-slide-next" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={movie.id}
                  style={slideStyle}
                >
                  <div className="slide-elements">
                    <a
                      aria-label={`Xem phim ${movie.name}`}
                      className="slide-url"
                      href={getMovieLink(movie.slug)}
                    />
                    <div
                      className="background-fade"
                      style={{ backgroundImage: `url("${poster}")` }}
                    />
                    <div className="cover-fade">
                      <div className="cover-image">
                        <img
                          alt={movie.name}
                          className="fade-in visible"
                          decoding="async"
                          height="1080"
                          src={poster}
                          width="1920"
                        />
                      </div>
                    </div>
                    <div className="safe-area">
                      <div className="slide-content">
                        <div className="media-item">
                          {logo ? (
                            <div className="media-title-image">
                              <a href={getMovieLink(movie.slug)} title={movie.name}>
                                <img
                                  alt={movie.name}
                                  className="media-title-logo-img"
                                  decoding="async"
                                  height="130"
                                  loading="lazy"
                                  src={logo}
                                  width="500"
                                />
                              </a>
                            </div>
                          ) : null}
                          <h3 className="media-title" style={{ display: logo ? "none" : undefined }}>
                            <a href={getMovieLink(movie.slug)}>{movie.name}</a>
                          </h3>
                          <h3 className="media-alias-title">
                            <a href={getMovieLink(movie.slug)}>
                              {movie.origin_name || movie.name}
                            </a>
                          </h3>
                          <div className="hl-tags">
                            {getHeroMeta(movie).map((meta) => (
                              <div
                                className={meta === (movie.imdb_rating || "0.0") ? "tag-imdb" : "tag-classic"}
                                key={`${movie.id}-${meta}`}
                              >
                                <span>{meta}</span>
                              </div>
                            ))}
                            <div className="tag-classic">
                              <span>{movie.episode_time}</span>
                            </div>
                          </div>
                          <div className="hl-tags mb-4">
                            {movie.categories.slice(0, 4).map((category) => (
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
                            <p>{stripHtml(movie.description)}</p>
                          </div>
                          <div className="touch">
                            <a className="button-play" href={getWatchLink(movie.slug)}>
                              <PlayArrowRoundedIcon sx={{ fontSize: 30 }} />
                            </a>
                            <div className="touch-group">
                              <a className="item" href={getMovieLink(movie.slug)}>
                                <div className="inc-icon icon-20">
                                  <InfoOutlinedIcon sx={{ fontSize: 20 }} />
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
        <div className="swiper swiper-initialized swiper-horizontal swiper-watch-progress top-slide-small swiper-backface-hidden">
          <div className="swiper-wrapper" style={{ transform: "translate3d(0px, 0px, 0px)" }}>
            {heroMovies.map((movie, index) => (
              <div
                className={[
                  "swiper-slide",
                  "swiper-slide-visible",
                  "swiper-slide-fully-visible",
                  index === 0 ? "swiper-slide-active swiper-slide-thumb-active" : "",
                  index === 1 ? "swiper-slide-next" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={`thumb-${movie.id}`}
                style={{ marginRight: "5px", width: "70.8333px" }}
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
