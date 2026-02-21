import Image from "next/image";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "درباره ما",     href: "#" },
  { label: "تماس با ما",   href: "#" },
  { label: "پذیرش اثر",    href: "#" },
  { label: "اخبار و نقدها", href: "#" },
  { label: "دسته بندی ها", href: "#" },
] as const;

const SOCIAL_LINKS = [
  { label: "اینستاگرام",  href: "#", icon: "📷" },
  { label: "تلگرام",      href: "#", icon: "✈️" },
  { label: "توییتر",      href: "#", icon: "🐦" },
] as const;

export default function Footer() {
  return (
    <footer className="w-full bg-dark-gray border-t-4 border-primary-red" dir="rtl">
      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Logo + description */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/qoqnoos-logo.png"
                alt="گروه انتشاراتی قُقنوس"
                width={52}
                height={52}
                className="object-contain"
              />
              <span className="text-lg font-bold text-white leading-tight">
                گروه انتشاراتی قُقنوس
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-7">
              انتشارات قُقنوس از سال ۱۳۴۸ با هدف ارتقای فرهنگ مطالعه و نشر آثار ادبی، فلسفی و علمی در ایران فعالیت می‌کند.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white border-r-2 border-primary-red pr-3">
              دسترسی سریع
            </h3>
            <ul className="flex flex-col gap-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white border-r-2 border-primary-red pr-3">
              اطلاعات تماس
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">📍</span>
                <span className="leading-6">تهران، خیابان انقلاب، خیابان فخر رازی</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span dir="ltr">۰۲۱-۶۶۴۸۰۰۰۰</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <span dir="ltr">info@qoqnoos.ir</span>
              </li>
            </ul>
          </div>

          {/* Newsletter + social */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-white border-r-2 border-primary-red pr-3">
              خبرنامه
            </h3>
            <p className="text-sm text-white/60">
              برای دریافت آخرین اخبار و معرفی کتاب‌های جدید عضو خبرنامه شوید.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل شما"
                dir="rtl"
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary-red transition-colors"
              />
              <button className="shrink-0 rounded-lg bg-primary-red px-4 py-2 text-sm font-medium text-white hover:bg-primary-red/90 transition-colors">
                عضویت
              </button>
            </div>
            <div className="flex gap-3 mt-1">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-base hover:border-primary-red hover:bg-primary-red/10 transition-colors"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-white/40" dir="rtl">
          <span>© {new Date().getFullYear()} گروه انتشاراتی قُقنوس — تمامی حقوق محفوظ است.</span>
          <span dir="ltr">qoqnoos.ir</span>
        </div>
      </div>
    </footer>
  );
}
