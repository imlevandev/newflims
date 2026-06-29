import { CategoryFilter } from "@/features/movie-catalog/components/category-filter";
import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import {
  getCachedCategories,
  getCachedMovieList,
  getCachedRegions,
} from "@/features/movie-catalog/lib/movie-catalog-data";

export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const country = getSingleSearchValue(resolvedSearchParams.country) || undefined;
  const sort = getSingleSearchValue(resolvedSearchParams.sort, "latest");
  const type = getSingleSearchValue(resolvedSearchParams.type) || undefined;
  const page = Number(getSingleSearchValue(resolvedSearchParams.page, "1")) || 1;

  const [categories, regions, movieList] = await Promise.all([
    getCachedCategories(),
    getCachedRegions(),
    getCachedMovieList({
      category: slug,
      country,
      page,
      sort,
      type,
    }),
  ]);

  const currentCategory = categories.find((category) => category.slug === slug);

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Thể loại</span>
          <h1>{currentCategory?.name || "Danh mục phim"}</h1>
          <p>Lọc phim theo thể loại với dữ liệu đã được đồng bộ từ OPhim vào MongoDB.</p>
        </div>

        <CategoryFilter
          categories={categories}
          current={{ category: slug, country, sort, type }}
          regions={regions}
        />

        <MovieGrid
          filters={{ country, sort, type }}
          items={movieList.items}
          pagination={movieList.pagination}
          pathname={`/the-loai/${slug}`}
        />
      </section>
    </MovieCatalogLayout>
  );
}
