// File: src/app/page.tsx

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TransparencySection from "@/components/TransparencySection";
import ZakatCalculator from "@/components/ZakatCalculator";
import CampaignSection from "@/components/CampaignSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TransparencySection />
      <ZakatCalculator />
      <CampaignSection />
      <Footer />
    </main>
  );
}
