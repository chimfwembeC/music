import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Clock, Mic, Music2, User, History, Loader2, Disc } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import useRoute from "@/Hooks/useRoute";
import { router } from "@inertiajs/react";

// Types
interface Suggestion {
    id: string;
    type: "song" | "artist" | "genre";
    title: string;
    subtitle?: string;
    imageUrl?: string;
}

const SearchModal = ({ isOpen, toggleSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const route = useRoute();

    const modalVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 30,
            },
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.2,
            },
        },
    };

    useEffect(() => {
        if (isOpen) {
            fetchRecentSearches();
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const fetchRecentSearches = async () => {
        try {
            const response = await axios.get('/search/recent');
            setRecentSearches(response.data);
        } catch (error) {
            console.error("Error fetching recent searches:", error);
        }
    };

    const fetchSuggestions = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get('/search/suggestions', {
                params: { query }
            });

            if (response.data && Array.isArray(response.data)) {
                setSuggestions(response.data);
            } else {
                setError("Invalid response format");
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setError("Failed to fetch suggestions");
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        fetchSuggestions(query);
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            router.get(`/search?query=${searchQuery}`);
            toggleSearch();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const startVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            setIsListening(true);
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                fetchSuggestions(transcript);
            };

            recognition.onerror = () => {
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        }
    };

    const renderSuggestionIcon = (type: string) => {
        switch (type) {
            case "song":
                return <Music2 className="w-4 h-4" />;
            case "artist":
                return <User className="w-4 h-4" />;
            case "genre":
                return <Disc className="w-4 h-4" />;
            default:
                return <Music2 className="w-4 h-4" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="h-screen">
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSearch}
                    />
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="min-h-screen px-4 text-center">
                            <motion.div
                                className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform bg-white dark:bg-gray-900 shadow-xl rounded-2xl"
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Music Search
                                        </h2>
                                        <motion.button
                                            onClick={toggleSearch}
                                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.button>
                                    </div>

                                    <div className="relative">
                                        <div className="relative flex items-center">
                                            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-purple-500 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none transition-all"
                                                placeholder="Search songs, artists, or genres..."
                                                value={searchQuery}
                                                onChange={handleSearchInput}
                                                onKeyPress={handleKeyPress}
                                            />
                                            {('webkitSpeechRecognition' in window) && (
                                                <motion.button
                                                    className={`absolute right-4 p-1 rounded-full ${isListening
                                                        ? "text-red-500"
                                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                        }`}
                                                    onClick={startVoiceSearch}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Mic className="w-5 h-5" />
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <div className="h-[300px] overflow-y-auto mt-4">
                                        {isLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                            </div>
                                        ) : (
                                            <>
                                                {searchQuery === "" && recentSearches.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                                                            <History className="w-4 h-4 mr-2" />
                                                            Recent Searches
                                                        </h3>
                                                        <div className="space-y-2">
                                                            {recentSearches.map((search, index) => (
                                                                <motion.div
                                                                    key={index}
                                                                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                                                                    whileHover={{ x: 4 }}
                                                                    onClick={() => {
                                                                        setSearchQuery(search);
                                                                        fetchSuggestions(search);
                                                                    }}
                                                                >
                                                                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                                                                    <span className="text-gray-700 dark:text-gray-300">
                                                                        {search}
                                                                    </span>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {searchQuery !== "" && suggestions.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                                                            Suggestions
                                                        </h3>
                                                        <div className="space-y-2">
                                                            {suggestions.map((suggestion) => (
                                                                <motion.div
                                                                    key={suggestion.id}
                                                                    className="flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group transition-colors"
                                                                    whileHover={{ x: 4 }}
                                                                    onClick={() => {
                                                                        setSearchQuery(suggestion.title); // Set search input to clicked suggestion
                                                                        fetchSuggestions(suggestion.title); // Fetch new suggestions based on clicked item
                                                                    }}
                                                                >
                                                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                                        <img
                                                                            src={suggestion.imageUrl}
                                                                            alt={suggestion.title}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="ml-4 flex-grow">
                                                                        <div className="flex items-center">
                                                                            {renderSuggestionIcon(suggestion.type)}
                                                                            <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                                                                {suggestion.title}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {suggestion.subtitle}
                                                                        </p>
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {searchQuery !== "" && suggestions.length === 0 && !isLoading && (
                                                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                                        <Search className="w-12 h-12 mb-4" />
                                                        <p>No results found</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <motion.button
                                            onClick={handleSearch}
                                            className={`px-6 py-2 bg-purple-600 text-white rounded-xl font-medium flex items-center space-x-2 ${!searchQuery.trim()
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-purple-700'
                                                }`}
                                            whileHover={searchQuery.trim() ? { scale: 1.02 } : {}}
                                            whileTap={searchQuery.trim() ? { scale: 0.98 } : {}}
                                            disabled={!searchQuery.trim()}
                                        >
                                            <Search className="w-5 h-5" />
                                            <span>Search</span>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
