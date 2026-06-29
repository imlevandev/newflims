import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
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
    return "/cobephim-v6/images/avatar-default.webp";
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

function TopicGrid({ topics }: { topics: HomepageTopicDto[] }) {
  if (topics.length === 0) {
    return null;
  }

  return (
    <div className="cards-row effect-fade-in cobe-api-section">
      <div className="row-header">
        <div className="category-name">Bạn đang quan tâm gì?</div>
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
              {movie.comments_count ? `${movie.comments_count} BL` : `${movie.view_total ?? 0} lượt`}
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
        <TrendingUpRoundedIcon sx={{ fontSize: 20 }} />
        <span>Thể loại thịnh hành</span>
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
        <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 20 }} />
        <span>Bình luận nổi bật</span>
      </div>
      <div className="cobe-comments-box__items">
        {comments.slice(0, 6).map((comment) => (
          <a className="cobe-comment-item" href={`/phim/${comment.movie?.slug ?? ""}`} key={comment.id}>
            <img alt="" className="cobe-comment-item__avatar" loading="lazy" src={getAvatarSrc(comment)} />
            <span className="cobe-comment-item__body">
              <strong>{comment.user?.name ?? "Thành viên"}</strong>
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
          <TopComments comments={feed.comments.topComments} />
          <RankingList
            icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 20 }} />}
            items={feed.comments.moviesHot}
            title="Phim hot"
          />
          <RankingList
            icon={<ChatBubbleOutlineRoundedIcon sx={{ fontSize: 20 }} />}
            items={feed.comments.moviesHotByComment}
            title="Đang bàn luận"
          />
          <CategoryRanking items={feed.comments.categoriesHot} />
        </div>
      </div>
    </>
  );
}
