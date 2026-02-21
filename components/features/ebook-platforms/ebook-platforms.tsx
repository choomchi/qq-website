import Link from "next/link";

const PLATFORMS = [
  { label: "طاقچه",   href: "#" },
  { label: "فیدیبو",  href: "#" },
  { label: "کتابراه", href: "#" },
] as const;

export default function EbookPlatforms() {
  return (
    <div className="w-full px-4 py-6">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between overflow-hidden rounded-2xl px-10 py-6"
        style={{ backgroundColor: "#2F3133" }}
        dir="rtl"
      >
        {/* Text + pills */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white">
            پلتفرم های خرید کتاب الکترونیک و صوتی
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            {PLATFORMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-1.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Phone mockup placeholder */}
        <div className="relative h-32 w-40 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-4xl select-none">
          📱
        </div>
      </div>
    </div>
  );
}
