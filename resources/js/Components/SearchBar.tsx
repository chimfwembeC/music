import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { getSearchSuggestions, getRecentSearches } from './api';
import type { SearchSuggestion } from './types';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadRecentSearches();

        // Close suggestions when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadSuggestions = async () => {
            if (query.length >= 2) {
                try {
                    const data = await getSearchSuggestions(query);
                    setSuggestions(data);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error('Failed to load suggestions:', error);
                }
            } else {
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(loadSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const loadRecentSearches = async () => {
        try {
            const searches = await getRecentSearches();
            setRecentSearches(searches);
        } catch (error) {
            console.error('Failed to load recent searches:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search for songs, artists, or genres..."
                    className="w-full px-4 py-3 pl-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </form>

            {showSuggestions && (query.length >= 2 || recentSearches.length > 0) && (
                <div className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    {query.length >= 2 ? (
                        suggestions.length > 0 ? (
                            <div className="py-2">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={`${suggestion.type}-${suggestion.id}`}
                                        onClick={() => {
                                            onSearch(suggestion.title);
                                            setShowSuggestions(false);
                                            setQuery(suggestion.title);
                                        }}
                                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <img
                                            src={suggestion.imageUrl}
                                            alt={suggestion.title}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                        <div className="text-left">
                                            <div className="font-medium">{suggestion.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {suggestion.subtitle}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                No results found
                            </div>
                        )
                    ) : recentSearches.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Recent Searches
                            </div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        onSearch(search);
                                        setShowSuggestions(false);
                                        setQuery(search);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
