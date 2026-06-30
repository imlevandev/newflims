'use client';

import { MovieUtilityActions } from "@/features/movie-catalog/components/movie-utility-actions";

interface MoviePageShellProps {
  html: string;
  movieSlug: string;
  primaryHref: string;
  score: string;
}

export function MoviePageShell({ html, movieSlug, primaryHref, score }: MoviePageShellProps) {
  return (
    <>
      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
      <div style={{ position: 'fixed', bottom: '0', left: '0', right: '0', zIndex: 100, padding: '0 16px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <MovieUtilityActions
            movieSlug={movieSlug}
            primaryHref={primaryHref}
            score={score}
          />
        </div>
      </div>
    </>
  );
}
