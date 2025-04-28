import { Home } from "lucide-react"

export default function Reccomendations() {
    let matchedEmotion = "default"
    const emotions = ["Masaya", "Kinikilig", "Malungkot", "Pagod", "Bored", "Excited"]
    const movies = matchedEmotion

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
            <div className="w-full max-w-3xl">
                <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <div className="flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-2">
                            When you're feeling {matchedEmotion}
                        </h2>
                        <p className="text-white mb-8 text-center italic">
                            Here's our recommended movies for you!
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
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