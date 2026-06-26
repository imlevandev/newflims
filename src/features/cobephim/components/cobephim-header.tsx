import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TvRoundedIcon from "@mui/icons-material/TvRounded";
import Link from "next/link";

import { MoviesService } from "@/server/modules/movies/movies.service";

import { HeaderScrollController } from "./header-scroll-controller";

const moviesService = new MoviesService();

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

export async function CobePhimHeader() {
  const [categories, regions] = await Promise.all([
    moviesService.getCategories(),
    moviesService.getRegions(),
  ]);

  const categoryColumns = chunkItems(categories, 4);
  const regionColumns = chunkItems(regions, 4);

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
                src="/cobephim/images/logo.svg"
                width="100"
              />
            </Link>

            <div id="search">
              <form action="/tim-kiem" className="search-elements" method="get">
                <div className="search-icon" style={{ marginTop: "-2px" }}>
                  <SearchRoundedIcon fontSize="inherit" />
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
                <div className="menu-item">
                  <Link href="/danh-sach">Chủ đề</Link>
                </div>

                <div className="menu-item menu-item-sub cobe-menu-dropdown">
                  <button className="cobe-menu-dropdown__trigger" type="button">
                    Thể loại
                    <KeyboardArrowDownRoundedIcon className="ms-1" sx={{ fontSize: 18 }} />
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
                    <KeyboardArrowDownRoundedIcon className="ms-1" sx={{ fontSize: 18 }} />
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
              </div>

              <div className="flex-grow-1" />

              <div className="app-download">
                <div className="dropdown">
                  <Link className="app-download-button haha dropdown-toggle" href="/danh-sach">
                    <div className="inc-icon">
                      <TvRoundedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div className="text text-light">
                      <span>Tải ứng dụng</span>
                      <strong>CôBe Phim</strong>
                    </div>
                  </Link>
                </div>
              </div>

              <div id="main_user">
                <Link aria-label="Đăng nhập" className="button-user button-login" href="/login">
                  <div className="line-center">
                    <PersonRoundedIcon fontSize="inherit" />
                    <span>Thành viên</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>
      <HeaderScrollController />
    </>
  );
}
