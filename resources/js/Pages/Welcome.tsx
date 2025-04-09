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
import LatestAlbums from '@/Components/LandingPage/LatestAlbums';
import MusicTabs from '@/Components/LandingPage/MusicTabs';
import NewsSection from '@/Components/LandingPage/NewsSection';

const LandingPage = () => {
  return (
    <GuestLayout title={'Welcome'}>
      <div className="">
        {/* Hero Section */}
        <HeroSection />

        <FeaturedMusicSection />

        {/* show latest albums */}
        <LatestAlbums />

        {/* Testimonials Section */}
        {/* <TestimonialsSection /> */}
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <NewsSection />
          </div>
          <div className="col-span-2">
            <MusicTabs />
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <ContactSection />
      </div>
    </GuestLayout>
  );
};

export default LandingPage;
