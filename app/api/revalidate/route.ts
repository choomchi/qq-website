import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { CACHE_TAGS, getCategoryProductsTag } from "@/lib/cache";

const SECTION_TAGS: Record<string, string[]> = {
  home: [CACHE_TAGS.home],
  "home-sliders": [CACHE_TAGS.home, CACHE_TAGS.homeSliders],
  "home-categories": [CACHE_TAGS.home, CACHE_TAGS.categories],
  "home-category-tree": [
    CACHE_TAGS.home,
    CACHE_TAGS.categories,
    CACHE_TAGS.categoryTree,
  ],
  "home-persons": [CACHE_TAGS.home, CACHE_TAGS.persons],
  "home-series": [CACHE_TAGS.home, CACHE_TAGS.series],
  "home-news": [CACHE_TAGS.home, CACHE_TAGS.news],
};

type RevalidateBody = {
  secret?: string;
  tags?: string[];
  section?: string;
  slug?: string;
};

function normalizeTags(body: RevalidateBody): string[] {
  const tags = new Set<string>();

  if (body.section && SECTION_TAGS[body.section]) {
    SECTION_TAGS[body.section].forEach((tag) => tags.add(tag));
  }

  body.tags?.forEach((tag) => {
    const trimmed = tag.trim();
    if (trimmed) tags.add(trimmed);
  });

  if (body.slug) {
    tags.add(getCategoryProductsTag(body.slug));
  }

  if (!tags.size) {
    tags.add(CACHE_TAGS.home);
  }

  return Array.from(tags);
}

function getProvidedSecret(request: NextRequest, body: RevalidateBody): string {
  return (
    body.secret ??
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret") ??
    ""
  );
}

export async function POST(request: NextRequest): Promise<Response> {
  const configuredSecret = process.env.REVALIDATE_SECRET;

  if (!configuredSecret) {
    return Response.json(
      {
        revalidated: false,
        error: "Missing REVALIDATE_SECRET environment variable.",
      },
      { status: 500 },
    );
  }

  let body: RevalidateBody = {};

  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  const providedSecret = getProvidedSecret(request, body);

  if (providedSecret !== configuredSecret) {
    return Response.json(
      { revalidated: false, error: "Invalid revalidation secret." },
      { status: 401 },
    );
  }

  const tags = normalizeTags(body);

  tags.forEach((tag) => {
    revalidateTag(tag, "max");
  });

  return Response.json({
    revalidated: true,
    tags,
    timestamp: new Date().toISOString(),
  });
}
