import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { getHomepageCollectionOrNotFound } from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getHomepageCollectionOrNotFound(slug);

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <div className="movie-section-head">
          <span className="movie-section-chip">Collection</span>
          <h1>{collection.name}</h1>
          <p>Danh sách này lấy từ collection trang chủ đã lưu trong MongoDB sau mỗi lần crawl.</p>
        </div>

        <MovieGrid items={collection.movies} pathname={`/c/${slug}`} />
      </section>
    </MovieCatalogLayout>
  );
}
