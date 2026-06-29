import { HeaderScrollController } from "./header-scroll-controller";
import { HtmlFragment } from "./html-fragment";
import { loadCobePhimStaticHomeContent } from "../lib/load-cobephim-content";

export function CobePhimShell() {
  const home = loadCobePhimStaticHomeContent();

  return (
    <div className="base-load __className_f367f3" suppressHydrationWarning>
      <HtmlFragment html={home} />
      <HeaderScrollController />
    </div>
  );
}
