"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "@/components/features/product-card/product-card";
import ProductCardDetail from "@/components/features/product-card/product-card-detail";
import type { Product } from "@/types/product";

type BgVariant = "default" | "dark" | "light";

const bgClasses: Record<BgVariant, string> = {
  default: "",
  dark: "bg-dark-gray",
  light: "bg-light-gray",
};

const titleClasses: Record<BgVariant, string> = {
  default: "text-foreground",
  dark: "text-white",
  light: "text-dark-gray",
};

type CardVariant = "default" | "detail";

type CategoryCarouselProps = {
  title: string;
  slug: string;
  products: Product[];
  bg?: BgVariant;
  cardVariant?: CardVariant;
};

export default function CategoryCarousel({ title, slug, products, bg = "default", cardVariant = "default" }: CategoryCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.75;
    trackRef.current.scrollBy({ left: dir === "next" ? -amount : amount, behavior: "smooth" });
  };

  if (!products.length) return null;

  const subtleText = bg === "default" ? "text-muted-foreground" : "text-white/60";
  const arrowBorder = bg === "default" ? "border-border text-foreground hover:bg-muted" : "border-white/30 text-white hover:bg-white/10";

  return (
    <section className={`w-full ${bgClasses[bg]}`} dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 pb-4">

        {/* Section header */}
        <div className="mb-0.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="block w-1 h-6 rounded-full bg-primary-red" />
            <h2 className={`text-xl font-bold ${titleClasses[bg]}`}>{title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/product-category/${slug}`}
              className={`text-sm font-medium transition-colors ${subtleText} hover:text-primary-red`}
            >
              مشاهده همه
            </Link>
            <button
              onClick={() => scroll("prev")}
              aria-label="قبلی"
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${arrowBorder}`}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => scroll("next")}
              aria-label="بعدی"
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${arrowBorder}`}
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
        <div className={`mb-3 h-px w-full ${bg === "default" ? "bg-border" : "bg-white/20"}`} />

        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product) => (
            <div key={product.databaseId} className="w-[calc(18%-10px)] shrink-0 min-w-40">
              {cardVariant === "detail" ? (
                <ProductCardDetail product={product} />
              ) : (
                <ProductCard product={product} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
