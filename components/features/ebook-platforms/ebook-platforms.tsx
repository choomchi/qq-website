import Link from "next/link";
import Image from "next/image";

const PLATFORMS = [
  { label: "طاقچه", href: "#" },
  { label: "فیدیبو", href: "#" },
  { label: "کتابراه", href: "#" },
] as const;

export default function EbookPlatforms() {
  return (
    <div className="w-full px-4 py-8 md:pt-32">
      <div
        className="mx-auto flex flex-col md:flex-row max-w-7xl items-center justify-center gap-6 rounded-[32px] px-4 md:px-8 py-8  relative overflow-visible"
        style={{ backgroundColor: "#2F3133" }}
        dir="rtl"
      >
        {/* Phone mockup placeholder */}
        <div className="absolute bottom-0 right-4 sm:right-10 md:right-16 lg:right-20 w-48 sm:w-56 md:w-64 lg:w-87.5 z-10 pointer-events-none drop-shadow-2xl hidden md:block">
          <Image
            src="/mysecretpreview/ebook-platforms.png"
            className="w-full h-auto object-bottom"
            alt="Ebook Platforms"
            width={600}
            height={800}
          />
        </div>
        {/* Text + pills */}
        <div className="flex flex-col w-full gap-4 items-center text-center z-20">
          <h2 className="text-xl md:text-[32px] font-bold text-white tracking-tight leading-loose">
            پلتفرم های خرید کتاب الکترونیک و صوتی
          </h2>
          <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap mt-2">
            {PLATFORMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-xl lg:rounded-2xl border border-white/80 bg-transparent px-6 py-1.5 md:px-8 md:py-2 text-sm md:text-lg font-medium text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
