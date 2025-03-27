import EnglishContent from "./components/EnglishContent";

// Dynamically fetch metadata on the server
export async function generateMetadata() {
  // Build an absolute URL using an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/in-english`, {
    cache: "no-cache",
  });
  const data = await res.json();

  return {
    title: data.seoTitle || data.title,
    description:
      data.metaDesc ||
      "Learn about Concealed Wines, an established wine and spirit importer in the Swedish market.",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const InEnglishPage = () => {
  return (
    <div>
      <EnglishContent />
    </div>
  );
};

export default InEnglishPage;
