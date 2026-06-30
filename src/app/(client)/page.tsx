import { CobePhimMain } from "@/features/cobephim/components/cobephim-main";
import { loadCobePhimContent } from "@/features/cobephim/lib/load-cobephim-content";
import { buildHomepageAnimeSectionHtml } from "@/features/cobephim-home/components/homepage-anime-section";
import { getCachedHomepageAnimeCollections } from "@/features/movie-catalog/lib/movie-catalog-data";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function ClientHomePage() {
  const { main } = loadCobePhimContent();
  const animeCollections = await getCachedHomepageAnimeCollections();
  const animeHtml = buildHomepageAnimeSectionHtml(animeCollections);

  return <CobePhimMain appendHtml={animeHtml} html={main} />;
}
