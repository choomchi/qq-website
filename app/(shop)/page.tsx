import { Suspense } from "react";
import HeroSlider from "@/components/features/home-slider";
import NavBar from "@/components/features/nav-bar";
import CategoryLinks from "@/components/features/category-links";
import CategorySection from "@/components/features/category-section";
import PersonsCarousel from "@/components/features/persons-carousel";
import EbookPlatforms from "@/components/features/ebook-platforms";
import SeriesCarousel from "@/components/features/series-carousel";
import UpcomingBooksCarousel from "@/components/features/upcoming-books-carousel";
import NewsCarousel from "@/components/features/news-carousel";

const SECTIONS = [
  { slug: "تازهها", title: undefined, bg: "dark", cardVariant: "default" },
  { slug: "بازنشر", title: undefined, bg: "default", cardVariant: "default" },
  {
    slug: "كودك-و-نوجوان-آفرينگان",
    title: "آخرین عناوین انتشارات آفرینگان",
    bg: "light",
    cardVariant: "default",
  },
  {
    slug: "هيلا",
    title: "آخرین عناوین انتشارات هیلا",
    bg: "dark",
    cardVariant: "default",
  },
  { slug: "پرفروشها", title: undefined, bg: "default", cardVariant: "default" },
] as const;

export default function ShopHomePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="w-full aspect-[16/4.7] bg-muted animate-pulse" />
        }
      >
        <HeroSlider />
      </Suspense>
      <NavBar />
      <CategoryLinks />
      {SECTIONS.slice(0, 4).map(({ slug, title, bg, cardVariant }) => (
        <Suspense key={slug} fallback={<CategorySectionSkeleton bg={bg} />}>
          <CategorySection
            slug={slug}
            title={title}
            bg={bg}
            cardVariant={cardVariant}
          />
        </Suspense>
      ))}
      <Suspense fallback={<SeriesCarouselSkeleton />}>
        <SeriesCarousel />
      </Suspense>
      <EbookPlatforms />
      <Suspense fallback={<PersonsCarouselSkeleton />}>
        <PersonsCarousel />
      </Suspense>
      {SECTIONS.slice(4).map(({ slug, title, bg, cardVariant }) => (
        <Suspense key={slug} fallback={<CategorySectionSkeleton bg={bg} />}>
          <CategorySection
            slug={slug}
            title={title}
            bg={bg}
            cardVariant={cardVariant}
          />
        </Suspense>
      ))}
      <Suspense fallback={<UpcomingBooksCarouselSkeleton />}>
        <UpcomingBooksCarousel />
      </Suspense>
      <Suspense fallback={<NewsCarouselSkeleton />}>
        <NewsCarousel />
      </Suspense>
    </main>
  );
}

function SeriesCarouselSkeleton() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="h-7 w-32 rounded-lg bg-muted animate-pulse mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-[calc(100%/7-10px)] shrink-0 min-w-32 rounded-xl bg-muted animate-pulse aspect-square"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function UpcomingBooksCarouselSkeleton() {
  return (
    <div className="w-full bg-[#d9d9d9] py-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-4 h-8 w-44 animate-pulse rounded-lg bg-white/55" />
        <div className="w-full rounded-3xl bg-white/55 p-4 md:p-5">
          <div className="h-46 animate-pulse rounded-2xl bg-white/70 md:h-56" />
        </div>
        <div className="mt-4 h-14 animate-pulse rounded-2xl bg-white/55 md:h-16" />
      </div>
    </div>
  );
}

function NewsCarouselSkeleton() {
  return (
    <div className="w-full bg-light-gray py-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-4 h-8 w-40 animate-pulse rounded-lg bg-white/70" />
        <div className="flex gap-2 overflow-hidden md:gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-80 min-w-0 flex-1 animate-pulse rounded-2xl bg-white/75"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonsCarouselSkeleton() {
  return (
    <div className="w-full bg-dark-gray">
      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="h-7 w-56 rounded-lg bg-white/10 animate-pulse mb-4" />
        <div className="flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-[calc(100%/7-10px)] shrink-0 min-w-28 rounded-xl bg-white/10 animate-pulse aspect-3/4"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategorySectionSkeleton({ bg }: { bg: string }) {
  const bgClass =
    bg === "dark" ? "bg-dark-gray" : bg === "light" ? "bg-light-gray" : "";
  return (
    <div className={`w-full ${bgClass}`}>
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="mb-3 h-6 w-40 rounded-lg bg-muted/30 animate-pulse" />
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-48 shrink-0 rounded-2xl bg-muted/30 animate-pulse aspect-[3/4.6]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
