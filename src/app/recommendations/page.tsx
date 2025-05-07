"use client"

import Link from "next/link"
import Image from "next/image";
import { Home, ChevronLeft, ChevronRight } from "lucide-react"
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
    const popularityText = !popularity || popularity === '0' ? 'Any' : `${popularity}/5`;

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

                const response = await fetch(`/api/recommendations?${params.toString()}&page=${currentPage}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }

                const data = await response.json();
                setMovies(data.results);
                setTotalPages(data.total_pages);
                console.log(`[Recommendations] Emotion: ${emotion}, Results: ${data.results.length}, Total Pages: ${data.total_pages}`);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [searchParams, currentPage, router]);

    const handlePageChange = async (newPage: number) => {
        if (!selectedEmotion) return;
        
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(searchParams.toString());
            params.append('page', newPage.toString());

            const response = await fetch(`/api/recommendations?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch recommendations');
            }

            setMovies(data.results);
            setTotalPages(data.total_pages);
            setCurrentPage(data.current_page);
            console.log(`[Recommendations] Page ${newPage}, Results: ${data.results.length}, Total Pages: ${data.total_pages}`);
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-[#00E054]" />
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
                <div className="text-red-500 text-xl">{error}</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-black p-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-2">
                            {getEmotionPrefix(selectedEmotion)} ang nararamdaman mo
                        </h2>
                        <p className="text-white mb-8 text-center italic">
                            Mga pelikulang para sa'yo! • Rating: {popularityText}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                            {[...movies].sort(() => Math.random() - 0.5).map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-white">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-8">
                            <Link href="/">
                                <Button
                                    variant="outline"
                                    className="w-full border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
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
                    <p className="text-gray-400 text-sm">© 2025 Suking Tindahan | DSS</p>
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