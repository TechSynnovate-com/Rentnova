/**
 * RentNova Landing Page
 * Modern home page showcasing the rental platform's features and benefits
 * 
 * Features:
 * - Hero section with compelling value proposition
 * - Feature highlights for tenants and landlords
 * - Property showcase carousel
 * - Call-to-action buttons for registration
 * - Mobile-first responsive design
 * 
 * @author RentNova Development Team
 * @version 1.0.0
 */

import { HeroSection } from '@/components/sections/hero-section'
import { FeaturedPropertiesCarousel } from '@/components/sections/featured-properties-carousel'
import { RelatedProperties } from '@/components/sections/related-properties'
import { StatsSection } from '@/components/sections/stats-section'
import { HowItWorks } from '@/components/sections/how-it-works'
import { CTASection } from '@/components/sections/cta-section'


export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <FeaturedPropertiesCarousel />
      <RelatedProperties maxProperties={6} />
      <HowItWorks />
      <CTASection />
    </div>
  )
}