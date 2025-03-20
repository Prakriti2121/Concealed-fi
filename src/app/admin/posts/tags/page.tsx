"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Tag {
  id: number;
  name: string;
  slug: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState({
    name: "",
    slug: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/posts/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");
      const data = await response.json();
      setTags(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Failed to load tags. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTag = async () => {
    if (newTag.name.trim() !== "" && newTag.slug.trim() !== "") {
      try {
        const tagData = {
          name: newTag.name.trim(),
          slug: newTag.slug.trim(),
        };

        const response = await fetch("/api/posts/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tagData),
        });

        if (!response.ok) throw new Error("Failed to add tag");

        const newTagData = await response.json();

        setTags((prevTags) => [
          ...prevTags,
          {
            ...newTagData,
            slug: tagData.slug,
          },
        ]);

        setNewTag({ name: "", slug: "" });
        setIsAddDialogOpen(false);
        setError(null);
      } catch (error) {
        console.error("Error adding tag:", error);
        setError("Failed to add tag. Please try again.");
      }
    }
  };

  const handleDeleteTag = async () => {
    if (tagToDelete !== null) {
      try {
        const response = await fetch("/api/posts/tags", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: tagToDelete }),
        });

        if (response.ok) {
          setTags(tags.filter((tag) => tag.id !== tagToDelete));
          setError(null);
        } else {
          throw new Error("Failed to delete tag");
        }
      } catch (error) {
        console.error("Error deleting tag:", error);
        setError("Failed to delete tag. Please try again.");
      } finally {
        setIsDeleteDialogOpen(false);
        setTagToDelete(null);
      }
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading tags...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage your tags</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" /> Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newTag.name}
                  onChange={(e) =>
                    setNewTag((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/ /g, "-"),
                    }))
                  }
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newTag.slug}
                  onChange={(e) =>
                    setNewTag((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  className="bg-background"
                />
              </div>

              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleAddTag}
              >
                Add Tag
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between p-4 bg-card rounded-lg border"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{tag.name}</h3>
              <div className="text-sm text-muted-foreground">
                ID: {tag.id} | Slug: {tag.slug}
              </div>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                setTagToDelete(tag.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {tags.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tags found. Add your first tag to get started.
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTag}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
