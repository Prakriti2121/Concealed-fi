"use client";

import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";

interface ArticleContentProps {
  limit?: number;
  showBreadcrumb?: boolean;
  disableSkeleton?: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  slug: string;
  featuredImage?: string;
  categories?: { name: string }[];
}

export function ArticleContent({
  limit,
  showBreadcrumb = true,
  disableSkeleton = false,
}: ArticleContentProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch posts: ${res.status} ${res.statusText}`
          );
        }

        const data = await res.json();
        setPosts(data);
      } catch (error: unknown) {
        console.error("Error fetching posts:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleReadMore = (slug: string) => {
    router.push(`/viini-artikkelit/${slug}`);
  };

  if (loading && !disableSkeleton) {
    return (
      <div className="space-y-8">
        {showBreadcrumb && <BreadCrumb title1="Viini-artikkelit" />}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(limit || postsPerPage)].map((_, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              {/* Image skeleton */}
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />

              <CardHeader>
                {/* Title skeleton */}
                <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />

                {/* Date skeleton */}
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </CardHeader>

              <CardContent>
                {/* Content skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>

                {/* Categories and button skeleton */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!limit && (
          <div className="flex justify-center space-x-4 mt-4">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return null;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!posts || posts.length === 0) {
    return <div>No posts found.</div>;
  }

  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const displayedPosts = limit
    ? posts.slice(0, limit)
    : posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="space-y-8">
      {showBreadcrumb && <BreadCrumb title1="Viini-artikkelit" />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedPosts.map((post) => (
          <Card
            key={post.id}
            className="hover:shadow-lg dark:hover:shadow-gray-800 bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer"
            onClick={() => handleReadMore(post.slug)}
          >
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-xl font-bold hover:text-primary dark:hover:text-primary-light transition-all duration-300">
                {post.title}
              </CardTitle>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2 transition-all duration-300">
                <CalendarDays className="mr-2 h-4 w-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-gray-700 dark:text-gray-300 transition-all duration-300 line-clamp-3 content"
                dangerouslySetInnerHTML={{
                  __html: post.content?.substring(0, 150) + "...",
                }}
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {post.categories
                    ?.map((cat: { name: string }) => cat.name)
                    .join(", ")}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadMore(post.slug);
                  }}
                  className="text-sm text-primary dark:text-primary-light hover:underline transition-all duration-300"
                >
                  Les mer →
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!limit && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
