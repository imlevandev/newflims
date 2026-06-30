import { AppError } from "@/server/common/errors/app-error";
import { env } from "@/server/config/env";

import type {
  HomepageBannerDto,
  HomepageCommentsDto,
  HomepageMenuItemDto,
  HomepageMovieCollectionDto,
  HomepageTopicsDto,
  RemoteMovieDto,
  RemoteMovieShowtimeDto,
} from "./dto/movie.dto";

interface ApiEnvelope<T> {
  status: boolean;
  msg: string;
  result: T;
}

interface HomepageListsResponse {
  collections: HomepageMovieCollectionDto[];
  totalPages: number;
}

interface RemoteFetchOptions {
  cache?: RequestCache;
  revalidate?: number | false;
}

export class MoviesRepository {
  private async fetchJson<T>(
    path: string,
    options: RemoteFetchOptions = {},
  ) {
    const { cache = "force-cache", revalidate = 300 } = options;
    const response = await fetch(`${env.MOVIE_API_BASE_URL}${path}`, {
      cache,
      headers: {
        Accept: "application/json",
      },
      next: revalidate === false ? undefined : { revalidate },
    });

    if (!response.ok) {
      throw new AppError(
        "Movie API is unavailable",
        response.status,
        "MOVIE_API_UNAVAILABLE",
      );
    }

    return (await response.json()) as ApiEnvelope<T>;
  }

  private async fetchPlainJson<T>(
    path: string,
    options: RemoteFetchOptions = {},
  ) {
    const { cache = "force-cache", revalidate = 300 } = options;
    const response = await fetch(`${env.MOVIE_API_BASE_URL}${path}`, {
      cache,
      headers: {
        Accept: "application/json",
      },
      next: revalidate === false ? undefined : { revalidate },
    });

    if (!response.ok) {
      throw new AppError(
        "Movie API is unavailable",
        response.status,
        "MOVIE_API_UNAVAILABLE",
      );
    }

    return (await response.json()) as T;
  }

  async getHotMovies(options?: RemoteFetchOptions) {
    const payload = await this.fetchJson<RemoteMovieDto[]>("/movies/hot", options);
    return payload.result;
  }

  async getHomepageCollections(
    page = 1,
    limit = 3,
    options?: RemoteFetchOptions,
  ) {
    const payload = await this.getHomepageCollectionsPage(page, limit, options);

    return payload.collections;
  }

  async getHomepageCollectionsPage(
    page = 1,
    limit = 3,
    options?: RemoteFetchOptions,
  ) {
    const searchParams = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    const payload = await this.fetchJson<HomepageListsResponse>(
      `/lists/homepageLists?${searchParams.toString()}`,
      options,
    );

    return payload.result;
  }

  async getAllHomepageCollections(limit = 3, options?: RemoteFetchOptions) {
    const firstPage = await this.getHomepageCollectionsPage(1, limit, options);
    const totalPages = Math.max(1, firstPage.totalPages || 1);

    if (totalPages === 1) {
      return firstPage.collections;
    }

    const restPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        this.getHomepageCollectionsPage(index + 2, limit, options),
      ),
    );

    return [
      ...firstPage.collections,
      ...restPages.flatMap((page) => page.collections),
    ];
  }

  async findHomepageMovieBySlug(slug: string, options?: RemoteFetchOptions) {
    const collections = await this.getAllHomepageCollections(3, options);

    return (
      collections
        .flatMap((collection) => collection.movies)
        .find((movie) => movie.slug === slug) || null
    );
  }

  async getHomepageTopics(options?: RemoteFetchOptions) {
    const payload = await this.fetchJson<HomepageTopicsDto>(
      "/topics/homepageTopics",
      options,
    );

    return payload.result;
  }

  async getHomepageMenus(options?: RemoteFetchOptions) {
    return this.fetchPlainJson<HomepageMenuItemDto[]>("/menus", options);
  }

  async getHomepageBanners(options?: RemoteFetchOptions) {
    return this.fetchPlainJson<HomepageBannerDto[]>("/banners", options);
  }

  async getHomepageComments(options?: RemoteFetchOptions) {
    const payload = await this.fetchJson<HomepageCommentsDto>("/comments/top", options);
    return payload.result;
  }

  async getMovieShowtimes(
    movieId: number | string,
    options?: RemoteFetchOptions,
  ) {
    return this.fetchPlainJson<RemoteMovieShowtimeDto[]>(
      `/showtimes/by-movie/${movieId}`,
      options,
    );
  }

  async getShowtimesByDate(
    date: string,
    options?: RemoteFetchOptions,
  ) {
    return this.fetchPlainJson<RemoteMovieShowtimeDto[]>(
      `/showtimes/by-date/${date}`,
      options,
    );
  }
}
