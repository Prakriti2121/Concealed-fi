import { ContactContent } from "./components/ContactContent";

// Dynamically fetch metadata on the server
export async function generateMetadata() {
  // Use an absolute URL for the internal API route
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = new URL("/api/ota-yhteytta", baseUrl);
  const res = await fetch(url.href, { cache: "no-cache" });
  const data = await res.json();

  return {
    title: data.seoTitle || data.title,
    description:
      data.metaDesc || "Get in touch with Concealed Wines. We're here to help!",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const KontaktOssPage = () => {
  return (
    <div>
      <ContactContent />
    </div>
  );
};

export default KontaktOssPage;
