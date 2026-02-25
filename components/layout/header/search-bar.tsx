"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import type { SearchHit } from "@/app/api/search/route";

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/mysecretpreview").replace(
  /\/$/,
  "",
);
const SEARCH_API_URL = `${BASE_PATH}/api/search`;

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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setHits([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${SEARCH_API_URL}?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setHits(data.hits ?? []);
      setOpen(true);
    } catch {
      setHits([]);
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
          onFocus={() => hits.length > 0 && setOpen(true)}
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

      {open && hits.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full rounded-xl border border-border bg-white shadow-xl z-50 overflow-hidden"
          dir="rtl"
        >
          <ul>
            {hits.map((hit) => (
              <li key={hit.id}>
                {/** Product results enriched with taxonomy metadata */}
                {(() => {
                  const primaryMeta = getPrimaryMetaLabel(hit);
                  const metaBadges = buildMetaBadges(hit);

                  return (
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
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-foreground line-clamp-1">
                      {hit.title}
                    </span>
                    {primaryMeta && (
                      <span className="text-xs text-muted-foreground truncate">
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
                  );
                })()}
              </li>
            ))}
          </ul>
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

      {open && !loading && hits.length === 0 && query.length >= 2 && (
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
