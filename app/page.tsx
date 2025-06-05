"use client";

import * as React from "react";
import { HeroSection } from "@/components/welcome/hero-section";
import { FeaturesSection } from "@/components/welcome/features-section";
import { HowItWorksSection } from "@/components/welcome/how-it-works-section";
import { TestimonialSection } from "@/components/welcome/testimonial-section";
import { CTASection } from "@/components/welcome/cta-section";
import { Footer } from "@/components/welcome/footer";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="flex flex-col h-screen overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </ScrollArea>
  );
}
