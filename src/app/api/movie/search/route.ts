import { handleRoute } from "@/server/common/http/route-handler";
import { MoviesService } from "@/server/modules/movies/movies.service";

const moviesService = new MoviesService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return handleRoute(() =>
    moviesService.searchMovies(
      searchParams.get("q") ?? "",
      searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    ),
  );
}
