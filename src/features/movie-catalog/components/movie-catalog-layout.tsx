import type { ReactNode } from "react";

import { CobePhimHeader } from "@/features/cobephim/components/cobephim-header";
import { CobePhimMobileNav } from "@/features/cobephim/components/cobephim-mobile-nav";
import { loadCobePhimContent } from "@/features/cobephim/lib/load-cobephim-content";

import { MovieCatalogFooter } from "./movie-catalog-footer";

interface MovieCatalogLayoutProps {
  children: ReactNode;
}

export function MovieCatalogLayout({ children }: MovieCatalogLayoutProps) {
  const fragments = loadCobePhimContent();

  return (
    <div className="movie-catalog">
      <CobePhimHeader />
      <main className="movie-catalog-main">{children}</main>
      <MovieCatalogFooter />
      <CobePhimMobileNav html={fragments.mobileNav} />
    </div>
  );
}
