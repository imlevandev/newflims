'use client';

import { useEffect, useState, useRef } from 'react';

interface ServerUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: ServerUser;
  token: string;
}

function UserIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 24 24" width="1em">
      <path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 10l5 5 5-5z"/>
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

type AuthMode = 'login' | 'register';

export function LoginButton() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cobephim_auth');
      if (raw) setAuth(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function saveAuth(data: { accessToken: string; user: ServerUser }) {
    const state: AuthState = { token: data.accessToken, user: data.user };
    localStorage.setItem('cobephim_auth', JSON.stringify(state));
    setAuth(state);
  }

  function logout() {
    localStorage.removeItem('cobephim_auth');
    setAuth(null);
    setMenuOpen(false);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Login failed');
      saveAuth(data.data);
      setSuccess('Đăng nhập thành công!');
      setTimeout(() => { setIsOpen(false); setSuccess(''); }, 600);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (regPassword !== regConfirm) { setError('Mật khẩu không khớp'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Register failed');
      saveAuth(data.data);
      setSuccess('Đăng ký thành công!');
      setTimeout(() => { setIsOpen(false); setSuccess(''); }, 600);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: '#f4f6fb', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  };

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#11151d',
    fontSize: '1rem', fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
    marginTop: '8px', opacity: loading ? 0.7 : 1,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: 'rgba(255,255,255,0.6)',
    fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px',
  };

  // ---- Logged in: show user button + dropdown ----
  if (auth) {
    const initial = auth.user.name?.charAt(0)?.toUpperCase() || '?';
    return (
      <div className="logged-user-wrapper" ref={menuRef} style={{ position: 'relative' }}>
        <button
          className="logged-user-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '40px', padding: '6px 16px 6px 6px', cursor: 'pointer',
            color: '#f4f6fb', fontSize: '0.9rem', fontWeight: 600,
          }}
        >
          <span style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            color: '#11151d', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.95rem', fontWeight: 800, flexShrink: 0,
          }}>
            {initial}
          </span>
          <span className="d-none d-lg-inline">{auth.user.name}</span>
          <ChevronDown />
        </button>

        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setMenuOpen(false)} />
            <style>{userDropdownCss}</style>
            <div className="cobe-dd">
              <div className="cobe-dd-head">
                <span style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  color: '#11151d', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.15rem', fontWeight: 800, flexShrink: 0,
                }}>
                  {initial}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="cobe-dd-name">{auth.user.name}</div>
                  <div className="cobe-dd-email">{auth.user.email}</div>
                </div>
              </div>

              <div className="cobe-dd-sep" />

              <a className="cobe-dd-item" href="/tai-khoan">
                <AccountIcon /> Thông tin tài khoản
              </a>
              <a className="cobe-dd-item" href="/danh-sach/quan-tam">
                <BookmarkIcon /> Danh sách quan tâm
              </a>
              <a className="cobe-dd-item" href="/danh-sach/yeu-thich">
                <HeartIcon /> Danh sách yêu thích
              </a>

              <div className="cobe-dd-sep" />

              <button className="cobe-dd-item cobe-dd-logout" onClick={logout}>
                <LogoutIcon /> Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ---- Not logged in: show login button + modal ----
  return (
    <>
      <button
        aria-label="Đăng nhập"
        className="button-user button-login"
        type="button"
        onClick={() => { setMode('login'); setIsOpen(true); }}
      >
        <div className="line-center">
          <UserIcon />
          <span>Thành viên</span>
        </div>
      </button>

      {isOpen && (
        <div
          className="login-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div style={{
            background: 'rgba(20,22,30,0.98)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '36px 32px',
            width: '100%',
            maxWidth: '420px',
            position: 'relative',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng"
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: 'none',
                color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CloseIcon />
            </button>

            {(error || success) && (
              <div style={{ marginBottom: '16px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', background: error ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: error ? '#fca5a5' : '#86efac', textAlign: 'center' }}>
                {error || success}
              </div>
            )}

            {mode === 'login' ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4f6fb', margin: '0 0 8px' }}>
                    Đăng nhập
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>
                    Chào mừng bạn trở lại!
                  </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="text" placeholder="Nhập email" autoComplete="username" style={inputStyle} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Mật khẩu</label>
                    <input type="password" placeholder="Nhập mật khẩu" autoComplete="current-password" style={inputStyle} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
                      <input type="checkbox" style={{ accentColor: '#f5b532' }} /> Ghi nhớ
                    </label>
                    <a href="#" style={{ color: '#f5b532', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>Quên mật khẩu?</a>
                  </div>
                  <button type="submit" style={btnStyle}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Chưa có tài khoản? </span>
                  <button onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: '#f5b532', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    Đăng ký ngay
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f4f6fb', margin: '0 0 8px' }}>
                    Đăng ký
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>
                    Tạo tài khoản để trải nghiệm tốt nhất
                  </p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'grid', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Tên hiển thị</label>
                    <input type="text" placeholder="Nhập tên của bạn" style={inputStyle} value={regName} onChange={(e) => setRegName(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" placeholder="Nhập email" autoComplete="email" style={inputStyle} value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Mật khẩu</label>
                    <input type="password" placeholder="Nhập mật khẩu" autoComplete="new-password" style={inputStyle} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nhập lại mật khẩu</label>
                    <input type="password" placeholder="Nhập lại mật khẩu" autoComplete="new-password" style={inputStyle} value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} />
                  </div>
                  <button type="submit" style={btnStyle}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>Đã có tài khoản? </span>
                  <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#f5b532', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    Đăng nhập
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const userDropdownCss = `
.cobe-dd {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: rgba(22,24,34,0.98);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset;
  min-width: 250px;
  padding: 6px;
  z-index: 1001;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  animation: ddIn 0.2s ease;
}
@keyframes ddIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.cobe-dd-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin: 2px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
}
.cobe-dd-name {
  font-weight: 700;
  color: #f4f6fb;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cobe-dd-email {
  color: rgba(255,255,255,0.4);
  font-size: 0.78rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cobe-dd-sep {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 6px 10px;
}
.cobe-dd-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  margin: 2px;
  border-radius: 12px;
  color: rgba(255,255,255,0.7);
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}
.cobe-dd-item:hover {
  background: rgba(255,255,255,0.08);
  color: #f4f6fb;
}
.cobe-dd-logout {
  color: #f87171 !important;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-family: inherit;
}
.cobe-dd-logout:hover {
  background: rgba(248,113,113,0.12);
}
`;
