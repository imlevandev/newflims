import Link from "next/link";

import { AuthPanel } from "@/components/forms/auth-panel";

export default function LoginPage() {
  return (
    <>
      <AuthPanel
        hint="Trang này thuộc nhóm route (auth) và sẵn sàng cho luồng đăng nhập bằng tài khoản, OAuth hoặc liên kết thần tốc."
        submitLabel="Đăng nhập"
        title="Đăng nhập"
      />
      <section className="panel helper-panel">
        <p className="muted">
          Tiếp tục tới <Link href="/register">đăng ký</Link> hoặc quay về{" "}
          <Link href="/">trang chủ</Link>.
        </p>
      </section>
    </>
  );
}
