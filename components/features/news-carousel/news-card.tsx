import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink } from "lucide-react";

import type { BlogPost } from "@/types/blog";

type NewsCardProps = {
  post: BlogPost;
};

const BLOG_BASE_URL = "https://qoqnoos.ir";

function getPostHref(post: BlogPost): string {
  if (post.uri?.startsWith("http")) {
    return post.uri;
  }

  if (post.uri) {
    return `${BLOG_BASE_URL}${post.uri.startsWith("/") ? post.uri : `/${post.uri}`}`;
  }

  return `${BLOG_BASE_URL}/${post.slug}`;
}

function stripHtml(input: string | null): string {
  if (!input) return "";

  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&zwnj;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(input: string | null): string {
  if (!input) return "تاریخ نامشخص";

  const parsedDate = new Date(input);

  if (Number.isNaN(parsedDate.getTime())) {
    return "تاریخ نامشخص";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
}

export default function NewsCard({ post }: NewsCardProps) {
  const postHref = getPostHref(post);
  const excerpt = stripHtml(post.excerpt);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-white" dir="rtl">
      <Link
        href={postHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-muted"
      >
        {post.featuredImage?.node?.sourceUrl ? (
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title || "خبر"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            تصویر ندارد
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3 md:p-3.5">
        <div className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground md:text-xs">
          <CalendarDays size={14} />
          <span>{formatDate(post.date)}</span>
        </div>

        <Link
          href={postHref}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-sm font-bold leading-6 text-foreground transition-colors hover:text-primary-red md:text-base"
        >
          {post.title || "بدون عنوان"}
        </Link>

        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground md:text-sm">
          {excerpt || "برای مطالعه این خبر روی ادامه مطلب کلیک کنید."}
        </p>

        <Link
          href={postHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-primary-red transition-opacity hover:opacity-80 md:text-sm"
        >
          <span>ادامه مطلب</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </article>
  );
}
