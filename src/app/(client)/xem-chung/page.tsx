import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { moviesService } from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WatchTogetherPage() {
  const movieList = await moviesService.getMovieList({
    limit: 24,
    page: 1,
    sort: "popular",
  });

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Xem chung</span>
          <h1>Phim nổi bật để xem cùng nhau</h1>
          <p>Không gian riêng cho nhóm nội dung nổi bật, không dùng chung route danh sách tổng.</p>
        </div>

        <MovieGrid items={movieList.items} pagination={movieList.pagination} pathname="/xem-chung" />
      </section>
    </MovieCatalogLayout>
  );
}
