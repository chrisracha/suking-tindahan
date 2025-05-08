"use client"

import EmotionSelector, { FilterContext } from "@/components/emotion-selector"
import FilterControls from "@/components/filter-controls"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number[]>([30, 120]);
  const [selectedDecades, setSelectedDecades] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion) return;

    const params = new URLSearchParams();
    params.append('emotion', selectedEmotion);
    if (selectedRating !== null) {
      params.append('popularity', selectedRating.toString());
    }
    if (selectedDuration.length === 2) {
      params.append('duration', JSON.stringify(selectedDuration));
    }
    if (selectedDecades.length > 0) {
      params.append('decades', selectedDecades.join(','));
    }

    router.push(`/recommendations?${params.toString()}`);
  };

  return (
    <FilterContext.Provider value={{
      selectedEmotion,
      setSelectedEmotion,
      popularity: selectedRating || 0,
      setPopularity: setSelectedRating,
      duration: selectedDuration,
      setDuration: setSelectedDuration,
      decade: selectedDecades.join(','),
      setDecade: (decade: string | null) => {
        if (decade) {
          setSelectedDecades(decade.split(','));
        } else {
          setSelectedDecades([]);
        }
      }
    }}>
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black">
        <div className="w-full max-w-3xl">
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="flex flex-col items-center">
              <h2 className="text-4xl md:text-5xl font-bold leading-normal text-center bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 text-transparent bg-clip-text mb-10">
                Kumusta ka ngayon?
              </h2>
              <div className="w-full space-y-10">
                <div className="space-y-4">
                  {/* Emotion Selection */}
                  <EmotionSelector />
                </div>
                <div className="space-y-4">
                  {/* Filters */}
                  <FilterControls />
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
    </FilterContext.Provider>
  )
}