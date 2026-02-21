import { ApiClientError, type GraphQLResponse } from "@/types/graphql";
import type {
  GetHomeGalleryQueryData,
  GetHomeGalleryQueryVariables,
  HomeSlider,
} from "@/types/home-slider";

const DEFAULT_META_KEY = "images";

const GET_HOME_GALLERY_QUERY = `
  query GetHomeGallery($metaKey: String!) {
    homeGalleryImages(metaKey: $metaKey) {
      databaseId
      sourceUrl
      altText
      caption
      title
      mimeType
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

  return `${appUrl.replace(/\/$/, "")}/api/graphql`;
}

async function parseFailureBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function graphqlRequest<
  TData,
  TVariables extends object,
>(query: string, variables: TVariables): Promise<TData> {
  const response = await fetch(getProxyEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

export const homeSlidersApi = {
  getHomeSliders: async (metaKey = DEFAULT_META_KEY): Promise<HomeSlider[]> => {
    const data = await graphqlRequest<
      GetHomeGalleryQueryData,
      GetHomeGalleryQueryVariables
    >(GET_HOME_GALLERY_QUERY, { metaKey });

    return data.homeGalleryImages;
  },
};
