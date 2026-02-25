"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Linkedin,
  Play,
  Send,
} from "lucide-react";
import type { Product } from "@/types/product";
import UpcomingBookCard from "./upcoming-book-card";

type UpcomingBooksCarouselTrackProps = {
  title: string;
  slug: string;
  products: Product[];
};

type SocialLink = {
  label: string;
  handle: string;
  href: string;
  Icon: typeof Instagram;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "اینستاگرام",
    handle: "@qoqnoospub",
    href: "https://instagram.com/qoqnoospub",
    Icon: Instagram,
  },
  {
    label: "آپارات",
    handle: "qoqnoospublication",
    href: "https://www.aparat.com/qoqnoospublication",
    Icon: Play,
  },
  {
    label: "تلگرام",
    handle: "@qoqnoospub",
    href: "https://t.me/qoqnoospub",
    Icon: Send,
  },
  {
    label: "لینکدین",
    handle: "Qoqnoos Distribution Centre",
    href: "https://www.linkedin.com/in/qoqnoos-distribution-centre-009398208/",
    Icon: Linkedin,
  },
];

export default function UpcomingBooksCarouselTrack({
  title,
  slug,
  products,
}: UpcomingBooksCarouselTrackProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    if (!trackRef.current) return;

    const amount = trackRef.current.clientWidth;
    trackRef.current.scrollBy({
      left: dir === "next" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <section className="w-full bg-[#d9d9d9] py-8 md:py-10" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-5">
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
          {products.map((product) => (
            <div
              key={product.databaseId}
              className="w-full min-w-full shrink-0 snap-start md:w-[calc(50%-0.375rem)] md:min-w-[calc(50%-0.375rem)]"
            >
              <UpcomingBookCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/60 bg-white/45 px-3 py-3 md:mt-5 md:px-5 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-semibold text-dark-gray md:text-base">در شبکه‌های اجتماعی همراه ما باشید</p>

            <ul className="flex flex-wrap items-center gap-2 md:gap-3">
              {SOCIAL_LINKS.map(({ label, handle, href, Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-dark-gray/20 bg-white px-3 py-1.5 text-xs font-medium text-dark-gray transition-colors hover:border-primary-red hover:text-primary-red md:text-sm"
                  >
                    <Icon size={14} />
                    <span className="truncate">{handle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
