"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MessageSquareMore } from "lucide-react";

interface Post {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  featuredImage?: string;
  author?: string;
  _count?: { comments: number };
  categories?: { id: number; name: string }[];
  tags?: { id: number; name: string }[];
  seo?: string;
}

const AllPosts = ({ posts }: { posts: Post[] }) => {
  const router = useRouter();

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      alert("Post deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <Button onClick={() => router.push("/admin/posts/new-post")}>
          Create New Post
        </Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="border">Image</TableHead>
              <TableHead className="border">Title</TableHead>
              <TableHead className="border">Author</TableHead>
              <TableHead className="border w-40">Date</TableHead>
              <TableHead className="border">Categories</TableHead>
              <TableHead className="border">Tags</TableHead>
              <TableHead className="border">
                <MessageSquareMore />
              </TableHead>
              <TableHead className="text-center border">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id} className="border-b">
                <TableCell className="border">
                  {post.featuredImage ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={
                          post.featuredImage.startsWith("/")
                            ? post.featuredImage
                            : `/uploads/${post.featuredImage}`
                        }
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 64px) 100vw, 64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium border">
                  {post.title}
                </TableCell>
                <TableCell className="border">
                  {post.author || "Unknown"}
                </TableCell>
                <TableCell className="border">
                  <div className="text-sm text-gray-500">Published</div>
                  <div>
                    {new Date(post.createdAt).toLocaleDateString("en-CA")}
                    <span className="text-sm text-gray-500">&nbsp;at</span>{" "}
                    {new Date(post.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </TableCell>
                <TableCell className="border">
                  {post.categories && post.categories.length > 0
                    ? post.categories
                        .map((category) => category.name)
                        .join(", ")
                    : "Uncategorized"}
                </TableCell>
                <TableCell className="border">
                  {post.tags && post.tags.length > 0
                    ? post.tags.map((tag) => tag.name).join(", ")
                    : "No tags"}
                </TableCell>
                <TableCell className="border">
                  {post._count?.comments || 0}
                </TableCell>
                <TableCell className="border">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/posts/${post.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/posts/${post.id}/edit`)
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AllPosts;
