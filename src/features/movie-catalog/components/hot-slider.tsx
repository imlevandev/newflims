"use client";

import Link from "next/link";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { getMovieBackdrop, getMovieMetaBadges, stripMovieDescription } from "../lib/movie-catalog-format";

interface HotSliderProps {
  movies: RemoteMovieDto[];
}

export function HotSlider({ movies }: HotSliderProps) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-hot-slider">
      <Swiper
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        loop={movies.length > 1}
        modules={[Autoplay]}
        slidesPerView={1}
        spaceBetween={24}
      >
        {movies.slice(0, 6).map((movie) => (
          <SwiperSlide key={movie.id}>
            <article
              className="movie-hot-slide"
              style={{
                backgroundImage: `linear-gradient(110deg, rgba(7, 10, 20, 0.88), rgba(7, 10, 20, 0.42)), url("${getMovieBackdrop(movie)}")`,
              }}
            >
              <div className="movie-hot-slide__content">
                <span className="movie-section-chip">Phim hot</span>
                <h2>{movie.name}</h2>
                <p>{movie.origin_name || movie.name}</p>
                <div className="movie-hot-slide__meta">
                  {getMovieMetaBadges(movie).map((badge) => (
                    <span key={`${movie.id}-${badge}`}>{badge}</span>
                  ))}
                </div>
                <p className="movie-hot-slide__description">
                  {stripMovieDescription(movie.description).slice(0, 180)}
                </p>
                <div className="movie-hot-slide__actions">
                  <Link href={`/xem-phim/${movie.slug}`}>Xem ngay</Link>
                  <Link className="is-secondary" href={`/phim/${movie.slug}`}>
                    Chi tiết
                  </Link>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
