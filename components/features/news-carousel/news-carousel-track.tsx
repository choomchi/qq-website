"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { BlogPost } from "@/types/blog";
import NewsCard from "./news-card";

type NewsCarouselTrackProps = {
  title: string;
  posts: BlogPost[];
};

const BLOG_LIST_URL = "https://qoqnoos.ir/blog";

export default function NewsCarouselTrack({ title, posts }: NewsCarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    if (!trackRef.current) return;

    const amount = trackRef.current.clientWidth;
    trackRef.current.scrollBy({
      left: dir === "next" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!posts.length) return null;

  return (
    <section className="w-full bg-light-gray py-8 md:py-10" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-5">
          <div className="flex items-center gap-3">
            <span className="block h-6 w-1 rounded-full bg-primary-red" />
            <h2 className="text-xl font-bold text-dark-gray md:text-2xl">{title}</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href={BLOG_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-dark-gray px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-red md:text-sm"
            >
              مشاهده همه
            </Link>
            <button
              type="button"
              onClick={() => scroll("prev")}
              aria-label="قبلی"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-gray/25 bg-white text-dark-gray transition-colors hover:border-primary-red hover:text-primary-red"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              aria-label="بعدی"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-gray/25 bg-white text-dark-gray transition-colors hover:border-primary-red hover:text-primary-red"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 md:gap-3"
          style={{ scrollbarWidth: "none" }}
        >
          {posts.map((post) => (
            <div
              key={post.databaseId}
              className="w-full min-w-full shrink-0 snap-start md:w-[calc(50%-0.375rem)] md:min-w-[calc(33%-0.375rem)] xl:w-[calc(22%-0.5rem)] xl:min-w-[calc(22%-0.5rem)]"
            >
              <NewsCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
