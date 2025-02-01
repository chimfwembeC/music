import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    description: string;
    email: string;
    image_url: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
    {
        id: 1,
        name: 'John Doe',
        description: 'This platform changed how I discover music! The recommendations are spot on and I love the community aspect.',
        email: 'johndoe@example.com',
        image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 2,
        name: 'Mary Smith',
        description: "The curated playlists are amazing. I've discovered so many new artists that I now love.The user interface is intuitive and beautiful.",
        email: 'marysmith@example.com',
        image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 3,
        name: 'David Wilson',
        description: 'As a music producer, this platform helps me stay connected with my audience. The analytics tools are invaluable.',
        email: 'davidwilson@example.com',
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 4,
        name: 'Sarah Johnson',
        description: 'The sound quality is exceptional. I appreciate how they prioritize high-fidelity streaming for audiophiles like me.',
        email: 'sarahjohnson@example.com',
        image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 5,
        name: 'Michael Brown',
        description: 'The collaborative playlist feature has made sharing music with friends so much more fun. We create themed playlists together!',
        email: 'michaelbrown@example.com',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 6,
        name: 'Emma Davis',
        description: 'I love how the platform supports independent artists. The direct support features have helped me build a sustainable career.',
        email: 'emmadavis@example.com',
        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 7,
        name: 'James Taylor',
        description: 'The offline mode is perfect for my commutes. I never have to worry about losing connection in the subway anymore.',
        email: 'jamestaylor@example.com',
        image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    },
    {
        id: 8,
        name: 'Lisa Anderson',
        description: "The social features make music discovery a shared experience. I've connected with so many people who share my taste.",
        email: 'lisaanderson@example.com',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
    }
];

export default function TestimonialsSection() {
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'loadMore'>('grid');
    const itemsPerPage = 6;

    const getPaginatedData = (page: number, mode: 'grid' | 'loadMore') => {
        if (mode === 'loadMore') {
            return TESTIMONIALS_DATA.slice(0, page * itemsPerPage);
        }
        const start = (page - 1) * itemsPerPage;
        return TESTIMONIALS_DATA.slice(start, start + itemsPerPage);
    };

    const totalPages = Math.ceil(TESTIMONIALS_DATA.length / itemsPerPage);
    const displayedTestimonials = getPaginatedData(currentPage, viewMode);

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <section className="min-h-screen bg-gray-200 dark:bg-gray-900 py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <motion.h2
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        What Our Users Say
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Discover what music lovers around the world think about our platform
                    </motion.p>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={() => {
                                setViewMode('grid');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            Grid View
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('loadMore');
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg transition-colors ${viewMode === 'loadMore'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            List View
                        </button>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="wait">
                        {displayedTestimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                variants={itemVariants}
                                layout
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <img
                                                    src={testimonial.image_url}
                                                    alt={testimonial.name}
                                                    className="h-14 w-14 rounded-full object-cover border-2 border-purple-500"
                                                />
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {testimonial.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testimonial.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600 dark:text-gray-300 italic">
                                            "{testimonial.description}"
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {viewMode === 'grid' && (
                    <div className="mt-12 flex justify-center items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg ${currentPage === page
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {viewMode === 'loadMore' && currentPage < totalPages && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
