import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { TermsPage, PrivacyPage, RefundPage, ContactPage, SupportPage } from "./pages/Legal";

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
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/support" element={<SupportPage />} />
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
