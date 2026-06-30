import fs from "fs";
import path from "path";
import type { Metadata } from "next";

import {
  buildHref,
  getFirstPlayableEpisode,
} from "@/features/movie-catalog/lib/movie-catalog-format";
import {
  getMovieDetailOrNotFound,
} from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const detail = await getMovieDetailOrNotFound(slug);
    return {
      title: `${detail.movie.name} (${detail.movie.origin_name}) - CôBe Phim`,
      description: detail.movie.description?.replace(/<[^>]*>/g, "").substring(0, 160) || "",
    };
  } catch {
    return { title: "Phim Không Tìm Thấy - CôBe Phim" };
  }
}

function safeReplace(html: string, search: RegExp, replacement: string): string {
  let result = html;
  let prev = "";
  while (prev !== result) {
    prev = result;
    result = result.replace(search, replacement);
  }
  return result;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { slug } = await params;
  const detail = await getMovieDetailOrNotFound(slug);

  const firstPlayable = getFirstPlayableEpisode(detail);
  const primaryHref = firstPlayable
    ? buildHref(`/xem-phim/${detail.movie.slug}`, {
        episode: firstPlayable.episode.slug,
        server: firstPlayable.server.server_slug,
      })
    : `/xem-phim/${detail.movie.slug}`;

  // Read full template
  const fullHtml = fs.readFileSync(path.join(process.cwd(), "public/movie-body.html"), "utf-8");

  // Strip desktop header (wrapped in d-none d-md-block) and footer
  const hdrBlockStart = fullHtml.indexOf('<header class="fly">');
  const hdrWrapperStart = fullHtml.lastIndexOf('<div class="d-none d-md-block">', hdrBlockStart);
  const hdrWrapperEnd = fullHtml.indexOf('</div>', fullHtml.indexOf('</header>', hdrBlockStart));
  const ftrStart = fullHtml.indexOf('<footer');

  let html = fullHtml;
  if (hdrWrapperStart >= 0 && hdrWrapperEnd >= 0) {
    html = fullHtml.substring(0, hdrWrapperStart) + fullHtml.substring(hdrWrapperEnd + '</div>'.length);
  }
  if (ftrStart >= 0) {
    const preFtr = html.lastIndexOf('<div class="d-none d-md-block">', ftrStart);
    html = html.substring(0, preFtr >= 0 ? preFtr : ftrStart);
  }

  // === DYNAMIC DATA REPLACEMENTS ===
  const safeName = detail.movie.name.replace(/\$/g, '$$$$');
  const safeOrigin = (detail.movie.origin_name || '').replace(/\$/g, '$$$$');
  const poster = (detail.movie.poster || detail.movie.thumbnail || '').replace(/\$/g, '$$$$');
  const thumb = (detail.movie.thumbnail || detail.movie.poster || '').replace(/\$/g, '$$$$');

  // Movie name (handles both "Tái Khởi" and "Tái\n Khởi")
  html = safeReplace(html, /Đặc Vụ Kim Tái\s+Khởi Động/g, safeName);

  // Origin name
  html = html.split('Agent Kim Reactivated').join(safeOrigin);

  // Poster & thumbnail  
  html = html.split('https://icdn.darkbytes.xyz/file/cm9waGltbQ/images/dac-vu-kim-tai-khoi-dong-poster.webp').join(poster);
  html = html.split('https://icdn.darkbytes.xyz/file/cm9waGltbQ/images/b006ea12-d24f-4717-afee-86c049106e2b.webp').join(thumb);

  // Watch links
  html = html.split('href="/xem-phim/dac-vu-kim-tai-khoi-dong"').join(`href="${primaryHref}"`);
  html = html.split('href="/xem-phim/dac-vu-kim-tai-khoi-dong.454466"').join(`href="${primaryHref}"`);
  html = html.split('href="/xem-phim/dac-vu-kim-tai-khoi-dong.454631"').join(`href="${primaryHref}"`);

  // Tags
  const imdbRating = detail.movie.imdb_rating || '10';
  const rating = detail.movie.rating || 'T16';
  const year = String(detail.movie.publish_year || 2026);
  const quality = detail.movie.quality || 'HD';
  const epCur = detail.movie.episode_current || '';

  // Replace rating point value
  html = html.replace(/(?<=<span class="point">)([\d.]+)(?=<\/span>)/, imdbRating);

  // Replace rating (T16 etc)
  html = html.replace(/(?<=<span class="last">)([^<]+)(?=<\/span>)/, rating);

  // Replace year in tag-classic  
  html = html.replace(/(<div class="tag-classic"><span>)\d{4}(<\/span><\/div>)/, `$1${year}$2`);

  // Replace first tag-classic with quality + episode tags
  const firstTagIdx = html.indexOf('<div class="tag-classic"><span>');
  const firstTagClose = html.indexOf('</span></div>', firstTagIdx);
  if (firstTagIdx >= 0 && firstTagClose >= 0) {
    const beforeTag = html.substring(0, firstTagIdx);
    const afterTag = html.substring(firstTagClose + '</span></div>'.length);
    const tags = [
      `<div class="tag-classic"><span>${quality}</span></div>`,
      epCur ? `<div class="tag-classic"><span>${epCur}</span></div>` : '',
    ].filter(Boolean).join('');
    html = beforeTag + tags + afterTag;
  }

  // Categories
  const catsHtml = detail.movie.categories
    .map((c) => `<a class="tag-topic" href="/the-loai/${c.slug}">${c.name}</a>`)
    .join('');
  html = html.replace(
    /<div class="hl-tags">\s*<a class="tag-topic"[^>]*>[\s\S]*?<\/a>\s*<\/div>/,
    `<div class="hl-tags">${catsHtml}</div>`,
  );

  // Description
  const desc = (detail.movie.description || '').replace(/<[^>]*>/g, '') || 'Đang cập nhật...';
  html = html.replace(
    /<div class="description">\s*<p>[\s\S]*?<\/p>\s*<\/div>/,
    `<div class="description"><p>${desc}</p></div>`,
  );

  // Episode time  
  html = html.replace(/>NaNm</, `>${detail.movie.episode_time || 'Đang cập nhật'}<`);

  // Region
  const regionsStr = detail.movie.regions?.length
    ? detail.movie.regions.map((r) => `<span><a href="/quoc-gia/${r.slug}">${r.name}</a></span>`).join(', ')
    : '<span>Đang cập nhật</span>';
  html = html.replace(
    /<span><a href="\/quoc-gia\/han-quoc">Hàn Quốc<\/a><\/span>/,
    regionsStr,
  );

  // Status
  const isCompleted = detail.movie.status === 'completed';
  const epTotal = detail.movie.episode_total || '???';
  const statusBlock = `<div class="status ${isCompleted ? 'completed' : 'on-going'} mb-4"><div class="line-center small">${!isCompleted ? '<div class="spinner-border spinner-border-sm" role="status"></div>' : ''}<span>Đã chiếu: ${epCur || '?'} / ${epTotal}</span></div></div>`;
  html = html.replace(
    /<div class="status [^"]* mb-4">[\s\S]*?<\/div>\s*<\/div>/,
    statusBlock,
  );

  // Server tabs
  const serversHtml = detail.episodes
    .map((srv, idx) => `
      <button data-server-slug="${srv.server_slug}" class="nav-link ${idx === 0 ? 'active' : ''}">
        <div class="inc-icon icon-12">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.33 4.67C15.33 4.14 15.12 3.63 14.75 3.25C14.37 2.88 13.86 2.67 13.33 2.67C10.78 2.67 5.22 2.67 2.67 2.67C2.14 2.67 1.63 2.88 1.25 3.25C0.88 3.63 0.67 4.14 0.67 4.67V11.33C0.67 11.86 0.88 12.37 1.25 12.75C1.63 13.12 2.14 13.33 2.67 13.33H13.33C13.86 13.33 14.37 13.12 14.75 12.75C15.12 12.37 15.33 11.86 15.33 11.33V4.67ZM14 4.67V11.33C14 11.51 13.93 11.68 13.8 11.8C13.68 11.93 13.51 12 13.33 12H2.67C2.49 12 2.32 11.93 2.2 11.8C2.07 11.68 2 11.51 2 11.33V4.67C2 4.49 2.07 4.32 2.2 4.2C2.32 4.07 2.49 4 2.67 4H13.33C13.51 4 13.68 4.07 13.8 4.2C13.93 4.32 14 4.49 14 4.67ZM4 10.67H5.33C5.7 10.67 6 10.37 6 10C6 9.63 5.7 9.33 5.33 9.33H4C3.63 9.33 3.33 9.63 3.33 10C3.33 10.37 3.63 10.67 4 10.67ZM8 10.67H12C12.37 10.67 12.67 10.37 12.67 10C12.67 9.63 12.37 9.33 12 9.33H8C7.63 9.33 7.33 9.63 7.33 10C7.33 10.37 7.63 10.67 8 10.67ZM11.33 8H12C12.37 8 12.67 7.7 12.67 7.33C12.67 6.97 12.37 6.67 12 6.67H11.33C10.97 6.67 10.67 6.97 10.67 7.33C10.67 7.7 10.97 8 11.33 8ZM4 8H8.67C9.03 8 9.33 7.7 9.33 7.33C9.33 6.97 9.03 6.67 8.67 6.67H4C3.63 6.67 3.33 6.97 3.33 7.33C3.33 7.7 3.63 8 4 8Z" fill="currentcolor"></path>
          </svg>
        </div>
        ${srv.server_name}
      </button>`)
    .join('');

  // Episode grid
  const imgSrc = detail.movie.poster || detail.movie.thumbnail || '';
  const episodesHtml = detail.episodes
    .map((srv, sIdx) => `
      <div class="de-eps is-grid is-simple server-pane ${sIdx !== 0 ? 'd-none' : ''}" id="server-pane-${srv.server_slug}">
        ${srv.items.map((item, idx) => `
            <a class="item" href="/xem-phim/${detail.movie.slug}?server=${srv.server_slug}&episode=${item.slug}">
              <div class="v-thumbnail h-thumbnail">
                <div class="play-button">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                  </svg>
                </div>
                <img alt="${item.name || `Tập ${idx + 1}`}" loading="lazy" width="1" height="1" decoding="async" src="${imgSrc}" style="color:transparent">
              </div>
              <div class="info">
                <div class="play-button">
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="11" width="11" xmlns="http://www.w3.org/2000/svg">
                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                  </svg>
                </div>
                <div class="ep-sort flex-shrink-0">${item.name || `Tập ${idx + 1}`}</div>
                <div class="media-title"></div>
              </div>
            </a>`).join('')}
      </div>`)
    .join('');

  // Replace server tabs
  html = html.replace(
    /<div class="v-tabs v-tabs-min tab-trans mb-0 nav nav-pills">[\s\S]*?<\/div>\s*<\/div>\s*<div class="flex-grow-1">/,
    `<div class="v-tabs v-tabs-min tab-trans mb-0 nav nav-pills">${serversHtml}</div></div><div class="flex-grow-1">`,
  );

  // Replace episode grid
  html = html.replace(
    /<div class="de-eps is-grid is-simple">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
    `${episodesHtml}</div></div></div>`,
  );

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
