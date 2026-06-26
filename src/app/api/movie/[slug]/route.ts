import { handleRoute } from "@/server/common/http/route-handler";
import { MoviesService } from "@/server/modules/movies/movies.service";

const moviesService = new MoviesService();

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  return handleRoute(() => moviesService.getMovieDetail(slug));
}
