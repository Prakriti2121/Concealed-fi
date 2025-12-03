import AboutUs from "@/components/molecules/AboutUs";
import BannerSection from "@/components/molecules/BannerSection";
import OurWines from "@/components/molecules/OurWines";
import WineArticles from "@/components/molecules/WineArticles";
import FeaturedProduct from "@/components/organisms/FeaturedProduct";
import Jumbotron from "@/components/organisms/Jumbotron";
import { Metadata } from "next";
import { breadcrumbSchemaGenerator, organizationSchema } from "@/app/utils/schemaUtils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export async function generateMetadata(): Promise<Metadata> {
  const resSeo = await fetch(`${baseUrl}/api/etusivu`, { cache: "no-cache" });
  const data = await resSeo.json();

  return {
    metadataBase: new URL(baseUrl),
    title: data.seoTitle || data.title,
    description:
      data.metaDesc || "Welcome to Concealed Wines Finland homepage!",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    alternates: {
      canonical: data.canonicalUrl || baseUrl,
    },
  };
}

export default async function Home() {
  // Fetch About Us data
  const resAbout = await fetch(`${baseUrl}/api/meista`, { cache: "no-cache" });
  const aboutUsData = await resAbout.json();

  // Fetch Our Wines data
  const resWines = await fetch(`${baseUrl}/api/meidan-viinit`, {
    cache: "no-cache",
  });
  const ourWinesData = await resWines.json();

  // Fetch Wine Articles data
  const resArticles = await fetch(`${baseUrl}/api/winearticles`, {
    cache: "no-cache",
  });
  const wineArticlesData = await resArticles.json();

  const breadcrumbs = breadcrumbSchemaGenerator([]);
  const organization = organizationSchema();

  return (
    <div>
      <script
        type="application/ld+json"
        className="yoast-schema-graph"
        dangerouslySetInnerHTML={{ __html: breadcrumbs }}
      />
      <script
        type="application/ld+json"
        className="yoast-schema-graph"
        dangerouslySetInnerHTML={{ __html: organization }}
      />
      <BannerSection />
      <Jumbotron />
      <FeaturedProduct />
      <div className="mt-64">
        <div>
          <AboutUs data={aboutUsData} />
        </div>
        <div className="mt-44">
          <OurWines data={ourWinesData} />
        </div>
        <div className="mt-44">
          <WineArticles data={wineArticlesData} />
        </div>
      </div>
    </div>
  );
}
