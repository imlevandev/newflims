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

interface ShowtimeFormState {
  dateEnd: string;
  dateStart: string;
  secretKey: string;
}

export function AdminShowtimeCrawlPanel({
  defaultDateEnd,
  defaultDateStart,
}: AdminShowtimeCrawlPanelProps) {
  const [form, setForm] = useState<ShowtimeFormState>({
    dateEnd: defaultDateEnd,
    dateStart: defaultDateStart,
    secretKey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<ShowtimeCrawlResultDto | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [finishedAt, setFinishedAt] = useState("");

  const summaryItems = result
    ? [
        { label: "Ngày đã quét", value: result.daysProcessed },
        { label: "Suất chiếu tìm thấy", value: result.showtimeEntriesFound },
        { label: "Phim đưa vào hàng crawl", value: result.uniqueMoviesQueued },
        { label: "Phim tạo mới", value: result.moviesCreated },
        { label: "Phim cập nhật", value: result.moviesUpdated },
        { label: "Phim lỗi", value: result.errorMovies },
        { label: "Thể loại đồng bộ", value: result.categoriesSynced },
        { label: "Quốc gia đồng bộ", value: result.regionsSynced },
      ]
    : [];

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
          "x-crawl-secret": form.secretKey.trim(),
        },
        body: JSON.stringify({
          dateEnd: form.dateEnd,
          dateStart: form.dateStart,
        }),
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
    <section className="panel admin-crawl-panel">
      <div className="admin-crawl-panel__intro">
        <div>
          <div className="eyebrow">Crawl theo lịch chiếu</div>
          <h2>Crawl các phim xuất hiện trong lịch chiếu sắp tới</h2>
          <p className="muted">
            Panel này quét showtimes theo khoảng ngày, gom các phim sắp chiếu rồi
            chỉ crawl đúng nhóm phim đó về MongoDB.
          </p>
        </div>

        <div className="admin-crawl-panel__chips">
          <span className="chip">Nguồn lịch chiếu từ darkbytes</span>
          <span className="chip">Chỉ crawl phim có trong showtimes</span>
          <span className="chip">Phù hợp cho seed phim sắp chiếu</span>
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
          <span>Từ ngày</span>
          <input
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                dateStart: event.target.value,
              }))
            }
            type="date"
            value={form.dateStart}
          />
        </label>

        <label>
          <span>Đến ngày</span>
          <input
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                dateEnd: event.target.value,
              }))
            }
            type="date"
            value={form.dateEnd}
          />
        </label>

        <button disabled={isSubmitting || !form.secretKey.trim()} type="submit">
          {isSubmitting ? "Đang crawl theo lịch chiếu..." : "Crawl theo lịch chiếu"}
        </button>
      </form>

      <div className="admin-crawl-helper-grid">
        <article className="admin-crawl-helper">
          <h3>Cách hoạt động</h3>
          <ul className="plain-list">
            <li>Lấy showtimes theo từng ngày trong khoảng bạn chọn</li>
            <li>Gom các phim trùng nhau để tránh crawl lặp</li>
            <li>Crawl metadata và episodes của đúng nhóm phim sắp chiếu</li>
          </ul>
        </article>

        <article className="admin-crawl-helper">
          <h3>Gợi ý sử dụng</h3>
          <ul className="plain-list">
            <li>Hôm nay đến 7 ngày tới: seed nhanh phim sắp chiếu trong tuần</li>
            <li>Chạy sau khi lịch chiếu cập nhật: giảm crawl thừa các phim cũ</li>
            <li>Phù hợp khi muốn ưu tiên phim sẽ lên trang lịch chiếu trước</li>
          </ul>
        </article>
      </div>

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      {result ? (
        <div className="admin-crawl-result">
          <div className="status-header">
            <div>
              <div className="eyebrow">Lần chạy gần nhất</div>
              <h3>Kết quả crawl lịch chiếu</h3>
              <p className="muted">
                Từ {form.dateStart} đến {form.dateEnd} - hoàn tất lúc {finishedAt}
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
