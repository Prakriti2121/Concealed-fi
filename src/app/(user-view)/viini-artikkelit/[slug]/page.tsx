import ArticlePageClient from "../components/ArticlePageClient";
import {
  breadcrumbSchemaGenerator,
  postSchemaGenerator,
  organizationSchema,
} from "@/app/utils/schemaUtils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the promise to extract slug
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/viini-artikkelit/${slug}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    // Fallback metadata if the post isn't found
    return {
      title: "Post not found",
      description: "The post you are looking for could not be found.",
    };
  }

  const data = await res.json();

  return {
    title: data.seoTitle || data.title,
    description: data.metaDesc || "Default meta description for the post.",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await the params promise to extract the slug
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Fetch article data
  const res = await fetch(`${baseUrl}/api/viini-artikkelit/${slug}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    // Handle case where post isn't found
    return <div>Post not found</div>;
  }

  const postData = await res.json();

  // Breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Viini Artikkelit",
      url: `${baseUrl}/viini-artikkelit`,
    },
    {
      name: postData.title,
      url: `${baseUrl}/viini-artikkelit/${slug}`,
    },
  ]);

  // Generate post schema
  const postSchema = postSchemaGenerator(postData);

  // Generate organization schema
  const organization = organizationSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organization }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: postSchema }}
      />
      <ArticlePageClient slug={slug} />
    </>
  );
}
