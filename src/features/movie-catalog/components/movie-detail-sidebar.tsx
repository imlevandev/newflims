import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

import type { RemoteMovieDto } from "@/server/modules/movies/dto/movie.dto";

import {
  getMovieMetaBadges,
  getMoviePoster,
  stripMovieDescription,
} from "../lib/movie-catalog-format";

interface MovieDetailSidebarProps {
  movie: RemoteMovieDto;
}

export function MovieDetailSidebar({ movie }: MovieDetailSidebarProps) {
  return (
    <aside className="movie-detail-sidebar">
      <img alt={movie.name} className="movie-detail-sidebar__poster" src={getMoviePoster(movie)} />

      <div className="movie-detail-sidebar__body">
        <h1>{movie.name}</h1>
        <p className="movie-detail-sidebar__origin">{movie.origin_name || movie.name}</p>

        <div className="movie-detail-sidebar__badges">
          {getMovieMetaBadges(movie).map((badge) => (
            <span key={`${movie.id}-${badge}`}>{badge}</span>
          ))}
        </div>

        <div className="movie-detail-sidebar__topics">
          {movie.categories.slice(0, 4).map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
        </div>

        <div className="movie-detail-sidebar__progress">
          <span>Đang chiếu: {movie.episode_current || movie.episode_total || "Đang cập nhật"}</span>
        </div>

        {movie.showtime ? (
          <div className="movie-detail-sidebar__schedule">
            <ScheduleRoundedIcon sx={{ fontSize: 18 }} />
            <span>Lịch chiếu tiếp theo: {movie.showtime}</span>
          </div>
        ) : null}

        <div className="movie-detail-sidebar__copy">
          <h2>Giới thiệu:</h2>
          <p>{stripMovieDescription(movie.description) || "Nội dung đang được cập nhật."}</p>
        </div>
      </div>
    </aside>
  );
}
