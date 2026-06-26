import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import Link from "next/link";

import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieEpisodeBoard } from "@/features/movie-catalog/components/movie-episode-board";
import { VideoPlayer } from "@/features/movie-catalog/components/video-player";
import { WatchMovieOverview } from "@/features/movie-catalog/components/watch-movie-overview";
import { WatchMovieSidePanel } from "@/features/movie-catalog/components/watch-movie-side-panel";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import {
  getMovieDetailOrNotFound,
  moviesService,
} from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface WatchMoviePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WatchMoviePage({
  params,
  searchParams,
}: WatchMoviePageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const initialServerSlug =
    getSingleSearchValue(resolvedSearchParams.server) || undefined;
  const initialEpisodeSlug =
    getSingleSearchValue(resolvedSearchParams.episode) || undefined;

  const [detail, hotMovies] = await Promise.all([
    getMovieDetailOrNotFound(slug),
    moviesService.getHotMovies(),
  ]);

  const recommendations = hotMovies
    .filter((movie) => movie.slug !== detail.movie.slug)
    .slice(0, 4);

  return (
    <MovieCatalogLayout>
      <section className="movie-watch-page">
        <div className="movie-watch-page__topbar">
          <Link className="movie-watch-page__back" href={`/phim/${detail.movie.slug}`}>
            <ArrowBackRoundedIcon sx={{ fontSize: 20 }} />
          </Link>

          <div className="movie-watch-page__heading">
            <span>Xem phim</span>
            <h1>{detail.movie.name}</h1>
          </div>
        </div>

        <div className="movie-watch-page__player-card">
          <VideoPlayer
            initialEpisodeSlug={initialEpisodeSlug}
            initialServerSlug={initialServerSlug}
            movie={detail.movie}
            servers={detail.episodes}
          />
        </div>

        <div className="movie-watch-layout">
          <div className="movie-watch-layout__main">
            <WatchMovieOverview movie={detail.movie} />

            <MovieEpisodeBoard
              currentEpisodeSlug={initialEpisodeSlug}
              currentServerSlug={initialServerSlug}
              movieDetail={detail}
              watchMode
            />

            <section className="movie-detail-comments">
              <div className="movie-detail-comments__title">
                <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 24 }} />
                <h2>Bình luận (0)</h2>
              </div>
              <p>Vui lòng đăng nhập để tham gia bình luận.</p>
              <div className="movie-detail-comments__input">Viết bình luận</div>
            </section>
          </div>

          <WatchMovieSidePanel
            movie={detail.movie}
            recommendations={recommendations}
          />
        </div>
      </section>
    </MovieCatalogLayout>
  );
}
