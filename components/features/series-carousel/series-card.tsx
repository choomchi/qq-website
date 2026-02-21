import Image from "next/image";
import Link from "next/link";
import type { Series } from "@/types/series";

type SeriesCardProps = {
  series: Series;
};

export default function SeriesCard({ series }: SeriesCardProps) {
  const href = `/product-category/${series.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-white p-3 transition-all hover:border-primary-red/40 hover:shadow-sm"
      dir="rtl"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/40">
        {series.shadowImage ? (
          <Image
            src={series.shadowImage}
            alt={series.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="160px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-2xl font-bold text-muted-foreground/40">
              {series.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <p className="w-full text-center text-xs font-semibold text-foreground leading-5 line-clamp-2 group-hover:text-primary-red transition-colors">
        {series.name}
      </p>
    </Link>
  );
}
