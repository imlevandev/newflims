import { AppError } from "@/server/common/errors/app-error";
import { env } from "@/server/config/env";

import type {
  HomepageMovieCollectionDto,
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
    const payload = await this.fetchJson<HomepageListsResponse>(
      `/lists/homepageLists?page=${page}&limit=${limit}`,
      options,
    );

    return payload.result.collections;
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
