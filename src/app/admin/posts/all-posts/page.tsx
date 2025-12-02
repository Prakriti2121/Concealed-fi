import AllPosts from "../components/AllPosts";
import prisma from "../../../../../prisma/prisma";

// Define a local interface that exactly matches what AllPosts expects.
interface ClientPost {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  featuredImage?: string;
  author?: string;
  seo?: string;
  _count: { comments: number };
  categories: { id: number; name: string }[];
  tags: { id: number; name: string }[];
}

export default async function AllPostsPage() {
  // Fetch posts with tags and categories
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tags: true,
      categories: true,
    },
  });

  // Map posts to the ClientPost type.
  const postsWithApprovedCount: ClientPost[] = await Promise.all(
    posts.map(async (post) => {
      const approvedCount = await prisma.comment.count({
        where: {
          postId: post.id,
          approved: true,
        },
      });

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        published: post.published,
        createdAt: post.createdAt.toISOString(),
        featuredImage: post.featuredImage || undefined,
        author: post.author || undefined,
        seo: undefined,
        _count: { comments: approvedCount },
        // Map categories to include only id and name.
        categories: post.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        })),
        // Map tags to include only id and name.
        tags: post.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })),
      };
    })
  );

  return <AllPosts posts={postsWithApprovedCount} />;
}
