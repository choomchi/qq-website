import Link from "next/link";

const CATEGORIES = [
  {
    label: "زبان و ادبیات",
    href: "https://qoqnoos.ir/product-category/%d8%b3%d8%a7%d9%8a%d8%aa/%d8%a7%d8%af%d8%a8%d9%8a%d8%a7%d8%aa/",
  },
  {
    label: "فلسفه",
    href: "https://qoqnoos.ir/product-category/%d8%b3%d8%a7%d9%8a%d8%aa/%d8%b9%d8%b1%d9%81%d8%a7%d9%86-%d9%88-%d9%81%d9%84%d8%b3%d9%81%d9%87/",
  },
  {
    label: "دین و عرفان",
    href: "https://qoqnoos.ir/product-category/%d8%b3%d8%a7%d9%8a%d8%aa/%d8%b9%d8%b1%d9%81%d8%a7%d9%86-%d9%88-%d9%81%d9%84%d8%b3%d9%81%d9%87/",
  },
  {
    label: "روانشناسی",
    href: "https://qoqnoos.ir/product-category/%d8%b3%d8%a7%d9%8a%d8%aa/%d8%b9%d9%84%d9%88%d9%85-%d8%a7%d9%86%d8%b3%d8%a7%d9%86%d9%8a/",
  },
  {
    label: "تاریخ",
    href: "https://qoqnoos.ir/product-category/%d8%b3%d8%a7%d9%8a%d8%aa/%d8%aa%d8%a7%d8%b1%d9%8a%d8%ae/",
  },
  {
    label: "کودک و نوجوان",
    href: "https://qoqnoos.ir/product-category/%d8%b3%d8%a7%d9%8a%d8%aa/%d9%83%d9%88%d8%af%d9%83-%d9%88-%d9%86%d9%88%d8%ac%d9%88%d8%a7%d9%86/",
  },
] as const;

export default function CategoryLinks() {
  return (
    <div className="w-full bg-[#d9d9d9]">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 flex-wrap"
        dir="rtl"
      >
        {CATEGORIES.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-1 justify-center rounded-full border border-dark-gray/30 bg-white px-3 py-1.5 md:px-6 md:py-1.5 text-sm md:text-md text-dark-gray font-medium hover:bg-white/40 transition-colors whitespace-nowrap"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
