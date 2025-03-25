// File: app/senaste-nytt/page.tsx
import React from "react";
import { ArticleContent } from "./components/ArticleContent";

export async function generateMetadata() {
  // Build the absolute URL using an environment variable or fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/viini-artikkelit`, { cache: "no-cache" });
  const data = await res.json();

  return {
    title: data.seoTitle || data.title,
    description:
      data.metaDesc || "Latest news and updates from Concealed Wines.",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const page = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Article</h1>
      <ArticleContent />
    </div>
  );
};

export default page;
