import { NextRequest, NextResponse } from "next/server";

const ELASTIC_BASE_URL = process.env.ELASTIC_BASE_URL ?? "http://localhost:9201";
const INDEX = "qoqnoosir-post-1";
const PRODUCT_RESULT_LIMIT = 8;
const SEARCH_POOL_SIZE = 24;
const FACET_RESULT_LIMIT = 6;

type TaxonomyTerm = {
  name: string;
};

export interface SearchHit {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  kind: "product";
  writer: string | null;
  writers: string[];
  translators: string[];
  categories: string[];
  series: string[];
  publishers: string[];
}

export interface SearchFacets {
  writers: string[];
  translators: string[];
  categories: string[];
  series: string[];
  publishers: string[];
}

export interface SearchResponse {
  hits: SearchHit[];
  facets: SearchFacets;
}

function getTerms(source: Record<string, unknown>): Record<string, unknown> {
  const raw = source.terms;

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }

  return {};
}

function extractTermNames(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];

  const names = raw
    .map((term) => {
      if (!term || typeof term !== "object") return null;

      const name = (term as TaxonomyTerm).name;
      if (!name) return null;

      const trimmed = name.trim();
      return trimmed || null;
    })
    .filter((name): name is string => Boolean(name));

  return Array.from(new Set(names));
}

function createEmptyFacets(): SearchFacets {
  return {
    writers: [],
    translators: [],
    categories: [],
    series: [],
    publishers: [],
  };
}

function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("fa-IR")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim();
}

function collectMatchingTerms(terms: string[], query: string): string[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return [];

  const matches = terms.filter((term) =>
    normalizeSearchText(term).includes(normalizedQuery),
  );

  return Array.from(new Set(matches)).slice(0, FACET_RESULT_LIMIT);
}

function buildFacets(hits: SearchHit[], query: string): SearchFacets {
  return {
    writers: collectMatchingTerms(
      hits.flatMap((hit) => hit.writers),
      query,
    ),
    translators: collectMatchingTerms(
      hits.flatMap((hit) => hit.translators),
      query,
    ),
    categories: collectMatchingTerms(
      hits.flatMap((hit) => hit.categories),
      query,
    ),
    series: collectMatchingTerms(
      hits.flatMap((hit) => hit.series),
      query,
    ),
    publishers: collectMatchingTerms(
      hits.flatMap((hit) => hit.publishers),
      query,
    ),
  };
}

function splitSeriesAndCategories(terms: string[]): { categories: string[]; series: string[] } {
  const categories: string[] = [];
  const series: string[] = [];

  terms.forEach((term) => {
    if (term.startsWith("مجموعه") || term.includes("مجموعه")) {
      series.push(term);
      return;
    }

    categories.push(term);
  });

  return {
    categories: Array.from(new Set(categories)),
    series: Array.from(new Set(series)),
  };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json<SearchResponse>({
      hits: [],
      facets: createEmptyFacets(),
    });
  }

  const body = {
    size: SEARCH_POOL_SIZE,
    _source: [
      "post_title",
      "post_name",
      "thumbnail",
      "terms.pa_writer",
      "terms.pa_translator",
      "terms.product_cat",
      "terms.pa_publisher",
    ],
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query: q,
              fields: [
                "post_title^4",
                "post_title.suggest^3",
                "terms.pa_writer.name^3",
                "terms.pa_translator.name^3",
                "terms.product_cat.name^2",
                "terms.pa_publisher.name^1.5",
              ],
              type: "best_fields",
              fuzziness: "AUTO",
            },
          },
        ],
        filter: [
          { term: { "post_type.raw": "product" } },
          { term: { post_status: "publish" } },
        ],
      },
    },
  };

  try {
    const res = await fetch(`${ELASTIC_BASE_URL}/${INDEX}/_search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json<SearchResponse>(
        {
          hits: [],
          facets: createEmptyFacets(),
        },
        { status: 502 },
      );
    }

    const data = await res.json();

    const normalizedHits: SearchHit[] = (data.hits?.hits ?? []).map((h: Record<string, unknown>) => {
      const src = h._source as Record<string, unknown>;
      const thumbSrc = (src.thumbnail as Record<string, unknown> | null)?.src as
        | string
        | undefined;
      const terms = getTerms(src);

      const writers = extractTermNames(terms.pa_writer);
      const translators = extractTermNames(terms.pa_translator);
      const publishers = extractTermNames(terms.pa_publisher);
      const productCategoryTerms = extractTermNames(terms.product_cat);
      const { categories, series } = splitSeriesAndCategories(productCategoryTerms);

      return {
        id: h._id as string,
        title: src.post_title as string,
        slug: src.post_name as string,
        thumbnail: thumbSrc ?? null,
        kind: "product",
        writer: writers[0] ?? null,
        writers,
        translators,
        categories,
        series,
        publishers,
      };
    });

    return NextResponse.json<SearchResponse>({
      hits: normalizedHits.slice(0, PRODUCT_RESULT_LIMIT),
      facets: buildFacets(normalizedHits, q),
    });
  } catch {
    return NextResponse.json<SearchResponse>(
      {
        hits: [],
        facets: createEmptyFacets(),
      },
      { status: 500 },
    );
  }
}
