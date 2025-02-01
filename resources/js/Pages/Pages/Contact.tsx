import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
        <GuestLayout title="Contact Us">
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 py-8">
                    <motion.h1
                        className="text-3xl font-bold mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Contact Us
                    </motion.h1>
                    <motion.form
                        onSubmit={handleSubmit}
                        className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-lg mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-lg mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-lg mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white"
                                required
                            ></textarea>
                        </div>

                        <motion.button
                            type="submit"
                            className="w-full py-3 bg-blue-500 rounded-lg text-white"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Send Message
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </GuestLayout>
    );
}

export default ContactPage;
