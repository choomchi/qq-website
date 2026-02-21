import { personsApi } from "@/services/persons/persons-api";
import PersonsCarouselTrack from "./persons-carousel-track";

export default async function PersonsCarousel() {
  const { writers, translators } = await personsApi.getWritersAndTranslators(20);

  if (!writers.length && !translators.length) return null;

  return <PersonsCarouselTrack writers={writers} translators={translators} />;
}
