import type { ReactNode } from "react";

// Layout độc lập hoàn toàn - giống hệt layout.tsx của dự án Tailwind mẫu
// Không kế thừa globals.css của workspace
export default function CobephimLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"
        />
        {/* CSS từ cobephim.pw CDN - y chang dự án Tailwind mẫu */}
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/7e7d96b1e6991756.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/b3d2bc2a41fef9ee.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/bab9322a06b792b3.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/fb9d7258d25d1688.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/8702ba90b2197423.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/2e1770d6816c0de0.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/cd6d44333c72200a.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/a2d010616312a546.css" />
        <link rel="stylesheet" href="https://cobephim.pw/_next/static/css/c0e142c7abbd44f1.css" />
        <link
          rel="preload"
          href="https://cobephim.pw/_next/static/media/e4af272ccee01ff0-s.p.woff2"
          as="font"
          crossOrigin=""
          type="font/woff2"
        />
        <style>{`
          body { margin: 0; background: #0a0a0e; }

          /* Gạch chân tab thẳng phẳng - không cong */
          .v-tabs .nav-link::after,
          .v-tabs .nav-link::before,
          .cg-tabs .nav-link::after,
          .cg-tabs .nav-link::before,
          .nav-tabs .nav-link::after,
          .nav-tabs .nav-link::before {
            border-radius: 0 !important;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
