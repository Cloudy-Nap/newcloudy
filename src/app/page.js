import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBenefits from "@/components/TrustBenefits";
import ShopCategories from "@/components/ShopCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import MattressRange from "@/components/MattressRange";
import PromoBanner from "@/components/PromoBanner";
import DolceVitaFeatures from "@/components/DolceVitaFeatures";
import Testimonials from "@/components/Testimonials";
import Map from "@/components/Map";
import Videos from "@/components/Videos";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-full bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <TrustBenefits />
      <ShopCategories />
    
      <MattressRange />
      <FeaturedProducts />
      <PromoBanner />
      <DolceVitaFeatures />
      <Testimonials />
      <Map />
      <Videos />
      <Footer />
    </div>
  );
}
