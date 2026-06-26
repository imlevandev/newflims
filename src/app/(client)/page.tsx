import { CobePhimShell } from "@/features/cobephim/components/cobephim-shell";
import { MoviesService } from "@/server/modules/movies/movies.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const moviesService = new MoviesService();

export default async function ClientHomePage() {
  const feed = await moviesService.getHomepageFeed();

  return <CobePhimShell feed={feed} />;
}
