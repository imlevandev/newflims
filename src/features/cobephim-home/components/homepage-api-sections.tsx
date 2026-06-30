import type { ReactNode } from "react";

import type {
  HomepageApiFeedDto,
  HomepageCommentDto,
  HomepageRankedCategoryDto,
  HomepageRankedMovieDto,
  HomepageTopicDto,
} from "@/server/modules/movies/dto/movie.dto";

interface HomepageApiSectionsProps {
  feed: HomepageApiFeedDto;
}

function getTopicHref(topic: HomepageTopicDto) {
  return `/chu-de/${topic.slug}`;
}

function getMovieHref(movie: HomepageRankedMovieDto) {
  return `/phim/${movie.slug}`;
}

function getAvatarSrc(comment: HomepageCommentDto) {
  const avatar = comment.user?.avatar;

  if (!avatar) {
    return "/cobephim-v6/cobephim-v6/images/avatar-default.webp";
  }

  if (avatar.startsWith("http")) {
    return avatar;
  }

  return avatar.startsWith("/images/")
    ? avatar.replace("/images/", "/cobephim-v6/images/")
    : avatar;
}

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

// Inline SVGs - avoid MUI emotion SSR hydration mismatch
function FireIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 23c-3.31 0-6-2.69-6-6 0-4 6-10.8 6-14v-2s6 6.8 6 14c0 3.31-2.69 6-6 6zm0-2c2.21 0 4-1.79 4-4 0-2.5-3-7.5-4-10-.5 1.25-2 4.75-3 7-.5 1-.95 1.95-1 3z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
    </svg>
  );
}

function TopicGrid({ topics }: { topics: HomepageTopicDto[] }) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="cards-row effect-fade-in cobe-api-section">
      <div className="row-header">
        <div className="category-name">Ban dang quan tam gi?</div>
      </div>
      <div className="topics-grid cobe-topic-grid">
        {topics.map((topic) => (
          <a
            className="row-topic cobe-topic-card"
            href={getTopicHref(topic)}
            key={topic.id}
            style={{
              background: `linear-gradient(135deg, #${topic.color || "674196"}, rgba(255,255,255,.18))`,
            }}
          >
            <div className="intro">
              <div className="heading-md mb-0">{topic.name}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function SafeBanners({ feed }: HomepageApiSectionsProps) {
  const imageBanners = feed.banners.filter((banner) => banner.image && banner.type !== "script");

  if (imageBanners.length === 0) {
    return null;
  }

  return (
    <div className="cards-row effect-fade-in cobe-api-section">
      <div className="cobe-banner-strip">
        {imageBanners.map((banner) => (
          <a href={banner.link || "#"} key={banner.id} rel="noreferrer" target="_blank">
            <img alt="Banner" loading="lazy" src={banner.image} />
          </a>
        ))}
      </div>
    </div>
  );
}

function RankingList({
  icon,
  items,
  title,
}: {
  icon: ReactNode;
  items: HomepageRankedMovie[];
  title: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="cobe-ranking-box">
      <div className="cobe-ranking-box__title">
        {icon}
        <span>{title}</span>
      </div>
      <div className="cobe-ranking-box__items">
        {items.slice(0, 8).map((movie) => (
          <a className="cobe-ranking-item" href={getMovieHref(movie)} key={movie.id}>
            <span className="cobe-ranking-item__rank">{movie.current_rank}</span>
            <span className="cobe-ranking-item__name">{movie.name}</span>
            <span className="cobe-ranking-item__meta">
              {movie.comments_count ? `${movie.comments_count} BL` : `${movie.view_total ?? 0} luot`}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

type HomepageRankedMovie = HomepageRankedMovieDto;

function CategoryRanking({ items }: { items: HomepageRankedCategoryDto[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="cobe-ranking-box">
      <div className="cobe-ranking-box__title">
        <TrendingIcon />
        <span>The loai thinh hanh</span>
      </div>
      <div className="cobe-ranking-box__items">
        {items.slice(0, 8).map((category) => (
          <a className="cobe-ranking-item" href={`/the-loai/${category.slug}`} key={category.id}>
            <span className="cobe-ranking-item__rank">{category.current_rank}</span>
            <span className="cobe-ranking-item__name">{category.name}</span>
            <span className="cobe-ranking-item__meta">{category.totalViews ?? 0}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function TopComments({ comments }: { comments: HomepageCommentDto[] }) {
  if (comments.length === 0) {
    return null;
  }

  return (
    <div className="cobe-comments-box">
      <div className="cobe-ranking-box__title">
        <ChatIcon />
        <span>Binh luan noi bat</span>
      </div>
      <div className="cobe-comments-box__items">
        {comments.slice(0, 6).map((comment) => (
          <a className="cobe-comment-item" href={`/phim/${comment.movie?.slug ?? ""}`} key={comment.id}>
            <img alt="" className="cobe-comment-item__avatar" loading="lazy" src={getAvatarSrc(comment)} />
            <span className="cobe-comment-item__body">
              <strong>{comment.user?.name ?? "Thanh vien"}</strong>
              <span>{cleanText(comment.content)}</span>
              {comment.movie ? <em>{comment.movie.name}</em> : null}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export function HomepageApiSections({ feed }: HomepageApiSectionsProps) {
  return (
    <>
      <TopicGrid topics={feed.topics.items} />
      <SafeBanners feed={feed} />
      <div className="cards-row effect-fade-in cobe-api-section">
        <div className="cobe-home-dashboard">
          <RankingList
            icon={<FireIcon />}
            items={feed.comments.moviesHot}
            title="Phim hot"
          />
          <RankingList
            icon={<ChatIcon />}
            items={feed.comments.moviesHotByComment}
            title="Dang ban luan"
          />
          <CategoryRanking items={feed.comments.categoriesHot} />
        </div>
      </div>
    </>
  );
}
