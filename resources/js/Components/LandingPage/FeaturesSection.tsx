import React from 'react'
import { motion } from "framer-motion";

export default function FeaturesSection() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-20">
            {["Discover Music", "Follow Artists", "Read Blogs"].map((feature, index) => (
                <motion.div
                    key={index}
                    className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                    <h2 className="text-xl font-bold">{feature}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Explore and enjoy endless music content.</p>
                </motion.div>
            ))}
        </section>
    )
}
