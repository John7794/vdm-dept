import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { CookieConsentProvider } from "./contexts/CookieConsentContext";
import { PrivacyModalProvider } from "./contexts/PrivacyModalContext";
import AccessibilityToolbar from "./components/AccessibilityToolbar";
import CookieConsent from "./components/CookieConsent";
import PrivacyModal from "./components/PrivacyModal";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Staff from "./pages/Staff";
import About from "./pages/About";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Applicants from "./pages/Applicants";
import Contacts from "./pages/Contacts";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import AccessGate from "./components/AccessGate";
import Admin from "./pages/Admin";
import { useCms } from "./contexts/CmsContext";
import { Loader2 } from "lucide-react";

export default function App() {
  const [hasAccess, setHasAccess] = useState(false);
  const { loading, error } = useCms();
  
  const sitePassword = (import.meta as any).env.VITE_SITE_PASSWORD;

  useEffect(() => {
    // Check if access was already granted in this browser
    const granted = localStorage.getItem("site_access") === "granted";
    
    // If no password is set in environment, we allow access by default
    // Otherwise, check if we already have a grant
    if (!sitePassword || sitePassword.trim() === "" || granted) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  }, [sitePassword]);

  if (!hasAccess && sitePassword && sitePassword.trim() !== "") {
    return <AccessGate correctPassword={sitePassword} onAccess={() => setHasAccess(true)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-text-main" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center text-red-500 font-mono">
        Error loading CMS: {error}
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <CookieConsentProvider>
          <PrivacyModalProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="programs" element={<Programs />} />
                  <Route path="staff" element={<Staff />} />
                  <Route path="about" element={<About />} />
                  <Route path="news" element={<News />} />
                  <Route path="news/:id" element={<NewsDetail />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ProjectDetail />} />
                  <Route path="applicants" element={<Applicants />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <AccessibilityToolbar />
              <CookieConsent />
              <PrivacyModal />
            </Router>
          </PrivacyModalProvider>
        </CookieConsentProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

