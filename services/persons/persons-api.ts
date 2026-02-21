import { ApiClientError, type GraphQLResponse } from "@/types/graphql";
import type {
  GetWritersAndTranslatorsQueryData,
  GetWritersAndTranslatorsQueryVariables,
  Person,
} from "@/types/person";

const GET_WRITERS_AND_TRANSLATORS_QUERY = `
  query GetWritersAndTranslators(
    $count: Int = 20
    $writerCursor: String
    $translatorCursor: String
  ) {
    writers: terms(
      first: $count
      after: $writerCursor
      where: { taxonomies: PAWRITER, hideEmpty: true }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes { id databaseId name slug count shadowImage }
    }
    translators: terms(
      first: $count
      after: $translatorCursor
      where: { taxonomies: PATRANSLATOR, hideEmpty: true }
    ) {
      pageInfo { hasNextPage endCursor }
      nodes { id databaseId name slug count shadowImage }
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
  return `${appUrl.replace(/\/$/, "")}/api/graphql`;
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

export const personsApi = {
  getWritersAndTranslators: async (
    count = 20,
    writerCursor = "",
    translatorCursor = "",
  ): Promise<{ writers: Person[]; translators: Person[] }> => {
    const data = await graphqlRequest<
      GetWritersAndTranslatorsQueryData,
      GetWritersAndTranslatorsQueryVariables
    >(GET_WRITERS_AND_TRANSLATORS_QUERY, {
      count,
      writerCursor: writerCursor || undefined,
      translatorCursor: translatorCursor || undefined,
    });

    return {
      writers: data.writers.nodes,
      translators: data.translators.nodes,
    };
  },
};
