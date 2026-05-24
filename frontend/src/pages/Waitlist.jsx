import Navbar from "../components/Navbar";
import WaitlistSection from "../components/WaitlistSection";
import Footer from "../components/Footer";

export default function WaitlistPage() {
  return (
    <main className="relative" data-testid="page-waitlist">
      <Navbar />
      <div className="pt-20">
        <WaitlistSection />
      </div>
      <Footer />
    </main>
  );
}
