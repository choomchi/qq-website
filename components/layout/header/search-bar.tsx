"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import type {
  SearchFacets,
  SearchHit,
  SearchResponse,
} from "@/app/api/search/route";

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/mysecretpreview").replace(
  /\/$/,
  "",
);
const SEARCH_API_URL = `${BASE_PATH}/api/search`;
const EMPTY_FACETS: SearchFacets = {
  writers: [],
  translators: [],
  categories: [],
  series: [],
  publishers: [],
};
const FACET_SECTIONS: Array<{ key: keyof SearchFacets; label: string }> = [
  { key: "writers", label: "نویسنده‌ها" },
  { key: "translators", label: "مترجم‌ها" },
  { key: "categories", label: "دسته‌ها" },
  { key: "series", label: "مجموعه‌ها" },
  { key: "publishers", label: "ناشرها" },
];

function hasFacetMatches(facets: SearchFacets): boolean {
  return Object.values(facets).some((items) => items.length > 0);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function getPrimaryMetaLabel(hit: SearchHit): string | null {
  if (hit.writers.length) {
    return `نویسنده: ${hit.writers.slice(0, 2).join("، ")}`;
  }

  if (hit.translators.length) {
    return `مترجم: ${hit.translators.slice(0, 2).join("، ")}`;
  }

  return null;
}

function buildMetaBadges(hit: SearchHit): string[] {
  const badges: string[] = [];

  if (hit.translators.length) {
    badges.push(`مترجم: ${hit.translators.slice(0, 2).join("، ")}`);
  }

  if (hit.categories.length) {
    badges.push(`دسته: ${hit.categories.slice(0, 2).join("، ")}`);
  }

  if (hit.series.length) {
    badges.push(`مجموعه: ${hit.series.slice(0, 2).join("، ")}`);
  }

  if (hit.publishers.length) {
    badges.push(`ناشر: ${hit.publishers.slice(0, 1).join("، ")}`);
  }

  return badges;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [facets, setFacets] = useState<SearchFacets>(EMPTY_FACETS);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setHits([]);
      setFacets(EMPTY_FACETS);
      setOpen(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as SearchResponse;

      setHits(data.hits ?? []);
      setFacets(data.facets ?? EMPTY_FACETS);
      setOpen(true);
    } catch {
      setHits([]);
      setFacets(EMPTY_FACETS);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasResults = hits.length > 0;
  const hasFacets = hasFacetMatches(facets);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full max-w-none md:max-w-md mx-0 md:mx-4 relative"
    >
      <div className="relative flex items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => (hasResults || hasFacets) && setOpen(true)}
          placeholder="جستجو در کتاب‌ها، نویسنده‌ها، مترجم‌ها و دسته‌ها . . ."
          dir="rtl"
          autoComplete="off"
          className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-2 pr-4 pl-10 text-base text-white placeholder:text-white/60 outline-none focus:border-white/60 focus:bg-white/15 transition-colors"
        />
        {loading ? (
          <Loader2
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 animate-spin"
            size={18}
          />
        ) : (
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none"
            size={18}
          />
        )}
      </div>

      {open && (hasResults || hasFacets) && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl border border-border bg-white shadow-xl z-50 overflow-hidden"
          dir="rtl"
        >
          {hasResults && (
            <>
              <div className="border-b border-border/70 px-3 py-2 text-[11px] font-semibold text-muted-foreground">
                کتاب‌ها
              </div>
              <ul>
                {hits.map((hit) => {
                  const primaryMeta = getPrimaryMetaLabel(hit);
                  const metaBadges = buildMetaBadges(hit);

                  return (
                    <li key={hit.id}>
                      <Link
                        href={`/product/${hit.slug}`}
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors"
                      >
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted/40">
                          {hit.thumbnail ? (
                            <Image
                              src={hit.thumbnail}
                              alt={hit.title}
                              fill
                              className="object-contain"
                              sizes="40px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                              📚
                            </div>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="line-clamp-1 text-sm font-semibold text-foreground">
                            {hit.title}
                          </span>
                          {primaryMeta && (
                            <span className="truncate text-xs text-muted-foreground">
                              {primaryMeta}
                            </span>
                          )}

                          {metaBadges.length > 0 && (
                            <div className="mt-1 flex flex-wrap items-center gap-1">
                              {metaBadges.map((badge) => (
                                <span
                                  key={`${hit.id}-${badge}`}
                                  className="inline-flex max-w-full rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                                  title={badge}
                                >
                                  <span className="truncate">{badge}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          {hasFacets && (
            <div className="border-t border-border/70 px-3 py-2">
              <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
                نتایج مرتبط با «{query}»
              </p>
              <div className="space-y-2">
                {FACET_SECTIONS.map((section) => {
                  const terms = facets[section.key];
                  if (!terms.length) return null;

                  return (
                    <div key={section.key} className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {section.label}:
                      </span>

                      {terms.map((term) => (
                        <button
                          key={`${section.key}-${term}`}
                          type="button"
                          onClick={() => {
                            setQuery(term);
                            void fetchResults(term);
                          }}
                          className="inline-flex max-w-full rounded-full border border-border/80 bg-background px-2 py-0.5 text-[11px] text-foreground transition-colors hover:bg-muted"
                          title={term}
                        >
                          <span className="truncate">{term}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-border px-3 py-2">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => {
                setOpen(false);
              }}
              className="text-xs font-medium text-primary-red hover:underline"
            >
              مشاهده همه نتایج برای «{query}»
            </Link>
          </div>
        </div>
      )}

      {open && !loading && !hasResults && !hasFacets && query.length >= 2 && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl border border-border bg-white shadow-xl z-50 px-4 py-3 text-sm text-muted-foreground"
          dir="rtl"
        >
          نتیجه‌ای یافت نشد.
        </div>
      )}
    </div>
  );
}
