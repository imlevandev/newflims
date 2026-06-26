import type {
  MovieDetailDto,
  RemoteMovieDto,
  RemoteMovieShowtimeDto,
} from "@/server/modules/movies/dto/movie.dto";
import type { MoviesService } from "@/server/modules/movies/movies.service";

export interface MovieScheduleCard {
  detailHref: string;
  episodeHref: string;
  episodeLabel: string;
  id: string;
  metaLabel: string;
  movie: RemoteMovieDto;
}

export interface MovieScheduleDay {
  date: Date;
  dateLabel: string;
  dayLabel: string;
  id: string;
  items: MovieScheduleCard[];
}

const VIETNAMESE_DAY_NAMES = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

function padNumber(value: number) {
  return value.toString().padStart(2, "0");
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function formatDateLabel(date: Date) {
  return `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}`;
}

function formatMetaLabel(showDate: Date, showTime?: string | null) {
  const dateLabel = formatDateLabel(showDate);
  return showTime?.trim() ? `${dateLabel} - ${showTime.trim()}` : `Chiếu ngày ${dateLabel}`;
}

function normalizeKey(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/tap|episode|ep/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function getEpisodeNumberToken(value?: string | null) {
  const match = value?.match(/\d+/);
  return match?.[0] || "";
}

function parseShowDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function normalizeShowtimeMovie(movie: NonNullable<RemoteMovieShowtimeDto["movie"]>): RemoteMovieDto {
  return {
    id: movie.id,
    name: movie.name,
    origin_name: "",
    slug: movie.slug,
    description: "",
    thumbnail: movie.thumbnail || movie.poster || "",
    poster: movie.poster || movie.thumbnail || "",
    banner: movie.poster || movie.thumbnail || "",
    banner_background: movie.poster || movie.thumbnail || "",
    type: "series",
    status: "ongoing",
    trailer_url: "",
    episode_time: "",
    episode_total: "",
    episode_current: "",
    quality: "HD",
    publish_year: 0,
    imdb_rating: "0",
    rating: "",
    image_name: null,
    latestEpisodes: [],
    categories: [],
    regions: [],
    updatedAt: "",
    view_total: 0,
    view_day: 0,
    view_week: 0,
    view_month: 0,
  };
}

function resolveScheduleEpisode(detail: MovieDetailDto, preferredEpisodeName?: string | null) {
  const latestEpisodeName =
    preferredEpisodeName?.trim()
    || detail.movie.latestEpisodes[0]?.name?.trim()
    || detail.movie.episode_current
    || "";

  const candidateKeys = [
    normalizeKey(latestEpisodeName),
    normalizeKey(getEpisodeNumberToken(latestEpisodeName)),
    normalizeKey(detail.movie.episode_current),
    normalizeKey(getEpisodeNumberToken(detail.movie.episode_current)),
  ].filter(Boolean);

  for (const server of detail.episodes) {
    for (const item of server.items) {
      const itemKeys = [
        normalizeKey(item.name),
        normalizeKey(item.slug),
        normalizeKey(getEpisodeNumberToken(item.name)),
      ].filter(Boolean);

      if (candidateKeys.some((candidateKey) => itemKeys.includes(candidateKey))) {
        return {
          episodeHref: `/xem-phim/${detail.movie.slug}?server=${server.server_slug}&episode=${item.slug}`,
          episodeLabel: item.name?.trim() || detail.movie.episode_current || "Đang cập nhật",
        };
      }
    }
  }

  const firstServer = detail.episodes.find((server) => server.items.length > 0);
  const firstEpisode = firstServer?.items[0];

  if (firstServer && firstEpisode) {
    return {
      episodeHref: `/xem-phim/${detail.movie.slug}?server=${firstServer.server_slug}&episode=${firstEpisode.slug}`,
      episodeLabel: firstEpisode.name?.trim() || detail.movie.episode_current || "Đang cập nhật",
    };
  }

  return {
    episodeHref: `/xem-phim/${detail.movie.slug}`,
    episodeLabel:
      preferredEpisodeName?.trim()
      || detail.movie.episode_current
      || detail.movie.episode_total
      || "Đang cập nhật",
  };
}

function buildScheduleCard(
  movie: RemoteMovieDto,
  showtime: RemoteMovieShowtimeDto,
  detail: MovieDetailDto | null,
) {
  const parsedShowDate = parseShowDate(showtime.show_date);
  const resolvedEpisode = detail
    ? resolveScheduleEpisode(detail, showtime.episode)
    : {
        episodeHref: `/xem-phim/${movie.slug}`,
        episodeLabel: showtime.episode?.trim() || "Đang cập nhật",
      };

  return {
    detailHref: `/phim/${movie.slug}`,
    episodeHref: resolvedEpisode.episodeHref,
    episodeLabel: resolvedEpisode.episodeLabel,
    id: `${movie.slug}-${showtime.id}`,
    metaLabel: formatMetaLabel(parsedShowDate || new Date(), showtime.show_time),
    movie,
  } satisfies MovieScheduleCard;
}

export async function buildMovieScheduleDays(
  moviesService: MoviesService,
  startDate = new Date(),
) {
  const baseDate = new Date(startDate);
  baseDate.setHours(0, 0, 0, 0);

  const days: MovieScheduleDay[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);

    return {
      date,
      dateLabel: formatDateLabel(date),
      dayLabel: VIETNAMESE_DAY_NAMES[date.getDay()],
      id: toDateKey(date),
      items: [],
    };
  });

  const detailCache = new Map<string, Promise<MovieDetailDto | null>>();

  const getMovieDetailCached = (slug: string) => {
    if (!detailCache.has(slug)) {
      detailCache.set(
        slug,
        moviesService.getMovieDetail(slug).catch(() => null),
      );
    }

    return detailCache.get(slug)!;
  };

  await Promise.all(
    days.map(async (day, index) => {
      const showtimes = await moviesService.getShowtimesByDate(day.id).catch(() => []);
      const cards = await Promise.all(
        showtimes.map(async (showtime) => {
          if (!showtime.movie?.slug) {
            return null;
          }

          const movie = normalizeShowtimeMovie(showtime.movie);
          const detail = await getMovieDetailCached(movie.slug);

          return buildScheduleCard(movie, showtime, detail);
        }),
      );

      days[index].items = cards
        .filter((card): card is MovieScheduleCard => Boolean(card))
        .sort((left, right) => left.movie.name.localeCompare(right.movie.name, "vi"));
    }),
  );

  return days;
}
