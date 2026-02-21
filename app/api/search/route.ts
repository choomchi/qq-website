import { NextRequest, NextResponse } from "next/server";

const ELASTIC_BASE_URL = process.env.ELASTIC_BASE_URL ?? "http://localhost:9201";
const INDEX = "qoqnoosir-post-1";

export interface SearchHit {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  writer: string | null;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ hits: [] });
  }

  const body = {
    size: 8,
    _source: ["post_title", "post_name", "thumbnail", "terms.pa_writer"],
    query: {
      bool: {
        must: [
          {
            multi_match: {
              query: q,
              fields: ["post_title^3", "post_title.suggest^2", "terms.pa_writer.name"],
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
      return NextResponse.json({ hits: [] }, { status: 502 });
    }

    const data = await res.json();

    const hits: SearchHit[] = (data.hits?.hits ?? []).map((h: Record<string, unknown>) => {
      const src = h._source as Record<string, unknown>;
      const thumbSrc = (src.thumbnail as Record<string, unknown> | null)?.src as string | undefined;
      const writerTerms = (src.terms as Record<string, unknown> | null)?.pa_writer as
        | Array<{ name: string }>
        | undefined;

      return {
        id: h._id as string,
        title: src.post_title as string,
        slug: src.post_name as string,
        thumbnail: thumbSrc ?? null,
        writer: writerTerms?.[0]?.name ?? null,
      };
    });

    return NextResponse.json({ hits });
  } catch {
    return NextResponse.json({ hits: [] }, { status: 500 });
  }
}
