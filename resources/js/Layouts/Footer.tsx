import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'About Us', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Press', href: '/press' },
            { label: 'Blog', href: '/blog' }
        ],
        support: [
            { label: 'Help Center', href: '/help' },
            { label: 'Safety Center', href: '/safety' },
            { label: 'Community Guidelines', href: '/guidelines' },
            { label: 'Contact Us', href: '/contact' }
        ],
        legal: [
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Licenses', href: '/licenses' }
        ]
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://facebook.com', color: 'hover:text-[#1877F2]', label: 'Facebook' },
        { icon: Twitter, href: 'https://twitter.com', color: 'hover:text-[#1DA1F2]', label: 'Twitter' },
        { icon: Instagram, href: 'https://instagram.com', color: 'hover:text-[#E4405F]', label: 'Instagram' },
        { icon: Youtube, href: 'https://youtube.com', color: 'hover:text-[#FF0000]', label: 'YouTube' }
    ];

    const contactInfo = [
        { icon: Mail, text: 'support@musichub.com' },
        { icon: Phone, text: '+1 (555) 123-4567' },
        { icon: MapPin, text: 'Los Angeles, CA 90001' }
    ];

    return (
        <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center space-x-2">
                                <Music2 className="w-8 h-8 text-purple-500" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                                    MusicHub
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 max-w-md">
                                Discover, stream, and share a constantly expanding mix of music from emerging and major artists around the world.
                            </p>
                            {/* Contact Information */}
                            <div className="space-y-2 mt-6">
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center space-x-3 text-sm"
                                        whileHover={{ x: 2 }}
                                    >
                                        <item.icon className="w-4 h-4 text-gray-400" />
                                        <span>{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([title, links], index) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-4 capitalize">{title}</h3>
                            <ul className="space-y-2">
                                {links.map((link, linkIndex) => (
                                    <motion.li key={linkIndex} whileHover={{ x: 2 }}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                                            <span>{link.label}</span>
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-12 pt-8 border-t border-gray-800"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-sm text-gray-400">
                            &copy; {currentYear} MusicHub. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-6">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-gray-400 transition-all duration-300 ${social.color}`}
                                    whileHover={{ scale: 1.2, rotate: 8 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
                    >
                        <span className="text-sm text-gray-400">Stay up to date with the latest music</span>
                        <div className="flex space-x-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="px-4 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
