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
    <nav className="w-full border-b border-border bg-white" dir="rtl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10 px-4 py-3 md:py-4">
        <ProductCategoriesMenu />
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-sm md:text-md font-medium text-foreground hover:text-primary-red transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
