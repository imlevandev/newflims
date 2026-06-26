import { HtmlFragment } from "./html-fragment";

interface CobePhimFooterProps {
  html: string;
}

export function CobePhimFooter({ html }: CobePhimFooterProps) {
  return (
    <div className="d-none d-md-block">
      <HtmlFragment html={html} />
    </div>
  );
}
