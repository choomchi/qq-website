"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PersonCard from "./person-card";
import type { Person } from "@/types/person";

type PersonsCarouselTrackProps = {
  writers: Person[];
  translators: Person[];
};

export default function PersonsCarouselTrack({ writers, translators }: PersonsCarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === "next" ? -amount : amount, behavior: "smooth" });
  };

  const combined = [
    ...writers.map((p) => ({ person: p, role: "writer" as const })),
    ...translators.map((p) => ({ person: p, role: "translator" as const })),
  ];

  if (!combined.length) return null;

  return (
    <section className="w-full bg-dark-gray mt-12" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-6">

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className="block w-1 h-6 rounded-full bg-primary-red" />
            <h2 className="text-xl font-bold text-white">پدیدآورندگان همکار</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/authors"
              className="text-sm font-medium text-white/60 hover:text-primary-red transition-colors"
            >
              مشاهده همه
            </Link>
            <button
              onClick={() => scroll("prev")}
              aria-label="قبلی"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label="بعدی"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
        <div className="w-full h-px mb-5 bg-white/20" />

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {combined.map(({ person, role }) => (
            <div key={`${role}-${person.databaseId}`} className="w-[calc(100%/7-10px)] shrink-0 min-w-28">
              <PersonCard person={person} role={role} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
