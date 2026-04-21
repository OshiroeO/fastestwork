import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryGrid from "./components/CategoryGrid";
import CategoryDetail from "./components/CategoryDetail";
import FeaturedSection from "./components/FeaturedSection";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import FreelancerRegisterPage from "./pages/FreelancerRegisterPage";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import MatchingEngineDemo from "./pages/MatchingEngineDemo";
import LoginModal from "./components/LoginModal";
import FreelancerBar from "./components/FreelancerBar";
import FreelancerProfileModal from "./components/FreelancerProfileModal";
import ChatPanel from "./components/ChatPanel";
import "./index.css";

const fullWidth = { width: "100%", maxWidth: "100%", display: "block", boxSizing: "border-box" };

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [verifiedFreelancers, setVerifiedFreelancers] = useState([]);

  // Auth / role demo
  const [userRole, setUserRole] = useState(null);          // null | "freelancer" | "customer"
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Freelancer dashboard
  const [freelancerSubPage, setFreelancerSubPage] = useState("post-job");
  const [postedJob, setPostedJob] = useState(null);

  // Profile modal + chat
  const [profileFreelancer, setProfileFreelancer] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const goHome = () => {
    setPage("home");
    setSelectedCategory(null);
    if (userRole === "freelancer") setFreelancerSubPage("post-job");
  };

  const handleSearch = () => {
    goHome();
    setTimeout(() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleFreelancerVerified = (freelancer) => {
    setVerifiedFreelancers(prev => [...prev, freelancer]);
  };

  const handleSelectRole = (role) => {
    setUserRole(role);
    setShowLoginModal(false);
    if (role === "freelancer") {
      setPage("freelancer-dashboard");
      setFreelancerSubPage("post-job");
    } else {
      goHome();
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setPostedJob(null);
    goHome();
  };

  const handleFreelancerCardClick = (freelancer) => {
    setProfileFreelancer(freelancer);
  };

  const renderPage = () => {
    // Freelancer dashboard (all sub-pages)
    if (userRole === "freelancer" && page === "freelancer-dashboard") {
      return (
        <FreelancerDashboard
          subPage={freelancerSubPage}
          onPostJob={(job) => setPostedJob(job)}
          postedJob={postedJob}
        />
      );
    }

    if (page === "register") return (
      <FreelancerRegisterPage onBack={goHome} onVerified={handleFreelancerVerified} />
    );
    if (page === "matching") return <MatchingEngineDemo onBack={goHome} />;
    if (page === "category" && selectedCategory) return (
      <CategoryDetail category={selectedCategory} onBack={goHome} />
    );

    return (
      <>
        <Hero onSearch={handleSearch} />
        <CategoryGrid onSelect={(cat) => { setSelectedCategory(cat); setPage("category"); }} />
        <FeaturedSection
          newFreelancers={verifiedFreelancers}
          postedJob={postedJob}
          onFreelancerClick={handleFreelancerCardClick}
        />
        <HowItWorks />
      </>
    );
  };

  return (
    <div style={fullWidth}>
      <Navbar
        activePage={page}
        onHomeClick={goHome}
        onRegisterClick={() => setPage("register")}
        onMatchingClick={() => setPage("matching")}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        userRole={userRole}
      />

      {/* Freelancer secondary bar */}
      {userRole === "freelancer" && (
        <FreelancerBar
          activePage={freelancerSubPage}
          onPageChange={(sub) => {
            setFreelancerSubPage(sub);
            setPage("freelancer-dashboard");
          }}
        />
      )}

      {renderPage()}
      <Footer />

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSelectRole={handleSelectRole}
        />
      )}

      {profileFreelancer && (
        <FreelancerProfileModal
          freelancer={profileFreelancer}
          postedJob={profileFreelancer.id === 1 ? postedJob : null}
          onClose={() => setProfileFreelancer(null)}
          onChat={() => {
            setShowChat(true);
            setProfileFreelancer(null);
          }}
        />
      )}

      {showChat && (
        <ChatPanel
          freelancer={{ name: "ณัฐวุฒิ แสงทอง", avatar: "NT", color: "#3b82f6" }}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
