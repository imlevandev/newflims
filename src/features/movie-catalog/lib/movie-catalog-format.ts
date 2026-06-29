import type {
  MovieDetailDto,
  MovieEpisodeServerDto,
  MovieEpisodeSourceDto,
  RemoteMovieDto,
} from "@/server/modules/movies/dto/movie.dto";

export function getMoviePoster(movie: RemoteMovieDto) {
  return movie.poster || movie.thumbnail || movie.banner || "";
}

export function getMovieBackdrop(movie: RemoteMovieDto) {
  return movie.banner || movie.banner_background || movie.poster || movie.thumbnail || "";
}

export function getMovieEpisodeLabel(movie: RemoteMovieDto) {
  return movie.latestEpisodes[0]?.name || movie.episode_current || movie.episode_total || movie.quality;
}

export function getMovieMetaBadges(movie: RemoteMovieDto) {
  return [
    movie.quality,
    movie.episode_current,
    movie.episode_total ? `Tổng ${movie.episode_total}` : null,
    movie.publish_year ? String(movie.publish_year) : null,
    movie.imdb_rating && movie.imdb_rating !== "0" ? `IMDb ${movie.imdb_rating}` : null,
  ].filter(Boolean) as string[];
}

export function stripMovieDescription(input: string) {
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function buildHref(
  pathname: string,
  params: Record<string, string | number | undefined | null>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function isEpisodePlayable(episode?: MovieEpisodeSourceDto | null) {
  return Boolean(episode?.m3u8);
}

export function getFirstPlayableEpisodeFromServer(server?: MovieEpisodeServerDto | null) {
  if (!server) {
    return null;
  }

  return server.items.find((item) => isEpisodePlayable(item)) || null;
}

export function getFirstPlayableEpisode(detail: MovieDetailDto) {
  for (const server of detail.episodes) {
    const episode = getFirstPlayableEpisodeFromServer(server);

    if (episode) {
      return {
        episode,
        server,
      };
    }
  }

  return null;
}

export function getFirstServerWithItems(servers: MovieEpisodeServerDto[]) {
  return servers.find((server) => server.items.length > 0) || servers[0] || null;
}

export function getPlayableEpisodeCount(servers: MovieEpisodeServerDto[]) {
  return servers.reduce(
    (total, server) => total + server.items.filter((item) => isEpisodePlayable(item)).length,
    0,
  );
}

export function getSingleSearchValue(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}
