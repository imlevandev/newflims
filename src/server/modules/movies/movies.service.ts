import { AppError } from "@/server/common/errors/app-error";

import type {
  CategoryDto,
  HomepageApiFeedDto,
  HomepageFeedDto,
  MovieDetailDto,
  MovieListQueryDto,
  MovieListResponseDto,
  RegionDto,
  RemoteMovieDto,
  RemoteMovieShowtimeDto,
} from "./dto/movie.dto";
import { MoviesDbRepository } from "./movies-db.repository";
import { MoviesRepository } from "./movies.repository";
import { OPhimRepository } from "./ophim.repository";

export class MoviesService {
  constructor(
    private readonly moviesDbRepository = new MoviesDbRepository(),
    private readonly externalMoviesRepository = new MoviesRepository(),
    private readonly ophimRepository = new OPhimRepository(),
  ) {}

  private toHomepageMovie(movie: RemoteMovieDto): RemoteMovieDto {
    return {
      id: movie.id,
      name: movie.name,
      origin_name: movie.origin_name,
      slug: movie.slug,
      description: movie.description ? movie.description.slice(0, 700) : "",
      thumbnail: movie.thumbnail,
      poster: movie.poster,
      banner: movie.banner,
      banner_background: movie.banner_background,
      type: movie.type,
      status: movie.status,
      trailer_url: movie.trailer_url,
      episode_time: movie.episode_time,
      episode_total: movie.episode_total,
      episode_current: movie.episode_current,
      quality: movie.quality,
      publish_year: movie.publish_year,
      imdb_rating: movie.imdb_rating,
      rating: movie.rating,
      image_name: movie.image_name,
      is_recommended: movie.is_recommended,
      latestEpisodes: (movie.latestEpisodes ?? []).slice(0, 1),
      categories: (movie.categories ?? []).slice(0, 4),
      regions: (movie.regions ?? []).slice(0, 2),
      view_total: movie.view_total,
      view_day: movie.view_day,
      view_week: movie.view_week,
      view_month: movie.view_month,
      updatedAt: movie.updatedAt,
    };
  }

  private isVietnamMovie(movie: RemoteMovieDto): boolean {
    return (movie.regions ?? []).some((region) => {
      return this.isVietnamRegion(region.slug, region.name);
    });
  }

  private withoutVietnamMovies(movies: RemoteMovieDto[]): RemoteMovieDto[] {
    return movies.filter((movie) => !this.isVietnamMovie(movie));
  }

  private isVietnamRegion(slug: string, name: string): boolean {
    const normalized = `${slug} ${name}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return normalized.includes("viet-nam") || normalized.includes("vietnam") || normalized.includes("viet nam");
  }

  async getHomepageFeed(): Promise<HomepageFeedDto> {
    const databaseFeed = await this.moviesDbRepository.getHomepageFeed(3);

    if (databaseFeed.hotMovies.length > 0 || databaseFeed.collections.length > 0) {
      return {
        hotMovies: this.withoutVietnamMovies(databaseFeed.hotMovies),
        collections: databaseFeed.collections.map((collection) => ({
          ...collection,
          movies: this.withoutVietnamMovies(collection.movies).slice(0, 10),
        })),
      };
    }

    const [hotMovies, collections] = await Promise.all([
      this.externalMoviesRepository.getHotMovies(),
      this.externalMoviesRepository.getHomepageCollections(1, 3),
    ]);

    return {
      hotMovies: this.withoutVietnamMovies(hotMovies),
      collections: collections.map((collection) => ({
        ...collection,
        movies: this.withoutVietnamMovies(collection.movies).slice(0, 10),
      })),
    };
  }

  async getHomepageCollectionBySlug(slug: string) {
    const collection = await this.moviesDbRepository.getHomepageCollectionBySlug(slug);

    if (!collection) {
      throw new AppError("Collection not found", 404, "COLLECTION_NOT_FOUND");
    }

    return {
      ...collection,
      movies: this.withoutVietnamMovies(collection.movies),
    };
  }

  async getHotMovies(): Promise<RemoteMovieDto[]> {
    const movies = await this.moviesDbRepository.getHotMovies(6);

    if (movies.length > 0) {
      return this.withoutVietnamMovies(movies);
    }

    const externalMovies = await this.externalMoviesRepository.getHotMovies();
    return this.withoutVietnamMovies(externalMovies);
  }

  async getMovieDetail(slug: string): Promise<MovieDetailDto> {
    const detail = await this.moviesDbRepository.getMovieBySlug(slug);

    if (detail) {
      return detail;
    }

    const homepageMovie = await this.externalMoviesRepository.findHomepageMovieBySlug(slug, {
      cache: "no-store",
      revalidate: false,
    });

    if (!homepageMovie) {
      throw new AppError("Movie not found", 404, "MOVIE_NOT_FOUND");
    }

    return {
      movie: this.toHomepageMovie(homepageMovie),
      episodes: [],
    };
  }

  async getMovieList(query: MovieListQueryDto): Promise<MovieListResponseDto> {
    if (query.country) {
      const normalizedCountry = query.country.toLowerCase();

      if (normalizedCountry === "viet-nam" || normalizedCountry === "vietnam") {
        return {
          items: [],
          pagination: {
            currentPage: query.page ?? 1,
            totalItems: 0,
            totalItemsPerPage: query.limit ?? 24,
            totalPages: 1,
          },
        };
      }
    }

    const response = await this.moviesDbRepository.getMovieList(query);
    const items = this.withoutVietnamMovies(response.items);

    return {
      ...response,
      items,
      pagination: {
        ...response.pagination,
        totalItems: Math.min(response.pagination.totalItems, items.length),
        totalPages: items.length === 0 ? 1 : response.pagination.totalPages,
      },
    };
  }

  async searchMovies(query: string, page?: number, limit?: number): Promise<MovieListResponseDto> {
    if (!query.trim()) {
      return {
        items: [],
        pagination: {
          currentPage: page ?? 1,
          totalItems: 0,
          totalItemsPerPage: limit ?? 24,
          totalPages: 1,
        },
      };
    }

    const response = await this.moviesDbRepository.searchMovies(query, page, limit);
    const items = this.withoutVietnamMovies(response.items);

    return {
      ...response,
      items,
      pagination: {
        ...response.pagination,
        totalItems: Math.min(response.pagination.totalItems, items.length),
        totalPages: items.length === 0 ? 1 : response.pagination.totalPages,
      },
    };
  }

  async getCategories(): Promise<CategoryDto[]> {
    let categories: CategoryDto[] = [];

    try {
      categories = await this.moviesDbRepository.getCategories();
    } catch (error) {
      console.warn("Falling back to OPhim categories because MongoDB is unavailable.", error);
    }

    if (categories.length > 0) {
      return categories;
    }

    const taxonomy = await this.ophimRepository.getCategories();
    return taxonomy.map((item) => ({
      id: item._id,
      name: item.name,
      slug: item.slug,
    }));
  }

  async getHomepageApiFeed(): Promise<HomepageApiFeedDto> {
    const [hotMovies, collections, topics, menus, banners, comments] = await Promise.all([
      this.externalMoviesRepository.getHotMovies(),
      this.externalMoviesRepository.getAllHomepageCollections(3),
      this.externalMoviesRepository.getHomepageTopics(),
      this.externalMoviesRepository.getHomepageMenus(),
      this.externalMoviesRepository.getHomepageBanners(),
      this.externalMoviesRepository.getHomepageComments(),
    ]);

    return {
      hotMovies: this.withoutVietnamMovies(hotMovies).map((movie) => this.toHomepageMovie(movie)),
      collections: collections.map((collection) => ({
        ...collection,
        movies: collection.movies
          .filter((movie) => !this.isVietnamMovie(movie))
          .slice(0, 10)
          .map((movie) => this.toHomepageMovie(movie)),
      })),
      topics,
      menus,
      banners,
      comments,
    };
  }

  async getHomepageAnimeCollections() {
    const collections = await this.externalMoviesRepository.getHomepageCollections(3, 3, {
      cache: "no-store",
      revalidate: false,
    });
    const animeCollections = collections.filter((collection) => {
      const normalized = `${collection.slug} ${collection.name}`.toLowerCase();
      return normalized.includes("anime") || normalized.includes("hoat-hinh");
    });

    return animeCollections.map((collection) => ({
      ...collection,
      name: collection.name || "Kho Tàng Anime Mới Nhất",
      movies: collection.movies
        .filter((movie) => !this.isVietnamMovie(movie))
        .slice(0, 15)
        .map((movie) => this.toHomepageMovie(movie)),
    }));
  }

  async getRegions(): Promise<RegionDto[]> {
    let regions: RegionDto[] = [];

    try {
      regions = await this.moviesDbRepository.getRegions();
    } catch (error) {
      console.warn("Falling back to OPhim regions because MongoDB is unavailable.", error);
    }

    if (regions.length > 0) {
      return regions.filter((region) => !this.isVietnamRegion(region.slug, region.name));
    }

    const taxonomy = await this.ophimRepository.getRegions();
    return taxonomy
      .map((item) => ({
        id: item._id,
        name: item.name,
        slug: item.slug,
      }))
      .filter((region) => !this.isVietnamRegion(region.slug, region.name));
  }

  async getScheduleSourceMovies(limitCollections = 4): Promise<RemoteMovieDto[]> {
    const [hotMovies, collections] = await Promise.all([
      this.externalMoviesRepository.getHotMovies({
        cache: "no-store",
        revalidate: false,
      }),
      this.externalMoviesRepository.getHomepageCollections(1, limitCollections, {
        cache: "no-store",
        revalidate: false,
      }),
    ]);

    return this.withoutVietnamMovies([...hotMovies, ...collections.flatMap((collection) => collection.movies)]).filter(
      (movie, index, items) =>
        items.findIndex((item) => String(item.id) === String(movie.id) || item.slug === movie.slug) ===
        index,
    );
  }

  async getMovieShowtimes(movieId: number | string): Promise<RemoteMovieShowtimeDto[]> {
    return this.externalMoviesRepository.getMovieShowtimes(movieId, {
      cache: "no-store",
      revalidate: false,
    });
  }

  async getShowtimesByDate(date: string): Promise<RemoteMovieShowtimeDto[]> {
    return this.externalMoviesRepository.getShowtimesByDate(date, {
      cache: "no-store",
      revalidate: false,
    });
  }
}
