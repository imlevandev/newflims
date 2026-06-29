import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
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
  const featuredMovie = heroMovies[0];

  if (!featuredMovie) {
    return null;
  }

  const featuredPoster = getMovieCover(featuredMovie);
  const featuredLogo = getTitleLogo(featuredMovie);

  return (
    <div id="top_slider">
      <div className="slide-wrapper top-slide-wrap">
        <div className="swiper swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress top-slide-main swiper-backface-hidden">
          <div className="swiper-wrapper">
            <div
              className="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-active"
              style={{ opacity: 1, transform: "translate3d(0px, 0px, 0px)", width: "1440px" } satisfies CSSProperties}
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
                          <h3 className="media-title" style={{ display: featuredLogo ? "none" : undefined }}>
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
                                className={meta === (featuredMovie.imdb_rating || "0.0") ? "tag-imdb" : "tag-classic"}
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
                              <PlayArrowRoundedIcon sx={{ fontSize: 30 }} />
                            </a>
                            <div className="touch-group">
                              <button
                                aria-label="Thêm vào danh sách yêu thích"
                                className="item text-white"
                                type="button"
                              >
                                <div className="inc-icon icon-20">
                                  <FavoriteRoundedIcon sx={{ fontSize: 20 }} />
                                </div>
                              </button>
                              <a className="item" href={getMovieLink(featuredMovie.slug)}>
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
