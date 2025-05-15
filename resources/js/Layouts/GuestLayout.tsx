import React from "react";
import { Head } from "@inertiajs/react";
import Header from "@/Layouts/Header";
import Footer from "@/Layouts/Footer";

const GuestLayout = ({ children, title }) => {
    return (
        <div className="dark:bg-gray-900 dark:text-white flex flex-col min-h-screen">
            {/* title */}
            <Head title={title} />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-grow mt-16">{children}</main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default GuestLayout;
