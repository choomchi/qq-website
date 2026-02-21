import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex-1 max-w-md mx-4">
      <div className="relative flex items-center">
        <input
          type="search"
          placeholder="جستجوی محصول . . ."
          dir="rtl"
          className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-2 pr-4 pl-10 text-base text-white placeholder:text-white/60 outline-none focus:border-white/60 focus:bg-white/15 transition-colors"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
}
