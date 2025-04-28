import EmotionSelector from "@/components/emotion-selector"
import FeelingInput from "@/components/feeling-input"
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-3xl">
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <div className="flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-20">
              Kumusta ka ngayon?
            </h2>
            <div className="w-full space-y-10">
              <div className="space-y-4">
                {/* Emotion Selection */}
                <EmotionSelector />
              </div>
              <div className="space-y-4 mt-12">
                {/* Text Input */}
                <FeelingInput />
              </div>
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