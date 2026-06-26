import { CategoryFilter } from "@/features/movie-catalog/components/category-filter";
import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import { moviesService } from "@/features/movie-catalog/lib/movie-catalog-data";

interface MovieListPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MovieListPage({
  searchParams,
}: MovieListPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = getSingleSearchValue(resolvedSearchParams.category) || undefined;
  const country = getSingleSearchValue(resolvedSearchParams.country) || undefined;
  const sort = getSingleSearchValue(resolvedSearchParams.sort, "latest");
  const type = getSingleSearchValue(resolvedSearchParams.type) || undefined;
  const page = Number(getSingleSearchValue(resolvedSearchParams.page, "1")) || 1;

  const [categories, regions, movieList] = await Promise.all([
    moviesService.getCategories(),
    moviesService.getRegions(),
    moviesService.getMovieList({
      category,
      country,
      page,
      sort,
      type,
    }),
  ]);

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <CategoryFilter
          categories={categories}
          current={{ category, country, sort, type }}
          regions={regions}
        />

        <MovieGrid
          filters={{ category, country, sort, type }}
          items={movieList.items}
          pagination={movieList.pagination}
          pathname="/danh-sach"
        />
      </section>
    </MovieCatalogLayout>
  );
}
