import { Suspense } from "react";
import Link from "next/link";
import HeroSlider from "@/components/features/home-slider";
import CategoryLinks from "@/components/features/category-links";
import CategorySection from "@/components/features/category-section";
import PersonsCarousel from "@/components/features/persons-carousel";
import EbookPlatforms from "@/components/features/ebook-platforms";
import SeriesCarousel from "@/components/features/series-carousel";
import UpcomingBooksCarousel from "@/components/features/upcoming-books-carousel";
import NewsCarousel from "@/components/features/news-carousel";

export const revalidate = 300;

const SECTIONS = [
  { slug: "تازهها", title: undefined, bg: "light", cardVariant: "detail" },
  { slug: "بازنشر", title: undefined, bg: "default", cardVariant: "detail" },
  {
    slug: "كودك-و-نوجوان-آفرينگان",
    title: "آخرین عناوین انتشارات آفرینگان",
    bg: "light",
    cardVariant: "detail",
  },
  {
    slug: "هيلا",
    title: "آخرین عناوین انتشارات هیلا",
    bg: "dark",
    cardVariant: "detail",
  },
  { slug: "پرفروشها", title: undefined, bg: "default", cardVariant: "detail" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "اینستاگرام",
    handle: "@qoqnoospub",
    href: "https://instagram.com/qoqnoospub",
  },
  {
    label: "آپارات",
    handle: "qoqnoospublication",
    href: "https://www.aparat.com/qoqnoospublication",
  },
  {
    label: "تلگرام",
    handle: "@qoqnoospub",
    href: "https://t.me/qoqnoospub",
  },
  {
    label: "لینکدین",
    handle: "Qoqnoos Distribution Centre",
    href: "https://www.linkedin.com/in/qoqnoos-distribution-centre-009398208/",
  },
] as const;

export default function ShopHomePage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="w-full bg-muted animate-pulse aspect-[16/8.5] md:aspect-[16/5.5] lg:aspect-[16/4.2]" />
        }
      >
        <HeroSlider />
      </Suspense>
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
      <Suspense fallback={<PersonsCarouselSkeleton />}>
        <PersonsCarousel />
      </Suspense>
      <section className="w-full bg-[#d9d9d9] py-4 md:py-5" dir="rtl">
        <div className="mx-auto w-full max-w-7xl px-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 [&>section]:h-full">
            <Suspense fallback={<UpcomingBooksCarouselSkeleton />}>
              <UpcomingBooksCarousel />
            </Suspense>
            <QoqnoosMediaPlaceholder />
          </div>
          <MediaSocialLinks />
        </div>
      </section>
      <Suspense fallback={<NewsCarouselSkeleton />}>
        <NewsCarousel />
      </Suspense>
    </main>
  );
}

function QoqnoosMediaPlaceholder() {
  return (
    <section className="w-full" dir="rtl">
      <div className="mb-4 flex items-center gap-3">
        <span className="block h-6 w-1 rounded-full bg-primary-red" />
        <h2 className="text-xl font-bold text-dark-gray md:text-2xl">نوای ققنوس</h2>
      </div>

      <div className="rounded-2xl border border-dashed border-dark-gray/25 bg-white/70 px-4 py-4 md:px-5 md:py-5">
        {/* <p className="text-sm font-medium leading-7 text-dark-gray md:text-base">
          این بخش برای پادکست و ویدیوکست در نظر گرفته شده است.
        </p> */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="inline-flex items-center justify-center rounded-xl border border-dark-gray/15 bg-white px-3 py-2 text-sm font-semibold text-dark-gray">
            پادکست
          </span>
          <span className="inline-flex items-center justify-center rounded-xl border border-dark-gray/15 bg-white px-3 py-2 text-sm font-semibold text-dark-gray">
            ویدیوکست
          </span>
        </div>
      </div>
    </section>
  );
}

function MediaSocialLinks() {
  return (
    <div className="mt-4 rounded-xl border border-white/60 bg-white/45 px-3 py-2.5 md:px-4 md:py-3">
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-semibold text-dark-gray md:text-base">
          در شبکه‌های اجتماعی همراه ما باشید
        </p>

        <ul className="flex flex-wrap items-center gap-2">
          {SOCIAL_LINKS.map(({ label, handle, href }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-dark-gray/20 bg-white px-3 py-1.5 text-xs font-medium text-dark-gray transition-colors hover:border-primary-red hover:text-primary-red"
              >
                {handle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
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
    <section className="w-full">
      <div className="mb-4 h-8 w-44 animate-pulse rounded-lg bg-white/55" />
      <div className="h-68 w-full animate-pulse rounded-2xl bg-white/60" />
    </section>
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
              className="h-72 min-w-0 flex-1 animate-pulse rounded-2xl bg-white/75"
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
