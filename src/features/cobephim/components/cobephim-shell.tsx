import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

import { CobePhimFooter } from "./cobephim-footer";
import { CobePhimHeader } from "./cobephim-header";
import { CobePhimMain } from "./cobephim-main";
import { CobePhimMobileNav } from "./cobephim-mobile-nav";
import { loadCobePhimContent } from "../lib/load-cobephim-content";

interface CobePhimShellProps {
  feed?: HomepageFeedDto;
}

export function CobePhimShell({ feed }: CobePhimShellProps) {
  const fragments = loadCobePhimContent();

  return (
    <div className="base-load __className_f367f3" suppressHydrationWarning>
      <div className="d-none d-md-block" suppressHydrationWarning />
      <div className="phim-shell" id="app" suppressHydrationWarning>
        <CobePhimHeader />
        <CobePhimMain feed={feed} html={fragments.main} />
        <CobePhimFooter html={fragments.footer} />
        <CobePhimMobileNav html={fragments.mobileNav} />
      </div>
      <div className="d-none d-md-block" suppressHydrationWarning />
      <section
        aria-atomic="false"
        aria-label="Notifications Alt+T"
        aria-live="polite"
        aria-relevant="additions text"
        className="Toastify"
        suppressHydrationWarning
      />
    </div>
  );
}
