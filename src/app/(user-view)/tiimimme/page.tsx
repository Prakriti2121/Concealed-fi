import { TeamContent } from "./components/TeamContent";

export async function generateMetadata() {
  // Build an absolute URL from an environment variable or default to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tiimimme`, { cache: "no-cache" });
  const data = await res.json();

  return {
    title: data.seoTitle || data.title,
    description:
      data.metaDesc ||
      "Meet the team behind Concealed Wines, your trusted wine importers in Scandinavia.",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

const VartTeamPage = () => {
  return (
    <div>
      <TeamContent />
    </div>
  );
};

export default VartTeamPage;
