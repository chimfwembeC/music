import React from 'react'
import { motion } from "framer-motion";

export default function FAQSection() {
    return (
        <section className="py-20">
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto mt-6 space-y-4">
                {["How do I upload music?", "Is the service free?", "Can I create playlists?"].map((question, index) => (
                    <motion.div
                        key={index}
                        className="p-4 border rounded-lg bg-white dark:bg-gray-800"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <h3 className="font-bold">{question}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Yes, you can easily upload and manage your music.</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
