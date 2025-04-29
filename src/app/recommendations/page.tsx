import Link from "next/link"
import Image from "next/image";
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Reccomendations() {
    let matchedEmotion = "default"
    const emotions = ["Masaya", "Kinikilig", "Malungkot", "Pagod", "Bored", "Excited"]
    const movies = matchedEmotion

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
            <div className="w-full max-w-3xl">
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-2">
                            Kung {matchedEmotion} ang nararamdaman mo
                        </h2>
                        <p className="text-white mb-8 text-center italic">
                            Mga pelikulang Pinoy na para sa'yo!
                        </p>
                        <div className="flex items-center gap-2 mb-8 text-gray-400 text-sm">
                            <span>
                                Duration: 1h 55m
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                            <div className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-black/60 transition-all hover:scale-[1.02] border border-white/5">
                                <div className="h-64 relative">
                                    <Image src="" alt="One More Chance" className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                                        <div className="p-3 text-white">
                                            <p className="font-bold">2007</p>
                                            <p className="text-xs">Drama, Romance</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-white">One More Chance</h3>
                                    <div className="mt-auto pt-4">
                                        <Link href="/movie/one-more-chance">
                                            <Button className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600">
                                                Tingnan ang Detalye
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
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
    )
}