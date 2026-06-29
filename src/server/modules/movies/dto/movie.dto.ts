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
  style?: number;
  order?: number;
  filter?: string;
  movies: RemoteMovieDto[];
}

export interface HomepageFeedDto {
  hotMovies: RemoteMovieDto[];
  collections: HomepageMovieCollectionDto[];
}

export interface HomepageTopicDto {
  id: number | string;
  name: string;
  slug: string;
  color?: string;
  order?: number;
  filter?: string;
}

export interface HomepageTopicsDto {
  items: HomepageTopicDto[];
  more?: number;
}

export interface HomepageMenuItemDto {
  key: string;
  label: string;
  data?: string | null;
  icon?: string | null;
  children?: HomepageMenuItemDto[];
}

export interface HomepageBannerDto {
  id: number | string;
  image?: string;
  link?: string;
  type?: string;
}

export interface HomepageCommentUserDto {
  id: number | string;
  name: string;
  gender?: string;
  avatar?: string;
  roles?: string;
  is_premium?: boolean;
}

export interface HomepageCommentMovieDto {
  id: number | string;
  name: string;
  slug: string;
}

export interface HomepageCommentDto {
  id: number | string;
  content: string;
  createdAt: string;
  user?: HomepageCommentUserDto;
  movie?: HomepageCommentMovieDto;
  total_children?: number;
}

export interface HomepageRankedCategoryDto {
  id: number | string;
  name: string;
  slug: string;
  current_rank: number;
  old_rank?: number | null;
  totalViews?: number | string;
}

export interface HomepageRankedMovieDto {
  id: number | string;
  name: string;
  slug: string;
  current_rank: number;
  old_rank?: number | null;
  view_total?: number;
  rating_star?: string;
  rating_count?: number;
  comments_count?: number;
  thumbnail?: string;
  poster?: string;
}

export interface HomepageCommentsDto {
  topComments: HomepageCommentDto[];
  newComments: HomepageCommentDto[];
  categoriesHot: HomepageRankedCategoryDto[];
  moviesHot: HomepageRankedMovieDto[];
  moviesHotByComment: HomepageRankedMovieDto[];
}

export interface HomepageApiFeedDto extends HomepageFeedDto {
  topics: HomepageTopicsDto;
  menus: HomepageMenuItemDto[];
  banners: HomepageBannerDto[];
  comments: HomepageCommentsDto;
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
