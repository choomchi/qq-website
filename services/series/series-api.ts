import { ApiClientError, type GraphQLResponse } from "@/types/graphql";
import type {
  GetSeriesListQueryData,
  GetSeriesListQueryVariables,
  Series,
} from "@/types/series";

const GET_SERIES_LIST_QUERY = `
  query GetSeriesWithImages($count: Int = 20, $cursor: String) {
    terms(
      first: $count
      after: $cursor
      where: { taxonomies: PRODUCTCATEGORY, hideEmpty: true }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes {
        databaseId
        name
        slug
        isSeries
        shadowImage
      }
    }
  }
`;

function getProxyEndpoint(): string {
  if (typeof window !== "undefined") return "/api/graphql";
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
    const ct = response.headers.get("content-type") ?? "";
    const details = ct.includes("application/json")
      ? await response.json()
      : await response.text();
    throw new ApiClientError("Request to GraphQL proxy failed.", response.status, details);
  }

  const payload = (await response.json()) as GraphQLResponse<TData>;

  if (payload.errors?.length) {
    throw new ApiClientError(
      payload.errors.map((e) => e.message).join(" | "),
      400,
      payload.errors,
    );
  }

  if (!payload.data) {
    throw new ApiClientError("GraphQL response did not include data.", 500, payload);
  }

  return payload.data;
}

export const seriesApi = {
  getSeriesList: async (count = 100, cursor = ""): Promise<Series[]> => {
    const data = await graphqlRequest<
      GetSeriesListQueryData,
      GetSeriesListQueryVariables
    >(GET_SERIES_LIST_QUERY, {
      count,
      cursor: cursor || undefined,
    });

    return data.terms.nodes.filter((s) => s.isSeries && s.name.startsWith("مجموعه"));
  },
};
