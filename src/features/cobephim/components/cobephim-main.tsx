import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

import { CloneHomeFeed } from "@/features/cobephim-home/components/clone-home-feed";
import { splitCobePhimMainHtml } from "@/features/cobephim-home/lib/split-cobephim-main-html";

import { HtmlFragment } from "./html-fragment";

interface CobePhimMainProps {
  feed?: HomepageFeedDto;
  html: string;
}

export function CobePhimMain({ feed, html }: CobePhimMainProps) {
  const segments = splitCobePhimMainHtml(html);

  if (!feed || !segments) {
    return <HtmlFragment html={html} />;
  }

  return (
    <>
      <HtmlFragment html={segments.prefix} />
      <CloneHomeFeed feed={feed} />
      <HtmlFragment html={segments.community} />
    </>
  );
}
