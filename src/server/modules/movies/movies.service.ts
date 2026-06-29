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

  async getHomepageFeed(): Promise<HomepageFeedDto> {
    const databaseFeed = await this.moviesDbRepository.getHomepageFeed(3);

    if (databaseFeed.hotMovies.length > 0 || databaseFeed.collections.length > 0) {
      return {
        hotMovies: databaseFeed.hotMovies,
        collections: databaseFeed.collections.map((collection) => ({
          ...collection,
          movies: collection.movies.slice(0, 10),
        })),
      };
    }

    const [hotMovies, collections] = await Promise.all([
      this.externalMoviesRepository.getHotMovies(),
      this.externalMoviesRepository.getHomepageCollections(1, 3),
    ]);

    return {
      hotMovies,
      collections: collections.map((collection) => ({
        ...collection,
        movies: collection.movies.slice(0, 10),
      })),
    };
  }

  async getHomepageCollectionBySlug(slug: string) {
    const collection = await this.moviesDbRepository.getHomepageCollectionBySlug(slug);

    if (!collection) {
      throw new AppError("Collection not found", 404, "COLLECTION_NOT_FOUND");
    }

    return collection;
  }

  async getHotMovies(): Promise<RemoteMovieDto[]> {
    const movies = await this.moviesDbRepository.getHotMovies(6);

    if (movies.length > 0) {
      return movies;
    }

    return this.externalMoviesRepository.getHotMovies();
  }

  async getMovieDetail(slug: string): Promise<MovieDetailDto> {
    const detail = await this.moviesDbRepository.getMovieBySlug(slug);

    if (!detail) {
      throw new AppError("Movie not found", 404, "MOVIE_NOT_FOUND");
    }

    return detail;
  }

  async getMovieList(query: MovieListQueryDto): Promise<MovieListResponseDto> {
    return this.moviesDbRepository.getMovieList(query);
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

    return this.moviesDbRepository.searchMovies(query, page, limit);
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
      hotMovies: hotMovies.map((movie) => this.toHomepageMovie(movie)),
      collections: collections.map((collection) => ({
        ...collection,
        movies: collection.movies
          .slice(0, 10)
          .map((movie) => this.toHomepageMovie(movie)),
      })),
      topics,
      menus,
      banners,
      comments,
    };
  }

  async getRegions(): Promise<RegionDto[]> {
    let regions: RegionDto[] = [];

    try {
      regions = await this.moviesDbRepository.getRegions();
    } catch (error) {
      console.warn("Falling back to OPhim regions because MongoDB is unavailable.", error);
    }

    if (regions.length > 0) {
      return regions;
    }

    const taxonomy = await this.ophimRepository.getRegions();
    return taxonomy.map((item) => ({
      id: item._id,
      name: item.name,
      slug: item.slug,
    }));
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

    return [...hotMovies, ...collections.flatMap((collection) => collection.movies)].filter(
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
