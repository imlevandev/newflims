import { CobePhimHeader } from "@/features/cobephim/components/cobephim-header";
import { CobePhimFooter } from "@/features/cobephim/components/cobephim-footer";
import { CobePhimMobileNav } from "@/features/cobephim/components/cobephim-mobile-nav";
import { loadCobePhimContent } from "@/features/cobephim/lib/load-cobephim-content";
import { getMovieCover } from "@/features/movies-home/lib/movie-format";
import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";
import "@/features/cobephim/content/cobephim-overrides.css";

const cobeStyles = [
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

interface Props {
  currentType?: string;
  currentPage: number;
  items: RemoteMovieDto[];
  pageNumbers: number[];
  pathname: string;
  totalPages: number;
}

function getEpisodeBadge(m: RemoteMovieDto) {
  const latestEpisode = m.latestEpisodes?.[0]?.name;
  return latestEpisode || m.episode_current || m.quality || "HD";
}

function buildPageHref(pathname: string, params: Record<string, string | number | null | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export function CobephimMovieListPage(props: Props) {
  const { currentType, currentPage, items, pageNumbers, pathname, totalPages } = props;
  const { footer, mobileNav } = loadCobePhimContent();
  return (
    <>
      {cobeStyles.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <link rel="preload" href="https://cobephim.pw/_next/static/media/e4af272ccee01ff0-s.p.woff2" as="font" crossOrigin="" type="font/woff2" />
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0!important;min-height:100vh!important;background:#0a0a0e!important}body::before{display:none!important}" }} />
      <div className="base-load __className_f367f3" suppressHydrationWarning>
        <CobePhimHeader />
        <main className="mobile-app-main" style={{ paddingTop: "120px" }}>
          <div className="mobile-app-main__inner">
            <div className="mobile-route-transition" style={{ opacity: 1, pointerEvents: "auto" }}>
              <div className="wrapper-w-slide" id="wrapper">
                <div className="fluid-gap">
                  {/* Movie Grid */}
                  <div className="cards-row cards-slide wide effect-fade-in">
                    <div className="topics-list single mt-0">
                      <div className="row-content">
                        <div className="cards-slide-wrapper relative" style={{ overflow: "visible" }}>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "16px",
                          }}>
                            {items.map((movie) => (
                              <div key={movie.id} className="sw-cover single">
                                <a className="v-thumbnail" href={`/phim/${movie.slug}`}>
                                  <div className="pin-new m-pin-new">
                                    <div className="line-center line-pd">
                                      <span />
                                      <strong>{getEpisodeBadge(movie)}</strong>
                                    </div>
                                  </div>
                                  <img
                                    alt={movie.name}
                                    loading="lazy"
                                    src={getMovieCover(movie)}
                                    style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: "12px" }}
                                  />
                                </a>
                                <div className="h-item">
                                  <div className="info">
                                    <h4 className="item-title lim-1">
                                      <a href={`/phim/${movie.slug}`} title={movie.name}>
                                        {movie.name}
                                      </a>
                                    </h4>
                                    <h4 className="alias-title lim-1">
                                      <a href={`/phim/${movie.slug}`} title={movie.origin_name || movie.name}>
                                        {movie.origin_name || movie.name}
                                      </a>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4 pb-5" style={{ gap: "6px" }}>
                      {currentPage > 1 ? (
                        <a className="page-link" href={buildPageHref(pathname, { page: currentPage - 1 === 1 ? null : currentPage - 1, sort: null, type: currentType })}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                        </a>
                      ) : null}
                      {pageNumbers.map((p) => (
                        <a key={p}
                          className={`page-link${p === currentPage ? " active" : ""}`}
                          href={buildPageHref(pathname, { page: p === 1 ? null : p, sort: null, type: currentType })}
                        >
                          {p}
                        </a>
                      ))}
                      {currentPage < totalPages ? (
                        <a className="page-link" href={buildPageHref(pathname, { page: currentPage + 1, sort: null, type: currentType })}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 7.41L10 6l6 6-6 6-1.41-1.41L13.17 12z"/></svg>
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <CobePhimFooter html={footer} />
        <CobePhimMobileNav html={mobileNav} />
      </div>
    </>
  );
}
