"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  approved: boolean;
  post: {
    title: string;
  };
}

export default function CommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch("/api/posts/comments");
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/posts/comments?id=${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      alert("Comment deleted successfully!");
      fetchComments();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprovalToggle = async (
    commentId: number,
    currentApprovalStatus: boolean
  ) => {
    setUpdatingId(commentId);
    try {
      const res = await fetch(`/api/posts/comments?id=${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved: !currentApprovalStatus }),
      });

      if (!res.ok) throw new Error("Failed to update comment approval status");

      const updatedComment = await res.json();
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, approved: updatedComment.approved }
            : comment
        )
      );

      alert(
        `Comment ${
          updatedComment.approved ? "approved" : "disapproved"
        } successfully!`
      );
    } catch (error) {
      console.error("Approval toggle error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Comments</h1>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="px-4 py-2">Author</TableHead>
              <TableHead className="px-4 py-2">Comment</TableHead>
              <TableHead className="px-4 py-2">In Response To</TableHead>
              <TableHead className="px-4 py-2">Date</TableHead>
              <TableHead className="px-4 py-2">Status</TableHead>
              <TableHead className="px-4 py-2 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((comment) => (
              <TableRow key={comment.id} className="border-b">
                <TableCell className="px-4 py-2 font-medium">
                  {comment.author}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {comment.content.length > 50
                    ? comment.content.slice(0, 50) + "..."
                    : comment.content}
                </TableCell>
                <TableCell className="px-4 py-2">
                  {comment.post.title}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("en-CA")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  {comment.approved ? (
                    <span className="text-green-500">Approved</span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/admin/comments/${comment.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleApprovalToggle(comment.id, comment.approved)
                      }
                      disabled={updatingId === comment.id}
                    >
                      {comment.approved ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
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
}
