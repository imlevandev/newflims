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

interface RegionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RegionPage({
  params,
  searchParams,
}: RegionPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const category = getSingleSearchValue(resolvedSearchParams.category) || undefined;
  const sort = getSingleSearchValue(resolvedSearchParams.sort, "latest");
  const type = getSingleSearchValue(resolvedSearchParams.type) || undefined;
  const page = Number(getSingleSearchValue(resolvedSearchParams.page, "1")) || 1;

  const [categories, regions, movieList] = await Promise.all([
    getCachedCategories(),
    getCachedRegions(),
    getCachedMovieList({
      category,
      country: slug,
      page,
      sort,
      type,
    }),
  ]);

  const currentRegion = regions.find((region) => region.slug === slug);

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Quốc gia</span>
          <h1>{currentRegion?.name || "Phim theo quốc gia"}</h1>
          <p>Duyệt phim theo khu vực và quốc gia đã crawl từ taxonomy của OPhim.</p>
        </div>

        <CategoryFilter
          categories={categories}
          current={{ category, country: slug, sort, type }}
          regions={regions}
        />

        <MovieGrid
          filters={{ category, sort, type }}
          items={movieList.items}
          pagination={movieList.pagination}
          pathname={`/quoc-gia/${slug}`}
        />
      </section>
    </MovieCatalogLayout>
  );
}
