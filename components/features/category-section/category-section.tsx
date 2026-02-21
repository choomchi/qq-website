import { categoriesApi } from "@/services/categories/categories-api";
import CategoryCarousel from "./category-carousel";

type BgVariant = "default" | "dark" | "light";
type CardVariant = "default" | "detail";

type CategorySectionProps = {
  slug: string;
  title?: string;
  bg?: BgVariant;
  cardVariant?: CardVariant;
};

export default async function CategorySection({ slug, title, bg, cardVariant }: CategorySectionProps) {
  const category = await categoriesApi.getCategoryProducts(slug);

  if (!category || !category.products.nodes.length) return null;

  return (
    <CategoryCarousel
      title={title ?? category.name}
      slug={slug}
      products={category.products.nodes}
      bg={bg}
      cardVariant={cardVariant}
    />
  );
}
