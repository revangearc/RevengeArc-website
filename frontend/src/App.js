import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import WaitlistPage from "./pages/Waitlist";
import CreatorPage from "./pages/Creator";
import {
  TermsPage, PrivacyPage, RefundPage, ContactPage, SupportPage,
  LegalCenterPage, AIHealthDisclaimerPage, CommunityGuidelinesPage,
  SubscriptionsRefundsPage, DataDeletionPage, CookiesPage,
} from "./pages/Legal";

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="App grain">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/creator" element={<CreatorPage />} />
          {/* Capitalised aliases redirect to canonical lowercase */}
          <Route path="/Waitlist" element={<Navigate to="/waitlist" replace />} />
          <Route path="/Creator" element={<Navigate to="/creator" replace />} />
          {/* Old /blog route → redirect to Legal Center */}
          <Route path="/blog" element={<Navigate to="/legal" replace />} />
          <Route path="/Blog" element={<Navigate to="/legal" replace />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/legal" element={<LegalCenterPage />} />
          <Route path="/ai-health-disclaimer" element={<AIHealthDisclaimerPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/subscriptions-refunds" element={<SubscriptionsRefundsPage />} />
          <Route path="/data-deletion" element={<DataDeletionPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        theme="dark"
        position="top-right"
        richColors
        toastOptions={{
          className: "ra-toast",
          style: {
            background: "linear-gradient(180deg, rgba(20,15,32,0.96) 0%, rgba(10,8,20,0.96) 100%)",
            border: "1px solid rgba(168,85,247,0.4)",
            color: "#fff",
            backdropFilter: "blur(18px)",
            boxShadow: "0 0 30px rgba(168,85,247,0.25), 0 10px 40px rgba(0,0,0,0.6)",
            fontWeight: 500,
          },
        }}
      />
    </div>
  );
}

export default App;
