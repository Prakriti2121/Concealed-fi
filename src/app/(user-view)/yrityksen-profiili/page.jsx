import { ProfileContent } from "./Components/ProfileContent";
import { breadcrumbSchemaGenerator } from "@/app/utils/schemaUtils";
import { aboutSchema } from "../../utils/constants";

// This function runs on the server and dynamically generates metadata
export async function generateMetadata() {
  // Construct an absolute URL using an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/yrityksen-profiili`, {
    cache: "no-cache",
  });

  const data = await res.json();

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description: data.metaDesc,
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const SelskapProfilePage = () => {
  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Yrityksen profiili",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/yrityksen-profiili`,
    },
  ]);

  // Convert aboutSchema to JSON string
  const aboutSchemaJson = JSON.stringify(aboutSchema);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: aboutSchemaJson }}
      />
      <div>
        <ProfileContent />
      </div>
    </>
  );
};

export default SelskapProfilePage;
