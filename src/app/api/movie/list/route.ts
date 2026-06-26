import { handleRoute } from "@/server/common/http/route-handler";
import { MoviesService } from "@/server/modules/movies/movies.service";

const moviesService = new MoviesService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  return handleRoute(() =>
    moviesService.getMovieList({
      category: searchParams.get("category") ?? undefined,
      country: searchParams.get("country") ?? undefined,
      limit: searchParams.get("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      sort: searchParams.get("sort") ?? undefined,
      type: searchParams.get("type") ?? undefined,
    }),
  );
}
