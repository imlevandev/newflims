export default function AdminUsersPage() {
  const steps = [
    { title: "Danh sách", desc: "GET /api/v1/users — Lấy toàn bộ người dùng" },
    { title: "Tạo mới", desc: "POST /api/v1/users — Thêm tài khoản mới" },
    { title: "Phân quyền", desc: "PATCH /api/v1/users/:id — Cập nhật vai trò, khóa tài khoản" },
  ];

  return (
    <>
      <section className="admin-hero admin-hero--compact">
        <div className="eyebrow">Người dùng</div>
        <h1>Quản trị người dùng trong hệ thống</h1>
        <p className="lead">
          Khu vực này dùng để quản lý danh sách tài khoản, trạng thái truy cập và các tác vụ phân quyền.
        </p>
      </section>

      <section className="panel list-card">
        <h2>Luồng quản lý người dùng</h2>
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {steps.map((step, i) => (
            <div
              key={step.title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 18px",
                borderRadius: 14,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <div>
                <strong style={{ color: "#0f172a", fontSize: "0.95rem" }}>{step.title}</strong>
                <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: "0.84rem" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
