import { SummaryCard } from "@/components/cards/summary-card";
import { SectionHeader } from "@/components/navigation/section-header";

export default function AdminDashboardPage() {
  return (
    <>
      <section className="panel admin-hero">
        <SectionHeader
          badge="Bảng điều khiển"
          description="Theo dõi nhanh trạng thái hệ thống, khu quản trị dữ liệu phim và các luồng vận hành chính trong một giao diện đồng bộ."
          title="Khu vực quản trị nội dung và vận hành hệ thống."
        />
      </section>

      <section className="content-grid admin-content-grid">
        <SummaryCard
          label="Người dùng"
          note="Quản lý danh sách người dùng, phân quyền và mở rộng luồng kiểm duyệt sau này."
          value="Sẵn sàng quản lý"
        />
        <SummaryCard
          label="Crawl phim"
          note="Trigger crawl toàn bộ hoặc theo thể loại, quốc gia trực tiếp từ admin."
          value="Điều khiển tập trung"
        />
        <SummaryCard
          label="Báo cáo"
          note="Có thể nối thêm thống kê realtime, nhật ký crawl và trạng thái dữ liệu MongoDB."
          value="Mở rộng dễ dàng"
        />
      </section>
    </>
  );
}
