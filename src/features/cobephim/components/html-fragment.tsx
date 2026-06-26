import type { ElementType } from "react";

interface HtmlFragmentProps {
  as?: ElementType;
  className?: string;
  html: string;
}

export function HtmlFragment({
  as = "div",
  className,
  html,
}: HtmlFragmentProps) {
  const Component = as;

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      suppressHydrationWarning
    />
  );
}
