import AboutUs from "@/components/molecules/AboutUs";
import OurWines from "@/components/molecules/OurWines";
import WineArticles from "@/components/molecules/WineArticles";
import FeaturedProduct from "@/components/organisms/FeaturedProduct";
import Jumbotron from "@/components/organisms/Jumbotron";

export default function Home() {
  return (
    <div>
      <Jumbotron />

      {/* featured product */}
      <div>
        <FeaturedProduct />
      </div>
      {/* / end of featured product */}
      <div className="mt-64">
        <div>
          <AboutUs />
        </div>
        <div className="mt-44">
          <OurWines />
        </div>
        <div className="mt-44">
          <WineArticles />
        </div>
      </div>
    </div>
  );
}
