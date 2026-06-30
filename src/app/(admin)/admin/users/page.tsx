export default function AdminUsersPage() {
  const steps = [
    { title: "Danh sách", desc: "GET /api/v1/users — Lấy toàn bộ người dùng" },
    { title: "Tạo mới", desc: "POST /api/v1/users — Thêm tài khoản mới" },
    { title: "Phân quyền", desc: "PATCH /api/v1/users/:id — Cập nhật vai trò, khóa" },
  ];

  return (
    <>
      <section className="admin-hero admin-hero--compact">
        <div className="eyebrow">Người dùng</div>
        <h1>Quản trị người dùng trong hệ thống</h1>
        <p className="lead">
          Khu vực này dùng để quản lý danh sách tài khoản, trạng thái truy cập và phân quyền.
        </p>
      </section>

      <section className="panel list-card">
        <h2>Luồng quản lý</h2>
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          {steps.map((step, i) => (
            <div className="admin-user-step" key={step.title}>
              <span className="admin-user-step__num">{i + 1}</span>
              <div>
                <div className="admin-user-step__title">{step.title}</div>
                <p className="admin-user-step__desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
