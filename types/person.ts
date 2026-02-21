export interface Person {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  count: number;
  shadowImage: string;
}

export interface PersonsConnection {
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  nodes: Person[];
}

export interface GetWritersAndTranslatorsQueryData {
  writers: PersonsConnection;
  translators: PersonsConnection;
}

export interface GetWritersAndTranslatorsQueryVariables {
  count?: number;
  writerCursor?: string;
  translatorCursor?: string;
}
