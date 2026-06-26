import { AppError } from "@/server/common/errors/app-error";

import type {
  CrawlRequestDto,
  CrawlResultDto,
  ShowtimeCrawlRequestDto,
  ShowtimeCrawlResultDto,
} from "./dto/crawl.dto";
import type { RemoteMovieShowtimeDto } from "./dto/movie.dto";
import { mapOPhimEpisodesToEpisodeWrites, mapOPhimMovieToMovieWrite, mapTaxonomySourceToUpsert } from "./movies.mapper";
import { MoviesDbRepository } from "./movies-db.repository";
import { MoviesRepository } from "./movies.repository";
import { OPhimRepository } from "./ophim.repository";

interface SyncMoviesResult {
  crawlErrors: Array<{ message: string; slug: string }>;
  errorMovies: number;
  moviesCreated: number;
  moviesUpdated: number;
  pagesProcessed: number;
}

function padNumber(value: number) {
  return value.toString().padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}

function parseInputDate(value: string, fieldName: "dateStart" | "dateEnd") {
  const trimmedValue = value.trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    throw new AppError(
      fieldName === "dateStart" ? "Ngày bắt đầu không hợp lệ" : "Ngày kết thúc không hợp lệ",
      400,
      fieldName === "dateStart"
        ? "CRAWL_SHOWTIME_START_INVALID"
        : "CRAWL_SHOWTIME_END_INVALID",
    );
  }

  const parsedDate = new Date(`${trimmedValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new AppError(
      fieldName === "dateStart" ? "Ngày bắt đầu không hợp lệ" : "Ngày kết thúc không hợp lệ",
      400,
      fieldName === "dateStart"
        ? "CRAWL_SHOWTIME_START_INVALID"
        : "CRAWL_SHOWTIME_END_INVALID",
    );
  }

  return parsedDate;
}

export class MoviesCrawlService {
  constructor(
    private readonly ophimRepository = new OPhimRepository(),
    private readonly darkbytesRepository = new MoviesRepository(),
    private readonly moviesDbRepository = new MoviesDbRepository(),
  ) {}

  private buildDarkbytesMoviePatch(movie: Record<string, any>, isRecommended = false) {
    const patch: Record<string, unknown> = {
      content: typeof movie.description === "string" ? movie.description : "",
      episode_current: movie.episode_current ?? "",
      episode_time: movie.episode_time ?? "",
      image_name: movie.image_name ?? "",
      is_recommended: isRecommended,
      lang: movie.language ?? movie.rating ?? "",
      name: movie.name,
      origin_name: movie.origin_name ?? "",
      poster_url: movie.poster ?? "",
      quality: movie.quality ?? "HD",
      slug: movie.slug,
      thumb_url: movie.thumbnail ?? movie.poster ?? "",
      trailer_url: movie.trailer_url ?? "",
      type: movie.type === "movie" || movie.type === "trailer" ? movie.type : "series",
      view_day: movie.view_day ?? 0,
      view_month: movie.view_month ?? 0,
      view_total: movie.view_total ?? 0,
      view_week: movie.view_week ?? 0,
      year: movie.publish_year ?? null,
    };

    if (typeof movie.status === "string") {
      patch.status =
        movie.status === "completed" || movie.status === "trailer"
          ? movie.status
          : "ongoing";
    }

    if (Array.isArray(movie.categories)) {
      patch.category = movie.categories.map((category: Record<string, any>) => ({
        id: String(category.id ?? category.slug ?? category.name ?? ""),
        name: category.name ?? "",
        slug: category.slug ?? "",
      }));
    }

    if (Array.isArray(movie.regions)) {
      patch.country = movie.regions.map((region: Record<string, any>) => ({
        id: String(region.id ?? region.slug ?? region.name ?? ""),
        name: region.name ?? "",
        slug: region.slug ?? "",
      }));
    }

    return patch;
  }

  private buildShowtimeText(showtime: RemoteMovieShowtimeDto) {
    return [showtime.show_date?.trim(), showtime.show_time?.trim()]
      .filter(Boolean)
      .join(" ");
  }

  private createShowtimeDateRange(request: ShowtimeCrawlRequestDto) {
    const defaultStartDate = new Date();
    defaultStartDate.setHours(0, 0, 0, 0);

    const startDate = request.dateStart?.trim()
      ? parseInputDate(request.dateStart, "dateStart")
      : defaultStartDate;
    const endDate = request.dateEnd?.trim()
      ? parseInputDate(request.dateEnd, "dateEnd")
      : startDate;

    if (endDate.getTime() < startDate.getTime()) {
      throw new AppError(
        "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu",
        400,
        "CRAWL_SHOWTIME_RANGE_INVALID",
      );
    }

    const dayDiff = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
    );

    if (dayDiff > 14) {
      throw new AppError(
        "Chỉ được crawl lịch chiếu tối đa 15 ngày mỗi lần",
        400,
        "CRAWL_SHOWTIME_RANGE_TOO_LARGE",
      );
    }

    const dates = Array.from({ length: dayDiff + 1 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return formatDateKey(date);
    });

    return {
      dateEnd: formatDateKey(endDate),
      dateStart: formatDateKey(startDate),
      dates,
    };
  }

  private async syncTaxonomies() {
    const [categories, regions] = await Promise.all([
      this.ophimRepository.getCategories(),
      this.ophimRepository.getRegions(),
    ]);

    await Promise.all(
      categories.map((category) =>
        this.moviesDbRepository.upsertCategory(mapTaxonomySourceToUpsert(category)),
      ),
    );

    await Promise.all(
      regions.map((region) =>
        this.moviesDbRepository.upsertRegion(mapTaxonomySourceToUpsert(region)),
      ),
    );

    return {
      categoriesSynced: categories.length,
      regionsSynced: regions.length,
    };
  }

  private async syncMovieBySlug(
    slug: string,
    overrides: Partial<Record<string, unknown>> = {},
  ) {
    const alreadyExists = await this.moviesDbRepository.movieExists(slug);
    const detailPayload = await this.ophimRepository.getMovieBySlug(slug);

    if (!detailPayload?.movie?.slug) {
      return {
        created: false,
        updated: false,
      };
    }

    const movieWrite = {
      ...mapOPhimMovieToMovieWrite(detailPayload),
      ...overrides,
    };

    const storedMovie = await this.moviesDbRepository.upsertMovie(movieWrite);

    if (!storedMovie?._id) {
      return {
        created: false,
        updated: false,
      };
    }

    const episodeWrites = mapOPhimEpisodesToEpisodeWrites(
      storedMovie._id,
      detailPayload.episodes ?? [],
    );

    await this.moviesDbRepository.replaceEpisodes(storedMovie._id, episodeWrites);

    return {
      created: !alreadyExists,
      updated: alreadyExists,
    };
  }

  private async syncOPhimMoviesByFilter(options: {
    categorySlug?: string;
    countrySlug?: string;
    pageEnd: number;
    pageStart: number;
  }): Promise<SyncMoviesResult> {
    const crawlErrors: Array<{ message: string; slug: string }> = [];
    let errorMovies = 0;
    let moviesCreated = 0;
    let moviesUpdated = 0;
    let pagesProcessed = 0;

    for (let page = options.pageStart; page <= options.pageEnd; page += 1) {
      const listPayload =
        options.categorySlug || options.countrySlug
          ? await this.ophimRepository.getCatalogMovies({
              categorySlug: options.categorySlug,
              countrySlug: options.countrySlug,
              page,
            })
          : await this.ophimRepository.getUpdatedMovies(page);

      pagesProcessed += 1;

      for (const listMovie of listPayload.items) {
        try {
          const syncResult = await this.syncMovieBySlug(listMovie.slug);

          if (syncResult.created) {
            moviesCreated += 1;
          }

          if (syncResult.updated) {
            moviesUpdated += 1;
          }
        } catch (error) {
          errorMovies += 1;
          crawlErrors.push({
            message:
              error instanceof Error ? error.message : "Unknown movie crawl error",
            slug: listMovie.slug,
          });
        }
      }
    }

    return {
      crawlErrors,
      errorMovies,
      moviesCreated,
      moviesUpdated,
      pagesProcessed,
    };
  }

  private async syncDarkbytesHomepage() {
    const [hotMovies, collections] = await Promise.all([
      this.darkbytesRepository.getHotMovies({
        cache: "no-store",
        revalidate: false,
      }),
      this.darkbytesRepository.getHomepageCollections(1, 8, {
        cache: "no-store",
        revalidate: false,
      }),
    ]);

    const hotSlugs: string[] = [];

    for (const movie of hotMovies) {
      hotSlugs.push(movie.slug);
      await this.moviesDbRepository.upsertMovie(
        this.buildDarkbytesMoviePatch(movie, true) as Record<string, unknown> & {
          slug: string;
        },
      );
    }

    await this.moviesDbRepository.markRecommendedMovies(hotSlugs);

    let homepageListsSynced = 0;

    for (const collection of collections) {
      const slugs = collection.movies.map((movie) => movie.slug);

      for (const movie of collection.movies) {
        await this.moviesDbRepository.upsertMovie(
          this.buildDarkbytesMoviePatch(
            movie,
            hotSlugs.includes(movie.slug),
          ) as Record<string, unknown> & { slug: string },
        );
      }

      const storedMovies = await this.moviesDbRepository.findMoviesBySlugs(slugs);
      const movieIdMap = new Map(storedMovies.map((movie) => [movie.slug, movie._id]));

      const orderedMovieIds = slugs
        .map((slug) => movieIdMap.get(slug))
        .filter((movieId): movieId is NonNullable<typeof movieId> => Boolean(movieId));

      await this.moviesDbRepository.upsertHomepageList({
        color: collection.color,
        filter: (collection as { filter?: string }).filter ?? "",
        movies: orderedMovieIds,
        name: collection.name,
        order: homepageListsSynced,
        slug: collection.slug,
        style: (collection as { style?: number }).style ?? 6,
      });

      homepageListsSynced += 1;
    }

    return {
      homepageListsSynced,
      hotMoviesSynced: hotMovies.length,
    };
  }

  async crawl(request: CrawlRequestDto): Promise<CrawlResultDto> {
    const pageStart = Math.max(1, request.pageStart ?? 1);
    const pageEnd = Math.max(pageStart, request.pageEnd ?? pageStart);
    const crawlMode = request.crawlMode ?? "all";
    const categorySlug =
      crawlMode === "category" ? request.categorySlug?.trim() || undefined : undefined;
    const countrySlug =
      crawlMode === "country" ? request.countrySlug?.trim() || undefined : undefined;

    if (crawlMode === "category" && !categorySlug) {
      throw new AppError(
        "Thiếu slug thể loại để crawl",
        400,
        "CRAWL_CATEGORY_REQUIRED",
      );
    }

    if (crawlMode === "country" && !countrySlug) {
      throw new AppError(
        "Thiếu slug quốc gia để crawl",
        400,
        "CRAWL_COUNTRY_REQUIRED",
      );
    }

    const crawlSource =
      crawlMode === "category"
        ? `ophim+darkbytes:category:${categorySlug}`
        : crawlMode === "country"
          ? `ophim+darkbytes:country:${countrySlug}`
          : "ophim+darkbytes";

    const crawlLog = await this.moviesDbRepository.createCrawlLog({
      page_end: pageEnd,
      page_start: pageStart,
      source: crawlSource,
      started: new Date(),
      status: "running",
      type:
        crawlMode === "all" && pageStart === pageEnd && pageStart === 1
          ? "incremental"
          : "single",
    });

    try {
      const taxonomyResult = await this.syncTaxonomies();
      const movieResult = await this.syncOPhimMoviesByFilter({
        categorySlug,
        countrySlug,
        pageEnd,
        pageStart,
      });
      const homepageResult = await this.syncDarkbytesHomepage();

      const result: CrawlResultDto = {
        ...homepageResult,
        ...movieResult,
        ...taxonomyResult,
      };

      await this.moviesDbRepository.finishCrawlLog(crawlLog._id, {
        crawl_errors: movieResult.crawlErrors,
        error_movies: result.errorMovies,
        finished: new Date(),
        new_movies: result.moviesCreated,
        status: "done",
        total_movies: result.moviesCreated + result.moviesUpdated,
        updated_movies: result.moviesUpdated,
      });

      return result;
    } catch (error) {
      await this.moviesDbRepository.finishCrawlLog(crawlLog._id, {
        crawl_errors: [
          {
            message: error instanceof Error ? error.message : "Unknown crawl error",
            slug: "",
          },
        ],
        finished: new Date(),
        status: "error",
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("Failed to crawl movie data", 500, "CRAWL_FAILED");
    }
  }

  async crawlByShowtimes(
    request: ShowtimeCrawlRequestDto,
  ): Promise<ShowtimeCrawlResultDto> {
    const { dateEnd, dateStart, dates } = this.createShowtimeDateRange(request);

    const crawlLog = await this.moviesDbRepository.createCrawlLog({
      page_end: dates.length,
      page_start: 1,
      source: `showtimes:${dateStart}:${dateEnd}`,
      started: new Date(),
      status: "running",
      type: "single",
    });

    try {
      const taxonomyResult = await this.syncTaxonomies();
      const showtimeMovies = new Map<
        string,
        {
          showtimeText: string;
          slug: string;
        }
      >();
      const crawlErrors: Array<{ message: string; slug: string }> = [];
      let showtimeEntriesFound = 0;
      let moviesCreated = 0;
      let moviesUpdated = 0;
      let errorMovies = 0;

      for (const date of dates) {
        const showtimes = await this.darkbytesRepository.getShowtimesByDate(date, {
          cache: "no-store",
          revalidate: false,
        });

        for (const showtime of showtimes) {
          const movieSlug = showtime.movie?.slug?.trim();

          if (!movieSlug) {
            continue;
          }

          showtimeEntriesFound += 1;

          if (!showtimeMovies.has(movieSlug)) {
            showtimeMovies.set(movieSlug, {
              showtimeText: this.buildShowtimeText(showtime),
              slug: movieSlug,
            });
          }
        }
      }

      for (const item of showtimeMovies.values()) {
        try {
          const syncResult = await this.syncMovieBySlug(
            item.slug,
            item.showtimeText ? { showtime: item.showtimeText } : {},
          );

          if (syncResult.created) {
            moviesCreated += 1;
          }

          if (syncResult.updated) {
            moviesUpdated += 1;
          }
        } catch (error) {
          errorMovies += 1;
          crawlErrors.push({
            message:
              error instanceof Error ? error.message : "Unknown showtime crawl error",
            slug: item.slug,
          });
        }
      }

      const result: ShowtimeCrawlResultDto = {
        categoriesSynced: taxonomyResult.categoriesSynced,
        daysProcessed: dates.length,
        errorMovies,
        hotMoviesSynced: 0,
        homepageListsSynced: 0,
        moviesCreated,
        moviesUpdated,
        pagesProcessed: 0,
        regionsSynced: taxonomyResult.regionsSynced,
        showtimeEntriesFound,
        uniqueMoviesQueued: showtimeMovies.size,
      };

      await this.moviesDbRepository.finishCrawlLog(crawlLog._id, {
        crawl_errors: crawlErrors,
        error_movies: result.errorMovies,
        finished: new Date(),
        new_movies: result.moviesCreated,
        status: "done",
        total_movies: result.moviesCreated + result.moviesUpdated,
        updated_movies: result.moviesUpdated,
      });

      return result;
    } catch (error) {
      await this.moviesDbRepository.finishCrawlLog(crawlLog._id, {
        crawl_errors: [
          {
            message:
              error instanceof Error ? error.message : "Unknown showtime crawl error",
            slug: "",
          },
        ],
        finished: new Date(),
        status: "error",
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Failed to crawl movies from showtimes",
        500,
        "CRAWL_SHOWTIMES_FAILED",
      );
    }
  }
}
