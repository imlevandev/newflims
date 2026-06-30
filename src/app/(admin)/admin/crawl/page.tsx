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
      <section className="admin-hero admin-hero--compact">
        <div className="eyebrow">Crawl phim</div>
        <h1>Vận hành crawl phim trực tiếp</h1>
        <p className="lead">
          Đồng bộ dữ liệu từ OPhim, darkbytes và lịch chiếu.
        </p>
      </section>

      <section className="admin-stats-grid">
        <article className="admin-stat-card admin-stat-card--gold">
          <div className="admin-stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className="admin-stat-card__label">Nguồn phim</div>
          <div className="admin-stat-card__value">OPhim API</div>
          <p className="admin-stat-card__note">Metadata, taxonomy và episodes.</p>
        </article>

        <article className="admin-stat-card admin-stat-card--green">
          <div className="admin-stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
            </svg>
          </div>
          <div className="admin-stat-card__label">Lịch chiếu</div>
          <div className="admin-stat-card__value">Showtimes</div>
          <p className="admin-stat-card__note">Quét showtimes để crawl phim sắp chiếu.</p>
        </article>

        <article className="admin-stat-card admin-stat-card--blue">
          <div className="admin-stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <div className="admin-stat-card__label">Lưu trữ</div>
          <div className="admin-stat-card__value">MongoDB</div>
          <p className="admin-stat-card__note">Movie, Episode, Category, CrawlLog.</p>
        </article>
      </section>

      <section style={{ marginTop: 22 }}>
        <AdminSlugCrawlPanel />
      </section>

      <section className="admin-two-col" style={{ marginTop: 22 }}>
        <AdminShowtimeCrawlPanel
          defaultDateEnd={formatDateInput(endDate)}
          defaultDateStart={formatDateInput(startDate)}
        />
        <AdminCrawlPanel categories={categories} regions={regions} />
      </section>
    </>
  );
}
