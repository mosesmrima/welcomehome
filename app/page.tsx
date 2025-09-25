import { Navbar } from "./components/landing/navbar"
import { HeroSection } from "./components/landing/hero-section"
import { MissionSection } from "./components/landing/mission-section"
import { ServicesSection } from "./components/landing/services-section"
import { TestimonialsSection } from "./components/landing/testimonials-section"
import { Footer } from "./components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
