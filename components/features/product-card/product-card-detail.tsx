import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

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
  const price = formatPrice(product.price);
  const href = `/product/${product.slug}`;

  return (
    <div className="flex h-full w-full flex-col items-center rounded-xl border border-border/60 px-3 pb-3 pt-5" style={{ backgroundColor: "#F7F7F7" }} dir="rtl">
      <Link
        href={href}
        className="mb-4 block w-full"
      >
        <div className="relative aspect-square w-full rounded-lg bg-white p-2">
          <div className="relative h-full w-full">
            {product.image?.sourceUrl ? (
              <Image
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                fill
                className="object-contain"
                sizes="144px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                بدون تصویر
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="flex w-full flex-1 flex-col">
        <Link
          href={href}
          className="text-base font-bold leading-6 text-foreground line-clamp-2 hover:text-primary-red transition-colors text-center"
        >
          {product.name}
        </Link>

        <div className="my-2 h-px w-full bg-border/60" />

        <div className="flex flex-col gap-2">
          {writer && (
            <div className="flex items-center gap-2">
              {writer.image ? (
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border/40">
                  <Image src={writer.image} alt={writer.name} fill className="object-cover" sizes="24px" />
                </div>
              ) : (
                <div className="h-6 w-6 shrink-0 rounded-full bg-border/40" />
              )}
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-xs font-semibold text-primary-red shrink-0">نویسنده:</span>
                <span className="text-xs text-foreground truncate">{writer.name}</span>
              </div>
            </div>
          )}
          {translator && (
            <div className="flex items-center gap-2">
              {translator.image ? (
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border/40">
                  <Image src={translator.image} alt={translator.name} fill className="object-cover" sizes="24px" />
                </div>
              ) : (
                <div className="h-6 w-6 shrink-0 rounded-full bg-border/40" />
              )}
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-xs font-semibold text-primary-red shrink-0">مترجم:</span>
                <span className="text-xs text-foreground truncate">{translator.name}</span>
              </div>
            </div>
          )}
          {!writer && !translator && <div className="h-6" />}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <button
            aria-label="افزودن به سبد خرید"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-dark-gray hover:bg-primary-red hover:text-white hover:border-primary-red transition-colors"
          >
            <ShoppingCart size={15} />
          </button>
          {price ? (
            <p className="text-base font-bold text-dark-gray">{price}</p>
          ) : (
            <p className="text-sm text-muted-foreground">تماس بگیرید</p>
          )}
        </div>
      </div>
    </div>
  );
}
