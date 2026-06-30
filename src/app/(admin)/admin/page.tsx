import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <>
      {/* Header */}
      <section className="admin-hero">
        <div className="eyebrow">Bảng điều khiển</div>
        <h1>Khu vực quản trị nội dung và vận hành hệ thống</h1>
        <p className="lead">
          Theo dõi trạng thái hệ thống, quản lý dữ liệu phim và kích hoạt các luồng crawl trong một giao diện tập trung.
        </p>
      </section>

      {/* Stats */}
      <section className="admin-stats-grid">
        <article className="admin-stat-card admin-stat-card--blue">
          <div className="admin-stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="admin-stat-card__label">Người dùng</div>
          <div className="admin-stat-card__value">Sẵn sàng</div>
          <p className="admin-stat-card__note">Quản lý tài khoản, phân quyền và kiểm duyệt.</p>
        </article>

        <article className="admin-stat-card admin-stat-card--green">
          <div className="admin-stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="admin-stat-card__label">Crawl phim</div>
          <div className="admin-stat-card__value">Điều khiển</div>
          <p className="admin-stat-card__note">Crawl toàn bộ, theo slug, thể loại hoặc lịch chiếu.</p>
        </article>

        <article className="admin-stat-card admin-stat-card--amber">
          <div className="admin-stat-card__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div className="admin-stat-card__label">Báo cáo</div>
          <div className="admin-stat-card__value">Mở rộng</div>
          <p className="admin-stat-card__note">Thống kê realtime, nhật ký crawl và trạng thái MongoDB.</p>
        </article>
      </section>

      {/* Quick actions */}
      <section className="panel summary-card">
        <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Thao tác nhanh</h2>
        <div className="admin-quick-actions">
          <Link className="admin-action-btn admin-action-btn--primary" href="/admin/crawl">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Crawl phim mới
          </Link>
          <Link className="admin-action-btn" href="/admin/users">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            Quản lý người dùng
          </Link>
          <Link className="admin-action-btn" href="/">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Về trang chủ
          </Link>
        </div>
      </section>
    </>
  );
}
