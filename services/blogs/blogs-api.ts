import { ApiClientError, type GraphQLResponse } from "@/types/graphql";
import type {
  BlogPost,
  GetLatestBlogPostsQueryData,
  GetLatestBlogPostsQueryVariables,
} from "@/types/blog";

const GET_LATEST_BLOG_POSTS_QUERY = `
  query GetLatestBlogPosts($first: Int = 8) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        databaseId
        title
        slug
        uri
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
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
  if (contentType.includes("application/json")) {
    return response.json();
  }
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
      payload.errors.map((error) => error.message).join(" | "),
      400,
      payload.errors,
    );
  }

  if (!payload.data) {
    throw new ApiClientError("GraphQL response did not include data.", 500, payload);
  }

  return payload.data;
}

export const blogsApi = {
  getLatestPosts: async (first = 8): Promise<BlogPost[]> => {
    const data = await graphqlRequest<
      GetLatestBlogPostsQueryData,
      GetLatestBlogPostsQueryVariables
    >(GET_LATEST_BLOG_POSTS_QUERY, { first });

    return data.posts.nodes;
  },
};
