import Link from "next/link";

import {
  getCachedCategories,
  getCachedRegions,
} from "@/features/movie-catalog/lib/movie-catalog-data";
import type { HomepageMenuItemDto } from "@/server/modules/movies/dto/movie.dto";

import { HeaderScrollController } from "./header-scroll-controller";
import { LoginButton } from "./login-button";

interface CobePhimHeaderProps {
  menus?: HomepageMenuItemDto[];
}

function chunkItems<T>(items: T[], columns: number) {
  const chunkSize = Math.ceil(items.length / columns);
  const chunks: T[][] = [];

  for (let index = 0; index < columns; index += 1) {
    const chunk = items.slice(index * chunkSize, (index + 1) * chunkSize);

    if (chunk.length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

function getMenuHref(item: HomepageMenuItemDto) {
  return item.data && item.data.trim() ? item.data : "#";
}

function isVietnamLink(label: string, href: string) {
  const normalized = `${label} ${href}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return normalized.includes("viet-nam") || normalized.includes("vietnam") || normalized.includes("viet nam");
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 24 24" width="1em">
      <path d="m20 20-4.35-4.35m2.35-5.15a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" className="ms-1" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function TvIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M7 21h10M8 3l4 4 4-4M5 7h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="1em" viewBox="0 0 24 24" width="1em">
      <path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export async function CobePhimHeader({ menus }: CobePhimHeaderProps = {}) {
  const [categories, regions] = await Promise.all([
    getCachedCategories(),
    getCachedRegions(),
  ]);

  const categoryColumns = chunkItems(categories, 4);
  const safeRegions = regions.filter((region) => !isVietnamLink(region.name, `/quoc-gia/${region.slug}`));
  const regionColumns = chunkItems(safeRegions, 4);
  const menuItems = menus?.length
    ? menus.map((item) => ({
        ...item,
        children: item.children?.filter((child) => !isVietnamLink(child.label, getMenuHref(child))),
      }))
    : null;

  return (
    <>
      <div className="d-none d-md-block cobe-header-react-wrap">
        <header className="fly cobe-header-react" data-site-header="true">
          <div className="header-elements">
            <Link href="/" id="logo" title="CôBe Phim">
              <img
                alt="logo"
                decoding="async"
                height="40"
                src="/cobephim-v6/images/logo.svg"
                width="100"
              />
            </Link>

            <div id="search">
              <form action="/tim-kiem" className="search-elements" method="get">
                <div className="search-icon" style={{ marginTop: "-2px" }}>
                  <SearchIcon />
                </div>
                <input
                  autoComplete="off"
                  className="search-input"
                  id="main-search"
                  name="q"
                  placeholder="Tìm kiếm phim, diễn viên"
                />
              </form>
            </div>

            <div className="el-group">
              <div id="main_menu">
                {menuItems ? (
                  menuItems.map((item) => {
                    const children = item.children ?? [];

                    if (children.length === 0) {
                      return (
                        <div className="menu-item" key={item.key}>
                          <a href={getMenuHref(item)} style={{ textTransform: "capitalize" }}>
                            {item.label}
                          </a>
                        </div>
                      );
                    }

                    return (
                      <div className="menu-item menu-item-sub cobe-menu-dropdown" key={item.key}>
                        <button className="cobe-menu-dropdown__trigger" type="button">
                          {item.label}
                          <ChevronDownIcon />
                        </button>

                        <div className="cobe-mega-menu">
                          {chunkItems(children, 4).map((column, columnIndex) => (
                            <div className="cobe-mega-menu__col" key={`${item.key}-col-${columnIndex}`}>
                              {column.map((child) => (
                                <a href={getMenuHref(child)} key={child.key}>
                                  {child.label}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="menu-item">
                      <Link href="/danh-sach">Chủ đề</Link>
                    </div>

                    <div className="menu-item menu-item-sub cobe-menu-dropdown">
                      <button className="cobe-menu-dropdown__trigger" type="button">
                        Thể loại
                        <ChevronDownIcon />
                      </button>

                      <div className="cobe-mega-menu cobe-mega-menu--categories">
                        {categoryColumns.map((column, columnIndex) => (
                          <div className="cobe-mega-menu__col" key={`category-col-${columnIndex}`}>
                            {column.map((category) => (
                              <Link href={`/the-loai/${category.slug}`} key={category.id}>
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="menu-item">
                      <Link href="/phim-le" style={{ textTransform: "capitalize" }}>
                        Phim lẻ
                      </Link>
                    </div>

                    <div className="menu-item">
                      <Link href="/phim-bo" style={{ textTransform: "capitalize" }}>
                        Phim bộ
                      </Link>
                    </div>

                    <div className="menu-item menu-item-sub cobe-menu-dropdown">
                      <button className="cobe-menu-dropdown__trigger" type="button">
                        Quốc gia
                        <ChevronDownIcon />
                      </button>

                      <div className="cobe-mega-menu cobe-mega-menu--regions">
                        {regionColumns.map((column, columnIndex) => (
                          <div className="cobe-mega-menu__col" key={`region-col-${columnIndex}`}>
                            {column.map((region) => (
                              <Link href={`/quoc-gia/${region.slug}`} key={region.id}>
                                {region.name}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="menu-item">
                      <Link href="/lich-chieu">Lịch chiếu</Link>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-grow-1" />

              <div className="app-download">
                <div className="dropdown">
                  <Link className="app-download-button haha dropdown-toggle" href="/danh-sach">
                    <div className="inc-icon">
                      <TvIcon />
                    </div>
                    <div className="text text-light">
                      <span>Tải ứng dụng</span>
                      <strong>CôBe Phim</strong>
                    </div>
                  </Link>
                </div>
              </div>

              <div id="main_user">
                <LoginButton />
              </div>
            </div>
          </div>
        </header>
      </div>
      <HeaderScrollController />
    </>
  );
}
