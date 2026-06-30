import type { HomepageFeedDto, HomepageMovieCollectionDto } from "@/server/modules/movies/dto/movie.dto";

import { CloneHomeFeed } from "@/features/cobephim-home/components/clone-home-feed";
import { HomepageAnimeSlider } from "@/features/cobephim-home/components/homepage-anime-section";

import { HtmlFragment } from "./html-fragment";

interface CobePhimMainProps {
  animeCollections?: HomepageMovieCollectionDto[];
  appendHtml?: string;
  feed?: HomepageFeedDto;
  html: string;
}

function appendHtmlToMain({
  appendHtml,
  html,
}: {
  appendHtml?: string;
  html: string;
}) {
  if (!appendHtml) {
    return html;
  }

  const mainEnd = html.lastIndexOf("</main>");

  return mainEnd === -1
    ? `${html}${appendHtml}`
    : `${html.slice(0, mainEnd)}${appendHtml}${html.slice(mainEnd)}`;
}

export function CobePhimMain({ animeCollections, appendHtml, feed, html }: CobePhimMainProps) {
  if (!feed) {
    return <HtmlFragment html={appendHtmlToMain({ appendHtml, html })} />;
  }

  return (
    <main className="mobile-app-main">
      <div className="mobile-app-main__inner">
        <div className="d-md-none">
          <nav aria-label="Danh muc noi dung" className="home-category-pills">
            <div className="home-category-pills__scroller">
              <a className="home-category-pills__pill home-category-pills__pill--active" href="/">
                <span className="home-category-pills__label">De xuat</span>
              </a>
              <a className="home-category-pills__pill" href="/danh-sach?type=series">
                <span className="home-category-pills__label">Phim bo</span>
              </a>
              <a className="home-category-pills__pill" href="/danh-sach?type=movie">
                <span className="home-category-pills__label">Phim le</span>
              </a>
              <a className="home-category-pills__pill" href="/danh-sach">
                <span className="home-category-pills__label">The loai</span>
              </a>
            </div>
          </nav>
        </div>
        <div className="mobile-route-transition" style={{ opacity: 1, pointerEvents: "auto" }}>
          <h1 style={{ display: "none" }}>CoBe Phim | Xem Phim Moi | Phim Hay | Phim HD Online</h1>
          <CloneHomeFeed feed={feed} />
          {animeCollections && animeCollections.length > 0 ? (
            <HomepageAnimeSlider collections={animeCollections} />
          ) : null}
          {appendHtml ? <HtmlFragment html={appendHtml} /> : null}
        </div>
      </div>
    </main>
  );
}
