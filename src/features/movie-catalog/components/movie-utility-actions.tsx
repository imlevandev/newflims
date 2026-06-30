'use client';

import { useEffect, useState, type ReactNode } from "react";

interface MovieUtilityActionsProps {
  movieId?: string;
  movieSlug?: string;
  primaryHref: string;
  primaryLabel?: string;
  score?: string;
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
      <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? "0" : "2"}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function getStorageList(key: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

function setStorageList(key: string, list: string[]) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function MovieUtilityActions({
  movieId = '',
  movieSlug = '',
  primaryHref,
  primaryLabel = "Xem ngay",
  score = "10 đánh giá",
}: MovieUtilityActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Load saved state
  useEffect(() => {
    if (!mounted || !movieSlug) return;
    const favs = getStorageList('cobephim_favorites');
    const marks = getStorageList('cobephim_bookmarks');
    setIsFavorite(favs.includes(movieSlug));
    setIsBookmarked(marks.includes(movieSlug));
  }, [mounted, movieSlug]);

  function toggleFavorite() {
    const favs = getStorageList('cobephim_favorites');
    let next: string[];
    if (favs.includes(movieSlug)) {
      next = favs.filter((s) => s !== movieSlug);
    } else {
      next = [...favs, movieSlug];
    }
    setStorageList('cobephim_favorites', next);
    setIsFavorite(!isFavorite);
  }

  function toggleBookmark() {
    const marks = getStorageList('cobephim_bookmarks');
    let next: string[];
    if (marks.includes(movieSlug)) {
      next = marks.filter((s) => s !== movieSlug);
    } else {
      next = [...marks, movieSlug];
    }
    setStorageList('cobephim_bookmarks', next);
    setIsBookmarked(!isBookmarked);
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Đã sao chép link!');
      } catch {
        prompt('Copy link:', url);
      }
    }
  }

  function handleComment() {
    const el = document.querySelector('.movie-detail-comments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  if (!mounted) return null;

  return (
    <div className="movie-utility-actions">
      <a className="movie-utility-actions__play" href={primaryHref}>
        <PlayIcon />
        {primaryLabel}
      </a>

      <div className="movie-utility-actions__links">
        <button className="movie-utility-actions__item" type="button" onClick={toggleFavorite} title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
          <span style={{ color: isFavorite ? '#e74c3c' : undefined }}><HeartIcon filled={isFavorite} /></span>
          <strong>{isFavorite ? "Đã thích" : "Yêu thích"}</strong>
        </button>

        <button className="movie-utility-actions__item" type="button" onClick={toggleBookmark} title={isBookmarked ? "Bỏ theo dõi" : "Thêm vào danh sách"}>
          <span style={{ color: isBookmarked ? '#f5b532' : undefined }}><BookmarkIcon filled={isBookmarked} /></span>
          <strong>{isBookmarked ? "Đã lưu" : "Thêm vào"}</strong>
        </button>

        <button className="movie-utility-actions__item" type="button" onClick={handleShare}>
          <span><ShareIcon /></span>
          <strong>Chia sẻ</strong>
        </button>

        <button className="movie-utility-actions__item" type="button" onClick={handleComment}>
          <span><ChatIcon /></span>
          <strong>Bình luận</strong>
        </button>
      </div>

      <div className="movie-utility-actions__score">
        <StarIcon />
        <strong>{score}</strong>
      </div>
    </div>
  );
}
