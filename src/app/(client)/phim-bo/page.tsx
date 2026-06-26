import { CategoryFilter } from "@/features/movie-catalog/components/category-filter";
import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import { moviesService } from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MovieSeriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SeriesMoviesPage({
  searchParams,
}: MovieSeriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = getSingleSearchValue(resolvedSearchParams.category) || undefined;
  const country = getSingleSearchValue(resolvedSearchParams.country) || undefined;
  const sort = getSingleSearchValue(resolvedSearchParams.sort, "latest");
  const page = Number(getSingleSearchValue(resolvedSearchParams.page, "1")) || 1;

  const [categories, regions, movieList] = await Promise.all([
    moviesService.getCategories(),
    moviesService.getRegions(),
    moviesService.getMovieList({
      category,
      country,
      page,
      sort,
      type: "series",
    }),
  ]);

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Phim bộ</span>
          <h1>Kho phim bộ</h1>
          <p>Trang riêng cho phim bộ, giữ route tách biệt đúng theo tab trên header.</p>
        </div>

        <CategoryFilter
          categories={categories}
          current={{ category, country, sort, type: "series" }}
          regions={regions}
        />

        <MovieGrid
          filters={{ category, country, sort }}
          items={movieList.items}
          pagination={movieList.pagination}
          pathname="/phim-bo"
        />
      </section>
    </MovieCatalogLayout>
  );
}
