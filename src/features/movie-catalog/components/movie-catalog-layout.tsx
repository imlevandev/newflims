import type { ReactNode } from "react";

interface MovieCatalogLayoutProps {
  children: ReactNode;
}

export function MovieCatalogLayout({ children }: MovieCatalogLayoutProps) {
  return (
    <div className="movie-catalog">
      <main className="movie-catalog-main">{children}</main>
    </div>
  );
}
