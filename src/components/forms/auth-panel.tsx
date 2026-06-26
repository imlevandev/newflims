interface AuthPanelProps {
  title: string;
  hint: string;
  submitLabel: string;
}

export function AuthPanel({ title, hint, submitLabel }: AuthPanelProps) {
  return (
    <section className="panel auth-panel">
      <h2>{title}</h2>
      <p className="muted">{hint}</p>
      <form className="auth-form">
        <label>
          Email
          <input name="email" placeholder="ban@example.com" type="email" />
        </label>
        <label>
          Mật khẩu
          <input name="password" placeholder="••••••••" type="password" />
        </label>
        <button type="submit">{submitLabel}</button>
      </form>
    </section>
  );
}
