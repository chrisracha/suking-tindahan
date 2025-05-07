"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import SearchBar from "@/components/search-bar"
import { MovieCard } from "@/components/movie-card"
import { Loader2 } from "lucide-react"
import { Movie } from "@/types/movie"

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const [results, setResults] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [totalResults, setTotalResults] = useState(0)

    useEffect(() => {
        if (!query) return

        const fetchResults = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch search results')
                }

                setResults(data.results)
                setTotalResults(data.total_results)
                console.log(`[Search] Query: "${query}", Results: ${data.results.length}, Total Results: ${data.total_results}`);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
                setResults([])
                setTotalResults(0)
            } finally {
                setIsLoading(false)
            }
        }

        fetchResults()
    }, [query])

    return (
        <main className="min-h-screen p-4 bg-black">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Search Bar */}
                <div className="flex justify-center pt-8">
                    <SearchBar />
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {query && (
                        <h2 className="text-2xl font-bold text-white">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#00E054]" />
                                    <span>Searching...</span>
                                </div>
                            ) : error ? (
                                "Error"
                            ) : (
                                `Found ${totalResults} results for "${query}"`
                            )}
                        </h2>
                    )}

                    {error && (
                        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-[2/3] bg-gray-800/50 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {results.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && results.length === 0 && query && (
                        <div className="text-center text-gray-400 py-12">
                            No movies found for "{query}"
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-[#00E054]" />
            </div>
        }>
            <SearchContent />
        </Suspense>
    )
} 