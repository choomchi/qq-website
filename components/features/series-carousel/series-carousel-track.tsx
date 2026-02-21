"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import SeriesCard from "./series-card";
import type { Series } from "@/types/series";

type SeriesCarouselTrackProps = {
  series: Series[];
};

export default function SeriesCarouselTrack({ series }: SeriesCarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === "next" ? -amount : amount, behavior: "smooth" });
  };

  if (!series.length) return null;

  return (
    <section className="w-full" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-6">

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className="block w-1 h-6 rounded-full bg-primary-red" />
            <h2 className="text-xl font-bold text-foreground">مجموعه‌ها</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/series"
              className="text-sm font-medium text-muted-foreground hover:text-primary-red transition-colors"
            >
              مشاهده همه
            </Link>
            <button
              onClick={() => scroll("prev")}
              aria-label="قبلی"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label="بعدی"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
        <div className="w-full h-px mb-5 bg-border" />

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {series.map((s) => (
            <div key={s.databaseId} className="w-[calc(100%/7-10px)] shrink-0 min-w-32">
              <SeriesCard series={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
