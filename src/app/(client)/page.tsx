import { CobePhimShell } from "@/features/cobephim/components/cobephim-shell";
import { MoviesService } from "@/server/modules/movies/movies.service";

const moviesService = new MoviesService();

export default async function ClientHomePage() {
  const feed = await moviesService.getHomepageFeed();

  return <CobePhimShell feed={feed} />;
}
