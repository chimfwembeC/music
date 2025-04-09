import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import icons

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

    // Handle FAQ toggle
    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20">
            <h2 className="text-3xl font-bold text-purple-500 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto mt-6 space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        className="p-4 border dark:border-purple-800 rounded-lg bg-white dark:bg-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleFAQ(index)}>
                            <h3 className="font-bold text-lg">{faq.question}</h3>
                            {/* Icon changes based on whether the FAQ is open or closed */}
                            {openIndex === index ? (
                                <ChevronUp className="text-gray-600 dark:text-purple-600" />
                            ) : (
                                <ChevronDown className="text-gray-600 dark:text-purple-600" />
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
        </section>
    );
}
