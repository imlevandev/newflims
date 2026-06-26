"use client";

import type { Route } from "next";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import type {
  CategoryDto,
  RegionDto,
} from "@/server/modules/movies/dto/movie.dto";

interface CategoryFilterProps {
  action?: string;
  categories: CategoryDto[];
  current: {
    category?: string;
    country?: string;
    sort?: string;
    type?: string;
  };
  regions: RegionDto[];
}

const typeOptions = [
  { label: "Tất cả", value: "" },
  { label: "Phim lẻ", value: "movie" },
  { label: "Phim bộ", value: "series" },
];

const sortOptions = [
  { label: "Mới nhất", value: "latest" },
  { label: "Lượt xem", value: "popular" },
  { label: "Năm mới nhất", value: "year_desc" },
  { label: "Năm cũ nhất", value: "year_asc" },
  { label: "Tên A-Z", value: "name_asc" },
  { label: "Tên Z-A", value: "name_desc" },
];

export function CategoryFilter({
  action = "/danh-sach",
  categories,
  current,
  regions,
}: CategoryFilterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedType, setSelectedType] = useState(current.type || "");
  const [selectedCategory, setSelectedCategory] = useState(current.category || "");
  const [selectedCountry, setSelectedCountry] = useState(current.country || "");
  const [selectedSort, setSelectedSort] = useState(current.sort || "latest");

  function buildTargetUrl() {
    let pathname = action;

    if (selectedCategory) {
      pathname = `/the-loai/${selectedCategory}`;
    } else if (selectedCountry) {
      pathname = `/quoc-gia/${selectedCountry}`;
    } else if (selectedType === "movie") {
      pathname = "/phim-le";
    } else if (selectedType === "series") {
      pathname = "/phim-bo";
    } else {
      pathname = "/danh-sach";
    }

    const params = new URLSearchParams();

    if (selectedSort && selectedSort !== "latest") {
      params.set("sort", selectedSort);
    }

    if (selectedCategory && selectedCountry) {
      params.set("country", selectedCountry);
    }

    if (selectedType && selectedCategory) {
      params.set("type", selectedType);
    }

    if (selectedType && selectedCountry && !selectedCategory) {
      params.set("type", selectedType);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(() => {
      router.push(buildTargetUrl() as Route);
      setIsOpen(false);
    });
  }

  return (
    <section className="movie-filter-dropdown">
      <button
        aria-expanded={isOpen}
        className="movie-filter-dropdown__toggle"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        <span className="movie-filter-dropdown__toggle-icon">
          <FilterAltRoundedIcon sx={{ fontSize: 18 }} />
        </span>
        <span>Bộ lọc</span>
        <KeyboardArrowDownRoundedIcon
          className={isOpen ? "is-open" : ""}
          sx={{ fontSize: 20 }}
        />
      </button>

      {isOpen ? (
        <form className="movie-filter-dropdown__panel" onSubmit={handleSubmit}>
          <div className="movie-filter-dropdown__row">
            <strong>Quốc gia:</strong>
            <div className="movie-filter-dropdown__options">
              {[
                { id: "all-country", label: "Tất cả", value: "" },
                ...regions.map((region) => ({
                  id: region.id,
                  label: region.name,
                  value: region.slug,
                })),
              ].map((region) => (
                <button
                  className={
                    selectedCountry === region.value
                      ? "movie-filter-chip is-active"
                      : "movie-filter-chip"
                  }
                  key={region.id}
                  onClick={() => setSelectedCountry(region.value)}
                  type="button"
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>

          <div className="movie-filter-dropdown__row">
            <strong>Loại phim:</strong>
            <div className="movie-filter-dropdown__options">
              {typeOptions.map((option) => (
                <button
                  className={
                    selectedType === option.value
                      ? "movie-filter-chip is-active"
                      : "movie-filter-chip"
                  }
                  key={option.value || "all-type"}
                  onClick={() => setSelectedType(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="movie-filter-dropdown__row">
            <strong>Thể loại:</strong>
            <div className="movie-filter-dropdown__options">
              <button
                className={
                  selectedCategory === ""
                    ? "movie-filter-chip is-active"
                    : "movie-filter-chip"
                }
                onClick={() => setSelectedCategory("")}
                type="button"
              >
                Tất cả
              </button>

              {categories.map((category) => (
                <button
                  className={
                    selectedCategory === category.slug
                      ? "movie-filter-chip is-active"
                      : "movie-filter-chip"
                  }
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  type="button"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="movie-filter-dropdown__row">
            <strong>Sắp xếp:</strong>
            <div className="movie-filter-dropdown__options">
              {sortOptions.map((option) => (
                <button
                  className={
                    selectedSort === option.value
                      ? "movie-filter-chip is-active"
                      : "movie-filter-chip"
                  }
                  key={option.value}
                  onClick={() => setSelectedSort(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="movie-filter-dropdown__actions">
            <button className="movie-filter-dropdown__submit" type="submit">
              Lọc kết quả
            </button>
            <button
              className="movie-filter-dropdown__close"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Đóng
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
