import {
  CACHE_REVALIDATE,
  CACHE_TAGS,
  getCategoryProductsTag,
} from "@/lib/cache";
import { ApiClientError, type GraphQLResponse } from "@/types/graphql";
import type {
  Category,
  GetCategoryProductsQueryData,
  GetCategoryProductsQueryVariables,
  GetProductCategoriesTreeQueryData,
  GetProductCategoriesTreeQueryVariables,
  ProductCategoryFlatNode,
  ProductCategoryTreeNode,
} from "@/types/category";

const GET_CATEGORY_PRODUCTS_QUERY = `
  query GetCategoryAndProducts($slug: ID!, $first: Int = 12, $after: String) {
    productCategory(id: $slug, idType: SLUG) {
      name
      description
      count
      products(first: $first, after: $after, where: { status: "PUBLISH", orderby: [{ field: DATE, order: DESC }] }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          databaseId
          name
          slug
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            price
            regularPrice
            stockStatus
          }
          ... on VariableProduct {
            price
            regularPrice
          }
          ... on ProductWithAttributes {
            attributes {
              nodes {
                name
                label
                options
                ... on GlobalProductAttribute {
                  terms {
                    nodes {
                      name
                      slug
                      shadowImage
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_CATEGORIES_TREE_QUERY = `
  query GetProductCategoriesTree($first: Int = 100, $after: String) {
    productCategories(first: $first, after: $after, where: { hideEmpty: false }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        count
        parent {
          node {
            ... on ProductCategory {
              databaseId
            }
          }
        }
      }
    }
  }
`;

function sortTree(nodes: ProductCategoryTreeNode[]): ProductCategoryTreeNode[] {
  nodes.sort((a, b) => a.name.localeCompare(b.name, "fa"));
  nodes.forEach((node) => {
    if (node.children.length) sortTree(node.children);
  });
  return nodes;
}

function buildCategoryTree(flatNodes: ProductCategoryFlatNode[]): ProductCategoryTreeNode[] {
  const nodeMap = new Map<number, ProductCategoryTreeNode>();
  const parentMap = new Map<number, number | null>();

  for (const node of flatNodes) {
    nodeMap.set(node.databaseId, {
      id: node.id,
      databaseId: node.databaseId,
      name: node.name,
      slug: node.slug,
      count: node.count,
      children: [],
    });
    parentMap.set(node.databaseId, node.parent?.node?.databaseId ?? null);
  }

  const roots: ProductCategoryTreeNode[] = [];

  for (const [databaseId, categoryNode] of nodeMap.entries()) {
    const parentId = parentMap.get(databaseId);
    const parentNode = parentId ? nodeMap.get(parentId) : undefined;

    if (parentNode) {
      parentNode.children.push(categoryNode);
    } else {
      roots.push(categoryNode);
    }
  }

  return sortTree(roots);
}

function getProxyEndpoint(): string {
  if (typeof window !== "undefined") {
    return "/api/graphql";
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL;

  if (!appUrl) {
    throw new ApiClientError(
      "Missing NEXT_PUBLIC_APP_URL or APP_URL for server-side API requests.",
      500,
    );
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/mysecretpreview";
  return `${appUrl.replace(/\/$/, "")}${basePath}/api/graphql`;
}

type GraphqlCacheOptions = {
  revalidate: number;
  tags: string[];
};

async function parseFailureBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}

async function graphqlRequest<TData, TVariables extends object>(
  query: string,
  variables: TVariables,
  cacheOptions: GraphqlCacheOptions,
): Promise<TData> {
  const requestCaching =
    typeof window === "undefined"
      ? { next: { revalidate: cacheOptions.revalidate, tags: cacheOptions.tags } }
      : { cache: "no-store" as const };

  const response = await fetch(getProxyEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    ...requestCaching,
  });

  if (!response.ok) {
    const details = await parseFailureBody(response);
    throw new ApiClientError("Request to GraphQL proxy failed.", response.status, details);
  }

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new ApiClientError(
      payload.errors.map((err) => err.message).join(" | "),
      400,
      payload.errors,
    );
  }

  if (!payload.data) {
    throw new ApiClientError("GraphQL response did not include data.", 500, payload);
  }

  return payload.data;
}

export const categoriesApi = {
  getCategoryProducts: async (
    slug: string,
    first = 12,
    after = "",
  ): Promise<Category | null> => {
    const data = await graphqlRequest<
      GetCategoryProductsQueryData,
      GetCategoryProductsQueryVariables
    >(
      GET_CATEGORY_PRODUCTS_QUERY,
      { slug, first, after },
      {
        revalidate: CACHE_REVALIDATE.categories,
        tags: [
          CACHE_TAGS.home,
          CACHE_TAGS.categories,
          getCategoryProductsTag(slug),
        ],
      },
    );

    return data.productCategory;
  },
  getProductCategoriesTree: async (
    first = 100,
  ): Promise<ProductCategoryTreeNode[]> => {
    const flatNodes: ProductCategoryFlatNode[] = [];
    let after: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const responseData: GetProductCategoriesTreeQueryData = await graphqlRequest<
        GetProductCategoriesTreeQueryData,
        GetProductCategoriesTreeQueryVariables
      >(
        GET_PRODUCT_CATEGORIES_TREE_QUERY,
        { first, after },
        {
          revalidate: CACHE_REVALIDATE.categoryTree,
          tags: [CACHE_TAGS.home, CACHE_TAGS.categories, CACHE_TAGS.categoryTree],
        },
      );

      flatNodes.push(...responseData.productCategories.nodes);
      hasNextPage = responseData.productCategories.pageInfo.hasNextPage;
      after = responseData.productCategories.pageInfo.endCursor;

      if (!hasNextPage || !after) {
        hasNextPage = false;
      }
    }

    return buildCategoryTree(flatNodes);
  },
};
