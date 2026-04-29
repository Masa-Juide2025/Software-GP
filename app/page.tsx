import { Navbar } from "@/components/home/navbar"
import { HeroSection } from "@/components/home/hero-section"
import { ServicesSection } from "@/components/home/services-section"
import { SpecialistsSection } from "@/components/home/specialists-section"
import { PlansSection } from "@/components/home/plans-section"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <SpecialistsSection />
      </main>
      <Footer />
    </div>
  )
}
