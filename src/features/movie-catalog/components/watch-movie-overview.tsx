import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Link from "next/link";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import {
  getMovieMetaBadges,
  getMoviePoster,
  stripMovieDescription,
} from "../lib/movie-catalog-format";

interface WatchMovieOverviewProps {
  movie: RemoteMovieDto;
}

export function WatchMovieOverview({ movie }: WatchMovieOverviewProps) {
  const badges = getMovieMetaBadges(movie).slice(0, 5);
  const description = stripMovieDescription(movie.description);

  return (
    <section className="watch-overview-card">
      <div className="watch-overview-card__main">
        <img alt={movie.name} className="watch-overview-card__poster" src={getMoviePoster(movie)} />

        <div className="watch-overview-card__content">
          <div className="watch-overview-card__header">
            <div>
              <h2>{movie.name}</h2>
              <p>{movie.origin_name || movie.name}</p>
            </div>
          </div>

          <div className="watch-overview-card__badges">
            {badges.map((badge) => (
              <span key={`${movie.id}-${badge}`}>{badge}</span>
            ))}
          </div>

          <div className="watch-overview-card__topics">
            {movie.categories.slice(0, 4).map((category) => (
              <span key={category.id}>{category.name}</span>
            ))}
          </div>

          <div className="watch-overview-card__progress">
            Đã chiếu: {movie.episode_current || movie.episode_total || "Đang cập nhật"}
          </div>

          {movie.showtime ? (
            <div className="watch-overview-card__schedule">
              <ScheduleRoundedIcon sx={{ fontSize: 18 }} />
              <span>Lịch chiếu tiếp theo: {movie.showtime}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="watch-overview-card__summary">
        <p>{description || "Nội dung phim đang được cập nhật."}</p>
        <Link className="watch-overview-card__link" href={`/phim/${movie.slug}`}>
          Thông tin phim
          <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
        </Link>
      </div>

      <aside className="watch-overview-card__side">
        <div className="watch-overview-card__stat">
          <StarRoundedIcon sx={{ fontSize: 22 }} />
          <div>
            <strong>Đánh giá</strong>
            <span>{movie.imdb_rating && movie.imdb_rating !== "0" ? movie.imdb_rating : "0.0"}</span>
          </div>
        </div>

        <div className="watch-overview-card__stat">
          <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 22 }} />
          <div>
            <strong>Bình luận</strong>
            <span>0</span>
          </div>
        </div>

        <div className="watch-overview-card__score-badge">
          <StarRoundedIcon sx={{ fontSize: 18 }} />
          <strong>0 đánh giá</strong>
        </div>
      </aside>
    </section>
  );
}
