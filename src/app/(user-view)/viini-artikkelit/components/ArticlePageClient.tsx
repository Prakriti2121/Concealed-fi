"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import BreadCrumb from "../../components/breadcrumb/breadcrumb";
import SidebarContent from "../../../(user-view)/components/sidebarcontent";

interface Post {
  slug: string | undefined;
  id: number;
  title: string;
  content: string;
  featuredImage: string;
  author: string;
  createdAt: string;
  tags: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  comments?: Comment[];
  seoTitle?: string;
  metaDesc?: string;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  date?: string;
}

interface ArticlePageClientProps {
  slug: string;
}

export default function ArticlePageClient({ slug }: ArticlePageClientProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        // Fetch public post data
        const res = await fetch(`/api/viini-artikkelit/${slug}`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(
            `Failed to fetch post: ${res.status} ${res.statusText}`
          );
        }
        const data = await res.json();
        setPost(data);
        if (data.comments) {
          setComments(data.comments);
        }
      } catch (err: unknown) {
        console.error("Error fetching post:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    try {
      const res = await fetch("/api/posts/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: post.id,
          author: "Anonymous",
          content: newComment,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit comment");
      }

      setCommentMessage(
        "Your comment has been submitted and will appear after admin approval."
      );
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setCommentMessage("There was an error submitting your comment.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Skeleton Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 bg-secondary rounded animate-pulse w-24"></div>
          <div className="h-4 bg-secondary rounded animate-pulse w-4"></div>
          <div className="h-4 bg-secondary rounded animate-pulse w-32"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Main Content Skeleton - width matches the actual content */}
          <div className="w-full lg:w-3/4">
            <article className="bg-card shadow-lg rounded-lg overflow-hidden">
              {/* Skeleton Featured Image */}
              <div className="w-full h-[400px] bg-secondary animate-pulse"></div>

              <div className="p-6">
                {/* Skeleton Title */}
                <div className="h-10 bg-secondary rounded animate-pulse w-3/4 mb-4"></div>

                {/* Skeleton Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-secondary rounded animate-pulse"></div>
                    <div className="h-4 bg-secondary rounded animate-pulse w-24"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-secondary rounded animate-pulse"></div>
                    <div className="h-4 bg-secondary rounded animate-pulse w-20"></div>
                  </div>
                </div>

                {/* Skeleton Content */}
                <div className="space-y-4">
                  <div className="h-4 bg-secondary rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-secondary rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-secondary rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-secondary rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-secondary rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-secondary rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-secondary rounded animate-pulse w-2/3"></div>
                </div>

                {/* Skeleton Share Buttons */}
                <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex space-x-4">
                    <div className="h-10 w-10 bg-secondary rounded animate-pulse"></div>
                    <div className="h-10 w-10 bg-secondary rounded animate-pulse"></div>
                    <div className="h-10 w-10 bg-secondary rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </article>

            {/* Skeleton Comments Section */}
            <section className="mt-12">
              <div className="h-8 bg-secondary rounded animate-pulse w-40 mb-4"></div>

              {/* Skeleton Comment Form */}
              <div className="mt-8">
                <div className="h-6 bg-secondary rounded animate-pulse w-48 mb-4"></div>
                <div className="h-32 bg-secondary rounded animate-pulse w-full mb-4"></div>
                <div className="h-10 bg-secondary rounded animate-pulse w-32"></div>
              </div>
            </section>
          </div>

          {/* Use empty div for sidebar with correct width to maintain layout */}
          <div className="lg:w-1/4 lg:sticky lg:top-6 lg:self-start h-fit">
            <SidebarContent excludeSlug={slug} limit={6} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadCrumb
        title1="Viini-artikkelit"
        link1="/viini-artikkelit"
        title2={post.title}
      />

      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Main Content */}
        <div className="max-w-4xl">
          <article className="bg-card shadow-lg rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-[400px] object-cover"
            />

            <div className="p-6">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {post.author}
                </div>
              </div>

              <div
                className="prose dark:prose-invert max-w-none content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
                <div className="flex space-x-4">
                  <FacebookShareButton
                    url={
                      typeof window !== "undefined" ? window.location.href : ""
                    }
                    title={post.title}
                  >
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Share on Facebook</span>
                    </div>
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={
                      typeof window !== "undefined" ? window.location.href : ""
                    }
                    title={post.title}
                  >
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Share on Twitter</span>
                    </div>
                  </TwitterShareButton>
                  <LinkedinShareButton
                    url={
                      typeof window !== "undefined" ? window.location.href : ""
                    }
                    title={post.title}
                    summary={post.content.substring(0, 100)}
                  >
                    <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">Share on LinkedIn</span>
                    </div>
                  </LinkedinShareButton>
                </div>
              </div>
            </div>
          </article>

          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-card shadow rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Avatar>
                      <AvatarFallback>{comment.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{comment.author}</h3>
                      <p className="text-sm text-muted-foreground">
                        {comment.date ||
                          new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleCommentSubmit} className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Add a comment</h3>
              {commentMessage && (
                <div className="mb-4 text-green-600">{commentMessage}</div>
              )}
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                className="mb-4"
                rows={4}
              />
              <Button type="submit">
                <Send className="mr-2 h-4 w-4" /> Send comment
              </Button>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4 lg:sticky lg:top-6 lg:self-start h-fit">
          <SidebarContent excludeSlug={post.slug} limit={6} />
        </div>
      </div>
    </div>
  );
}
