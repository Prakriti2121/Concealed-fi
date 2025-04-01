import AboutUs from "@/components/molecules/AboutUs";
import OurWines from "@/components/molecules/OurWines";
import WineArticles from "@/components/molecules/WineArticles";
import FeaturedProduct from "@/components/organisms/FeaturedProduct";
import Jumbotron from "@/components/organisms/Jumbotron";

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

  return (
    <div>
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
