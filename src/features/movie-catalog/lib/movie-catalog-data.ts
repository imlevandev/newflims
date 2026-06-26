import { notFound } from "next/navigation";

import { AppError } from "@/server/common/errors/app-error";
import { MoviesService } from "@/server/modules/movies/movies.service";

export const moviesService = new MoviesService();

export async function getMovieDetailOrNotFound(slug: string) {
  try {
    return await moviesService.getMovieDetail(slug);
  } catch (error) {
    if (error instanceof AppError && error.code === "MOVIE_NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}

export async function getHomepageCollectionOrNotFound(slug: string) {
  try {
    return await moviesService.getHomepageCollectionBySlug(slug);
  } catch (error) {
    if (error instanceof AppError && error.code === "COLLECTION_NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}
