export const queryKeys = {
  homeSliders: {
    all: () => ["home-sliders"] as const,
    byMetaKey: (metaKey: string) => ["home-sliders", metaKey] as const,
  },
} as const;
