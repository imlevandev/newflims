import "../globals.css";
import "@/features/cobephim/content/cobephim.css";
import "@/features/cobephim/content/cobephim-overrides.css";
import "@/features/movie-catalog/content/movie-catalog.css";
import "swiper/css";

import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return children;
}
