export interface HomeSlider {
  databaseId: number;
  sourceUrl: string;
  altText: string;
  caption: string;
  title: string;
  mimeType: string;
}

export interface GetHomeGalleryQueryData {
  homeGalleryImages: HomeSlider[];
}

export interface GetHomeGalleryQueryVariables {
  metaKey: string;
}
