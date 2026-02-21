import { ApiClientError, type GraphQLResponse } from "@/types/graphql";
import type {
  Category,
  GetCategoryProductsQueryData,
  GetCategoryProductsQueryVariables,
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

async function parseFailureBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}

async function graphqlRequest<TData, TVariables extends object>(
  query: string,
  variables: TVariables,
): Promise<TData> {
  const response = await fetch(getProxyEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
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
    >(GET_CATEGORY_PRODUCTS_QUERY, { slug, first, after });

    return data.productCategory;
  },
};
