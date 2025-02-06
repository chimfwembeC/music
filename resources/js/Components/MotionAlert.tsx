// MotionAlert.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MotionAlertProps {
    show: boolean;
    message: string;
    type?: "success" | "error";
    className?: string;
}

const MotionAlert: React.FC<MotionAlertProps> = ({
    show,
    message,
    type = "success",
    className = "",
}) => {
    // Define background color based on type
    const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50 ${className}`}
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MotionAlert;
