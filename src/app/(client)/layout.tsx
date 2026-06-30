import "../globals.css";
import "@/features/movie-catalog/content/movie-catalog.css";
import "swiper/css";
import "@/features/cobephim/content/cobephim.css";
import "@/features/cobephim/content/cobephim-overrides.css";

import type { ReactNode } from "react";

import { CobePhimFooter } from "@/features/cobephim/components/cobephim-footer";
import { CobePhimHeader } from "@/features/cobephim/components/cobephim-header";
import { CobePhimMobileNav } from "@/features/cobephim/components/cobephim-mobile-nav";
import { HomeSliderController } from "@/features/cobephim/components/home-slider-controller";
import { loadCobePhimContent } from "@/features/cobephim/lib/load-cobephim-content";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { footer, mobileNav } = loadCobePhimContent();

  return (
    <div className="base-load __className_f367f3" suppressHydrationWarning>
      <CobePhimHeader />
      {children}
      <CobePhimFooter html={footer} />
      <CobePhimMobileNav html={mobileNav} />
      <HomeSliderController />
    </div>
  );
}
