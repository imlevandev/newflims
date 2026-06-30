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
  if (!Number.isFinite(numericValue) || numericValue < 1) return 1;
  return Math.floor(numericValue);
}

export function AdminCrawlPanel({ categories, regions }: AdminCrawlPanelProps) {
  const [form, setForm] = useState<CrawlFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CrawlResultDto | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [finishedAt, setFinishedAt] = useState("");

  const normalizedPageStart = useMemo(() => normalizePageValue(form.pageStart), [form.pageStart]);
  const normalizedPageEnd = useMemo(
    () => Math.max(normalizedPageStart, normalizePageValue(form.pageEnd)),
    [form.pageEnd, normalizedPageStart],
  );

  const isFilterInvalid =
    (form.crawlMode === "category" && !form.categorySlug) ||
    (form.crawlMode === "country" && !form.countrySlug);

  const canSubmit = form.secretKey.trim() && !isSubmitting && !isFilterInvalid;

  function getModeLabel() {
    if (form.crawlMode === "category") {
      const cat = categories.find((c) => c.slug === form.categorySlug);
      return cat ? `Thể loại: ${cat.name}` : "Thể loại";
    }
    if (form.crawlMode === "country") {
      const reg = regions.find((r) => r.slug === form.countrySlug);
      return reg ? `Quốc gia: ${reg.name}` : "Quốc gia";
    }
    return "Toàn bộ";
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
          categorySlug: form.crawlMode === "category" ? form.categorySlug : undefined,
          countrySlug: form.crawlMode === "country" ? form.countrySlug : undefined,
          pageStart: normalizedPageStart,
          pageEnd: normalizedPageEnd,
        }),
      });

      const payload = (await response.json()) as
        | ApiSuccessResponse<CrawlResultDto>
        | ApiErrorResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(
          payload.success ? "Không thể chạy crawl." : payload.error.message,
        );
        return;
      }

      setResult(payload.data);
      setFinishedAt(new Date().toLocaleString("vi-VN"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể kết nối tới API crawl.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="crawl-panel crawl-panel--batch">
      {/* Header */}
      <div className="crawl-panel__header">
        <div className="crawl-panel__icon crawl-panel__icon--batch">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
          </svg>
        </div>
        <div>
          <div className="crawl-panel__eyebrow">Crawl hàng loạt</div>
          <h3 className="crawl-panel__title">Crawl nhiều phim theo trang</h3>
          <p className="crawl-panel__desc">
            Crawl toàn bộ, theo thể loại hoặc quốc gia với phạm vi trang tùy chỉnh.
            Dữ liệu được chuẩn hóa và lưu vào MongoDB.
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="crawl-panel__form" onSubmit={handleSubmit}>
        <div className="crawl-panel__form-row">
          <label className="crawl-panel__field">
            <span className="crawl-panel__label">Secret Key</span>
            <input
              autoComplete="off"
              className="crawl-panel__input"
              onChange={(e) => setForm((c) => ({ ...c, secretKey: e.target.value }))}
              placeholder="CRAWL_SECRET_KEY"
              type="password"
              value={form.secretKey}
            />
          </label>

          <label className="crawl-panel__field">
            <span className="crawl-panel__label">Chế độ</span>
            <select
              className="crawl-panel__input"
              onChange={(e) =>
                setForm((c) => ({
                  ...c,
                  crawlMode: e.target.value as CrawlMode,
                  categorySlug: e.target.value === "category" ? c.categorySlug : "",
                  countrySlug: e.target.value === "country" ? c.countrySlug : "",
                }))
              }
              value={form.crawlMode}
            >
              <option value="all">Toàn bộ</option>
              <option value="category">Theo thể loại</option>
              <option value="country">Theo quốc gia</option>
            </select>
          </label>

          {form.crawlMode === "category" ? (
            <label className="crawl-panel__field">
              <span className="crawl-panel__label">Thể loại</span>
              <select
                className="crawl-panel__input"
                onChange={(e) => setForm((c) => ({ ...c, categorySlug: e.target.value }))}
                value={form.categorySlug}
              >
                <option value="">Chọn thể loại</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </label>
          ) : form.crawlMode === "country" ? (
            <label className="crawl-panel__field">
              <span className="crawl-panel__label">Quốc gia</span>
              <select
                className="crawl-panel__input"
                onChange={(e) => setForm((c) => ({ ...c, countrySlug: e.target.value }))}
                value={form.countrySlug}
              >
                <option value="">Chọn quốc gia</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.slug}>{reg.name}</option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="crawl-panel__field crawl-panel__field--sm">
            <span className="crawl-panel__label">Trang bắt đầu</span>
            <input
              className="crawl-panel__input"
              min={1}
              onChange={(e) => setForm((c) => ({ ...c, pageStart: e.target.value }))}
              type="number"
              value={form.pageStart}
            />
          </label>

          <label className="crawl-panel__field crawl-panel__field--sm">
            <span className="crawl-panel__label">Trang kết thúc</span>
            <input
              className="crawl-panel__input"
              min={1}
              onChange={(e) => setForm((c) => ({ ...c, pageEnd: e.target.value }))}
              type="number"
              value={form.pageEnd}
            />
          </label>

          <button className="crawl-panel__btn crawl-panel__btn--batch" disabled={!canSubmit} type="submit">
            {isSubmitting ? (
              <span className="crawl-panel__spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            )}
            {isSubmitting ? "Đang crawl..." : "Chạy crawl"}
          </button>
        </div>
      </form>

      {/* Tags */}
      <div className="crawl-panel__tags">
        <span className="crawl-panel__tag">OPhim + darkbytes</span>
        <span className="crawl-panel__tag">Nhiều phim</span>
        <span className="crawl-panel__tag">Homepage lists</span>
        <span className="crawl-panel__tag">Taxonomy tự động</span>
      </div>

      {/* Error */}
      {errorMessage ? (
        <div className="crawl-panel__error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errorMessage}
        </div>
      ) : null}

      {/* Result */}
      {result ? (
        <div className="crawl-panel__result">
          <div className="crawl-panel__result-header">
            <div>
              <span className="crawl-panel__result-badge crawl-panel__result-badge--ok">Hoàn tất</span>
              <p className="crawl-panel__result-meta">
                {getModeLabel()} &middot; Trang {normalizedPageStart}–{normalizedPageEnd} &middot; {finishedAt}
              </p>
            </div>
          </div>

          <div className="crawl-panel__stats">
            <div className={`crawl-panel__stat ${result.moviesCreated > 0 ? "crawl-panel__stat--accent" : ""}`}>
              <span className="crawl-panel__stat-label">Tạo mới</span>
              <strong className="crawl-panel__stat-value">{result.moviesCreated}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.moviesUpdated > 0 ? "crawl-panel__stat--accent" : ""}`}>
              <span className="crawl-panel__stat-label">Cập nhật</span>
              <strong className="crawl-panel__stat-value">{result.moviesUpdated}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Trang đã xử lý</span>
              <strong className="crawl-panel__stat-value">{result.pagesProcessed}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.errorMovies > 0 ? "crawl-panel__stat--danger" : ""}`}>
              <span className="crawl-panel__stat-label">Lỗi</span>
              <strong className="crawl-panel__stat-value">{result.errorMovies}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Thể loại ĐB</span>
              <strong className="crawl-panel__stat-value">{result.categoriesSynced}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Quốc gia ĐB</span>
              <strong className="crawl-panel__stat-value">{result.regionsSynced}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Homepage</span>
              <strong className="crawl-panel__stat-value">{result.homepageListsSynced}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Hot phim</span>
              <strong className="crawl-panel__stat-value">{result.hotMoviesSynced}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
