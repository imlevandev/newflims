import { CategoryFilter } from "@/features/movie-catalog/components/category-filter";
import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import { moviesService } from "@/features/movie-catalog/lib/movie-catalog-data";

interface MovieSinglePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SingleMoviesPage({
  searchParams,
}: MovieSinglePageProps) {
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
      type: "movie",
    }),
  ]);

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Phim lẻ</span>
          <h1>Kho phim lẻ</h1>
          <p>Trang riêng cho phim lẻ, đi đúng route tách riêng theo tab trên header.</p>
        </div>

        <CategoryFilter
          categories={categories}
          current={{ category, country, sort, type: "movie" }}
          regions={regions}
        />

        <MovieGrid
          filters={{ category, country, sort }}
          items={movieList.items}
          pagination={movieList.pagination}
          pathname="/phim-le"
        />
      </section>
    </MovieCatalogLayout>
  );
}
