import { ProfileContent } from "./Components/ProfileContent";

// This function runs on the server and dynamically generates metadata
export async function generateMetadata() {
  // Construct an absolute URL using an environment variable or default to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/yrityksen-profiili`, {
    cache: "no-cache",
  });

  const data = await res.json();

  return {
    title: data.seoTitle || data.title,
    description: data.metaDesc,
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const SelskapProfilePage = () => {
  return (
    <div>
      <ProfileContent />
    </div>
  );
};

export default SelskapProfilePage;
