import React from 'react';
// import { motion } from "framer-motion";
import DarkModeToggle from '@/Components/DarkModeToggle';
import { Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import TestimonialsSection from '@/Components/LandingPage/TestimonialsSection';
import FAQSection from '@/Components/LandingPage/FAQSection';
import ContactSection from '@/Components/LandingPage/ContactSection';
import HeroSection from '@/Components/LandingPage/HeroSection';
import FeaturesSection from '@/Components/LandingPage/FeaturesSection';
import FeaturedMusicSection from '@/Components/LandingPage/FeaturedMusicSection';

const LandingPage = () => {
  return (
    <GuestLayout title={'Welcome'}>
      <div className="">
        {/* Hero Section */}
        <HeroSection />
        <div className="">
          <FeaturedMusicSection />
        </div>
        {/* Features Section */}
        <FeaturesSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </GuestLayout>
  );
};

export default LandingPage;
