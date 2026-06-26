import type { MovieListResponseDto, RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import { buildHref } from "../lib/movie-catalog-format";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  emptyDescription?: string;
  emptyTitle?: string;
  filters?: Record<string, string | number | undefined>;
  items: RemoteMovieDto[];
  pagination?: MovieListResponseDto["pagination"];
  pathname: string;
}

function buildPageHref(
  pathname: string,
  filters: Record<string, string | number | undefined> | undefined,
  page: number,
) {
  return buildHref(pathname, {
    ...filters,
    page,
  });
}

export function MovieGrid({
  emptyDescription = "Thử đổi bộ lọc hoặc tìm kiếm từ khóa khác.",
  emptyTitle = "Chưa có phim phù hợp",
  filters,
  items,
  pagination,
  pathname,
}: MovieGridProps) {
  if (items.length === 0) {
    return (
      <div className="movie-empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyDescription}</p>
      </div>
    );
  }

  const pageNumbers = pagination
    ? Array.from(
        new Set(
          [
            1,
            pagination.currentPage - 1,
            pagination.currentPage,
            pagination.currentPage + 1,
            pagination.totalPages,
          ].filter((page) => page >= 1 && page <= pagination.totalPages),
        ),
      ).sort((left, right) => left - right)
    : [];

  return (
    <>
      <div className="movie-grid">
        {items.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {pagination && pagination.totalPages > 1 ? (
        <nav aria-label="Phân trang" className="movie-pagination">
          <a
            aria-disabled={pagination.currentPage <= 1}
            className={pagination.currentPage <= 1 ? "is-disabled" : ""}
            href={buildPageHref(pathname, filters, Math.max(1, pagination.currentPage - 1))}
          >
            Trang trước
          </a>
          <div className="movie-pagination__pages">
            {pageNumbers.map((page) => (
              <a
                className={page === pagination.currentPage ? "is-active" : ""}
                href={buildPageHref(pathname, filters, page)}
                key={page}
              >
                {page}
              </a>
            ))}
          </div>
          <a
            aria-disabled={pagination.currentPage >= pagination.totalPages}
            className={pagination.currentPage >= pagination.totalPages ? "is-disabled" : ""}
            href={buildPageHref(
              pathname,
              filters,
              Math.min(pagination.totalPages, pagination.currentPage + 1),
            )}
          >
            Trang sau
          </a>
        </nav>
      ) : null}
    </>
  );
}
