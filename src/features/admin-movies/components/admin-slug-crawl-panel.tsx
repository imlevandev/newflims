"use client";

import { useState } from "react";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/server/common/http/api-response";
import type { CrawlResultDto } from "@/server/modules/movies/dto/crawl.dto";

export function AdminSlugCrawlPanel() {
  const [slug, setSlug] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CrawlResultDto | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [finishedAt, setFinishedAt] = useState("");

  const canSubmit = slug.trim() && secretKey.trim() && !isSubmitting;

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
          "x-crawl-secret": secretKey.trim(),
        },
        body: JSON.stringify({ crawlMode: "slug", slug: slug.trim() }),
      });

      const payload = (await response.json()) as
        | ApiSuccessResponse<CrawlResultDto>
        | ApiErrorResponse;

      if (!response.ok || !payload.success) {
        setErrorMessage(
          payload.success ? "Kh\u00f4ng th\u1ec3 crawl phim theo slug." : payload.error.message,
        );
        return;
      }

      setResult(payload.data);
      setFinishedAt(new Date().toLocaleString("vi-VN"));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Kh\u00f4ng th\u1ec3 k\u1ebft n\u1ed1i t\u1edbi API crawl.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const movieStatus =
    result && result.moviesCreated === 0 && result.moviesUpdated === 0 && result.errorMovies === 0
      ? "not-found"
      : result && result.errorMovies > 0
        ? "error"
        : result
          ? "success"
          : null;

  return (
    <section className="crawl-panel crawl-panel--slug">
      <div className="crawl-panel__header">
        <div className="crawl-panel__icon crawl-panel__icon--slug">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M11 8v6" />
            <path d="M8 11h6" />
          </svg>
        </div>
        <div>
          <div className="crawl-panel__eyebrow">Crawl \u0111\u01a1n l\u1ebb</div>
          <h3 className="crawl-panel__title">Crawl phim theo Slug</h3>
          <p className="crawl-panel__desc">
            Nh\u1eadp slug c\u1ee7a m\u1ed9t phim c\u1ee5 th\u1ec3 \u0111\u1ec3 crawl metadata v\u00e0 episodes t\u1eeb OPhim v\u1ec1 MongoDB ngay l\u1eadp t\u1ee9c.
          </p>
        </div>
      </div>

      <form className="crawl-panel__form" onSubmit={handleSubmit}>
        <div className="crawl-panel__form-row">
          <label className="crawl-panel__field">
            <span className="crawl-panel__label">Slug phim</span>
            <input
              autoComplete="off"
              className="crawl-panel__input"
              onChange={(e) => setSlug(e.target.value)}
              placeholder="vd: dao-hai-tac, one-piece..."
              type="text"
              value={slug}
            />
          </label>

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

          <button
            className="crawl-panel__btn crawl-panel__btn--slug"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? (
              <span className="crawl-panel__spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
            {isSubmitting ? "\u0110ang crawl..." : "Crawl ngay"}
          </button>
        </div>
      </form>

      <div className="crawl-panel__tags">
        <span className="crawl-panel__tag">OPhim API</span>
        <span className="crawl-panel__tag">1 phim / l\u1ea7n</span>
        <span className="crawl-panel__tag">C\u00f3 episodes</span>
        <span className="crawl-panel__tag">Taxonomy t\u1ef1 \u0111\u1ed9ng</span>
      </div>

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

      {result ? (
        <div className={`crawl-panel__result ${movieStatus === "not-found" ? "crawl-panel__result--warn" : movieStatus === "error" ? "crawl-panel__result--err" : ""}`}>
          <div className="crawl-panel__result-header">
            <div>
              <span className={`crawl-panel__result-badge ${movieStatus === "not-found" ? "crawl-panel__result-badge--warn" : movieStatus === "error" ? "crawl-panel__result-badge--err" : "crawl-panel__result-badge--ok"}`}>
                {movieStatus === "not-found" ? "Kh\u00f4ng t\u00ecm th\u1ea5y" : movieStatus === "error" ? "C\u00f3 l\u1ed7i" : "Th\u00e0nh c\u00f4ng"}
              </span>
              <p className="crawl-panel__result-meta">
                Slug: <strong>{slug.trim()}</strong> &middot; {finishedAt}
              </p>
            </div>
            {movieStatus === "success" ? (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="crawl-panel__result-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : null}
          </div>

          <div className="crawl-panel__stats">
            <div className={`crawl-panel__stat ${result.moviesCreated > 0 ? "crawl-panel__stat--accent" : ""}`}>
              <span className="crawl-panel__stat-label">T\u1ea1o m\u1edbi</span>
              <strong className="crawl-panel__stat-value">{result.moviesCreated}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.moviesUpdated > 0 ? "crawl-panel__stat--accent" : ""}`}>
              <span className="crawl-panel__stat-label">C\u1eadp nh\u1eadt</span>
              <strong className="crawl-panel__stat-value">{result.moviesUpdated}</strong>
            </div>
            <div className={`crawl-panel__stat ${result.errorMovies > 0 ? "crawl-panel__stat--danger" : ""}`}>
              <span className="crawl-panel__stat-label">L\u1ed7i</span>
              <strong className="crawl-panel__stat-value">{result.errorMovies}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Th\u1ec3 lo\u1ea1i \u0110B</span>
              <strong className="crawl-panel__stat-value">{result.categoriesSynced}</strong>
            </div>
            <div className="crawl-panel__stat">
              <span className="crawl-panel__stat-label">Qu\u1ed1c gia \u0110B</span>
              <strong className="crawl-panel__stat-value">{result.regionsSynced}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
