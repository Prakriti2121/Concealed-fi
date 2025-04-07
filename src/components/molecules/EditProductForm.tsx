"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import TiptapEditor from "./Tiptap";
import toast from "react-hot-toast";

// Define product schema (all fields optional)
const productSchema = z.object({
  title: z.string().optional(),
  isNew: z.boolean().optional(),
  availableOnlyOnline: z.boolean().optional(),
  organic: z.boolean().optional(),
  featured: z.boolean().optional(),
  productCode: z.string().optional(),
  vintage: z.string().optional(),
  price: z.number().optional(),
  largeImage: z.instanceof(File).optional(), // Will be handled separately
  buyLink: z.string().optional(),
  sortiment: z.string().optional(),
  tagLine: z.string().optional(),
  producerDescription: z.string().optional(),
  producerUrl: z.string().optional(),
  region: z.string().optional(),
  taste: z.preprocess((val: unknown) => {
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
    }
    return val;
  }, z.array(z.string()).optional()),
  awards: z.string().optional(),
  additionalInfo: z.string().optional(),
  vegetables: z.boolean().optional(),
  roastedVegetables: z.boolean().optional(),
  softCheese: z.boolean().optional(),
  hardCheese: z.boolean().optional(),
  starches: z.boolean().optional(),
  fish: z.boolean().optional(),
  richFish: z.boolean().optional(),
  whiteMeatPoultry: z.boolean().optional(),
  lambMeat: z.boolean().optional(),
  porkMeat: z.boolean().optional(),
  redMeatBeef: z.boolean().optional(),
  gameMeat: z.boolean().optional(),
  curedMeat: z.boolean().optional(),
  sweets: z.boolean().optional(),
  bottleVolume: z.number().optional(),
  alcohol: z.number().optional(),
  composition: z.string().optional(),
  closure: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductForm() {
  const { id } = useParams();
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      isNew: false,
      availableOnlyOnline: false,
      organic: false,
      featured: false,
      productCode: "",
      vintage: "",
      price: 0,
      largeImage: undefined,
      buyLink: "",
      sortiment: "",
      tagLine: "",
      producerDescription: "",
      producerUrl: "",
      region: "",
      taste: [],
      awards: "",
      additionalInfo: "",
      vegetables: false,
      roastedVegetables: false,
      softCheese: false,
      hardCheese: false,
      starches: false,
      fish: false,
      richFish: false,
      whiteMeatPoultry: false,
      lambMeat: false,
      porkMeat: false,
      redMeatBeef: false,
      gameMeat: false,
      curedMeat: false,
      sweets: false,
      bottleVolume: 0,
      alcohol: 0,
      composition: "",
      closure: "",
    },
  });

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Fetch product data and reset form values
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        form.reset({
          title: data.title || "",
          isNew: data.isNew || false,
          availableOnlyOnline: data.availableOnlyOnline || false,
          organic: data.organic || false,
          featured: data.featured || false,
          productCode: data.productCode || "",
          vintage: data.vintage || "",
          price: data.price || 0,
          buyLink: data.buyLink || "",
          sortiment: data.sortiment || "",
          tagLine: data.tagLine || "",
          producerDescription: data.producerDescription || "",
          producerUrl: data.producerUrl || "",
          region: data.region || "",
          taste: data.taste || [],
          awards: data.awards || "",
          additionalInfo: data.additionalInfo || "",
          vegetables: data.vegetables || false,
          roastedVegetables: data.roastedVegetables || false,
          softCheese: data.softCheese || false,
          hardCheese: data.hardCheese || false,
          starches: data.starches || false,
          fish: data.fish || false,
          richFish: data.richFish || false,
          whiteMeatPoultry: data.whiteMeatPoultry || false,
          lambMeat: data.lambMeat || false,
          porkMeat: data.porkMeat || false,
          redMeatBeef: data.redMeatBeef || false,
          gameMeat: data.gameMeat || false,
          curedMeat: data.curedMeat || false,
          sweets: data.sweets || false,
          bottleVolume: data.bottleVolume || 0,
          alcohol: data.alcohol || 0,
          composition: data.composition || "",
          closure: data.closure || "",
        });
        if (data.largeImage) {
          setPreviewUrl(data.largeImage);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error fetching product data");
      }
    };
    fetchProduct();
  }, [id, form]);

  // Updated onSubmit handler that checks for a new file upload
  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      // Handle producerDescription
      if (data.producerDescription) {
        formData.append("producerDescription", data.producerDescription);
      }

      // Handle largeImage: if a new file is provided, upload it first
      if (data.largeImage instanceof File) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", data.largeImage);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }
        const uploadData = await uploadResponse.json();
        // Append the returned URL to our update payload instead of the File object
        formData.append("largeImage", uploadData.url);
      } else if (previewUrl) {
        // No new file selected—use the existing image URL
        formData.append("largeImage", previewUrl);
      }

      // Append remaining fields (skip producerDescription and largeImage)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "producerDescription" && key !== "largeImage") {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      });

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to update product");

      await response.json();
      toast.success("Product updated successfully");
      router.push("/admin/wines");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Layout similar to AddProductForm */}
        <hr />
        <p className="text-xl font-bold">Wine Fields</p>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isNew"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">New</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableOnlyOnline"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">
                  Available Only Online
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organic"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Organic</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormLabel className="cursor-pointer">Featured</FormLabel>
              </FormItem>
            )}
          />
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Product Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Code</FormLabel>
                <FormControl>
                  <Input placeholder="Product Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vintage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vintage</FormLabel>
                <FormControl>
                  <Input placeholder="Vintage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? "" : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sortiment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sortiment</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sortiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tillfälliga sortimentet">
                        Tillfälliga sortimentet
                      </SelectItem>
                      <SelectItem value="Beställning sortimentet">
                        Beställning sortimentet
                      </SelectItem>
                      <SelectItem value="Exklusiva sortimentet">
                        Exklusiva sortimentet
                      </SelectItem>
                      <SelectItem value="Fasta Sortimentet">
                        Fasta Sortimentet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tagLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag Line</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Tag Line" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="producerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producer</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Producer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Region" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Taste</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., sweet, savory, spicy"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="awards"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Awards</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Awards" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Info</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Additional Info" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Product Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="largeImage"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      className="cursor-pointer"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                          const objectUrl = URL.createObjectURL(file);
                          setPreviewUrl(objectUrl);
                        }
                      }}
                      {...field}
                    />
                    {previewUrl && (
                      <div className="relative w-40 h-40">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buyLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy Link URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/buy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Producer Description with Tiptap Editor */}
        <FormField
          control={form.control}
          name="producerDescription"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Producer Description</FormLabel>
              <FormControl>
                <div className="border rounded-md min-h-[200px]">
                  <TiptapEditor
                    content={field.value}
                    onUpdate={({ editor }) => field.onChange(editor.getHTML())}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Food Combinations (checkboxes) */}
        <hr />
        <p className="text-xl font-bold">Food Combinations</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "vegetables", label: "Vegetables" },
            { name: "roastedVegetables", label: "Roasted Vegetables" },
            { name: "softCheese", label: "Soft Cheese" },
            { name: "hardCheese", label: "Hard Cheese" },
            { name: "starches", label: "Starches" },
            { name: "fish", label: "Fish" },
            { name: "richFish", label: "Rich Fish" },
            { name: "whiteMeatPoultry", label: "White Meat / Poultry" },
            { name: "lambMeat", label: "Lamb Meat" },
            { name: "porkMeat", label: "Pork Meat" },
            { name: "redMeatBeef", label: "Red Meat / Beef" },
            { name: "gameMeat", label: "Game Meat" },
            { name: "curedMeat", label: "Cured Meat" },
            { name: "sweets", label: "Sweets" },
          ].map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name as keyof ProductFormValues}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3">
                  <Checkbox
                    checked={field.value as boolean | undefined}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel className="cursor-pointer">{item.label}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Other specifications */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="composition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Composition</FormLabel>
                <FormControl>
                  <Input placeholder="Composition" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="closure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closure</FormLabel>
                <FormControl>
                  <Input placeholder="Closure" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bottleVolume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bottle Volume</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Bottle Volume"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? "" : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alcohol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alcohol</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Alcohol"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? "" : Number.parseFloat(value)
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
