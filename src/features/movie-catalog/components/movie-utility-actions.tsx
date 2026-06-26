import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface MovieUtilityActionsProps {
  primaryHref: string;
  primaryLabel?: string;
  score?: string;
}

const utilityItems = [
  { icon: FavoriteBorderRoundedIcon, label: "Yêu thích" },
  { icon: AddRoundedIcon, label: "Thêm vào" },
  { icon: ShareRoundedIcon, label: "Chia sẻ" },
  { icon: ChatBubbleOutlineRoundedIcon, label: "Bình luận" },
];

export function MovieUtilityActions({
  primaryHref,
  primaryLabel = "Xem ngay",
  score = "10 đánh giá",
}: MovieUtilityActionsProps) {
  return (
    <div className="movie-utility-actions">
      <a className="movie-utility-actions__play" href={primaryHref}>
        <PlayArrowRoundedIcon
          className="movie-utility-actions__play-icon"
          sx={{ fontSize: 24 }}
        />
        {primaryLabel}
      </a>

      <div className="movie-utility-actions__links">
        {utilityItems.map((item) => (
          <button className="movie-utility-actions__item" key={item.label} type="button">
            <span>
              <item.icon sx={{ fontSize: 24 }} />
            </span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>

      <div className="movie-utility-actions__score">
        <StarRoundedIcon sx={{ fontSize: 22 }} />
        <strong>{score}</strong>
      </div>
    </div>
  );
}
