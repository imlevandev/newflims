import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import { moviesService } from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = getSingleSearchValue(resolvedSearchParams.q).trim();
  const page = Number(getSingleSearchValue(resolvedSearchParams.page, "1")) || 1;

  const searchResult = query
    ? await moviesService.searchMovies(query, page, 20)
    : {
        items: [],
        pagination: {
          currentPage: 1,
          totalItems: 0,
          totalItemsPerPage: 20,
          totalPages: 1,
        },
      };

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Tìm kiếm</span>
          <h1>{query ? `Kết quả cho "${query}"` : "Nhập từ khóa để tìm phim"}</h1>
          <p>
            Search dùng full-text index trong MongoDB trên `name` và `origin_name`, nên frontend chỉ nói
            chuyện với backend Next.js nội bộ.
          </p>
        </div>

        <MovieGrid
          emptyDescription="Hãy thử tên tiếng Việt, tên gốc hoặc một từ khóa ngắn hơn."
          emptyTitle="Không tìm thấy kết quả"
          filters={{ q: query }}
          items={searchResult.items}
          pagination={searchResult.pagination}
          pathname="/tim-kiem"
        />
      </section>
    </MovieCatalogLayout>
  );
}
