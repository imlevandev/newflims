import Link from "next/link";

import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieEpisodeBoard } from "@/features/movie-catalog/components/movie-episode-board";
import { VideoPlayer } from "@/features/movie-catalog/components/video-player";
import { WatchMovieOverview } from "@/features/movie-catalog/components/watch-movie-overview";
import { WatchMovieSidePanel } from "@/features/movie-catalog/components/watch-movie-side-panel";
import { WatchEpisodeLinkController } from "@/features/movie-catalog/components/watch-episode-link-controller";
import { getSingleSearchValue } from "@/features/movie-catalog/lib/movie-catalog-format";
import {
  getMovieDetailOrNotFound,
  getCachedHotMovies,
} from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";

interface WatchMoviePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function ArrowBackIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9H13a8.48 8.48 0 0 1 8 8v.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
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
    getCachedHotMovies(),
  ]);

  const recommendations = hotMovies
    .filter((movie) => movie.slug !== detail.movie.slug)
    .slice(0, 4);

  return (
    <MovieCatalogLayout>
      <section className="movie-watch-page">
        <div className="movie-watch-page__topbar">
          <Link className="movie-watch-page__back" href={`/phim/${detail.movie.slug}`}>
            <ArrowBackIcon />
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
          <WatchEpisodeLinkController />
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
                <CommentIcon />
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
