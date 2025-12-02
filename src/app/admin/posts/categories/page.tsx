"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Upload, X, ImageIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    image: "",
    description: "",
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/posts/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async () => {
    if (newCategory.name.trim() !== "" && newCategory.slug.trim() !== "") {
      try {
        let imageUrl = "";

        if (selectedFile) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", selectedFile);

          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) throw new Error("Image upload failed");
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        }

        const categoryData = {
          name: newCategory.name.trim(),
          slug: newCategory.slug.trim(),
          description: newCategory.description.trim(),
          image: imageUrl || previewImage || "",
        };

        const response = await fetch("/api/posts/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });

        if (!response.ok) throw new Error("Failed to add category");

        const newCategoryData = await response.json();

        setCategories((prevCategories) => [
          ...prevCategories,
          {
            ...newCategoryData,
            image: categoryData.image,
            slug: categoryData.slug,
            description: categoryData.description,
          },
        ]);

        setNewCategory({ name: "", slug: "", image: "", description: "" });
        setPreviewImage(null);
        setSelectedFile(null);
        setIsAddDialogOpen(false);
        setError(null);
      } catch (error) {
        console.error("Error adding category:", error);
        setError("Failed to add category. Please try again.");
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete !== null) {
      try {
        const response = await fetch("/api/posts/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: categoryToDelete }),
        });

        if (response.ok) {
          setCategories(
            categories.filter((category) => category.id !== categoryToDelete)
          );
          setError(null);
        } else {
          throw new Error("Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category. Please try again.");
      } finally {
        setIsDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your categories</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
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
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex flex-col gap-4">
                  {previewImage && (
                    <div className="relative w-full h-48">
                      <Image
                        src={previewImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md"
                        height={128}
                        width={128}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6"
                        onClick={() => {
                          setPreviewImage(null);
                          setSelectedFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Label
                      htmlFor="image"
                      className="flex-1 flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {previewImage ? "Change Image" : "Upload Image"}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="bg-background"
                  rows={3}
                />
              </div>

              <Button
                type="button"
                className="w-full mt-4"
                onClick={handleAddCategory}
              >
                Add Category
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
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-start gap-4 p-4 bg-card rounded-lg border"
          >
            <div className="w-40 h-40 flex-shrink-0">
              {category.image ? (
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-md"
                  height={128}
                  width={128}
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    ID: {category.id}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Slug: {category.slug}
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setCategoryToDelete(category.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No categories found. Add your first category to get started.
          </div>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
