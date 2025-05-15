import React from 'react';
import { motion } from "framer-motion";
import { Play, Headphones, Music2, TrendingUp, Sparkles } from 'lucide-react';

export default function HeroSection() {
    const backgroundImage = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80";

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const stats = [
        { icon: Music2, label: 'Songs', value: '10M+' },
        { icon: Headphones, label: 'Listeners', value: '2M+' },
        { icon: TrendingUp, label: 'Artists', value: '50K+' }
    ];

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-96 h-96 bg-purple-500/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 2,
                        }}
                    />
                ))}
            </div>

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Text Content */}
                    <div className="text-center lg:text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                            <span className="text-sm text-purple-200">Discover Your Next Favorite Song</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent"
                        >
                            Your Music Journey
                            <br />
                            Starts Here
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg text-gray-300 max-w-xl"
                        >
                            Explore millions of tracks, create your perfect playlist, and connect with a community of music lovers from around the world.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center group w-full sm:w-auto justify-center"
                            >
                                <Play className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                                Start Listening
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 backdrop-blur-sm transition-colors w-full sm:w-auto justify-center inline-flex items-center"
                            >
                                View Trending
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Right Column - Stats & Visual Elements */}
                    <div className="">
                        {/* Floating Music Notes Animation */}
                        <div className="overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-purple-500/50"
                                    initial={{ y: 0, x: Math.random() * 100 }}
                                    animate={{
                                        y: [-20, -120],
                                        x: Math.sin(i) * 50,
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.8,
                                    }}
                                >
                                    <Music2 size={25} />
                                </motion.div>
                            ))}
                        </div>



                        {/* trending floating */}
                        {/* <div className="overflow-hidden">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-purple-500/50"
                                    initial={{ y: 0, x: Math.random() * 100 }}
                                    animate={{
                                        y: [-20, -120],
                                        x: Math.sin(i) * 50,
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.8,
                                    }}
                                >
                                    <Headphones size={25} />
                                </motion.div>
                            ))}
                        </div> */}

                        {/* Stats Grid */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    {...fadeInUp}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                                    <div className="relative p-6 rounded-2xl border border-white/20 backdrop-blur-sm bg-white/10">
                                        <stat.icon className="w-8 h-8 text-purple-400 mb-4" />
                                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                        <div className="text-sm text-gray-300">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Effect */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg className="w-full h-24" viewBox="0 0 1440 74" fill="none">
                    <motion.path
                        initial={{ d: "M0,37 C320,77 520,18 720,37 C920,56 1120,77 1440,37 L1440,74 L0,74 Z" }}
                        animate={{
                            d: [
                                "M0,37 C320,77 520,18 720,37 C920,56 1120,77 1440,37 L1440,74 L0,74 Z",
                                "M0,42 C320,70 520,28 720,42 C920,55 1120,70 1440,42 L1440,74 L0,74 Z"
                            ]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut",
                            repeatType: "mirror"
                        }}
                        fill="rgba(255,255,255,0.05)"
                    />
                </svg>
            </div>
        </section>
    );
}
