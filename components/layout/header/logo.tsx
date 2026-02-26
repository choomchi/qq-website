import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <Image
        src="/mysecretpreview/qoqnoos-logo.png"
        alt="گروه انتشاراتی قُقنوس"
        width={48}
        height={48}
        priority
        // unoptimized
        className="object-contain"
      />
      <span className="text-xl font-semibold leading-tight text-white md:text-[22px]">
        گروه انتشاراتی قُقنوس
      </span>
    </Link>
  );
}
