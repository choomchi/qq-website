import type { ProductsConnection } from "./product";

export interface Category {
  name: string;
  description: string | null;
  count: number;
  products: ProductsConnection;
}

export interface GetCategoryProductsQueryData {
  productCategory: Category | null;
}

export interface GetCategoryProductsQueryVariables {
  slug: string;
  first?: number;
  after?: string;
}
