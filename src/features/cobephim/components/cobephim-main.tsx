import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

import { CloneHomeFeed } from "@/features/cobephim-home/components/clone-home-feed";
import { splitCobePhimMainHtml } from "@/features/cobephim-home/lib/split-cobephim-main-html";

import { HtmlFragment } from "./html-fragment";

interface CobePhimMainProps {
  appendHtml?: string;
  feed?: HomepageFeedDto;
  html: string;
}

function appendHtmlToMain({
  appendHtml,
  html,
}: {
  appendHtml?: string;
  html: string;
}) {
  if (!appendHtml) {
    return html;
  }

  const mainEnd = html.lastIndexOf("</main>");

  return mainEnd === -1
    ? `${html}${appendHtml}`
    : `${html.slice(0, mainEnd)}${appendHtml}${html.slice(mainEnd)}`;
}

export function CobePhimMain({ appendHtml, feed, html }: CobePhimMainProps) {
  const segments = splitCobePhimMainHtml(html);

  if (!feed || !segments) {
    return <HtmlFragment html={appendHtmlToMain({ appendHtml, html })} />;
  }

  return (
    <>
      <HtmlFragment html={segments.prefix} />
      <CloneHomeFeed feed={feed} />
      {appendHtml ? <HtmlFragment html={appendHtml} /> : null}
    </>
  );
}
