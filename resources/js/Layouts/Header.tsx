import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Music2, Users, BookOpen, Mail, ChevronDown, User, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { router } from '@inertiajs/react';

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    {
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    toggleSearch();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [])
    }
    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleSearch = () => {
        setIsSearchOpen(prev => !prev);
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
        setIsSearchOpen(false);
    };

    const navItems = [
        { href: '/music', label: 'Music', icon: Music2 },
        { href: '/artists', label: 'Artists', icon: Users },
        { href: '/blogs', label: 'Blogs', icon: BookOpen },
        { href: '/contact', label: 'Contact', icon: Mail },
        { href: '/about', label: 'About', icon: User }
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
                : 'bg-white dark:bg-gray-900'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.get('/')}
                    >
                        <Music2 className="w-8 h-8 text-purple-600" />
                        <span className="text-xl cursor-pointer font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                            MusicHub
                        </span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <motion.div
                                key={item.label}
                                onClick={() => router.get(item.href)}
                                className="px-3 py-2 cursor-pointer rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1 group transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <item.icon className="w-4 h-4 group-hover:text-purple-500 transition-colors" />
                                <span>{item.label}</span>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <motion.div
                            className="relative hidden sm:block"
                            whileHover={{ scale: 1.02 }}
                        >
                            <button
                                onClick={toggleSearch}
                                className="flex items-center w-48 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            >
                                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    Search...
                                </span>
                                <kbd className="ml-auto inline-flex items-center px-1.5 py-0.5 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-purple-800 rounded">
                                    ⌘K
                                </kbd>
                            </button>
                        </motion.div>

                        {/* Mobile Search Icon */}
                        <motion.button
                            className="sm:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={toggleSearch}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Search className="w-5 h-5" />
                        </motion.button>

                        {/* Theme Toggle (You can keep your DarkModeToggle component here) */}
                        <div className="hidden sm:block">
                            {/* Your DarkModeToggle component */}
                            <DarkModeToggle />
                        </div>

                        <div className="hidden sm:block">
                            <motion.button
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-400 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                                onClick={() => router.get('/login')}
                                whileTap={{ scale: 0.9 }}
                            >
                                <LogIn className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* <div className="hidden sm:block">
                            <motion.button
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => router.get('/login')}
                                whileTap={{ scale: 0.9 }}
                            >
                                Create Account
                            </motion.button>
                        </div> */}
                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={toggleMobileMenu}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                toggleSearch={toggleSearch}
            />

            {/* Keyboard Shortcut Handler */}
            <div className="hidden">
                {/* Add keyboard shortcut listener for ⌘K */}

            </div>
        </header>
    );
};

export default Header;
