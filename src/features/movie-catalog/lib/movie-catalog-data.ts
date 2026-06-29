import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

import { AppError } from "@/server/common/errors/app-error";
import { MoviesService } from "@/server/modules/movies/movies.service";
import type { MovieListQueryDto } from "@/server/modules/movies/dto/movie.dto";

export const moviesService = new MoviesService();

export const getCachedHomepageFeed = unstable_cache(
  () => moviesService.getHomepageFeed(),
  ["homepage-feed"],
  { revalidate: 300, tags: ["homepage-feed"] },
);

export const getCachedHomepageApiFeed = unstable_cache(
  () => moviesService.getHomepageApiFeed(),
  ["homepage-api-feed"],
  { revalidate: 300, tags: ["homepage-feed"] },
);

export const getCachedHotMovies = unstable_cache(
  () => moviesService.getHotMovies(),
  ["hot-movies"],
  { revalidate: 300, tags: ["movies"] },
);

export const getCachedCategories = unstable_cache(
  () => moviesService.getCategories(),
  ["movie-categories"],
  { revalidate: 3600, tags: ["movie-taxonomy"] },
);

export const getCachedRegions = unstable_cache(
  () => moviesService.getRegions(),
  ["movie-regions"],
  { revalidate: 3600, tags: ["movie-taxonomy"] },
);

export const getCachedMovieList = unstable_cache(
  (query: MovieListQueryDto) => moviesService.getMovieList(query),
  ["movie-list"],
  { revalidate: 300, tags: ["movies"] },
);

export const getCachedMovieDetail = unstable_cache(
  (slug: string) => moviesService.getMovieDetail(slug),
  ["movie-detail"],
  { revalidate: 300, tags: ["movies"] },
);

export const getCachedHomepageCollection = unstable_cache(
  (slug: string) => moviesService.getHomepageCollectionBySlug(slug),
  ["homepage-collection"],
  { revalidate: 300, tags: ["homepage-feed"] },
);

export async function getMovieDetailOrNotFound(slug: string) {
  try {
    return await getCachedMovieDetail(slug);
  } catch (error) {
    if (error instanceof AppError && error.code === "MOVIE_NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}

export async function getHomepageCollectionOrNotFound(slug: string) {
  try {
    return await getCachedHomepageCollection(slug);
  } catch (error) {
    if (error instanceof AppError && error.code === "COLLECTION_NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}
