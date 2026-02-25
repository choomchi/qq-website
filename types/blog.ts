export interface BlogPost {
  id: string;
  databaseId: number;
  title: string | null;
  slug: string;
  uri: string | null;
  date: string | null;
  excerpt: string | null;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string | null;
    } | null;
  } | null;
}

export interface GetLatestBlogPostsQueryData {
  posts: {
    nodes: BlogPost[];
  };
}

export interface GetLatestBlogPostsQueryVariables {
  first?: number;
}
