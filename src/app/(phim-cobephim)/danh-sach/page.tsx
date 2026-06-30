import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import { getCachedMovieList } from "@/features/movie-catalog/lib/movie-catalog-data";
import { CobephimMovieListPage } from "@/features/cobephim/components/cobephim-movie-list-page";

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(getSingleSearchValue(sp.page, "1")) || 1;
  const type = undefined;

  const movieList = await getCachedMovieList({ page, sort: "latest", type });

  const pageNumbers = movieList.pagination
    ? Array.from(new Set([
        1,
        movieList.pagination.currentPage - 1,
        movieList.pagination.currentPage,
        movieList.pagination.currentPage + 1,
        movieList.pagination.totalPages,
      ].filter((p) => p >= 1 && p <= movieList.pagination.totalPages)))
      .sort((a, b) => a - b)
    : [];

  return (
    <CobephimMovieListPage
      currentPage={page}
      currentType={type}
      items={movieList.items}
      pageNumbers={pageNumbers}
      pathname="/danh-sach"
      totalPages={movieList.pagination?.totalPages || 1}
    />
  );
}
