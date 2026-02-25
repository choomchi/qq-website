import Logo from "./logo";
import SearchBar from "./search-bar";
import HeaderActions from "./header-actions";
import NavBar from "@/components/features/nav-bar";

export default function Header() {
  return (
    <header className="w-full bg-primary-red shadow-sm">
      <div
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5"
        dir="rtl"
      >
        <Logo />
        <div className="order-last mt-1.5 w-full md:order-0 md:mt-0 md:w-auto md:flex-1">
          <SearchBar />
        </div>
        <HeaderActions />
      </div>

      <div className="border-t border-black/10 bg-[#d9d9d9]">
        <NavBar />
      </div>
    </header>
  );
}
