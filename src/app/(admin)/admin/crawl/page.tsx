import { SummaryCard } from "@/components/cards/summary-card";
import { SectionHeader } from "@/components/navigation/section-header";
import { AdminCrawlPanel } from "@/features/admin-movies/components/admin-crawl-panel";
import { AdminShowtimeCrawlPanel } from "@/features/admin-movies/components/admin-showtime-crawl-panel";
import { AdminSlugCrawlPanel } from "@/features/admin-movies/components/admin-slug-crawl-panel";
import "@/features/admin-movies/admin-crawl.css";
import { MoviesService } from "@/server/modules/movies/movies.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const moviesService = new MoviesService();

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function AdminMovieCrawlPage() {
  const [categories, regions] = await Promise.all([
    moviesService.getCategories(),
    moviesService.getRegions(),
  ]);

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return (
    <>
      <section className="panel admin-hero admin-hero--compact">
        <SectionHeader
          badge="Crawl phim"
          description="Theo dõi và kích hoạt các luồng đồng bộ dữ liệu phim từ OPhim, darkbytes và cả nhóm phim sắp chiếu trong lịch chiếu."
          title="Vận hành crawl phim trực tiếp trong admin."
        />
      </section>

      <section className="content-grid admin-content-grid">
        <SummaryCard
          label="Nguồn phim"
          note="Crawl metadata, taxonomy và episodes từ OPhim."
          value="OPhim API"
        />
        <SummaryCard
          label="Lịch chiếu"
          note="Quét showtimes theo ngày để lấy đúng các phim sắp chiếu cần ưu tiên."
          value="Showtimes API"
        />
        <SummaryCard
          label="Lưu trữ"
          note="Đồng bộ vào MongoDB qua các model Movie, Episode, Category, Region và CrawlLog."
          value="MongoDB ready"
        />
      </section>

      {/* Slug crawl — nhanh, đơn lẻ */}
      <section style={{ marginTop: 24 }}>
        <AdminSlugCrawlPanel />
      </section>

      {/* Hai panel dưới cùng: Showtime + Batch */}
      <section className="content-grid" style={{ marginTop: 24 }}>
        <AdminShowtimeCrawlPanel
          defaultDateEnd={formatDateInput(endDate)}
          defaultDateStart={formatDateInput(startDate)}
        />
        <AdminCrawlPanel categories={categories} regions={regions} />
      </section>
    </>
  );
}
