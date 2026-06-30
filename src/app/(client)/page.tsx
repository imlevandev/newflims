import { headers } from "next/headers";

import { CobePhimMain } from "@/features/cobephim/components/cobephim-main";
import { loadCobePhimContent } from "@/features/cobephim/lib/load-cobephim-content";
import { getCachedHomepageAnimeCollections } from "@/features/movie-catalog/lib/movie-catalog-data";
import type { ApiSuccessResponse } from "@/server/common/http/api-response";
import type { HomepageFeedDto } from "@/server/modules/movies/dto/movie.dto";

export const revalidate = 300;
export const dynamic = "force-dynamic";

async function getHomepageFeedFromInternalApi() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
  const response = await fetch(`${protocol}://${host}/api/homepage`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Homepage API failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiSuccessResponse<HomepageFeedDto>;

  if (!payload.success) {
    throw new Error("Homepage API returned an error response");
  }

  return payload.data;
}

export default async function ClientHomePage() {
  const { main } = loadCobePhimContent();
  const [feed, animeCollections] = await Promise.all([
    getHomepageFeedFromInternalApi(),
    getCachedHomepageAnimeCollections(),
  ]);

  return <CobePhimMain animeCollections={animeCollections} feed={feed} html={main} />;
}
