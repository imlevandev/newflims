export interface RemoteMovieCategoryDto {
  id: number | string;
  name: string;
  slug: string;
}

export interface RemoteMovieRegionDto {
  id: number | string;
  name: string;
  slug: string;
}

export interface RemoteMovieEpisodeDto {
  id: number | string;
  name: string;
  server: string;
  season_number: number;
  movieId: number | string;
  createdAt: string;
}

export interface RemoteMovieDto {
  id: number | string;
  name: string;
  origin_name: string;
  slug: string;
  description: string;
  actor?: string[];
  thumbnail: string;
  director?: string[];
  poster: string;
  banner?: string;
  banner_background?: string;
  type: string;
  status?: string;
  trailer_url: string;
  episode_time: string;
  episode_total?: string;
  episode_current: string;
  showtime?: string;
  quality: string;
  publish_year: number;
  imdb_rating: string;
  rating: string;
  image_name: string | null;
  is_recommended?: boolean;
  latestEpisodes: RemoteMovieEpisodeDto[];
  categories: RemoteMovieCategoryDto[];
  regions?: RemoteMovieRegionDto[];
  view_total?: number;
  view_day?: number;
  view_week?: number;
  view_month?: number;
  updatedAt?: string;
}

export interface MovieEpisodeSourceDto {
  name: string;
  slug: string;
  embed: string;
  m3u8: string;
}

export interface MovieEpisodeServerDto {
  id: string;
  server_name: string;
  server_slug: string;
  items: MovieEpisodeSourceDto[];
}

export interface MovieDetailDto {
  movie: RemoteMovieDto;
  episodes: MovieEpisodeServerDto[];
}

export interface HomepageMovieCollectionDto {
  id: number | string;
  name: string;
  slug: string;
  color: string;
  movies: RemoteMovieDto[];
}

export interface HomepageFeedDto {
  hotMovies: RemoteMovieDto[];
  collections: HomepageMovieCollectionDto[];
}

export interface RemoteMovieShowtimeDto {
  id: number | string;
  movie_id: number | string;
  episode: string;
  show_date: string;
  show_time: string | null;
  createdAt?: string;
  updatedAt?: string;
  movie?: RemoteMovieDto;
}

export interface MovieListQueryDto {
  category?: string;
  country?: string;
  limit?: number;
  page?: number;
  sort?: string;
  type?: string;
}

export interface PaginationDto {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  totalItemsPerPage: number;
}

export interface MovieListResponseDto {
  items: RemoteMovieDto[];
  pagination: PaginationDto;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
}

export interface RegionDto {
  id: string;
  name: string;
  slug: string;
}
