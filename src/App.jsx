import { usePortfolioSEO } from "./seo/usePortfolioSEO";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { Nav } from "./components/layout/Nav";
import { Hero } from "./components/sections/Hero";
import { TrustStrip } from "./components/sections/TrustStrip";
import { Work } from "./components/sections/Work";
import { Process } from "./components/sections/Process";
import { ServicesSection } from "./components/sections/ServicesSection";
import { AboutSection } from "./components/sections/AboutSection";
import { Testimonials } from "./components/sections/Testimonials";
import { FAQ } from "./components/sections/FAQ";
import { CTA } from "./components/sections/CTA";
import { Footer } from "./components/layout/Footer";
import { MobileStickyBar } from "./components/sections/MobileStickyBar";

export default function RishiJainPortfolio() {
    usePortfolioSEO();

    return (
        <div style={{ background: "#F7F4EF", minHeight: "100vh", overflowX: "hidden" }}>
            <a href="#main-content">Skip to content</a>
            <ScrollProgress />
            <Nav />
            <main id="main-content">
                <Hero />
                <TrustStrip />
                <Work />
                <Process />
                <ServicesSection />
                <AboutSection />
                <Testimonials />
                <FAQ />
                <CTA />
            </main>
            <Footer />
            <MobileStickyBar />
        </div>
    );
}