export interface Series {
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  isSeries: boolean;
  shadowImage: string;
}

export interface SeriesConnection {
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  nodes: Series[];
}

export interface GetSeriesListQueryData {
  terms: SeriesConnection;
}

export interface GetSeriesListQueryVariables {
  count?: number;
  cursor?: string;
}
