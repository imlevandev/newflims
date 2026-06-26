import Link from "next/link";

import { AuthPanel } from "@/components/forms/auth-panel";

export default function RegisterPage() {
  return (
    <>
      <AuthPanel
        hint="Dùng trang này cho tạo tài khoản, lời mời tham gia hoặc biểu mẫu onboarding."
        submitLabel="Tạo tài khoản"
        title="Đăng ký"
      />
      <section className="panel helper-panel">
        <p className="muted">
          Đã có tài khoản? <Link href="/login">Đăng nhập tại đây</Link>.
        </p>
      </section>
    </>
  );
}
