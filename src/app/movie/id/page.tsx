import Link from "next/link"
import { ArrowLeft, Play, SeparatorHorizontal, Star, TypeOutline } from "lucide-react"
import Badge from "@/components/Badge";
import { Separator } from "@/components/ui/separator"

export default function MovieDetailPage() {
    const trailer = "https://www.youtube.com/watch?v=example";

    return (
        <main className="min-h-screen flex flex-col bg-black p-4">
            <div className="w-full max-w-4xl mx-auto">
                {/* Movie Details */}
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <Link href="/recommendations" className="inline-flex items-center text-purple-300 hover:text-purple-100 mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Bumalik sa mga Rekomendasyon
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Movie Poster */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                            <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg shadow-black/50 border border-white/10">
                                <image />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            </div>

                            {trailer && (
                                <a
                                    href={trailer}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-4 bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 flex items-center justify-center py-2 rounded-md text-white font-semibold"
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    Trailer
                                </a>
                            )}
                        </div>

                        {/* Movie Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text">
                                <span>Four Sisters and a Wedding</span>
                            </h1>

                            <div className="flex items-center gap-2 mt-2 text-gray-300">
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 font-bold">7.8/10</span>
                                </div>
                                <span className="text-gray-500">•</span>
                                <span>2013</span>
                                <span className="text-gray-500">•</span>
                                <span>2h 5m</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {["Comedy", "Drama", "Family"].map((genre, index) => (
                                    <Badge key={index} className="bg-gray-800 text-gray-200 border-gray-700 mt-2">
                                        {genre}
                                    </Badge>
                                ))}
                            </div>

                            <Separator className="my-4 bg-gray-700" />

                            <div className="space-y-4 text-gray-200">
                                <div>
                                    <h2 className="text-xl font-bold text-purple-200 mb-2">Buod</h2>
                                    <p>The Salazar sisters come together to dissuade their younger brother from marrying his fiancée. As they interact, they face the issues they've been running away from.</p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-200 mb-2">Mga Artista</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { name: "Bea Alonzo", role: "Bobbie Salazar" },
                                            { name: "Toni Gonzaga", role: "Teddie Salazar" },
                                            { name: "Angel Locsin", role: "Alex Salazar" },
                                            { name: "Shaina Magdayao", role: "Gabbie Salazar" },
                                            { name: "Enchong Dee", role: "CJ Salazar" },
                                            { name: "Janus del Prado", role: "Frodo" },
                                        ].map((actor, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {actor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-white">{actor.name}</p>
                                                    <p className="text-xs text-gray-400">{actor.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-200 mb-2">Saan Mapapanood</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {["Netflix", "iWantTFC"].map((service, index) => (
                                            <Badge
                                                key={index}
                                                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 cursor-pointer text-white"
                                            >
                                                {service}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-purple-200 mb-2">Director</h2>
                                    <p>Cathy Garcia-Molina</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 text-center mt-4">
                    <p className="text-gray-400 text-sm">© 2025 Pinoy Movie Recommender</p>
                </div>
            </div>
        </main>
    )
}
