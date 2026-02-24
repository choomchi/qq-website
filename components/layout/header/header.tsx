import Logo from "./logo";
import SearchBar from "./search-bar";
import HeaderActions from "./header-actions";

export default function Header() {
  return (
    <header className="w-full bg-primary-red">
      <div
        className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-3 gap-4"
        dir="rtl"
      >
        <Logo />
        <div className="w-full order-last mt-2 md:order-none md:mt-0 md:w-auto md:flex-1">
          <SearchBar />
        </div>
        <HeaderActions />
      </div>
    </header>
  );
}
