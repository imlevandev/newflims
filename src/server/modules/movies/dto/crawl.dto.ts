export interface OPhimPaginationDto {
  currentPage: number;
  totalItems: number;
  totalItemsPerPage: number;
  totalPages: number;
}

export interface OPhimListItemDto {
  _id: string;
  name: string;
  origin_name: string;
  slug: string;
  thumb_url: string;
  poster_url: string;
  year: number;
  tmdb?: {
    id?: string;
    season?: number;
    type?: string;
    vote_average?: number;
    vote_count?: number;
  };
  imdb?: {
    id?: string | null;
    vote_average?: number;
    vote_count?: number;
  };
  modified?: {
    time?: string;
  };
}

export interface OPhimListResponseDto {
  items: OPhimListItemDto[];
  pagination: OPhimPaginationDto;
  pathImage?: string;
  status: boolean;
}

export interface OPhimCatalogResponseDto {
  data: {
    items: OPhimListItemDto[];
    params?: {
      filterCategory?: string[];
      filterCountry?: string[];
      filterType?: string;
      pagination?: {
        currentPage: number;
        pageRanges?: number;
        totalItems: number;
        totalItemsPerPage: number;
      };
    };
  };
  message: string;
  status: string;
}

export interface OPhimTaxonomyDto {
  _id: string;
  name: string;
  slug: string;
}

export interface OPhimEpisodeItemDto {
  filename?: string;
  link_embed?: string;
  link_m3u8?: string;
  name: string;
  slug: string;
}

export interface OPhimEpisodeServerDto {
  is_ai?: boolean;
  server_data: OPhimEpisodeItemDto[];
  server_name: string;
}

export interface OPhimMovieDetailDto {
  _id: string;
  actor?: string[];
  category?: Array<{ id: string; name: string; slug: string }>;
  content?: string;
  country?: Array<{ id: string; name: string; slug: string }>;
  created?: { time?: string };
  director?: string[];
  episode_current?: string;
  episode_total?: string;
  imdb?: {
    id?: string | null;
    vote_average?: number;
    vote_count?: number;
  };
  lang?: string;
  modified?: { time?: string };
  name: string;
  notify?: string;
  origin_name?: string;
  poster_url?: string;
  quality?: string;
  showtimes?: string;
  slug: string;
  status?: string;
  thumb_url?: string;
  time?: string;
  tmdb?: {
    id?: string;
    season?: number;
    type?: string;
    vote_average?: number;
    vote_count?: number;
  };
  trailer_url?: string;
  type?: string;
  view?: number;
  year?: number;
}

export interface OPhimMovieDetailResponseDto {
  episodes: OPhimEpisodeServerDto[];
  movie: OPhimMovieDetailDto;
  status: boolean;
}

export interface CrawlRequestDto {
  categorySlug?: string;
  countrySlug?: string;
  crawlMode?: "all" | "category" | "country";
  pageEnd?: number;
  pageStart?: number;
  secretKey?: string;
}

export interface CrawlResultDto {
  categoriesSynced: number;
  errorMovies: number;
  hotMoviesSynced: number;
  homepageListsSynced: number;
  moviesCreated: number;
  moviesUpdated: number;
  pagesProcessed: number;
  regionsSynced: number;
}

export interface ShowtimeCrawlRequestDto {
  dateEnd?: string;
  dateStart?: string;
  secretKey?: string;
}

export interface ShowtimeCrawlResultDto extends CrawlResultDto {
  daysProcessed: number;
  showtimeEntriesFound: number;
  uniqueMoviesQueued: number;
}
