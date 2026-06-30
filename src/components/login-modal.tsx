'use client';

import { useState, useEffect, useCallback } from 'react';

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Expose open/close globally
  useEffect(() => {
    (window as any).__openLoginModal = open;
    (window as any).__closeLoginModal = close;
    return () => {
      delete (window as any).__openLoginModal;
      delete (window as any).__closeLoginModal;
    };
  }, [open, close]);

  // Listen for header button clicks
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.button-login')) {
        e.preventDefault();
        e.stopPropagation();
        open();
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [open]);

  if (!isOpen) return null;

  return (
    <div
      className="login-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
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
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Dong"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: 'none',
            color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{
            fontSize: '1.5rem', fontWeight: 800, color: '#f4f6fb',
            margin: '0 0 8px',
          }}>
            Dang nhap
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>
            Chao mung ban tro lai!
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px',
            }}>
              Email hoac SDT
            </label>
            <input
              type="text"
              placeholder="Nhap email hoac so dien thoai"
              autoComplete="username"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#f4f6fb',
                fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block', color: 'rgba(255,255,255,0.6)',
              fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px',
            }}>
              Mat khau
            </label>
            <input
              type="password"
              placeholder="Nhap mat khau"
              autoComplete="current-password"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)', color: '#f4f6fb',
                fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
              <input type="checkbox" style={{ accentColor: '#f5b532' }} />
              Ghi nho
            </label>
            <a href="#" style={{ color: '#f5b532', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Quen mat khau?
            </a>
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: '14px', borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              color: '#11151d', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', marginTop: '8px',
            }}
          >
            Dang nhap
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '24px', paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>
            Chua co tai khoan?{' '}
          </span>
          <a href="/register" style={{ color: '#f5b532', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
            Dang ky ngay
          </a>
        </div>
      </div>
    </div>
  );
}
