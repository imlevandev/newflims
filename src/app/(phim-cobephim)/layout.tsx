import type { ReactNode } from "react";
import Script from "next/script";

import { CobePhimFooter } from "@/features/cobephim/components/cobephim-footer";
import { CobePhimHeader } from "@/features/cobephim/components/cobephim-header";
import { CobePhimMobileNav } from "@/features/cobephim/components/cobephim-mobile-nav";
import { loadCobePhimContent } from "@/features/cobephim/lib/load-cobephim-content";
import "@/features/cobephim/content/cobephim-overrides.css";

const cobePhimStylesheets = [
  "https://cobephim.pw/_next/static/css/7e7d96b1e6991756.css",
  "https://cobephim.pw/_next/static/css/b3d2bc2a41fef9ee.css",
  "https://cobephim.pw/_next/static/css/bab9322a06b792b3.css",
  "https://cobephim.pw/_next/static/css/fb9d7258d25d1688.css",
  "https://cobephim.pw/_next/static/css/8702ba90b2197423.css",
  "https://cobephim.pw/_next/static/css/2e1770d6816c0de0.css",
  "https://cobephim.pw/_next/static/css/cd6d44333c72200a.css",
  "https://cobephim.pw/_next/static/css/a2d010616312a546.css",
  "https://cobephim.pw/_next/static/css/c0e142c7abbd44f1.css",
];

export default function CobephimLayout({ children }: { children: ReactNode }) {
  const { footer, mobileNav } = loadCobePhimContent();

  return (
    <>
      {cobePhimStylesheets.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <link
        rel="preload"
        href="https://cobephim.pw/_next/static/media/e4af272ccee01ff0-s.p.woff2"
        as="font"
        crossOrigin=""
        type="font/woff2"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body {
              margin: 0 !important;
              min-height: 100vh !important;
              background: #0a0a0e !important;
            }
            body::before {
              display: none !important;
            }
          `,
        }}
      />
      <div className="base-load __className_f367f3" suppressHydrationWarning>
        <CobePhimHeader />
        {children}
        <CobePhimFooter html={footer} />
        <CobePhimMobileNav html={mobileNav} />
      </div>
      <Script id="tab-switcher" strategy="afterInteractive">
        {`(function(){
          document.addEventListener('click',function(e){
            var btn=e.target.closest('.nav-link,.nav-item button,[role="tab"]');
            if(!btn)return;
            var parent=btn.closest('.v-tabs,.nav-tabs,.nav-pills');
            if(!parent)return;
            var container=parent.nextElementSibling||parent.parentElement.querySelector('.tab-content');
            if(!container){container=document.querySelector('.tab-content');}
            if(!container)return;
            parent.querySelectorAll('.nav-link.active,.nav-link[aria-selected="true"],button[aria-selected="true"]').forEach(function(b){b.classList.remove('active');b.setAttribute('aria-selected','false');});
            btn.classList.add('active');btn.setAttribute('aria-selected','true');
            container.querySelectorAll('.tab-pane').forEach(function(p){p.classList.remove('active','show');});
            var pane=container.querySelector('[aria-labelledby="'+btn.id+'"]');
            if(pane){pane.classList.add('active','show');}
          });
        })()`}
      </Script>
    </>
  );
}
