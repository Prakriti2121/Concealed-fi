import EnglishContent from "./components/EnglishContent";
import { breadcrumbSchemaGenerator } from "@/app/utils/schemaUtils";

// Dynamically fetch metadata on the server
export async function generateMetadata() {
  // Build an absolute URL using an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/in-english`, {
    cache: "no-cache",
  });
  const data = await res.json();

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description:
      data.metaDesc ||
      "Learn about Concealed Wines, an established wine and spirit importer in the Swedish market.",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const InEnglishPage = () => {
  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "In English",
      url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "https://www.cwno.vittvin.nu"
      }/in-english`,
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <div>
        <EnglishContent />
      </div>
    </>
  );
};

export default InEnglishPage;
