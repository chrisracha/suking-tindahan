"use client"

import Link from "next/link"
import Image from "next/image";
import { Home, ChevronLeft, ChevronRight, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from 'react';
import { MovieCard } from "@/components/movie-card";
import { Movie } from "@/types/movie";
import { Loader2 } from "lucide-react";

const FALLBACK_POSTER = '/images/no-poster.svg';

function RecommendationsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

    // Get the popularity from search params
    const popularity = searchParams.get('popularity');
    const getPopularityText = (rating: string | null) => {
        if (!rating || rating === '0') return 'Any';
        const numRating = parseInt(rating);
        switch (numRating) {
            case 1: return '1-2/10';
            case 2: return '3-4/10';
            case 3: return '5-6/10';
            case 4: return '7-8/10';
            case 5: return '9-10/10';
            default: return 'Any';
        }
    };
    const popularityText = getPopularityText(popularity);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams(searchParams.toString());
                const emotion = params.get('emotion');
                
                // If no emotion is selected, redirect to home
                if (!emotion) {
                    router.push('/');
                    return;
                }

                setSelectedEmotion(emotion);

                // Get the page from URL params or default to 1
                const pageParam = params.get('page');
                const pageNum = pageParam ? parseInt(pageParam) : 1;
                setCurrentPage(pageNum);

                const response = await fetch(`/api/recommendations?${params.toString()}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                
                if (data.results.length === 0) {
                    setError('No movies found for this page');
                    return;
                }

                setMovies(data.results);
                setTotalPages(data.total_pages);
                setCurrentPage(data.current_page);
                console.log(`[Recommendations] Emotion: ${emotion}, Results: ${data.results.length}, Total Pages: ${data.total_pages}`);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchParams, router]);

    const handlePageChange = async (newPage: number) => {
        if (!selectedEmotion || newPage < 1 || newPage > totalPages) return;
        
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', newPage.toString());

            // Update URL with new page number
            router.push(`/recommendations?${params.toString()}`, { scroll: false });

            const response = await fetch(`/api/recommendations?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }

            const data = await response.json();
            
            if (data.results.length === 0) {
                setError('No movies found for this page');
                return;
            }

            setMovies(data.results);
            setTotalPages(data.total_pages);
            setCurrentPage(data.current_page);
            
            // Scroll to top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    const handleShuffle = () => {
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        handlePageChange(randomPage);
    };

    const getEmotionPrefix = (emotion: string | null) => {
        if (!emotion) return "Kung ano";
        switch (emotion) {
            case 'Masaya': return 'Kung masaya';
            case 'Kinikilig': return 'Kung kinikilig';
            case 'Malungkot': return 'Kung malungkot';
            case 'Pagod': return 'Kung pagod';
            case 'Bored': return 'Kung nauumay';
            case 'Excited': return 'Kung excited';
            default: return `Kung ${emotion.toLowerCase()}`;
        }
    };

    // Only show loading state on initial load
    if (loading && movies.length === 0) {
        return (
            <main className="min-h-screen flex flex-col bg-black p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="flex flex-col items-center">
                            {/* Loading skeleton for title */}
                            <div className="h-12 w-3/4 bg-gray-800/50 rounded-lg animate-pulse mb-2" />
                            <div className="h-6 w-1/2 bg-gray-800/50 rounded-lg animate-pulse mb-8" />

                            {/* Loading skeleton for movie grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col bg-gray-800/50 rounded-xl overflow-hidden shadow-lg shadow-black/50 border border-white/5"
                                    >
                                        <div className="h-72 relative bg-gray-800/50 animate-pulse" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-6 bg-gray-800/50 rounded animate-pulse" />
                                            <div className="h-10 bg-gray-800/50 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Loading skeleton for pagination */}
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <div className="h-10 w-24 bg-gray-800/50 rounded-lg animate-pulse" />
                                <div className="h-6 w-32 bg-gray-800/50 rounded-lg animate-pulse" />
                                <div className="h-10 w-24 bg-gray-800/50 rounded-lg animate-pulse" />
                            </div>

                            {/* Loading skeleton for back button */}
                            <div className="mt-8 w-full">
                                <div className="h-10 w-full bg-gray-800/50 rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex flex-col bg-black p-4">
                <div className="w-full max-w-6xl mx-auto">
                    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <div className="flex flex-col items-center">
                            <h2 className="text-3xl md:text-4xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-4">
                                Walang nahanap na pelikula
                            </h2>
                            <p className="text-gray-400 text-center mb-8">
                                Subukan mong baguhin ang iyong mga filter o bumalik sa simula.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/">
                                    <Button
                                        variant="outline"
                                        className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        Bumalik sa Simula
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Bumalik
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-3 text-center mt-4">
                        <p className="text-gray-400 text-sm">© 2025 Suking Tindahan | DSS</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-black p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-2">
                            {getEmotionPrefix(selectedEmotion)} ka ngayon,
                        </h2>
                        <p className="text-white mb-8 text-center italic text-sm sm:text-base">
                            ito ang mga pelikulang para sa'yo!
                        </p>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col bg-gray-800/50 rounded-xl overflow-hidden shadow-lg shadow-black/50 border border-white/5"
                                    >
                                        <div className="h-48 sm:h-56 md:h-72 relative bg-gray-800/50 animate-pulse" />
                                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                                            <div className="h-4 sm:h-6 bg-gray-800/50 rounded animate-pulse" />
                                            <div className="h-8 sm:h-10 bg-gray-800/50 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                                    {movies.map((movie) => (
                                        <MovieCard key={movie.id} movie={movie} />
                                    ))}
                                </div>

                                {/* Pagination - Only show if there are results and more than one page */}
                                {movies.length > 0 && totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full">
                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <Button
                                                variant="outline"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1 || loading}
                                                className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="hidden sm:inline">Previous</span>
                                            </Button>
                                            <span className="text-white text-sm sm:text-base">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages || loading}
                                                className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base"
                                            >
                                                <span className="hidden sm:inline">Next</span>
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={handleShuffle}
                                            disabled={loading}
                                            className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base"
                                        >
                                            <Shuffle className="h-4 w-4" />
                                            <span className="hidden sm:inline ml-2">Shuffle</span>
                                        </Button>
                                    </div>
                                )}

                                {/* Show message when no results */}
                                {!loading && movies.length === 0 && (
                                    <div className="text-center text-gray-400 py-8 sm:py-12 text-sm sm:text-base">
                                        No movies found for your current filters. Try adjusting your preferences.
                                    </div>
                                )}
                            </>
                        )}

                        <div className="w-full mt-8 flex justify-center">
                            <Link href="/" className="block w-full sm:w-auto max-w-xs">
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white text-sm sm:text-base"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Bumalik sa Simula
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 text-center mt-4">
                    <p className="text-gray-400 text-xs sm:text-sm">© 2025 Suking Tindahan | DSS</p>
                </div>
            </div>
        </main>
    );
}

export default function RecommendationsPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-[#00E054]" />
            </div>
        }>
            <RecommendationsContent />
        </Suspense>
    );
}