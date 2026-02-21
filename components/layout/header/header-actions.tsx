"use client";

import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href="/cart"
        className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5 text-base text-white hover:bg-white/10 transition-colors"
      >
        <ShoppingCart size={18} />
        <span>سبد خرید</span>
      </Link>
      <Link
        href="/account"
        className="flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5 text-base text-white hover:bg-white/10 transition-colors"
      >
        <User size={18} />
        <span>حساب کاربری</span>
      </Link>
    </div>
  );
}
