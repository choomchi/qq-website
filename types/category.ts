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

export interface ProductCategoryFlatNode {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  parent: {
    node: {
      databaseId: number;
    } | null;
  } | null;
}

export interface ProductCategoryTreeNode {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  children: ProductCategoryTreeNode[];
}

export interface GetProductCategoriesTreeQueryData {
  productCategories: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: ProductCategoryFlatNode[];
  };
}

export interface GetProductCategoriesTreeQueryVariables {
  first?: number;
  after?: string | null;
}
