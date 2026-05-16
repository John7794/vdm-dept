import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
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
import Maintenance from "./pages/Maintenance";

export default function App() {
  // Toggle maintenance mode via Environment Variable
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

  if (isMaintenance) {
    return <Maintenance />;
  }

  return (
    <ThemeProvider>
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
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

