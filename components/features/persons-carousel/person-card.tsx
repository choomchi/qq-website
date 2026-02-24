import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Person } from "@/types/person";

type PersonCardProps = {
  person: Person;
  role: "writer" | "translator";
};

const roleLabel: Record<"writer" | "translator", string> = {
  writer: "نویسنده",
  translator: "مترجم",
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/mysecretpreview";

export default function PersonCard({ person, role }: PersonCardProps) {
  const href = `/author/${person.slug}`;
  const subtitle = person.count > 0 ? `${person.count} عنوان` : roleLabel[role];

  return (
    <Link
      href={href}
      className="group relative block h-26.75 w-full overflow-hidden rounded-[15px]"
      style={{
        backgroundImage: `url('${BASE_PATH}/carousel-card-bg.svg')`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      dir="rtl"
    >
      <div className="relative z-10 flex h-full w-full items-center justify-between gap-2 p-2.5 pr-3 pl-2.5 -mt-2">
        <div className="relative h-15 w-15 shrink-0 overflow-hidden rounded-full border border-white/15 bg-black/25">
          {person.shadowImage ? (
            <Image
              src={person.shadowImage}
              alt={person.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="66px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white/40">
              {person.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col text-right">
          <span className="line-clamp-1 text-[18px] leading-tight font-bold text-white">
            {person.name}
          </span>
          <span className="mt-1 text-[12px] leading-none font-medium text-white/55">
            {subtitle}
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-2 left-0 md:bottom-0.5 md:left-0.5 z-20 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg bg-[#3B3B3B]/90 text-white">
        <ArrowLeft size={14} strokeWidth={2.2} />
      </div>
    </Link>
  );
}
