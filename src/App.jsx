import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import CategoryDetail from "./components/CategoryDetail";
import FeaturedSection from "./components/FeaturedSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import VerificationDemo from "./pages/VerificationDemo";
import MatchingEngineDemo from "./pages/MatchingEngineDemo";
import "./index.css";

const fullWidth = { width: "100%", maxWidth: "100%", display: "block", boxSizing: "border-box" };

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const goHome = () => { setPage("home"); setSelectedCategory(null); };

  const handleSearch = () => {
    goHome();
    setTimeout(() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const renderPage = () => {
    if (page === "verification") return <VerificationDemo onBack={goHome} />;
    if (page === "matching") return <MatchingEngineDemo onBack={goHome} />;
    if (page === "category" && selectedCategory) return <CategoryDetail category={selectedCategory} onBack={goHome} />;
    return (
      <>
        <Hero onSearch={handleSearch} />
        <CategoryGrid onSelect={(cat) => { setSelectedCategory(cat); setPage("category"); }} />
        <FeaturedSection />
        <HowItWorks />
      </>
    );
  };

  return (
    <div style={fullWidth}>
      <Navbar
        activePage={page}
        onHomeClick={goHome}
        onVerificationClick={() => setPage("verification")}
        onMatchingClick={() => setPage("matching")}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}
