import { AppError } from "@/server/common/errors/app-error";
import { handleRoute } from "@/server/common/http/route-handler";
import { env } from "@/server/config/env";
import { MoviesCrawlService } from "@/server/modules/movies/movies-crawl.service";
import type { CrawlRequestDto } from "@/server/modules/movies/dto/crawl.dto";

const moviesCrawlService = new MoviesCrawlService();

export async function POST(request: Request) {
  const headerSecret = request.headers.get("x-crawl-secret");
  const body = (await request.json().catch(() => ({}))) as CrawlRequestDto;
  const secretKey = headerSecret || body.secretKey;

  return handleRoute(() => {
    if (secretKey !== env.CRAWL_SECRET_KEY) {
      throw new AppError("Invalid crawl secret key", 401, "INVALID_CRAWL_SECRET");
    }

    return moviesCrawlService.crawl(body);
  });
}
