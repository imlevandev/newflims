import type { Types } from "mongoose";

import { env } from "@/server/config/env";

import type {
  OPhimEpisodeServerDto,
  OPhimMovieDetailResponseDto,
  OPhimTaxonomyDto,
} from "./dto/crawl.dto";
import type {
  CategoryDto,
  MovieDetailDto,
  MovieEpisodeServerDto,
  RegionDto,
  RemoteMovieDto,
} from "./dto/movie.dto";

function toAbsoluteOPhimAssetUrl(url?: string | null) {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${env.OPHIM_IMAGE_BASE_URL}/${url.replace(/^\/+/, "")}`;
}

function toIsoDate(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString();
}

function normalizeEpisodeCurrent(movie: {
  episode_current?: string;
  episodeCurrent?: string;
}) {
  return movie.episode_current || movie.episodeCurrent || "";
}

function buildLatestEpisodes(movie: {
  _id?: Types.ObjectId | string;
  episode_current?: string;
}) {
  const latestName = movie.episode_current?.match(/\d+/)?.[0] ?? movie.episode_current ?? "";

  if (!latestName) {
    return [];
  }

  return [
    {
      id: `${movie._id ?? "movie"}-latest`,
      name: latestName,
      server: "default",
      season_number: 1,
      movieId: String(movie._id ?? ""),
      createdAt: new Date().toISOString(),
    },
  ];
}

export function mapMovieDocumentToDto(movie: {
  _id: Types.ObjectId | string;
  actor?: string[];
  category?: Array<{ id?: string; name?: string; slug?: string }>;
  content?: string;
  country?: Array<{ id?: string; name?: string; slug?: string }>;
  director?: string[];
  episode_current?: string;
  episode_total?: string;
  episode_time?: string;
  image_name?: string;
  imdb?: { vote_average?: number };
  is_recommended?: boolean;
  lang?: string;
  modified?: Date | string;
  name: string;
  notify?: string;
  origin_name?: string;
  partNumber?: number;
  poster_url?: string;
  quality?: string;
  showtime?: string;
  slug: string;
  status?: string;
  thumb_url?: string;
  trailer_url?: string;
  type?: string;
  view_day?: number;
  view_month?: number;
  view_total?: number;
  view_week?: number;
  year?: number | null;
}): RemoteMovieDto {
  return {
    id: String(movie._id),
    name: movie.name,
    origin_name: movie.origin_name || "",
    slug: movie.slug,
    description: movie.content || "",
    actor: movie.actor ?? [],
    director: movie.director ?? [],
    thumbnail: movie.thumb_url || movie.poster_url || "",
    poster: movie.poster_url || movie.thumb_url || "",
    banner: movie.poster_url || movie.thumb_url || "",
    banner_background: movie.poster_url || movie.thumb_url || "",
    type: movie.type || "series",
    status: movie.status || "ongoing",
    trailer_url: movie.trailer_url || "",
    episode_time: movie.episode_time || "",
    episode_total: movie.episode_total || "",
    episode_current: normalizeEpisodeCurrent(movie),
    showtime: movie.showtime || "",
    quality: movie.quality || "HD",
    publish_year: movie.year || 0,
    imdb_rating: String(movie.imdb?.vote_average || 0),
    rating: movie.lang || "",
    image_name: movie.image_name || null,
    is_recommended: Boolean(movie.is_recommended),
    latestEpisodes: buildLatestEpisodes(movie),
    categories: (movie.category || []).map((item) => ({
      id: item.id || item.slug || item.name || "",
      name: item.name || "",
      slug: item.slug || "",
    })),
    regions: (movie.country || []).map((item) => ({
      id: item.id || item.slug || item.name || "",
      name: item.name || "",
      slug: item.slug || "",
    })),
    view_total: movie.view_total || 0,
    view_day: movie.view_day || 0,
    view_week: movie.view_week || 0,
    view_month: movie.view_month || 0,
    updatedAt: toIsoDate(movie.modified),
  };
}

export function mapEpisodeDocumentsToDto(
  episodes: Array<{
    _id: Types.ObjectId | string;
    items?: Array<{
      embed?: string;
      m3u8?: string;
      name: string;
      slug?: string;
    }>;
    server_name: string;
    server_slug?: string;
  }>,
): MovieEpisodeServerDto[] {
  return episodes.map((episode) => ({
    id: String(episode._id),
    server_name: episode.server_name,
    server_slug: episode.server_slug || "",
    items: (episode.items || []).map((item) => ({
      name: item.name,
      slug: item.slug || item.name,
      embed: item.embed || "",
      m3u8: item.m3u8 || "",
    })),
  }));
}

export function mapMovieDetailDto(
  movie: Parameters<typeof mapMovieDocumentToDto>[0],
  episodes: Parameters<typeof mapEpisodeDocumentsToDto>[0],
): MovieDetailDto {
  return {
    movie: mapMovieDocumentToDto(movie),
    episodes: mapEpisodeDocumentsToDto(episodes),
  };
}

export function mapCategoryDocumentToDto(category: {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
}): CategoryDto {
  return {
    id: String(category._id),
    name: category.name,
    slug: category.slug,
  };
}

export function mapRegionDocumentToDto(region: {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
}): RegionDto {
  return {
    id: String(region._id),
    name: region.name,
    slug: region.slug,
  };
}

export function mapTaxonomySourceToUpsert(taxonomy: OPhimTaxonomyDto) {
  return {
    name: taxonomy.name,
    slug: taxonomy.slug,
  };
}

export function mapOPhimMovieToMovieWrite(
  payload: OPhimMovieDetailResponseDto,
) {
  const movie = payload.movie;

  return {
    actor: movie.actor ?? [],
    category: (movie.category ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
    })),
    content: movie.content ?? "",
    country: (movie.country ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
    })),
    created: movie.created?.time ? new Date(movie.created.time) : new Date(),
    director: movie.director?.filter(Boolean) ?? [],
    episode_current: movie.episode_current ?? "",
    episode_time: movie.time ?? "",
    episode_total: movie.episode_total ?? "",
    imdb: {
      id: movie.imdb?.id ?? "",
      vote_average: movie.imdb?.vote_average ?? 0,
      vote_count: movie.imdb?.vote_count ?? 0,
    },
    lang: movie.lang ?? "",
    modified: movie.modified?.time ? new Date(movie.modified.time) : new Date(),
    name: movie.name,
    notify: movie.notify ?? "",
    origin_name: movie.origin_name ?? "",
    poster_url: toAbsoluteOPhimAssetUrl(movie.poster_url),
    quality: movie.quality ?? "HD",
    showtime: movie.showtimes ?? "",
    slug: movie.slug,
    status: movie.status === "trailer" ? "trailer" : movie.status === "completed" ? "completed" : "ongoing",
    thumb_url: toAbsoluteOPhimAssetUrl(movie.thumb_url),
    tmdb: {
      id: movie.tmdb?.id ?? "",
      season: movie.tmdb?.season ?? 1,
      type: movie.tmdb?.type ?? "",
      vote_average: movie.tmdb?.vote_average ?? 0,
      vote_count: movie.tmdb?.vote_count ?? 0,
    },
    trailer_url: movie.trailer_url ?? "",
    type: movie.type === "movie" || movie.type === "trailer" ? movie.type : "series",
    view_total: movie.view ?? 0,
    year: movie.year ?? null,
  };
}

function slugifyValue(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeEpisodeName(input?: string | null, fallback?: string | null) {
  const normalizedInput = input?.trim();

  if (normalizedInput) {
    return normalizedInput;
  }

  const normalizedFallback = fallback?.trim();

  if (normalizedFallback) {
    return normalizedFallback;
  }

  return "Episode";
}

export function mapOPhimEpisodesToEpisodeWrites(
  movieId: Types.ObjectId | string,
  episodes: OPhimEpisodeServerDto[],
) {
  return episodes.map((server) => ({
    created: new Date(),
    items: server.server_data.map((item) => {
      const name = normalizeEpisodeName(item.name, item.slug || item.filename);

      return {
        air_date: null,
        created: new Date(),
        duration: 0,
        embed: "",
        filename: item.filename ?? "",
        m3u8: item.link_m3u8 ?? "",
        name,
        size: 0,
        slug: item.slug || slugifyValue(name),
        source_error: "",
        source_status: "active" as const,
        thumbnail: "",
      };
    }),
    movie_id: movieId,
    server_name: server.server_name,
    server_slug: slugifyValue(server.server_name),
  }));
}
