import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { MovieDetailHero } from "@/features/movie-catalog/components/movie-detail-hero";
import { MovieDetailSidebar } from "@/features/movie-catalog/components/movie-detail-sidebar";
import { MovieEpisodeBoard } from "@/features/movie-catalog/components/movie-episode-board";
import { MovieGrid } from "@/features/movie-catalog/components/movie-grid";
import { MovieUtilityActions } from "@/features/movie-catalog/components/movie-utility-actions";
import {
  buildHref,
  getFirstPlayableEpisode,
} from "@/features/movie-catalog/lib/movie-catalog-format";
import {
  getMovieDetailOrNotFound,
  moviesService,
} from "@/features/movie-catalog/lib/movie-catalog-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MovieDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MovieDetailPage({
  params,
  searchParams,
}: MovieDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const currentServerSlug =
    (Array.isArray(resolvedSearchParams.server)
      ? resolvedSearchParams.server[0]
      : resolvedSearchParams.server) || undefined;

  const [detail, hotMovies] = await Promise.all([
    getMovieDetailOrNotFound(slug),
    moviesService.getHotMovies(),
  ]);

  const firstPlayable = getFirstPlayableEpisode(detail);
  const primaryHref = firstPlayable
    ? buildHref(`/xem-phim/${detail.movie.slug}`, {
        episode: firstPlayable.episode.slug,
        server: firstPlayable.server.server_slug,
      })
    : `/xem-phim/${detail.movie.slug}`;

  const relatedMovies = hotMovies
    .filter((movie) => movie.slug !== detail.movie.slug)
    .slice(0, 5);

  return (
    <MovieCatalogLayout>
      <MovieDetailHero movie={detail.movie} />

      <section className="movie-detail-stage">
        <MovieDetailSidebar movie={detail.movie} />

        <div className="movie-detail-stage__main">
          <MovieUtilityActions
            primaryHref={primaryHref}
            primaryLabel="Xem ngay"
          />

          <MovieEpisodeBoard
            currentServerSlug={currentServerSlug}
            movieDetail={detail}
          />

          <section className="movie-detail-comments">
            <div className="movie-detail-comments__title">
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 24 }} />
              <h2>Bình luận (0)</h2>
            </div>
            <p>
              Đăng nhập để tham gia bình luận về bộ phim này. Giao diện đã bỏ
              hoàn toàn các block quảng cáo.
            </p>
            <div className="movie-detail-comments__input">Viết bình luận</div>
          </section>
        </div>
      </section>

      {relatedMovies.length > 0 ? (
        <section className="movie-page-section">
          <div className="movie-section-head">
            <span className="movie-section-chip">Đề xuất</span>
            <h2>Phim hot khác</h2>
          </div>

          <MovieGrid items={relatedMovies} pathname={`/phim/${detail.movie.slug}`} />
        </section>
      ) : null}
    </MovieCatalogLayout>
  );
}
