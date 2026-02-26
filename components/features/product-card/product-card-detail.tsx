import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { hasDigitalStatusAttribute } from "./digital-status";

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "/mysecretpreview").replace(
  /\/$/,
  "",
);
const EBOOK_ICON_SRC = `${BASE_PATH}/ie-logo.svg`;

type ProductCardDetailProps = {
  product: Product;
};

interface PersonInfo {
  name: string;
  image: string | null;
}

function getPerson(product: Product, attrName: string): PersonInfo | null {
  const attr = product.attributes?.nodes.find((a) => a.name === attrName);
  if (!attr) return null;
  const term = attr.terms?.nodes[0];
  const name = term?.name ?? attr.options[0];
  if (!name) return null;
  return { name, image: term?.shadowImage ?? null };
}

function formatPrice(raw?: string): string | null {
  if (!raw) return null;
  return raw.replace(/&nbsp;/g, " ").trim();
}

export default function ProductCardDetail({ product }: ProductCardDetailProps) {
  const writer = getPerson(product, "pa_writer");
  const translator = getPerson(product, "pa_translator");
  const hasDigitalStatus = hasDigitalStatusAttribute(product);
  const price = formatPrice(product.price);
  const href = `/product/${product.slug}`;

  return (
    <div
      className="flex h-full w-full flex-col items-center rounded-xl border border-border/60 px-2 pb-2 pt-2.5 md:px-2.5 md:pb-2.5 md:pt-3"
      style={{ backgroundColor: "#F7F7F7" }}
      dir="rtl"
    >
      <Link href={href} className="mb-1.5 md:mb-2 block w-full">
        <div className="relative aspect-5/4 w-full rounded-lg bg-white p-1 md:p-1.5">
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

          <div className="relative h-full w-full">
            {product.image?.sourceUrl ? (
              <Image
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 140px, 144px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-[10px] md:text-sm">
                بدون تصویر
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="flex w-full flex-1 flex-col">
        <Link
          href={href}
          className="text-xs md:text-sm font-bold leading-5 text-foreground line-clamp-1 hover:text-primary-red transition-colors text-center"
        >
          {product.name}
        </Link>

        <div className="my-1.5 h-px w-full bg-border/60" />

        <div className="flex flex-col gap-1.5">
          {writer && (
            <div className="flex items-center gap-1.5">
              {writer.image ? (
                <div className="relative h-4 w-4 md:h-5 md:w-5 shrink-0 overflow-hidden rounded-full border border-border/40">
                  <Image
                    src={writer.image}
                    alt={writer.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              ) : (
                <div className="h-4 w-4 md:h-5 md:w-5 shrink-0 rounded-full bg-border/40" />
              )}
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-[10px] md:text-xs font-semibold text-primary-red shrink-0">
                  نویسنده:
                </span>
                <span className="text-[10px] md:text-xs text-foreground truncate">
                  {writer.name}
                </span>
              </div>
            </div>
          )}
          {translator && (
            <div className="flex items-center gap-1.5">
              {translator.image ? (
                <div className="relative h-4 w-4 md:h-5 md:w-5 shrink-0 overflow-hidden rounded-full border border-border/40">
                  <Image
                    src={translator.image}
                    alt={translator.name}
                    fill
                    className="object-cover"
                    sizes="20px"
                  />
                </div>
              ) : (
                <div className="h-4 w-4 md:h-5 md:w-5 shrink-0 rounded-full bg-border/40" />
              )}
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-[10px] md:text-xs font-semibold text-primary-red shrink-0">
                  مترجم:
                </span>
                <span className="text-[10px] md:text-xs text-foreground truncate">
                  {translator.name}
                </span>
              </div>
            </div>
          )}
          {!writer && !translator && <div className="h-4 md:h-5" />}
        </div>

        <div className="mt-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-0 pt-1.5">
          <button
            aria-label="افزودن به سبد خرید"
            className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-dark-gray transition-colors hover:border-primary-red hover:bg-primary-red hover:text-white"
          >
            <ShoppingCart size={14} />
          </button>
          {price ? (
            <p className="text-xs md:text-sm font-bold text-dark-gray">
              {price}
            </p>
          ) : (
            <p className="text-[10px] md:text-sm text-muted-foreground">
              تماس بگیرید
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
