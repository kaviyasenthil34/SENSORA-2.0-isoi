import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Tracks from "../components/Tracks";
import Schedule from "../components/Schedule";
import Venue from "../components/Venue";
import ISOIBoard from "../components/ISOIBoard";
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Tracks />
        <Schedule />
        <Venue />
        <ISOIBoard />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
