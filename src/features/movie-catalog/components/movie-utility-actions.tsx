import type { ReactNode } from "react";

interface MovieUtilityActionsProps {
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

function HeartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
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

const utilityItems: { icon: ReactNode; label: string }[] = [
  { icon: <HeartIcon />, label: "Yeu thich" },
  { icon: <AddIcon />, label: "Them vao" },
  { icon: <ShareIcon />, label: "Chia se" },
  { icon: <ChatIcon />, label: "Binh luan" },
];

export function MovieUtilityActions({
  primaryHref,
  primaryLabel = "Xem ngay",
  score = "10 danh gia",
}: MovieUtilityActionsProps) {
  return (
    <div className="movie-utility-actions">
      <a className="movie-utility-actions__play" href={primaryHref}>
        <PlayIcon />
        {primaryLabel}
      </a>

      <div className="movie-utility-actions__links">
        {utilityItems.map((item) => (
          <button className="movie-utility-actions__item" key={item.label} type="button">
            <span>{item.icon}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>

      <div className="movie-utility-actions__score">
        <StarIcon />
        <strong>{score}</strong>
      </div>
    </div>
  );
}
