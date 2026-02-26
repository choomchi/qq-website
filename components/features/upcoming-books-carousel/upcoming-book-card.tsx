import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import type { Product } from "@/types/product";
import { hasDigitalStatusAttribute } from "@/components/features/product-card/digital-status";

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/mysecretpreview").replace(
  /\/$/,
  "",
);
const EBOOK_ICON_SRC = `${BASE_PATH}/ie-logo.svg`;

type UpcomingBookCardProps = {
  product: Product;
};

function getWriterName(product: Product): string | null {
  const attr = product.attributes?.nodes.find((node) => node.name === "pa_writer");
  if (!attr) return null;
  const term = attr.terms?.nodes[0];
  return term?.name ?? attr.options[0] ?? null;
}

export default function UpcomingBookCard({ product }: UpcomingBookCardProps) {
  const href = `/product/${product.slug}`;
  const writerName = getWriterName(product);
  const hasDigitalStatus = hasDigitalStatusAttribute(product);

  return (
    <article
      className="relative w-full rounded-2xl border border-border/80 bg-[#F7F7F7] p-2 md:p-1"
      dir="rtl"
    >
      {/* <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary-red px-2.5 py-1 text-[10px] font-semibold text-white md:text-xs">
        <Info size={12} />
        <span>در دست انتشار</span>
      </span> */}

      <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-[9rem_1fr] sm:items-center sm:pt-1 md:gap-5">
        <div className="order-2 flex min-w-0 flex-col items-start gap-3 sm:order-2">
          <Link
            href={href}
            className="line-clamp-2 text-lg font-bold leading-8 text-foreground transition-colors hover:text-primary-red md:text-2xl"
          >
            {product.name}
          </Link>

          <div className="h-px w-full bg-border/70" />

          <p className="text-sm text-muted-foreground md:text-base">
            نویسنده: {writerName ?? "-"}
          </p>

          <Link
            href={href}
            className="mt-1 inline-flex items-center justify-center rounded-full bg-light-gray px-4 py-1.5 text-sm font-medium text-dark-gray transition-colors hover:bg-primary-red hover:text-white"
          >
            اطلاعات بیشتر
          </Link>
        </div>

        <Link
          href={href}
          className="order-1 mx-auto block w-30 sm:order-1 sm:w-36"
          aria-label={`مشاهده ${product.name}`}
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-xl border border-border/70 bg-white p-2">
            {hasDigitalStatus && (
              <span
                className="absolute right-1.5 top-1.5 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-red text-white shadow-sm"
                title="نسخه دیجیتال"
              >
                <Image
                  src={EBOOK_ICON_SRC}
                  alt=""
                  width={12}
                  height={12}
                  className="h-3 w-3 object-contain"
                />
              </span>
            )}

            {product.image?.sourceUrl ? (
              <Image
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 120px, 144px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                بدون تصویر
              </div>
            )}
          </div>
        </Link>
      </div>
    </article>
  );
}
