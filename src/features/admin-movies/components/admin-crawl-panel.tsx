"use client";

import { useMemo, useState } from "react";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/server/common/http/api-response";
import type { CrawlResultDto } from "@/server/modules/movies/dto/crawl.dto";
import type {
  CategoryDto,
  RegionDto,
} from "@/server/modules/movies/dto/movie.dto";

type CrawlMode = "all" | "category" | "country";

interface CrawlFormState {
  categorySlug: string;
  crawlMode: CrawlMode;
  countrySlug: string;
  pageEnd: string;
  pageStart: string;
  secretKey: string;
}

interface AdminCrawlPanelProps {
  categories: CategoryDto[];
  regions: RegionDto[];
}

const initialFormState: CrawlFormState = {
  categorySlug: "",
  crawlMode: "all",
  countrySlug: "",
  pageEnd: "1",
  pageStart: "1",
  secretKey: "",
};

function normalizePageValue(input: string) {
  const numericValue = Number(input);

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return 1;
  }

  return Math.floor(numericValue);
}

export function AdminCrawlPanel({
  categories,
  regions,
}: AdminCrawlPanelProps) {
  const [form, setForm] = useState<CrawlFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CrawlResultDto | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseMeta, setResponseMeta] = useState<{
    finishedAt: string;
    mode: string;
  } | null>(null);

  const normalizedPageStart = useMemo(
    () => normalizePageValue(form.pageStart),
    [form.pageStart],
  );
  const normalizedPageEnd = useMemo(
    () => Math.max(normalizedPageStart, normalizePageValue(form.pageEnd)),
    [form.pageEnd, normalizedPageStart],
  );

  const summaryItems = result
    ? [
        { label: "Phim tạo mới", value: result.moviesCreated },
        { label: "Phim cập nhật", value: result.moviesUpdated },
        { label: "Trang đã xử lý", value: result.pagesProcessed },
        { label: "Phim lỗi", value: result.errorMovies },
        { label: "Thể loại đồng bộ", value: result.categoriesSynced },
        { label: "Quốc gia đồng bộ", value: result.regionsSynced },
        { label: "Danh sách trang chủ", value: result.homepageListsSynced },
      ]
    : [];

  function getModeLabel() {
    if (form.crawlMode === "category") {
      const category = categories.find((item) => item.slug === form.categorySlug);
      return category ? `Theo thể loại: ${category.name}` : "Theo thể loại";
    }

    if (form.crawlMode === "country") {
      const region = regions.find((item) => item.slug === form.countrySlug);
      return region ? `Theo quốc gia: ${region.name}` : "Theo quốc gia";
    }

    return "Toàn bộ dữ liệu";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");
    setResult(null);

    try {
      const response = await fetch("/api/crawl", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-crawl-secret": form.secretKey.trim(),
        },
        body: JSON.stringify({
          crawlMode: form.crawlMode,
          categorySlug:
            form.crawlMode === "category" ? form.categorySlug : undefined,
          countrySlug:
            form.crawlMode === "country" ? form.countrySlug : undefined,
          pageStart: normalizedPageStart,
          pageEnd: normalizedPageEnd,
        }),
      });

      const payload = (await response.json()) as
        | ApiSuccessResponse<CrawlResultDto>
        | ApiErrorResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(
          payload.success ? "Không thể chạy crawl phim." : payload.error.message,
        );
        return;
      }

      setResult(payload.data);
      setResponseMeta({
        finishedAt: new Date().toLocaleString("vi-VN"),
        mode:
          form.crawlMode === "all"
            ? normalizedPageStart === 1 && normalizedPageEnd === 1
              ? "Toàn bộ - trang 1"
              : `Toàn bộ - trang ${normalizedPageStart} đến ${normalizedPageEnd}`
            : `${getModeLabel()} - trang ${normalizedPageStart} đến ${normalizedPageEnd}`,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể kết nối tới API crawl.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFilterInvalid =
    (form.crawlMode === "category" && !form.categorySlug) ||
    (form.crawlMode === "country" && !form.countrySlug);

  return (
    <section className="panel admin-crawl-panel">
      <div className="admin-crawl-panel__intro">
        <div>
          <div className="eyebrow">Crawl cơ bản</div>
          <h2>Chạy crawl phim từ OPhim và darkbytes</h2>
          <p className="muted">
            Dùng panel này để crawl toàn bộ, theo thể loại hoặc theo quốc gia.
            Dữ liệu sau khi chuẩn hóa sẽ được lưu vào MongoDB.
          </p>
        </div>

        <div className="admin-crawl-panel__chips">
          <span className="chip">MongoDB storage</span>
          <span className="chip">Bảo vệ bằng secret key</span>
          <span className="chip">Lọc theo thể loại hoặc quốc gia</span>
        </div>
      </div>

      <form className="admin-crawl-form" onSubmit={handleSubmit}>
        <label>
          <span>Secret key</span>
          <input
            autoComplete="off"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                secretKey: event.target.value,
              }))
            }
            placeholder="Nhập CRAWL_SECRET_KEY"
            type="password"
            value={form.secretKey}
          />
        </label>

        <label>
          <span>Chế độ crawl</span>
          <select
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                crawlMode: event.target.value as CrawlMode,
                categorySlug:
                  event.target.value === "category" ? current.categorySlug : "",
                countrySlug:
                  event.target.value === "country" ? current.countrySlug : "",
              }))
            }
            value={form.crawlMode}
          >
            <option value="all">Toàn bộ</option>
            <option value="category">Theo thể loại</option>
            <option value="country">Theo quốc gia</option>
          </select>
        </label>

        <label>
          <span>Thể loại</span>
          <select
            disabled={form.crawlMode !== "category"}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                categorySlug: event.target.value,
              }))
            }
            value={form.categorySlug}
          >
            <option value="">Chọn thể loại</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Quốc gia</span>
          <select
            disabled={form.crawlMode !== "country"}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                countrySlug: event.target.value,
              }))
            }
            value={form.countrySlug}
          >
            <option value="">Chọn quốc gia</option>
            {regions.map((region) => (
              <option key={region.id} value={region.slug}>
                {region.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Trang bắt đầu</span>
          <input
            min={1}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                pageStart: event.target.value,
              }))
            }
            type="number"
            value={form.pageStart}
          />
        </label>

        <label>
          <span>Trang kết thúc</span>
          <input
            min={1}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                pageEnd: event.target.value,
              }))
            }
            type="number"
            value={form.pageEnd}
          />
        </label>

        <button
          disabled={isSubmitting || !form.secretKey.trim() || isFilterInvalid}
          type="submit"
        >
          {isSubmitting ? "Đang crawl..." : "Chạy crawl"}
        </button>
      </form>

      <div className="admin-crawl-helper-grid">
        <article className="admin-crawl-helper">
          <h3>Luồng dữ liệu</h3>
          <ul className="plain-list">
            <li>OPhim: phim, taxonomy, episodes, m3u8_url</li>
            <li>darkbytes: hot slider, homepage lists</li>
            <li>MongoDB: Movie, Episode, Category, Region, HomepageList, CrawlLog</li>
          </ul>
        </article>

        <article className="admin-crawl-helper">
          <h3>Thiết lập nhanh</h3>
          <ul className="plain-list">
            <li>Toàn bộ 1-1: cập nhật nhanh trang đầu phim mới nhất</li>
            <li>Thể loại 1-3: seed nhanh một nhóm phim theo category</li>
            <li>Quốc gia 1-5: gom phim theo thị trường như Hàn Quốc hoặc Trung Quốc</li>
          </ul>
        </article>
      </div>

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      {result && responseMeta ? (
        <div className="admin-crawl-result">
          <div className="status-header">
            <div>
              <div className="eyebrow">Lần chạy gần nhất</div>
              <h3>Kết quả crawl thành công</h3>
              <p className="muted">
                {responseMeta.mode} - hoàn tất lúc {responseMeta.finishedAt}
              </p>
            </div>
            <span className="badge badge-live">Hoàn tất</span>
          </div>

          <div className="admin-crawl-result__grid">
            {summaryItems.map((item) => (
              <article className="admin-crawl-stat" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
