import { MovieCatalogLayout } from "@/features/movie-catalog/components/movie-catalog-layout";
import { ScheduleBoard } from "@/features/movie-catalog/components/schedule-board";
import { moviesService } from "@/features/movie-catalog/lib/movie-catalog-data";
import { buildMovieScheduleDays } from "@/features/movie-catalog/lib/movie-schedule";

interface SchedulePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedDay = getSingleQueryValue(resolvedSearchParams.day);
  const days = await buildMovieScheduleDays(moviesService);
  const activeDayId = selectedDay && days.some((day) => day.id === selectedDay) ? selectedDay : days[0]?.id;

  return (
    <MovieCatalogLayout>
      <section className="movie-page-section movie-page-section--flush">
        <ScheduleBoard activeDayId={activeDayId || ""} days={days} />
      </section>
    </MovieCatalogLayout>
  );
}
