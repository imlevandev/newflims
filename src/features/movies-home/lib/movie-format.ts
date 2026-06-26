import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

export function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function getMovieCover(movie: RemoteMovieDto) {
  return movie.poster || movie.thumbnail || movie.image_name || "";
}

export function getMovieMeta(movie: RemoteMovieDto) {
  return [
    movie.quality,
    movie.episode_current,
    movie.publish_year ? String(movie.publish_year) : null,
  ].filter(Boolean);
}
