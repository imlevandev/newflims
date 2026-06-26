import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SmartDisplayRoundedIcon from "@mui/icons-material/SmartDisplayRounded";
import Link from "next/link";

import type { CategoryDto } from "@/server/modules/movies/dto/movie.dto";

import { SearchBar } from "./search-bar";

interface MovieCatalogHeaderProps {
  categories?: CategoryDto[];
  searchValue?: string;
}

export function MovieCatalogHeader({
  categories = [],
  searchValue = "",
}: MovieCatalogHeaderProps) {
  return (
    <header className="movie-catalog-header">
      <div className="movie-catalog-header__inner">
        <div className="movie-catalog-brand">
          <Link href="/">
            <span className="movie-catalog-brand__badge">
              <SmartDisplayRoundedIcon sx={{ fontSize: 26 }} />
            </span>
            <span className="movie-catalog-brand__text">
              <strong>RoPhim</strong>
              <small>Phim hay cả rổ</small>
            </span>
          </Link>
        </div>

        <SearchBar defaultValue={searchValue} />

        <nav className="movie-catalog-nav">
          <Link href="/danh-sach">Chủ đề</Link>
          <Link href={categories[0] ? `/the-loai/${categories[0].slug}` : "/danh-sach"}>
            Thể loại
          </Link>
          <Link href="/phim-le">Phim lẻ</Link>
          <Link href="/phim-bo">Phim bộ</Link>
          <Link href="/quoc-gia/han-quoc">Quốc gia</Link>
          <Link href="/lich-chieu">Lịch chiếu</Link>
        </nav>

        <Link className="movie-catalog-member" href="/login">
          <PersonRoundedIcon sx={{ fontSize: 20 }} />
          Thành viên
        </Link>
      </div>
    </header>
  );
}
