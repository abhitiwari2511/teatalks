import Navbar from "@/components/homePage/Navbar";
import Hero from "@/components/homePage/Hero";
import FeatureSection from "@/components/homePage/FeatureSection";
import Testimonials from "@/components/homePage/Testimonials";
import CtaSection from "@/components/homePage/CtaSection";
import Footer from "@/components/homePage/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <Hero />
      <FeatureSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}
