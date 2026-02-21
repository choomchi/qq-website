import { seriesApi } from "@/services/series/series-api";
import SeriesCarouselTrack from "./series-carousel-track";

export default async function SeriesCarousel() {
  const series = await seriesApi.getSeriesList(100);

  if (!series.length) return null;

  return <SeriesCarouselTrack series={series} />;
}
