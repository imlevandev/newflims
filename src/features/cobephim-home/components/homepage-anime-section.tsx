import {
  getMovieBackdrop,
  getMovieEpisodeLabel,
  getMoviePoster,
  stripMovieDescription,
} from "@/features/movie-catalog/lib/movie-catalog-format";
import type {
  HomepageMovieCollectionDto,
  RemoteMovieCategoryDto,
  RemoteMovieDto,
} from "@/server/modules/movies/dto/movie.dto";

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function renderChevronIcon() {
  return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"></path></svg>`;
}

function renderPlayIcon() {
  return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path></svg>`;
}

function renderHeartIcon() {
  return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg>`;
}

function renderInfoIcon() {
  return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>`;
}

function renderTopic(topic: RemoteMovieCategoryDto) {
  return `<a class="tag-topic" href="/the-loai/${escapeHtml(topic.slug)}">${escapeHtml(topic.name)}</a>`;
}

function renderHeroSlide(movie: RemoteMovieDto, index: number) {
  const active = index === 0;
  const className = [
    "swiper-slide",
    active ? "swiper-slide-visible swiper-slide-fully-visible swiper-slide-active" : "",
    index === 1 ? "swiper-slide-next" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const tags = getMovieTags(movie);
  const topics = (movie.categories ?? []).slice(0, 4);

  return `<div class="${className}" style="width: 100%; opacity: ${active ? "1" : "0"}; transform: translate3d(${-100 * index}%, 0px, 0px);">
<div class="slide-elements"><a class="slide-url" href="${escapeHtml(getMovieLink(movie))}"></a>
<div class="cover-fade"><div class="cover-image"><img alt="${escapeHtml(movie.name)}" loading="lazy" width="991" height="460" decoding="async" data-nimg="1" src="${escapeHtml(getMovieBackdrop(movie))}" style="color: transparent;"></div></div>
<div class="safe-area"><div class="slide-content"><div class="media-item">
<h3 class="media-title lim-1"><a title="${escapeHtml(movie.name)}" href="${escapeHtml(getMovieLink(movie))}">${escapeHtml(movie.name)}</a></h3>
<h3 class="media-alias-title"><a title="${escapeHtml(movie.origin_name || movie.name)}" href="${escapeHtml(getMovieLink(movie))}">${escapeHtml(movie.origin_name || movie.name)}</a></h3>
<div class="hl-tags">
${movie.imdb_rating && movie.imdb_rating !== "0" ? `<div class="tag-imdb"><span>${escapeHtml(movie.imdb_rating)}</span></div>` : ""}
${tags.map((tag, tagIndex) => `<div class="${tagIndex === 0 ? "tag-model" : "tag-classic"}"><span${tagIndex === 0 ? ' class="last"' : ""}>${escapeHtml(tag)}</span></div>`).join("")}
</div>
<div class="hl-tags mb-4">${topics.map(renderTopic).join("")}</div>
<div class="description lim-3">${escapeHtml(stripMovieDescription(movie.description || ""))}</div>
<div class="touch"><a class="button-play" href="${escapeHtml(getWatchLink(movie))}">${renderPlayIcon()}</a><div class="touch-group"><a href="#" class="item "><div class="inc-icon icon-20">${renderHeartIcon()}</div></a><a class="item" href="${escapeHtml(getMovieLink(movie))}"><div class="inc-icon icon-20">${renderInfoIcon()}</div></a></div></div>
</div></div></div></div>
</div>`;
}

function renderThumbSlide(movie: RemoteMovieDto, index: number) {
  const className = [
    "swiper-slide",
    index <= 12 ? "swiper-slide-visible" : "",
    index <= 12 ? "swiper-slide-fully-visible" : "",
    index === 0 ? "swiper-slide-active swiper-slide-thumb-active" : "",
    index === 1 ? "swiper-slide-next" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const qualityBadge =
    movie.quality?.toUpperCase() === "4K"
      ? '<span class="thumb-4k-badge" aria-label="Chất lượng 4K">4K</span>'
      : "";

  return `<div class="${className}" data-slide-index="${index}" style="width: 200px;"><div class="v-thumbnail">${qualityBadge}<img alt="${escapeHtml(movie.name)}" loading="lazy" width="59" height="89" decoding="async" data-nimg="1" src="${escapeHtml(getMoviePoster(movie))}" style="color: transparent;"></div></div>`;
}

export function buildHomepageAnimeSectionHtml(collections: HomepageMovieCollectionDto[]) {
  const movies = collections
    .flatMap((collection) => collection.movies)
    .filter(
      (movie, index, items) =>
        items.findIndex((item) => String(item.id) === String(movie.id) || item.slug === movie.slug) === index,
    )
    .slice(0, 12);

  if (movies.length === 0) {
    return "";
  }

  return `<div>
<div class="effect-fade-in">
<div>
<div class="cards-row big-slide wide">
<div class="row-header"><h2 class="category-name">Kho Tàng Anime Mới Nhất</h2><div class="cat-more"><a class="line-center" href="/c/kho-tang-anime-moi-nhat"><span>Xem thêm</span>${renderChevronIcon()}</a></div></div>
<div class="row-content"><div class="slide-wrapper big-slide-wrapper">
<div class="swiper swiper-fade swiper-initialized swiper-horizontal swiper-watch-progress top-slide-main"><div class="swiper-wrapper">${movies.map(renderHeroSlide).join("")}</div></div>
<div class="swiper swiper-initialized swiper-horizontal swiper-watch-progress top-slide-small swiper-thumbs"><div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);">${movies.map(renderThumbSlide).join("")}</div></div>
</div></div>
</div>
</div>
</div>
<div class="effect-fade-in" style="margin-top: 20px; margin-bottom: 20px;"></div>
</div>`;
}
