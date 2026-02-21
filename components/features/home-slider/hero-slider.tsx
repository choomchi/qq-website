import { homeSlidersApi } from "@/services/home-sliders/home-sliders-api";
import HeroSliderTrack from "./hero-slider-track";

export default async function HeroSlider() {
  const slides = await homeSlidersApi.getHomeSliders();

  return <HeroSliderTrack slides={slides} />;
}
