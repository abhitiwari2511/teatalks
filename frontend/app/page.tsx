import Navbar from "@/components/landingPage/Navbar";
import Hero from "@/components/landingPage/Hero";
import FeatureSection from "@/components/landingPage/FeatureSection";
import Testimonials from "@/components/landingPage/Testimonials";
import CtaSection from "@/components/landingPage/CtaSection";
import Footer from "@/components/landingPage/Footer";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeatureSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  );
}
