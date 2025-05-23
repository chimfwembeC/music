import React, { useState, useEffect } from "react";
import { Sun, Moon, Monitor, ChevronDown, MoonStar, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Get system preference
const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const DarkModeToggle = () => {
    const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check local storage or system default
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system";
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme("dark"); // Default is dark mode
        }

        // Apply theme
        const applyTheme = (mode: string) => {
            if (mode === "system") {
                document.documentElement.classList.toggle("dark", getSystemTheme());
            } else {
                document.documentElement.classList.toggle("dark", mode === "dark");
            }
        };

        applyTheme(savedTheme || "dark");
    }, []);

    const handleThemeChange = (mode: "light" | "dark" | "system") => {
        setTheme(mode);
        localStorage.setItem("theme", mode);
        document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && getSystemTheme()));
        setOpen(false); // Close dropdown after selection
    };

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white border border-gray-400 dark:border-purple-800"
            >
                {theme === "dark" ? <Moon size={20} className="text-gray-500" /> :
                    theme === "light" ? <Sun size={20} className="text-yellow-500" /> :
                        <Monitor size={20} className="text-blue-500" />}
                <span className="capitalize">{theme}</span>
                {open ? (
                    <ChevronDown size={16} />
                ) : (
                    <ChevronUp size={16} />
                )}
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-400 dark:border-purple-800 rounded-lg shadow-lg"
                    >
                        <ul className="py-2 dark:text-gray-200">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                Manage Modes    
                            </div>
                            <div className="border-b border-gray-400 dark:border-purple-700" />
                            <li
                                onClick={() => handleThemeChange("light")}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <Sun size={18} className="text-yellow-500" /> Light Mode
                            </li>
                            <div className="border-b border-gray-400 dark:border-purple-700" />
                            <li
                                onClick={() => handleThemeChange("dark")}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <MoonStar size={18} className="text-gray-700 dark:text-gray-500" /> Dark Mode
                            </li>
                            <div className="border-b border-gray-400 dark:border-purple-700" />
                            <li
                                onClick={() => handleThemeChange("system")}
                                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <Monitor size={18} className="text-blue-500" /> System Default
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DarkModeToggle;
