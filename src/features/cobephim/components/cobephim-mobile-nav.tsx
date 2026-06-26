import { HtmlFragment } from "./html-fragment";

interface CobePhimMobileNavProps {
  html: string;
}

export function CobePhimMobileNav({ html }: CobePhimMobileNavProps) {
  return (
    <div className="d-md-none">
      <HtmlFragment html={html} />
    </div>
  );
}
