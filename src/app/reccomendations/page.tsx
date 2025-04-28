import { Home } from "lucide-react"

export default function Reccomendations() {
    let matchedEmotion = "default"
    const emotions = ["Masaya", "Kinikilig", "Malungkot", "Pagod", "Bored", "Excited"]
    const movies = matchedEmotion

return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#fabb21]">
      <div className="w-full max-w-3xl bg-white/30 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#af3222] p-4 text-center relative">
      <h1 className="text-4xl md:text-5xl font-bold text-[#f4e3ce] relative z-10">
        Suking Tindahan
      </h1>
      <p className="text-white text-sm mt-1 relative z-10">A Mood-based Pinoy Movie Recommendation System</p>
      </div>
      <div className="p-6 md:p-8 bg-white/30">
            <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#301c08] mt-5 mb-3">
                When you're feeling {matchedEmotion}
            </h2>
            <p className="text-[#301c08] mb-8 text-center italic">
              Here's our recommended movies for you!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            </div>
            </div>
        </div>
      
        {/* Footer */}
        <div className="bg-[#f4e3ce] p-3 text-center">
            <p className="text-[#af3222] text-sm">© 2025 Suking Tindahan | DSS</p>
        </div>
    </div>
    </main>
)
}