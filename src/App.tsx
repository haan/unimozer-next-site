import { DownloadCards } from "./components/DownloadCards";
import { FeatureCarousel } from "./components/FeatureCarousel";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { ItAdminSection } from "./components/ItAdminSection";
import { Overview } from "./components/Overview";

function App() {
  return (
    <div
      className="min-h-screen"
      id="top"
    >
      <Hero />
      <main>
        <Overview />
        <FeatureCarousel />
        <DownloadCards />
        <ItAdminSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
