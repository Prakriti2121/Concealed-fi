import { getWineBySlug } from "@/lib/actions/product.actions";
import Image from "next/image";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Share2,
  Wine,
  Tag,
  GlassWater,
  Leaf,
  Award,
  Info,
  MapPin,
  Percent,
  Package,
} from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};
export const revalidate = 0;

export default async function Page({ params }: PageProps) {
  // Await the params promise
  const { slug } = await params;

  const product = await getWineBySlug(slug);
  if (!product) {
    return <div>Product not found!</div>;
  }

  // Parse taste data from JSON if needed
  const tasteArray = Array.isArray(product.taste)
    ? product.taste
    : typeof product.taste === "string"
    ? JSON.parse(product.taste)
    : Object.values(product.taste || {});

  // Function to generate food pairing badges
  const getFoodPairings = () => {
    const pairings = [];
    if (product.vegetables) pairings.push("Vegetables");
    if (product.roastedVegetables) pairings.push("Roasted Vegetables");
    if (product.softCheese) pairings.push("Soft Cheese");
    if (product.hardCheese) pairings.push("Hard Cheese");
    if (product.starches) pairings.push("Starches");
    if (product.fish) pairings.push("Fish");
    if (product.richFish) pairings.push("Rich Fish");
    if (product.whiteMeatPoultry) pairings.push("White Meat/Poultry");
    if (product.lambMeat) pairings.push("Lamb");
    if (product.porkMeat) pairings.push("Pork");
    if (product.redMeatBeef) pairings.push("Red Meat/Beef");
    if (product.gameMeat) pairings.push("Game Meat");
    if (product.curedMeat) pairings.push("Cured Meat");
    if (product.sweets) pairings.push("Sweets");
    return pairings;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <Home size={16} className="mr-1" />
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="font-medium">{product.title}</span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="relative h-full flex items-center justify-center">
          <Card className="w-full h-full p-4 flex items-center justify-center">
            <div className="w-64 h-full relative">
              <Image
                src={product.largeImage || "/placeholder-wine.png"}
                alt={product.title}
                width={150}
                height={300}
                className="object-contain"
                priority
              />
            </div>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div>
          {/* Title and Badges */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {product.tagLine && (
              <div className="flex items-center text-gray-500 mb-2">
                <Tag size={16} className="mr-1" />
                <span>{product.tagLine}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {product.isNew && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  New
                </Badge>
              )}
              {product.organic && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <Leaf size={14} className="mr-1" /> Organic
                </Badge>
              )}
              {product.featured && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  <Award size={14} className="mr-1" /> Featured
                </Badge>
              )}
              {product.availableOnlyOnline && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  Online Only
                </Badge>
              )}
            </div>
          </div>

          {/* Price and Buy Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-3xl font-bold">{product.price.toFixed(2)} €</p>
              <p className="text-sm text-gray-500 flex items-center">
                <Package size={14} className="mr-1" />
                {product.sortiment && <>{product.sortiment} • </>}
                Product Code: {product.productCode}
              </p>
            </div>
            <Button asChild className="bg-zinc-800 hover:bg-zinc-700">
              <a
                href={product.buyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buy Now
              </a>
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center">
                <Wine size={16} className="mr-1" /> Producer
              </span>
              <a
                href={product.producerUrl}
                className="text-blue-600 hover:underline"
              >
                {product.producerUrl.split("/").pop() || "Producer"}
              </a>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center">
                <MapPin size={16} className="mr-1" /> Region
              </span>
              <span>{product.region}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium">Vintage</span>
              <span>{product.vintage}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 font-medium flex items-center">
                <Percent size={16} className="mr-1" /> Alcohol
              </span>
              <span>{product.alcohol}%</span>
            </div>
          </div>

          {/* Taste Profile */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <GlassWater size={18} className="mr-2" /> Taste Profile
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-800 leading-relaxed">
                  {tasteArray.join(", ")}.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Share */}
          <div className="flex items-center space-x-2 mt-4 mb-6">
            <span className="text-gray-500 font-medium">Share:</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Additional Info Tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            <button className="py-4 border-b-2 border-black font-medium flex items-center">
              <Info size={18} className="mr-2" /> Product Details
            </button>
          </div>
        </div>

        <div className="py-6">
          {/* Producer Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">About the Producer</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: product.producerDescription || "",
              }}
            />
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Wine Details */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Wine size={20} className="mr-2" /> Wine Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 mb-1">Bottle Volume</p>
                    <p>{product.bottleVolume} ml</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Alcohol</p>
                    <p>{product.alcohol}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Closure</p>
                    <p>{product.closure}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Vintage</p>
                    <p>{product.vintage}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Composition</p>
                    <p>{product.composition}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Product Code</p>
                    <p>{product.productCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Food Pairings */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Food Pairings</h3>
                <div className="flex flex-wrap gap-2">
                  {getFoodPairings().map((pairing, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {pairing}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          {product.additionalInfo && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Info size={20} className="mr-2" /> Additional Information
                </h3>
                <p>{product.additionalInfo}</p>
              </CardContent>
            </Card>
          )}

          {/* Awards */}
          {product.awards && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Award size={20} className="mr-2" /> Awards
                </h3>
                <p>{product.awards}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Last updated info */}
      <div className="mt-8 text-sm text-gray-500 flex items-center">
        <Info size={14} className="mr-1" />
        Last updated: {new Date(product.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
