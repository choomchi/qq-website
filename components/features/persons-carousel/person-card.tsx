import Image from "next/image";
import Link from "next/link";
import type { Person } from "@/types/person";

type PersonCardProps = {
  person: Person;
  role: "writer" | "translator";
};

const roleLabel: Record<"writer" | "translator", string> = {
  writer: "نویسنده",
  translator: "مترجم",
};

export default function PersonCard({ person, role }: PersonCardProps) {
  const href = `/author/${person.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10"
      dir="rtl"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
        {person.shadowImage ? (
          <Image
            src={person.shadowImage}
            alt={person.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/30 text-2xl font-bold">
            {person.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="text-sm font-semibold text-white leading-5 line-clamp-2">
          {person.name}
        </span>
        <span className="text-xs text-white/50">{roleLabel[role]}</span>
      </div>
    </Link>
  );
}
