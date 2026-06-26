import { StackList } from "@/components/cards/stack-list";
import { SectionHeader } from "@/components/navigation/section-header";

const adminUserFlow = [
  "Lấy danh sách người dùng từ GET /api/v1/users",
  "Tạo người dùng mới từ POST /api/v1/users",
  "Bổ sung cập nhật vai trò và khóa tài khoản ở bước tiếp theo",
];

export default function AdminUsersPage() {
  return (
    <>
      <section className="panel admin-hero admin-hero--compact">
        <SectionHeader
          badge="Người dùng"
          description="Khu vực này dùng để quản lý danh sách tài khoản, trạng thái truy cập và các tác vụ phân quyền sau này."
          title="Quản trị người dùng trong hệ thống."
        />
      </section>

      <StackList items={adminUserFlow} title="Luồng quản lý người dùng" />
    </>
  );
}
