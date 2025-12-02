import { TeamContent } from "./components/TeamContent";
import { breadcrumbSchemaGenerator } from "../../utils/utils";
import { personSchema } from "../../utils/constants";

export async function generateMetadata() {
  // Build an absolute URL from an environment variable or default to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tiimimme`, { cache: "no-cache" });
  const data = await res.json();

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description:
      data.metaDesc ||
      "Meet the team behind Concealed Wines, your trusted wine importers in Scandinavia.",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const VartTeamPage = () => {
  // Generate breadcrumb schema
  const breadcrumbs = breadcrumbSchemaGenerator([
    {
      name: "Tiimimme",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/tiimimme`,
    },
  ]);

  // Convert personSchema to JSON string
  const personSchemaJson = JSON.stringify(personSchema);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personSchemaJson }}
      />
      <div>
        <TeamContent />
      </div>
    </>
  );
};

export default VartTeamPage;
