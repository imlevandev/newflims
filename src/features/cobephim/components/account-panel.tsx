'use client';

import { useEffect, useState } from 'react';

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function VipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

export function AccountPanel() {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cobephim_auth');
      if (raw) {
        setUser(JSON.parse(raw).user);
      } else {
        window.location.href = '/';
      }
    } catch {}
  }, []);

  if (!mounted || !user) return null;

  const initial = user.name?.charAt(0)?.toUpperCase() || '?';

  function handleLogout() {
    localStorage.removeItem('cobephim_auth');
    window.location.href = '/';
  }

  return (
    <>
      <style>{accCss}</style>
      <div className="acc-container">
        <div className="acc-grid">
          <div className="acc-sidebar">
            <div className="acc-sidebar-user">
              <span className="acc-avatar">{initial}</span>
              <div className="acc-user-text">
                <div className="acc-user-name">{user.name}</div>
                <div className="acc-user-role">{user.role}</div>
              </div>
            </div>

            <a href="/tai-khoan" className="acc-link acc-link--active">
              <AccountIcon /> Thông tin tài khoản
            </a>
            <a href="/tai-khoan/binh-luan" className="acc-link">
              <CommentIcon /> Bình luận
            </a>
            <a href="/tai-khoan/doi-mat-khau" className="acc-link">
              <PasswordIcon /> Đổi mật khẩu
            </a>
            <a href="/tai-khoan/nang-cap" className="acc-link">
              <VipIcon /> Nâng cấp tài khoản VIP
            </a>

            <div className="acc-sidebar-spacer" />
            <div className="acc-sep" />
            <button onClick={handleLogout} className="acc-link acc-link--logout">
              <LogoutIcon /> Đăng xuất
            </button>
          </div>

          <div className="acc-content">
            <h2 className="acc-title">Thông tin tài khoản</h2>

            <form onSubmit={(e) => e.preventDefault()} className="acc-form">
              <div>
                <label className="acc-label">Họ và tên</label>
                <input type="text" defaultValue={user.name} className="acc-input" />
              </div>
              <div>
                <label className="acc-label">Email</label>
                <input type="email" defaultValue={user.email} disabled className="acc-input acc-input--disabled" />
              </div>
              <div>
                <label className="acc-label">Giới tính</label>
                <div className="acc-radio-group">
                  {["Nam", "Nữ", "Khác"].map((g) => (
                    <label key={g} className="acc-radio-label">
                      <input type="radio" name="gender" defaultChecked={g === "Nam"} className="acc-radio" />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="acc-btn">Cập nhật</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const accCss = `
.acc-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
.acc-grid {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 28px;
  align-items: stretch;
}
.acc-sidebar {
  background: rgba(22,24,34,0.8);
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 20px 12px;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}
.acc-sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 8px;
  flex-shrink: 0;
}
.acc-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #11151d;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 800; flex-shrink: 0;
}
.acc-user-text { min-width: 0; }
.acc-user-name {
  font-weight: 700; color: #f4f6fb; font-size: 0.9rem;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.acc-user-role {
  color: rgba(255,255,255,0.4); font-size: 0.78rem;
  text-transform: capitalize;
}
.acc-link {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px;
  color: rgba(255,255,255,0.55); font-size: 0.88rem;
  font-weight: 500; text-decoration: none;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.acc-link:hover { background: rgba(255,255,255,0.06); color: #f4f6fb; }
.acc-link--active { background: rgba(245,181,50,0.12) !important; color: #f5b532 !important; }
.acc-link--logout {
  color: #f87171 !important;
  background: none; border: none; cursor: pointer;
  width: 100%; text-align: left; font-family: inherit; font-size: 0.88rem;
  flex-shrink: 0;
}
.acc-link--logout:hover { background: rgba(248,113,113,0.12); }
.acc-sidebar-spacer { flex: 1; min-height: 0; }
.acc-sep {
  height: 1px; background: rgba(255,255,255,0.06);
  margin: 8px 12px;
  flex-shrink: 0;
}
.acc-content {
  background: rgba(22,24,34,0.8);
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 32px;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.acc-title {
  font-size: 1.4rem; font-weight: 800;
  color: #f4f6fb; margin: 0 0 28px;
  flex-shrink: 0;
}
.acc-form {
  display: grid;
  gap: 20px;
  max-width: 480px;
}
.acc-label {
  display: block; color: rgba(255,255,255,0.5);
  font-size: 0.85rem; font-weight: 600; margin-bottom: 8px;
}
.acc-input {
  width: 100%; padding: 13px 16px; border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
  color: #f4f6fb; font-size: 0.95rem; outline: none; box-sizing: border-box;
}
.acc-input:focus { border-color: rgba(245,181,50,0.4); }
.acc-input--disabled { opacity: 0.5; cursor: not-allowed; }
.acc-radio-group { display: flex; gap: 20px; }
.acc-radio { accent-color: #f5b532; width: 18px; height: 18px; }
.acc-radio-label {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  color: rgba(255,255,255,0.7); font-size: 0.9rem;
}
.acc-btn {
  padding: 12px 32px; border-radius: 12px; border: none;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #11151d; font-size: 0.95rem; font-weight: 700;
  cursor: pointer; justify-self: start; margin-top: 8px;
}
.acc-btn:hover { opacity: 0.9; }
@media (max-width: 768px) {
  .acc-grid {
    grid-template-columns: 1fr;
  }
  .acc-sidebar { height: auto; }
}
`;
