"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FolderTree, Menu } from "lucide-react";

import type { ProductCategoryTreeNode } from "@/types/category";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ProductCategoriesMenuPanelProps = {
  categories: ProductCategoryTreeNode[];
};

type CategoryStepViewProps = {
  categories: ProductCategoryTreeNode[];
  path: ProductCategoryTreeNode[];
  onBack: () => void;
  onDrillDown: (category: ProductCategoryTreeNode) => void;
  onSelect?: () => void;
};

function CategoryStepView({
  categories,
  path,
  onBack,
  onDrillDown,
  onSelect,
}: CategoryStepViewProps) {
  const currentCategory = path[path.length - 1] ?? null;
  const currentCategories = currentCategory ? currentCategory.children : categories;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/10 px-4 py-2.5">
        {path.length ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary-red"
          >
            <ChevronRight size={14} />
            <span>بازگشت</span>
          </button>
        ) : (
          <span className="w-16" aria-hidden />
        )}

        <p className="truncate text-sm font-semibold text-foreground md:text-base">
          {currentCategory?.name ?? "دسته‌بندی محصولات"}
        </p>

        <span className="w-16" aria-hidden />
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-6">
        {currentCategories.length ? (
          <ul className="space-y-1">
            {currentCategories.map((category) => {
              const hasChildren = category.children.length > 0;

              if (hasChildren) {
                return (
                  <li key={category.databaseId}>
                    <button
                      type="button"
                      onClick={() => onDrillDown(category)}
                      aria-label={`نمایش زیر‌دسته‌های ${category.name}`}
                      className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-right transition-colors hover:bg-muted/70"
                    >
                      <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary-red">
                        {category.name}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                        <span>{category.count}</span>
                        <ChevronLeft
                          size={14}
                          className="transition-colors group-hover:text-primary-red"
                        />
                      </span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={category.databaseId}>
                  <Link
                    href={`/product-category/${category.slug}`}
                    onClick={onSelect}
                    className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted/70"
                  >
                    <span className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary-red">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{category.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            زیر‌دسته‌ای برای نمایش وجود ندارد.
          </p>
        )}
      </div>
    </div>
  );
}

export default function ProductCategoriesMenuPanel({
  categories,
}: ProductCategoriesMenuPanelProps) {
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopPath, setDesktopPath] = useState<ProductCategoryTreeNode[]>([]);
  const [mobilePath, setMobilePath] = useState<ProductCategoryTreeNode[]>([]);

  const handleDesktopOpenChange = (open: boolean) => {
    setDesktopOpen(open);
    if (!open) setDesktopPath([]);
  };

  const handleMobileOpenChange = (open: boolean) => {
    setMobileOpen(open);
    if (!open) setMobilePath([]);
  };

  const closeDesktop = () => {
    setDesktopOpen(false);
    setDesktopPath([]);
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setMobilePath([]);
  };

  return (
    <>
      <div className="hidden md:block ">
        <Sheet open={desktopOpen} onOpenChange={handleDesktopOpenChange}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm md:text-md font-medium text-foreground transition-colors hover:text-primary-red md:pt-2"
            >
              {/* <Menu size={16} /> */}
              <span>دسته بندی ها</span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="end-auto right-0 w-full overflow-hidden border-l border-r-0 p-0 sm:max-w-xl"
            dir="rtl"
          >
            <SheetHeader className="border-b border-border/70 bg-muted/20">
              <SheetTitle className="flex items-center gap-2 text-base md:text-lg">
                <FolderTree size={17} className="text-primary-red" />
                <span>دسته‌بندی محصولات</span>
              </SheetTitle>
            </SheetHeader>

            <CategoryStepView
              categories={categories}
              path={desktopPath}
              onBack={() => setDesktopPath((prev) => prev.slice(0, -1))}
              onDrillDown={(category) =>
                setDesktopPath((prev) => [...prev, category])
              }
              onSelect={closeDesktop}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="md:hidden">
        <Drawer
          open={mobileOpen}
          onOpenChange={handleMobileOpenChange}
          direction="bottom"
        >
          <DrawerTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm md:text-md font-medium text-foreground transition-colors hover:text-primary-red"
            >
              <Menu size={16} />
              <span>دسته بندی ها</span>
            </button>
          </DrawerTrigger>

          <DrawerContent dir="rtl" className="max-h-[85vh]">
            <DrawerHeader className="border-b border-border/70 bg-muted/20 text-right">
              <DrawerTitle className="flex items-center gap-2 text-sm">
                <FolderTree size={16} className="text-primary-red" />
                <span>دسته‌بندی محصولات</span>
              </DrawerTitle>
            </DrawerHeader>

            <CategoryStepView
              categories={categories}
              path={mobilePath}
              onBack={() => setMobilePath((prev) => prev.slice(0, -1))}
              onDrillDown={(category) =>
                setMobilePath((prev) => [...prev, category])
              }
              onSelect={closeMobile}
            />
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
