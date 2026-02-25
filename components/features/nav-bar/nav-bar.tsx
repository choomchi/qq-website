import Link from "next/link";
import ProductCategoriesMenu from "@/components/features/product-categories-menu";

const NAV_ITEMS = [
  { label: "پذیرش اثر", href: "#" },
  { label: "اخبار و نقدها", href: "#" },
  { label: "درباره ما", href: "#" },
  { label: "تماس با ما", href: "#" },
] as const;

export default function NavBar() {
  return (
    <nav className="w-full bg-[#d9d9d9]" dir="rtl" aria-label="منوی اصلی سایت">
      <div className="mx-auto flex max-w-7xl items-center justify-start gap-1.5 overflow-x-auto px-4 py-1.5 text-dark-gray [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:justify-center sm:gap-2.5 md:gap-4 md:py-2">
        <ProductCategoriesMenu />
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="shrink-0 rounded-full px-2 py-1 text-[13px] font-medium text-dark-gray transition-colors hover:bg-white/65 hover:text-primary-red md:text-sm"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
