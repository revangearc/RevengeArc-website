import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HomeDashboardSection from "../components/HomeDashboardSection";
import NutritionSection from "../components/NutritionSection";
import AIFoodScanSection from "../components/AIFoodScanSection";
import GymBuddieSection from "../components/GymBuddieSection";
import WorkoutSection from "../components/WorkoutSection";
import CombatZoneSection from "../components/CombatZoneSection";
import ArenaSection from "../components/ArenaSection";
import ProgressHubSection from "../components/ProgressHubSection";
import ProfileSection from "../components/ProfileSection";
import PricingSection from "../components/PricingSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HomeDashboardSection />
      <NutritionSection />
      <AIFoodScanSection />
      <GymBuddieSection />
      <WorkoutSection />
      <CombatZoneSection />
      <ArenaSection />
      <ProgressHubSection />
      <ProfileSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
