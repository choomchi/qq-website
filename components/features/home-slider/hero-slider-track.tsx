"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { HomeSlider } from "@/types/home-slider";

type HeroSliderTrackProps = {
  slides: HomeSlider[];
};

export default function HeroSliderTrack({ slides }: HeroSliderTrackProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  }, [slides.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  if (!slides.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <Link
            key={slide.databaseId}
            href={slide.altText || "/"}
            className="relative w-full shrink-0 aspect-[16/4.7]"
            tabIndex={-1}
          >
            <Image
              src={slide.sourceUrl}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={slides.indexOf(slide) === 0}
            />
          </Link>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="اسلاید قبلی"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
      >
        <ChevronRight size={18} />
      </button>
      <button
        onClick={next}
        aria-label="اسلاید بعدی"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`رفتن به اسلاید ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
