import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="shell shell-narrow">
      <section className="hero panel compact-hero">
        <div className="eyebrow">Khu vực tài khoản</div>
        <h1>Trang đăng nhập và đăng ký được tách riêng khỏi phần còn lại của ứng dụng.</h1>
        <p className="lead">
          Gom toàn bộ luồng đăng nhập, đăng ký, quên mật khẩu và xác minh về một nhóm route riêng
          để quản lý truy cập rõ ràng hơn.
        </p>
      </section>
      <section className="single-column">{children}</section>
    </main>
  );
}
