import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageCircle, Phone } from 'lucide-react';
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
            <div className="min-h-screen bg-gradient-to-br  dark:from-gray-900 dark:to-gray-800 from-gray-200 to-gray-100 dark:text-white text-gray-600">
                <div className="container mx-auto px-4 py-8">
                    <motion.h1
                        className="text-3xl font-bold mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Contact Us
                    </motion.h1>

                    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mock Contact Information Section */}
                        {/* Mock Contact Information Section */}
                        <motion.div
                            className="w-full mb-8 mx-auto bg-white dark:bg-gray-800/50 p-6 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-semibold mb-4">Our Contact Information</h2>
                            <div className="flex items-center mb-4">
                                <Mail className="text-blue-500 mr-3" />
                                <span className="text-lg">Email: <a href="mailto:support@example.com">support@example.com</a></span>
                            </div>
                            <div className="flex items-center mb-4">
                                <Phone className="text-blue-500 mr-3" />
                                <span className="text-lg">Phone: (123) 456-7890</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <MessageCircle className="text-blue-500 mr-3" />
                                <span className="text-lg">Address: 123 Music Street, Melody City, Country</span>
                            </div>

                            {/* Embed Google Map */}
                            <motion.div
                                className="w-full mb-8 mx-auto bg-gray-400/50 dark:bg-gray-800 p-6 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-2xl font-semibold mb-4">Find Us on the Map</h2>
                                <div className="w-full">
                                    <iframe
                                        className="w-full h-full rounded-lg"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16058.53911902399!2d28.3228!3d-15.3875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMfxmYWluZ2Z1ZGZ1ZGFkZD8QbG9hZ2thdnRl!5e0!3m2!1sen!2sin!4v1621603505083!5m2!1sen!2sin"
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </motion.div>

                        </motion.div>



                        {/* Contact Form Section */}
                        <motion.form
                            onSubmit={handleSubmit}
                            className="w-full mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg"
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
                                    placeholder='Enter name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-gray-300/50 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 dark:text-white text-gray-600"
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
                                    placeholder='Enter email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-gray-300/50 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 dark:text-white text-gray-600"
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
                                    placeholder='Write your message or concern here...!'
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full p-3 rounded-lg bg-gray-300/50 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600 dark:text-white text-gray-600"
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
            </div>
        </GuestLayout>
    );
}

export default ContactPage;
