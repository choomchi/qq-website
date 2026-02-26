"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types/product";
import UpcomingBookCard from "./upcoming-book-card";

const TRANSITION_DURATION_MS = 280;

type UpcomingBooksCarouselTrackProps = {
  title: string;
  slug: string;
  products: Product[];
};

export default function UpcomingBooksCarouselTrack({
  title,
  slug,
  products,
}: UpcomingBooksCarouselTrackProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const swapTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (swapTimerRef.current !== null) {
      window.clearTimeout(swapTimerRef.current);
      swapTimerRef.current = null;
    }

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  const getNextIndex = useCallback(
    (from: number) => (from === products.length - 1 ? 0 : from + 1),
    [products.length],
  );

  const getPrevIndex = useCallback(
    (from: number) => (from === 0 ? products.length - 1 : from - 1),
    [products.length],
  );

  const move = useCallback(
    (dir: "next" | "prev") => {
      if (products.length < 2 || isTransitioning) return;

      clearTimers();
      setDirection(dir);
      setIsTransitioning(true);

      swapTimerRef.current = window.setTimeout(() => {
        setCurrent((index) => (dir === "next" ? getNextIndex(index) : getPrevIndex(index)));
      }, TRANSITION_DURATION_MS / 2);

      resetTimerRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION_MS);
    },
    [clearTimers, getNextIndex, getPrevIndex, isTransitioning, products.length],
  );

  const prev = useCallback(() => {
    move("prev");
  }, [move]);

  const next = useCallback(() => {
    move("next");
  }, [move]);

  useEffect(() => {
    if (products.length < 2) return;

    const timer = window.setInterval(() => move("next"), 5000);
    return () => window.clearInterval(timer);
  }, [move, products.length]);

  useEffect(() => {
    if (current >= products.length) {
      setCurrent(0);
    }
  }, [current, products.length]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const featuredProduct = products[current];
  if (!featuredProduct) return null;

  return (
    <section className="w-full" dir="rtl">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 md:mb-4">
        <div className="flex items-center gap-3">
          <span className="block h-6 w-1 rounded-full bg-primary-red" />
          <h2 className="text-xl font-bold text-dark-gray md:text-2xl">{title}</h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href={`/product-category/${slug}`}
            className="rounded-lg bg-dark-gray px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-red md:text-sm"
          >
            مشاهده همه
          </Link>
          {products.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="قبلی"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-gray/25 bg-white text-dark-gray transition-colors hover:border-primary-red hover:text-primary-red"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="بعدی"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-gray/25 bg-white text-dark-gray transition-colors hover:border-primary-red hover:text-primary-red"
              >
                <ChevronLeft size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div
        className={`w-full transition-all duration-300 ${
          isTransitioning
            ? direction === "next"
              ? "-translate-x-2 opacity-0"
              : "translate-x-2 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <UpcomingBookCard product={featuredProduct} />
      </div>
    </section>
  );
}
