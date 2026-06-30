import { readFileSync } from "fs";
import path from "path";

type CobePhimFragments = {
  footer: string;
  home: string;
  main: string;
  mobileNav: string;
};

let cache: CobePhimFragments | null = null;
let homeCache: string | null = null;
let mobileNavCache: string | null = null;

const BLOCKED_VIETNAM_MOVIE_SLUGS = [
  "tho-oi",
  "biet-doi-sieu-kho",
  "co-hau-gai",
  "bo-gia",
  "mai",
  "nha-ba-nu",
  "lat-mat",
  "lat-mat-7",
  "dat-rung-phuong-nam",
  "con-cam",
  "quy-cau",
  "dia-dao",
  "dia-dao-mat-troi-trong-bong-toi",
  "tu-chien-tren-khong",
  "nha-gia-tien",
  "bo-tu-bao-thu",
  "nu-hon-bac-ty",
  "tham-tu-kien",
  "mua-do",
  "thien-than-ho-menh",
];

function findClosingDivIndex(html: string, startIndex: number) {
  const tagPattern = /<\/?div\b[^>]*>/gi;
  tagPattern.lastIndex = startIndex;

  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html))) {
    if (match[0].startsWith("</")) {
      depth -= 1;

      if (depth === 0) {
        return tagPattern.lastIndex;
      }
    } else {
      depth += 1;
    }
  }

  return -1;
}

function removeEnclosingSwiperSlide(html: string, slug: string) {
  let nextHtml = html;
  const markers = [`href="/phim/${slug}`, `href="/xem-phim/${slug}`, `${slug}-poster`, `${slug}-thumb`, `/${slug}`];

  for (;;) {
    const markerIndex = markers
      .map((marker) => nextHtml.indexOf(marker))
      .filter((index) => index !== -1)
      .sort((left, right) => left - right)[0];

    if (markerIndex === undefined) {
      return nextHtml;
    }

    const blockStart = nextHtml.lastIndexOf('<div class="swiper-slide', markerIndex);
    const fallbackStart = nextHtml.lastIndexOf('<div class="d-item', markerIndex);
    const start = blockStart === -1 ? fallbackStart : blockStart;

    if (start === -1) {
      return nextHtml;
    }

    const end = findClosingDivIndex(nextHtml, start);

    if (end === -1 || end <= start) {
      return nextHtml;
    }

    nextHtml = `${nextHtml.slice(0, start)}${nextHtml.slice(end)}`;
  }
}

function normalizeFirstHeroSlide(html: string) {
  const topMainIndex = html.indexOf("top-slide-main");

  if (topMainIndex === -1) {
    return html;
  }

  const firstSlideStart = html.indexOf('<div class="swiper-slide', topMainIndex);

  if (firstSlideStart === -1) {
    return html;
  }

  const firstSlideTagEnd = html.indexOf(">", firstSlideStart);

  if (firstSlideTagEnd === -1) {
    return html;
  }

  const currentTag = html.slice(firstSlideStart, firstSlideTagEnd + 1);
  const normalizedTag = currentTag
    .replace(
      /class="[^"]*"/,
      'class="swiper-slide swiper-slide-visible swiper-slide-fully-visible swiper-slide-active"',
    )
    .replace(
      /style="[^"]*"/,
      'style="width: 1440px; opacity: 1; transform: translate3d(0px, 0px, 0px);"',
    );

  return `${html.slice(0, firstSlideStart)}${normalizedTag}${html.slice(firstSlideTagEnd + 1)}`;
}

function removeVietnamMoviesFromStaticHome(html: string) {
  const withoutBlockedMovies = BLOCKED_VIETNAM_MOVIE_SLUGS.reduce(
    (nextHtml, slug) => removeEnclosingSwiperSlide(nextHtml, slug),
    html,
  );

  return normalizeFirstHeroSlide(withoutBlockedMovies);
}

function normalizeHeaderHtml(html: string) {
  return html
    .replace('action="#"', 'action="/tim-kiem" method="get"')
    .replace('<a href="#">Thể loại', '<a href="/danh-sach">Thể loại')
    .replace('title="Phim lẻ" href="#"', 'title="Phim lẻ" href="/danh-sach?type=movie"')
    .replace('title="Phim bộ" href="#"', 'title="Phim bộ" href="/danh-sach?type=series"')
    .replace('<a href="#">Quốc gia', '<a href="/quoc-gia/han-quoc">Quốc gia')
    .replace('<a href="#">Thêm', '<a href="/danh-sach?sort=latest">Thêm')
    .replace(
      '<a class="app-download-button haha dropdown-toggle"',
      '<a class="app-download-button haha dropdown-toggle" href="/danh-sach"',
    )
    .replace(
      '<button aria-label="Đăng nhập" class="button-user button-login">',
      '<a aria-label="Đăng nhập" class="button-user button-login" href="/login">',
    )
    .replace('</button></div></div></div></header>', '</a></div></div></div></header>');
}

function normalizeMainHtml(html: string) {
  return removeVietnamMoviesFromStaticHome(html)
    .replace(
      '<a class="home-category-pills__pill" href="#"><span class="home-category-pills__label">Phim bộ</span></a>',
      '<a class="home-category-pills__pill" href="/danh-sach?type=series"><span class="home-category-pills__label">Phim bộ</span></a>',
    )
    .replace(
      '<a class="home-category-pills__pill" href="#"><span class="home-category-pills__label">Phim lẻ</span></a>',
      '<a class="home-category-pills__pill" href="/danh-sach?type=movie"><span class="home-category-pills__label">Phim lẻ</span></a>',
    )
    .replace(
      '<a class="home-category-pills__pill" href="#"><span class="home-category-pills__label">Thể loại</span>',
      '<a class="home-category-pills__pill" href="/danh-sach"><span class="home-category-pills__label">Thể loại</span>',
    );
}

function normalizeMobileNavHtml(html: string) {
  return html
    .replace('href="#"', 'href="/tim-kiem"')
    .replace('href="#"', 'href="/danh-sach"')
    .replace('href="#"', 'href="/lich-chieu"')
    .replace('href="#"', 'href="/login"');
}

function normalizeFooterHtml(html: string) {
  return html
    .replace(/<div class="true">[\s\S]*?<\/div><\/div>/, "")
    .replace("như Việt Nam, Hàn Quốc", "như Hàn Quốc")
    .replace(
      /<a class="social-item" target="_blank" href="https:\/\/discord\.gg\/daoroxanh" title="Discord">[\s\S]*?<\/a>/,
      "",
    );
}

const readFragment = (filename: string) => {
  const filePath = path.join(
    process.cwd(),
    "src",
    "features",
    "cobephim",
    "content",
    filename,
  );

  const html = readFileSync(filePath, "utf8");

  if (filename === "header.html") {
    return normalizeHeaderHtml(html);
  }

  if (filename === "main.html") {
    return normalizeMainHtml(html);
  }

  if (filename === "home-static.html") {
    return normalizeMainHtml(html);
  }

  if (filename === "mobile-nav.html") {
    return normalizeMobileNavHtml(html);
  }

  if (filename === "footer.html") {
    return normalizeFooterHtml(html);
  }

  return html;
};

export function loadCobePhimContent(): CobePhimFragments {
  if (cache) {
    return cache;
  }

  cache = {
    footer: readFragment("footer.html"),
    home: readFragment("home-static.html"),
    main: readFragment("main.html"),
    mobileNav: readFragment("mobile-nav.html"),
  };

  return cache;
}

export function loadCobePhimStaticHomeContent() {
  if (homeCache) {
    return homeCache;
  }

  homeCache = readFragment("home-static.html");
  return homeCache;
}

export function loadCobePhimMobileNavContent() {
  if (mobileNavCache) {
    return mobileNavCache;
  }

  mobileNavCache = readFragment("mobile-nav.html");
  return mobileNavCache;
}
