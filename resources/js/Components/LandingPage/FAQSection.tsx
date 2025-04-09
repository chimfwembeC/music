import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Twitter, Facebook, Instagram, Github, Mail } from 'lucide-react'; // Import icons

export default function FAQSection() {
    // State to track the visibility of each FAQ answer
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // List of FAQs
    const faqs = [
        {
            question: "How do I upload music?",
            answer: "Yes, you can easily upload and manage your music.",
        },
        {
            question: "Is the service free?",
            answer: "Our service has both free and premium plans.",
        },
        {
            question: "Can I create playlists?",
            answer: "Yes, you can create and share your playlists.",
        },
    ];

    // Social media and email links
    const socialLinks = [
        { name: 'Twitter', icon: <Twitter className="text-blue-400" />, link: 'https://twitter.com/yourprofile' },
        { name: 'Facebook', icon: <Facebook className="text-blue-600" />, link: 'https://facebook.com/yourprofile' },
        { name: 'Instagram', icon: <Instagram className="text-pink-600" />, link: 'https://instagram.com/yourprofile' },
        { name: 'Github', icon: <Github className="text-gray-200" />, link: 'https://github.com/yourprofile' },
        { name: 'Email', icon: <Mail className="text-purple-500" />, link: 'mailto:your.email@example.com' }, // Added email link
    ];

    // Handle FAQ toggle
    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20">
            <h2 className="text-3xl font-bold text-center text-purple-500">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto mt-6 space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        className="p-4 border border-gray-600 dark:border-purple-800 rounded-lg bg-white dark:bg-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFAQ(index)}>
                            <h3 className="font-bold text-lg text-purple-500">{faq.question}</h3>
                            {/* Icon changes based on whether the FAQ is open or closed */}
                            {openIndex === index ? (
                                <ChevronUp className="text-gray-600 dark:text-purple-800" />
                            ) : (
                                <ChevronDown className="text-gray-600 dark:text-purple-800" />
                            )}
                        </div>
                        
                        {/* Slide in answer */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                opacity: openIndex === index ? 1 : 0,
                                height: openIndex === index ? 'auto' : 0,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                            className="text-gray-600 dark:text-gray-300 mt-2"
                        >
                            {faq.answer}
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* Social Media and Email Section */}
            <div className="mt-10 text-center">
                <h3 className="text-2xl font-bold">Follow Us</h3>
                <div className="flex justify-center space-x-6 mt-4">
                    {socialLinks.map((social, index) => (
                        <a
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
