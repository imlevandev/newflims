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
  return html
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
