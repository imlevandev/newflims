import { handleRoute } from "@/server/common/http/route-handler";
import { MoviesService } from "@/server/modules/movies/movies.service";

const moviesService = new MoviesService();

export async function GET() {
  return handleRoute(() => moviesService.getCategories());
}
