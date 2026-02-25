import { blogsApi } from "@/services/blogs/blogs-api";
import type { BlogPost } from "@/types/blog";
import NewsCarouselTrack from "./news-carousel-track";

const NEWS_SECTION_TITLE = "اخبار و وبلاگ";

async function getLatestBlogPosts(): Promise<BlogPost[]> {
  try {
    return await blogsApi.getLatestPosts(9);
  } catch {
    return [];
  }
}

export default async function NewsCarousel() {
  const posts = await getLatestBlogPosts();

  if (!posts.length) {
    return null;
  }

  return <NewsCarouselTrack title={NEWS_SECTION_TITLE} posts={posts} />;
}
