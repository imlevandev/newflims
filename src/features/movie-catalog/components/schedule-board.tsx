import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import Link from "next/link";

import { getMoviePoster } from "../lib/movie-catalog-format";
import type { MovieScheduleDay } from "../lib/movie-schedule";

interface ScheduleBoardProps {
  activeDayId: string;
  days: MovieScheduleDay[];
}

export function ScheduleBoard({ activeDayId, days }: ScheduleBoardProps) {
  const activeDay = days.find((day) => day.id === activeDayId) || days[0];

  if (!activeDay) {
    return null;
  }

  return (
    <section className="movie-schedule">
      <div className="movie-schedule__title-row">
        <span aria-hidden="true" className="movie-schedule__title-icon">
          <CalendarMonthRoundedIcon sx={{ fontSize: 28 }} />
        </span>
        <h1>Lịch chiếu</h1>
      </div>

      <div className="movie-schedule__tabs">
        {days.map((day) => (
          <Link
            className={day.id === activeDay.id ? "is-active" : ""}
            href={`/lich-chieu?day=${day.id}`}
            key={day.id}
          >
            <span>{day.dateLabel}</span>
            <strong>{day.dayLabel}</strong>
          </Link>
        ))}
      </div>

      <div className="movie-schedule__divider" />

      {activeDay.items.length > 0 ? (
        <div className="movie-schedule__grid">
          {activeDay.items.map((item, index) => (
            <article className={`movie-schedule-card${index === 1 ? " is-emphasis" : ""}`} key={item.id}>
              <a className="movie-schedule-card__main" href={item.detailHref}>
                <span className="movie-schedule-card__poster-link">
                  <img
                    alt={item.movie.name}
                    className="movie-schedule-card__poster"
                    loading="lazy"
                    src={getMoviePoster(item.movie)}
                  />
                </span>

                <span className="movie-schedule-card__body">
                  <span className="movie-schedule-card__title">{item.movie.name}</span>
                  <span className="movie-schedule-card__meta">{item.metaLabel}</span>
                </span>
              </a>

              <a className="movie-schedule-card__episode" href={item.episodeHref}>
                {item.episodeLabel}
              </a>
            </article>
          ))}
        </div>
      ) : (
        <div className="movie-empty-state">
          <h3>Chưa có lịch chiếu cho ngày này</h3>
          <p>Thử chuyển sang ngày khác để xem các tập đang được lên lịch phát.</p>
        </div>
      )}
    </section>
  );
}
