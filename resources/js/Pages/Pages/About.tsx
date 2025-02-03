import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

function AboutPage() {
    return (
        <GuestLayout title="About Us">
            <div className="min-h-screen bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
                <div className="container mx-auto px-4 py-8">
                    <motion.h1
                        className="text-3xl font-bold mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        About Us
                    </motion.h1>

                    <motion.div
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center mb-6">
                            <Info className="w-10 h-10 text-blue-500 mr-4" />
                            <h2 className="text-2xl font-semibold">Our Story</h2>
                        </div>

                        <p className="text-lg dark:text-gray-400">
                            Welcome to our website! We are a team of passionate individuals who
                            strive to bring the best music, content, and experiences to our
                            community. Whether you're here to discover new tunes, explore the
                            world of artists, or enjoy our blogs, we hope you find something you
                            love.
                        </p>
                        <p className="text-lg dark:text-gray-400 mt-4">
                            We believe in creativity, collaboration, and the power of
                            storytelling. Our mission is to connect music lovers with artists and
                            content that inspire, entertain, and resonate with people worldwide.
                        </p>
                    </motion.div>
                </div>
            </div>
        </GuestLayout>
    );
}

export default AboutPage;
