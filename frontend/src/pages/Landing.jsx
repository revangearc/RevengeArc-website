import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HomeDashboardSection from "../components/HomeDashboardSection";
import NutritionSection from "../components/NutritionSection";
import GymBuddieSection from "../components/GymBuddieSection";
import WorkoutSection from "../components/WorkoutSection";
import CombatZoneSection from "../components/CombatZoneSection";
import ArenaSection from "../components/ArenaSection";
import ProgressHubSection from "../components/ProgressHubSection";
import ProfileSection from "../components/ProfileSection";
import CreatorProgramSection from "../components/CreatorProgramSection";
import WaitlistSection from "../components/WaitlistSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <HomeDashboardSection />
      <NutritionSection />
      <GymBuddieSection />
      <WorkoutSection />
      <CombatZoneSection />
      <ArenaSection />
      <ProgressHubSection />
      <ProfileSection />
      <CreatorProgramSection />
      <WaitlistSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
