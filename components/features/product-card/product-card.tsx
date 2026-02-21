import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";

type ProductCardProps = {
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

export default function ProductCard({ product }: ProductCardProps) {
  const writer = getPerson(product, "pa_writer");
  const translator = getPerson(product, "pa_translator");
  const price = formatPrice(product.price);
  const href = `/product/${product.slug}`;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/80" style={{ backgroundColor: "#F7F7F7" }} dir="rtl">
      <Link href={href} className="block w-full p-2.5">
        <div className="relative aspect-square w-full rounded-lg bg-white p-2">
          <div className="relative h-full w-full">
            {product.image?.sourceUrl ? (
              <Image
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                fill
                className="object-contain"
                sizes="192px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                بدون تصویر
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 pt-0">
        <Link href={href} className="text-sm font-semibold leading-6 text-foreground line-clamp-2 hover:text-primary-red transition-colors">
          {product.name}
        </Link>

        <div className="my-2 h-px w-full bg-border/60" />

        <div className="flex flex-col gap-1.5">
          {writer && (
            <div className="flex items-center gap-1.5">
              {writer.image ? (
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-border/40">
                  <Image src={writer.image} alt={writer.name} fill className="object-cover" sizes="20px" />
                </div>
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full bg-border/40" />
              )}
              <span className="text-xs text-muted-foreground truncate">{writer.name}</span>
            </div>
          )}
          {translator && (
            <div className="flex items-center gap-1.5">
              {translator.image ? (
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full border border-border/40">
                  <Image src={translator.image} alt={translator.name} fill className="object-cover" sizes="20px" />
                </div>
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full bg-border/40" />
              )}
              <span className="text-xs text-muted-foreground truncate">{translator.name}</span>
            </div>
          )}
          {!writer && !translator && <div className="h-5" />}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <p className="min-h-6 text-left text-base font-bold text-dark-gray">{price ?? "\u00a0"}</p>
          <button className="flex items-center justify-center gap-1.5 w-full rounded-full bg-primary-red py-1.5 text-sm font-medium text-white hover:bg-primary-red/90 transition-colors">
            <ShoppingCart size={15} />
            <span>خرید</span>
          </button>
        </div>
      </div>
    </div>
  );
}
