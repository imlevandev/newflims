import { AppError } from "@/server/common/errors/app-error";
import { env } from "@/server/config/env";

import type {
  OPhimCatalogResponseDto,
  OPhimListResponseDto,
  OPhimMovieDetailResponseDto,
  OPhimTaxonomyDto,
} from "./dto/crawl.dto";

export class OPhimRepository {
  private async fetchJson<T>(path: string) {
    const response = await fetch(`${env.OPHIM_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new AppError(
        "OPhim API is unavailable",
        response.status,
        "OPHIM_API_UNAVAILABLE",
        { path },
      );
    }

    return (await response.json()) as T;
  }

  async getUpdatedMovies(page: number) {
    return this.fetchJson<OPhimListResponseDto>(
      `/danh-sach/phim-moi-cap-nhat?page=${page}`,
    );
  }

  async getCatalogMovies(options: {
    categorySlug?: string;
    countrySlug?: string;
    page: number;
  }) {
    const searchParams = new URLSearchParams({
      page: String(options.page),
    });

    if (options.categorySlug) {
      searchParams.set("category", options.categorySlug);
    }

    if (options.countrySlug) {
      searchParams.set("country", options.countrySlug);
    }

    const payload = await this.fetchJson<OPhimCatalogResponseDto>(
      `/v1/api/danh-sach?${searchParams.toString()}`,
    );

    const pagination = payload.data?.params?.pagination;

    return {
      items: payload.data?.items ?? [],
      pagination: {
        currentPage: pagination?.currentPage ?? options.page,
        totalItems: pagination?.totalItems ?? 0,
        totalItemsPerPage: pagination?.totalItemsPerPage ?? 24,
        totalPages:
          pagination?.totalItems && pagination?.totalItemsPerPage
            ? Math.max(1, Math.ceil(pagination.totalItems / pagination.totalItemsPerPage))
            : options.page,
      },
      status: payload.status === "success",
    } satisfies OPhimListResponseDto;
  }

  async getMovieBySlug(slug: string) {
    return this.fetchJson<OPhimMovieDetailResponseDto>(`/phim/${slug}`);
  }

  async getCategories() {
    return this.fetchJson<OPhimTaxonomyDto[]>("/the-loai");
  }

  async getRegions() {
    return this.fetchJson<OPhimTaxonomyDto[]>("/quoc-gia");
  }
}
