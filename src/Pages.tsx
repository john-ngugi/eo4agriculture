import React, { useState } from "react";
import MapView from "./components/Map";
import Navbar from "./components/NavBar";
import Carousel from "./components/Carousel";
import IntroSection from "./components/IntroSection";
import AboutSection from "./components/AboutSection";
import ProjectCards from "./components/ProjectCards";
import Timeline from "./components/Timeline";
import QuoteSection from "./components/QuoteSection";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

const MainPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<"home" | "dashboard">("home");

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <div
            className="min-h-screen w-full bg-gradient-to-b from-white/90 to-white/80 bg-cover bg-no-repeat bg-center relative overflow-x-hidden"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.78)), url('/static/images/80532.jpg')",
            }}
          >
            <div className="bg-white/50 absolute left-0 overflow-y-auto w-full h-full overflow-x-hidden">
              <div className="relative h-full w-full">
                {/* Carousel Section */}
                <Carousel />

                {/* Main Content */}
                <div className="container mx-auto mt-3 px-4">
                  {/* Introduction Section */}
                  <IntroSection />

                  {/* About Section */}
                  <AboutSection />

                  {/* Project Products */}
                  <h4 className="mt-8 mb-4 text-xl font-semibold">
                    Project Products
                  </h4>
                  <ProjectCards />

                  {/* Impact and Outcomes */}
                  <h4 className="mt-12 mb-12 text-xl font-semibold text-center">
                    Project Impact and Expected Outcomes
                  </h4>

                  <Timeline />

                  {/* Quote Section */}
                  <QuoteSection />
                </div>

                {/* Partners Section */}
                <Partners />

                {/* Footer */}
                <Footer />
              </div>
            </div>
          </div>
        );
      case "dashboard":
        return (
          <div className="flex-1 relative">
            <MapView />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      {renderContent()}
    </div>
  );
};

export default MainPage;
