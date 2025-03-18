import AboutUs from "@/components/molecules/AboutUs";
import FeaturedProduct from "@/components/organisms/FeaturedProduct";
import Jumbotron from "@/components/organisms/Jumbotron";

export default function Home() {
  return (
    <div>
      <Jumbotron />

      {/* featured product */}
      <div className="mt-">
        <FeaturedProduct />
      </div>
      {/* / end of featured product */}
      <div className="mt-64">
        <div>
          <AboutUs />
        </div>
      </div>

      <div className="mb-72"></div>
    </div>
  );
}
