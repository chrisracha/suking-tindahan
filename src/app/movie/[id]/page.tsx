"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Movie } from "@/types/movie";
import { Loader2, ArrowLeft, Play, Star, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/Badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { VideoModal } from "@/components/video-modal";

export default function MovieDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/movie/${params.id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch movie details');
                }
                
                const data = await response.json();
                setMovie(data);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch movie details');
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchMovieDetails();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-[#00E054]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
                    <p className="text-gray-400">The movie you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-black p-4">
            <div className="w-full max-w-4xl mx-auto">
                {/* Back Button */}
                <div className="p-4">
                    <Button
                        variant="outline"
                        className="border-gray-600 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                        onClick={() => {
                            if (searchParams.get('query')) {
                                router.push(`/search?query=${encodeURIComponent(searchParams.get('query')!)}`);
                            } else {
                                router.back();
                            }
                        }}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Bumalik
                    </Button>
                </div>

                {/* Movie Details */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Movie Poster */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg shadow-black/50 border border-white/10">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            </div>

                            {movie.trailer && (
                                <Button
                                    onClick={() => setIsVideoModalOpen(true)}
                                    className="w-full mt-4 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 flex items-center justify-center py-2 rounded-md text-white font-semibold"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    Trailer
                                </Button>
                            )}
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text">
                                {movie.title}
                            </h1>

                            <div className="flex items-center gap-2 mt-2 text-gray-300">
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 font-bold">{movie.vote_average?.toFixed(1) ?? 'N/A'}/10</span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <span>{new Date(movie.release_date).getFullYear()}</span>
                                <span className="text-gray-500">•</span>
                                <span>{movie.runtime ? `${movie.runtime} min` : 'N/A'}</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {movie.genres.map((genreId) => (
                                    <Badge key={genreId} className="bg-gray-800 text-gray-200 border-gray-700 mt-2">
                                        {genreId}
                                    </Badge>
                                ))}
                            </div>

                            <Separator className="my-4 bg-gray-700" />

                            <div className="space-y-4 text-gray-200">
                                <div>
                                    <h2 className="text-xl font-bold text-purple-200 mb-2">Buod</h2>
                                    <p>{movie.overview}</p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-200 mb-2">Mga Artista</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        {movie.cast?.map((actor: { name: string; character: string; profile_path: string }) => (
                                            <div key={actor.name} className="flex flex-col items-center">
                                                <div className="w-16 h-16 rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={actor.profile_path 
                                                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                            : '/images/no-profile.svg'
                                                        }
                                                        alt={actor.name}
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/images/no-profile.svg';
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-sm font-medium mt-2 text-center">{actor.name}</p>
                                                <p className="text-xs text-gray-400 text-center">{actor.character}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {movie.director && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                            <Image
                                                src={movie.director.profile_path 
                                                    ? `https://image.tmdb.org/t/p/w185${movie.director.profile_path}`
                                                    : '/images/no-profile.svg'
                                                }
                                                alt={movie.director.name}
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/no-profile.svg';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{movie.director.name}</p>
                                            <p className="text-xs text-gray-400">Director</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 text-center mt-4">
                    <p className="text-gray-400 text-sm">© 2025 Suking Tindahan</p>
                </div>
            </div>

            {/* Video Modal */}
            {movie?.trailer && (
                <VideoModal
                    isOpen={isVideoModalOpen}
                    onClose={() => setIsVideoModalOpen(false)}
                    videoId={movie.trailer.key}
                />
            )}
        </main>
    );
} 