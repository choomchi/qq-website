export const queryKeys = {
  homeSliders: {
    all: () => ["home-sliders"] as const,
    byMetaKey: (metaKey: string) => ["home-sliders", metaKey] as const,
  },
  categories: {
    all: () => ["categories"] as const,
    bySlug: (slug: string, first?: number, after?: string) =>
      ["categories", slug, first, after] as const,
  },
  persons: {
    all: () => ["persons"] as const,
  },
  series: {
    all: () => ["series"] as const,
  },
};
