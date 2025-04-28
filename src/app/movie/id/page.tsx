import Link from "next/link"
import { ArrowLeft, Play, Star } from "lucide-react"

export default function MovieDetailPage() {
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
                <Link href="/recommendations" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Recommendation
                </Link>
              <div className="flex flex-col items-center">
              <div className="w-full space-y-8">
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
