import { AppError } from "@/server/common/errors/app-error";

import type {
  CategoryDto,
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
