import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-text-main selection:bg-accent-yellow selection:text-ink font-sans">
      <Navbar />
      <main className="flex-grow flex flex-col pt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
