import { categoriesApi } from "@/services/categories/categories-api";
import UpcomingBooksCarouselTrack from "./upcoming-books-carousel-track";

const UPCOMING_BOOKS_SLUG = "در-دست-انتشار";

export default async function UpcomingBooksCarousel() {
  const category = await categoriesApi.getCategoryProducts(UPCOMING_BOOKS_SLUG);

  if (!category || !category.products.nodes.length) return null;

  return (
    <UpcomingBooksCarouselTrack
      title={category.name || "در دست انتشار"}
      slug={UPCOMING_BOOKS_SLUG}
      products={category.products.nodes}
    />
  );
}
