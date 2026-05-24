import Navbar from "../components/Navbar";
import CreatorProgramSection from "../components/CreatorProgramSection";
import Footer from "../components/Footer";

export default function CreatorPage() {
  return (
    <main className="relative" data-testid="page-creator">
      <Navbar />
      <div className="pt-20">
        <CreatorProgramSection />
      </div>
      <Footer />
    </main>
  );
}
