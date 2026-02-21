export interface ProductImage {
  sourceUrl: string;
  altText: string;
}

export interface AttributeTerm {
  name: string;
  slug: string;
  shadowImage: string;
}

export interface ProductAttribute {
  name: string;
  label: string;
  options: string[];
  terms?: {
    nodes: AttributeTerm[];
  };
}

export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  image: ProductImage | null;
  price?: string;
  regularPrice?: string;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  attributes?: {
    nodes: ProductAttribute[];
  };
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface ProductsConnection {
  pageInfo: PageInfo;
  nodes: Product[];
}
