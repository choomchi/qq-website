import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0">
      <Image
        src="/qoqnoos-logo.png"
        alt="گروه انتشاراتی قُقنوس"
        width={48}
        height={48}
        priority
        unoptimized
        className="object-contain"
      />
      <span className="text-white font-semibold text-lg leading-tight">
        گروه انتشاراتی قُقنوس
      </span>
    </Link>
  );
}
