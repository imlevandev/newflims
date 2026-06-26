import type { SortOrder, Types } from "mongoose";

import { connectDb } from "@/server/database/connect-db";
import { CategoryModel } from "@/server/database/models/category.model";
import { CrawlLogModel } from "@/server/database/models/crawl-log.model";
import { EpisodeModel } from "@/server/database/models/episode.model";
import { HomepageListModel } from "@/server/database/models/homepage-list.model";
import { MovieModel } from "@/server/database/models/movie.model";
import { RegionModel } from "@/server/database/models/region.model";

import { mapCategoryDocumentToDto, mapMovieDocumentToDto, mapMovieDetailDto, mapRegionDocumentToDto } from "./movies.mapper";
import type {
  CategoryDto,
  HomepageFeedDto,
  HomepageMovieCollectionDto,
  MovieDetailDto,
  MovieListQueryDto,
  MovieListResponseDto,
  RegionDto,
  RemoteMovieDto,
} from "./dto/movie.dto";

function buildSort(sort?: string): Record<string, SortOrder> {
  switch (sort) {
    case "popular":
      return { view_total: -1, modified: -1 };
    case "year_asc":
      return { year: 1, modified: -1 };
    case "year_desc":
      return { year: -1, modified: -1 };
    case "name_asc":
      return { name: 1 };
    case "name_desc":
      return { name: -1 };
    case "latest":
    default:
      return { modified: -1 };
  }
}

export class MoviesDbRepository {
  async getHotMovies(limit = 6): Promise<RemoteMovieDto[]> {
    await connectDb();

    const recommendedMovies = await MovieModel.find({ is_recommended: true })
      .sort({ modified: -1, view_total: -1 })
      .limit(limit)
      .lean();

    if (recommendedMovies.length >= limit) {
      return recommendedMovies.map(mapMovieDocumentToDto);
    }

    const fallbackIds = new Set(recommendedMovies.map((movie) => String(movie._id)));
    const fallbackMovies = await MovieModel.find({
      _id: { $nin: [...fallbackIds] },
    })
      .sort({ modified: -1, view_total: -1 })
      .limit(limit - recommendedMovies.length)
      .lean();

    return [...recommendedMovies, ...fallbackMovies].map(mapMovieDocumentToDto);
  }

  async getHomepageCollections(limit = 3): Promise<HomepageMovieCollectionDto[]> {
    await connectDb();

    const lists = await HomepageListModel.find({})
      .sort({ order: 1, _id: 1 })
      .limit(limit)
      .lean();

    const collections = await Promise.all(
      lists.map(async (list) => {
        const movies = await MovieModel.find({
          _id: { $in: list.movies },
        }).lean();

        const movieMap = new Map(movies.map((movie) => [String(movie._id), movie]));
        const orderedMovies = list.movies
          .map((movieId) => movieMap.get(String(movieId)))
          .filter(Boolean)
          .map((movie) => mapMovieDocumentToDto(movie!));

        return {
          color: list.color,
          id: String(list._id),
          movies: orderedMovies,
          name: list.name,
          slug: list.slug,
        } satisfies HomepageMovieCollectionDto;
      }),
    );

    return collections;
  }

  async getHomepageCollectionBySlug(slug: string): Promise<HomepageMovieCollectionDto | null> {
    await connectDb();

    const list = await HomepageListModel.findOne({ slug }).lean();

    if (!list) {
      return null;
    }

    const movies = await MovieModel.find({
      _id: { $in: list.movies },
    }).lean();

    const movieMap = new Map(movies.map((movie) => [String(movie._id), movie]));
    const orderedMovies = list.movies
      .map((movieId) => movieMap.get(String(movieId)))
      .filter(Boolean)
      .map((movie) => mapMovieDocumentToDto(movie!));

    return {
      color: list.color,
      id: String(list._id),
      movies: orderedMovies,
      name: list.name,
      slug: list.slug,
    };
  }

  async getHomepageFeed(limitCollections = 3): Promise<HomepageFeedDto> {
    const [hotMovies, collections] = await Promise.all([
      this.getHotMovies(6),
      this.getHomepageCollections(limitCollections),
    ]);

    return {
      hotMovies,
      collections,
    };
  }

  async getMovieBySlug(slug: string): Promise<MovieDetailDto | null> {
    await connectDb();

    const movie = await MovieModel.findOne({ slug }).lean();

    if (!movie) {
      return null;
    }

    const episodes = await EpisodeModel.find({ movie_id: movie._id })
      .sort({ server_name: 1 })
      .lean();

    return mapMovieDetailDto(movie, episodes);
  }

  async getMovieList(query: MovieListQueryDto): Promise<MovieListResponseDto> {
    await connectDb();

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(60, Math.max(1, query.limit ?? 24));
    const filter: Record<string, unknown> = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (query.category) {
      filter["category.slug"] = query.category;
    }

    if (query.country) {
      filter["country.slug"] = query.country;
    }

    const [items, totalItems] = await Promise.all([
      MovieModel.find(filter)
        .sort(buildSort(query.sort))
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      MovieModel.countDocuments(filter),
    ]);

    return {
      items: items.map(mapMovieDocumentToDto),
      pagination: {
        currentPage: page,
        totalItems,
        totalItemsPerPage: limit,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
      },
    };
  }

  async searchMovies(query: string, page = 1, limit = 24): Promise<MovieListResponseDto> {
    await connectDb();

    const normalizedPage = Math.max(1, page);
    const normalizedLimit = Math.min(60, Math.max(1, limit));
    const filter = {
      $text: {
        $search: query,
      },
    };

    const [items, totalItems] = await Promise.all([
      MovieModel.find(filter, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" }, modified: -1 })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .lean(),
      MovieModel.countDocuments(filter),
    ]);

    return {
      items: items.map(mapMovieDocumentToDto),
      pagination: {
        currentPage: normalizedPage,
        totalItems,
        totalItemsPerPage: normalizedLimit,
        totalPages: Math.max(1, Math.ceil(totalItems / normalizedLimit)),
      },
    };
  }

  async getCategories(): Promise<CategoryDto[]> {
    await connectDb();

    const categories = await CategoryModel.find({}).sort({ order: 1, name: 1 }).lean();
    return categories.map(mapCategoryDocumentToDto);
  }

  async getRegions(): Promise<RegionDto[]> {
    await connectDb();

    const regions = await RegionModel.find({}).sort({ name: 1 }).lean();
    return regions.map(mapRegionDocumentToDto);
  }

  async upsertMovie(payload: Record<string, unknown> & { slug: string }) {
    await connectDb();

    return MovieModel.findOneAndUpdate(
      { slug: payload.slug },
      {
        $set: payload,
        $setOnInsert: {
          created: payload.created ?? new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        lean: true,
        timestamps: false,
      },
    );
  }

  async movieExists(slug: string) {
    await connectDb();
    return Boolean(await MovieModel.exists({ slug }));
  }

  async replaceEpisodes(movieId: Types.ObjectId | string, episodes: Array<Record<string, unknown>>) {
    await connectDb();

    await EpisodeModel.deleteMany({ movie_id: movieId });

    if (episodes.length === 0) {
      return [];
    }

    return EpisodeModel.insertMany(episodes, { ordered: true });
  }

  async upsertCategory(payload: { name: string; slug: string }) {
    await connectDb();

    return CategoryModel.findOneAndUpdate(
      { slug: payload.slug },
      {
        $set: payload,
      },
      {
        new: true,
        upsert: true,
        lean: true,
      },
    );
  }

  async upsertRegion(payload: { name: string; slug: string }) {
    await connectDb();

    return RegionModel.findOneAndUpdate(
      { slug: payload.slug },
      {
        $set: payload,
      },
      {
        new: true,
        upsert: true,
        lean: true,
      },
    );
  }

  async markRecommendedMovies(slugs: string[]) {
    await connectDb();

    await MovieModel.updateMany(
      { is_recommended: true, slug: { $nin: slugs } },
      { $set: { is_recommended: false } },
      { timestamps: false },
    );

    if (slugs.length > 0) {
      await MovieModel.updateMany(
        { slug: { $in: slugs } },
        { $set: { is_recommended: true } },
        { timestamps: false },
      );
    }
  }

  async findMoviesBySlugs(slugs: string[]) {
    await connectDb();

    return MovieModel.find({ slug: { $in: slugs } }).lean();
  }

  async upsertHomepageList(payload: {
    color: string;
    filter: string;
    movies: Types.ObjectId[];
    name: string;
    order: number;
    slug: string;
    style: number;
  }) {
    await connectDb();

    return HomepageListModel.findOneAndUpdate(
      { slug: payload.slug },
      {
        $set: {
          ...payload,
          cache_at: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        lean: true,
      },
    );
  }

  async createCrawlLog(payload: Record<string, unknown>) {
    await connectDb();
    return CrawlLogModel.create(payload);
  }

  async finishCrawlLog(
    crawlLogId: Types.ObjectId | string,
    payload: Record<string, unknown>,
  ) {
    await connectDb();

    return CrawlLogModel.findByIdAndUpdate(
      crawlLogId,
      {
        $set: payload,
      },
      {
        new: true,
        lean: true,
      },
    );
  }
}
