import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

import { CloneHomeFeed } from "@/features/cobephim-home/components/clone-home-feed";

import { HtmlFragment } from "./html-fragment";

interface CobePhimMainProps {
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

export function CobePhimMain({ appendHtml, feed, html }: CobePhimMainProps) {
  if (!feed) {
    return <HtmlFragment html={appendHtmlToMain({ appendHtml, html })} />;
  }

  return (
    <main className="mobile-app-main">
      <div className="mobile-app-main__inner">
        <div className="d-md-none">
          <nav aria-label="Danh mục nội dung" className="home-category-pills">
            <div className="home-category-pills__scroller">
              <a className="home-category-pills__pill home-category-pills__pill--active" href="/">
                <span className="home-category-pills__label">Đề xuất</span>
              </a>
              <a className="home-category-pills__pill" href="/danh-sach?type=series">
                <span className="home-category-pills__label">Phim bộ</span>
              </a>
              <a className="home-category-pills__pill" href="/danh-sach?type=movie">
                <span className="home-category-pills__label">Phim lẻ</span>
              </a>
              <a className="home-category-pills__pill" href="/danh-sach">
                <span className="home-category-pills__label">Thể loại</span>
              </a>
            </div>
          </nav>
        </div>
        <div className="mobile-route-transition" style={{ opacity: 1, pointerEvents: "auto" }}>
          <h1 style={{ display: "none" }}>CôBe Phim | Xem Phim Mới | Phim Hay | Phim HD Online</h1>
          <CloneHomeFeed feed={feed} />
          {appendHtml ? <HtmlFragment html={appendHtml} /> : null}
        </div>
      </div>
    </main>
  );
}
