export const CACHE_REVALIDATE = {
  homePage: 300,
  homeSliders: 300,
  categories: 300,
  categoryTree: 900,
  persons: 600,
  series: 600,
  news: 600,
} as const;

export const CACHE_TAGS = {
  home: "home",
  homeSliders: "home-sliders",
  categories: "home-categories",
  categoryTree: "home-category-tree",
  persons: "home-persons",
  series: "home-series",
  news: "home-news",
} as const;

export function getCategoryProductsTag(slug: string): string {
  return `${CACHE_TAGS.categories}:${slug}`;
}
