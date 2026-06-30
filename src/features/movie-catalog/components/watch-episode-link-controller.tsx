"use client";

import { useEffect } from "react";

export function WatchEpisodeLinkController() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[data-watch-episode-link='true']",
      );

      if (!link) {
        return;
      }

      const serverSlug = link.dataset.serverSlug;
      const episodeSlug = link.dataset.episodeSlug;

      if (!serverSlug || !episodeSlug) {
        return;
      }

      event.preventDefault();
      window.history.pushState(null, "", link.href);
      window.dispatchEvent(
        new CustomEvent("watch-episode-change", {
          detail: { episodeSlug, serverSlug },
        }),
      );
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
