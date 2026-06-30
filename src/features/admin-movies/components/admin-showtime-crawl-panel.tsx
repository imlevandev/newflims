"use client";

import { useState } from "react";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/server/common/http/api-response";
import type { ShowtimeCrawlResultDto } from "@/server/modules/movies/dto/crawl.dto";

interface AdminShowtimeCrawlPanelProps {
  defaultDateEnd: string;
  defaultDateStart: string;
}

export function AdminShowtimeCrawlPanel({
  defaultDateEnd,
  defaultDateStart,
}: AdminShowtimeCrawlPanelProps) {
  const [dateStart, setDateStart] = useState(defaultDateStart);
  const [dateEnd, setDateEnd] = useState(defaultDateEnd);
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ShowtimeCrawlResultDto | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [finishedAt, setFinishedAt] = useState("");

  const canSubmit = secretKey.trim() && !isSubmitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setResult(null);

    try {
      const response = await fetch("/api/crawl/showtimes", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-crawl-secret": secretKey.trim(),
        },
        body: JSON.stringify({ dateEnd, dateStart }),
      });

      const payload = (await response.json()) as
        | ApiSuccessResponse<ShowtimeCrawlResultDto>
        | ApiErrorResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(
          payload.success
            ? "Không thể crawl phim từ lịch chiếu."
            : payload.error.message,
        );
        return;
      }

      setResult(payload.data);
      setFinishedAt(new Date().toLocaleString("vi-VN"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể kết nối tới API crawl lịch chiếu.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="crawl-panel crawl-panel--showtime">
      {/* Header */}
      <div className="crawl-panel__header">
        <div className="crawl-panel__icon crawl-panel__icon--showtime">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div>
          <div className="crawl-panel__eyebrow">Crawl theo lịch chiếu</div>
          <h3 className="crawl-panel__title">Crawl phim sắp chiếu</h3>
          <p className="crawl-panel__desc">
            Quét showtimes theo khoảng ngày, gom các phim sắp chiếu rồi chỉ crawl đúng nhóm phim đó về MongoDB.
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
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="CRAWL_SECRET_KEY"
              type="password"
              value={secretKey}
            />
          </label>

          <label className="crawl-panel__field crawl-panel__field--sm">
            <span className="crawl-panel__label">Từ ngày</span>
            <input
              className="crawl-panel__input"
              onChange={(e) => setDateStart(e.target.value)}
              type="date"
              value={dateStart}
            />
          </label>

          <label className="crawl-panel__field crawl-panel__field--sm">
            <span className="crawl-panel__label">Đến ngày</span>
            <input
              className="crawl-panel__input"
              onChange={(e) => setDateEnd(e.target.value)}
              type="date"
              value={dateEnd}
            />
          </label>

          <button className="crawl-panel__btn crawl-panel__btn--showtime" disabled={!canSubmit} type="submit">
            {isSubmitting ? (
              <span className="crawl-panel__spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            )}
            {isSubmitting ? "Đang crawl..." : "Crawl lịch chiếu"}
          </button>
        </div>
      </form>

      {/* Tags */}
      <div className="crawl-panel__tags">
        <span className="crawl-panel__tag">Darkbytes Showtimes</span>
        <span className="crawl-panel__tag">Tối đa 15 ngày</span>
        <span className="crawl-panel__tag">Chống trùng lặp</span>
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
                {dateStart} → {dateEnd} &middot; {finishedAt}
              </p>
            </div>
          </div>

          <div className="crawl-panel__stats">
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Ngày đã quét</span>
              <strong className="crawl-panel__stat-value">{result.daysProcessed}</strong>
            </div>
            <div className="crawl-panel__stat crawl-panel__stat--accent">
              <span className="crawl-panel__stat-label">Suất chiếu</span>
              <strong className="crawl-panel__stat-value">{result.showtimeEntriesFound}</strong>
            </div>
            <div className="crawl-panel__stat crawl-panel__stat--accent">
              <span className="crawl-panel__stat-label">Phim vào hàng chờ</span>
              <strong className="crawl-panel__stat-value">{result.uniqueMoviesQueued}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.moviesCreated > 0 ? "crawl-panel__stat--accent" : ""}`}>
              <span className="crawl-panel__stat-label">Tạo mới</span>
              <strong className="crawl-panel__stat-value">{result.moviesCreated}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.moviesUpdated > 0 ? "crawl-panel__stat--accent" : ""}`}>
              <span className="crawl-panel__stat-label">Cập nhật</span>
              <strong className="crawl-panel__stat-value">{result.moviesUpdated}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.errorMovies > 0 ? "crawl-panel__stat--danger" : ""}`}>
              <span className="crawl-panel__stat-label">Lỗi</span>
              <strong className="crawl-panel__stat-value">{result.errorMovies}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
