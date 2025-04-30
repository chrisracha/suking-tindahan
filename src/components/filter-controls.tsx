"use client"

import { useState } from "react"
import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FilterControls() {
    const router = useRouter()
    const [popularity, setPopularity] = useState(3)
    const [duration, setDuration] = useState([90]) // Default to 90 minutes
    const [decade, setDecade] = useState<string | null>(null)

    // Decade options
    const decades = [
        { value: "80s", label: "80s", years: [1980, 1989] },
        { value: "90s", label: "90s", years: [1990, 1999] },
        { value: "00s", label: "00s", years: [2000, 2009] },
        { value: "10s", label: "10s", years: [2010, 2019] },
        { value: "20s", label: "20s", years: [2020, 2029] },
    ]

    // Duration labels
    const durationLabels = [
        { value: 10, label: "<10m" },
        { value: 30, label: "30m" },
        { value: 60, label: "1h" },
        { value: 90, label: "1.5h" },
        { value: 120, label: "2h+" },
    ]

    // Get the closest duration label
    const getCurrentDurationLabel = () => {
        const currentValue = duration[0]
        let closestLabel = durationLabels[0]

        for (const label of durationLabels) {
            if (Math.abs(label.value - currentValue) < Math.abs(closestLabel.value - currentValue)) {
                closestLabel = label
            }
        }

        return closestLabel.label
    }

    return (
        <div className="space-y-6 bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
            {/* Decade */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-sm">From the...</label>
                    <span className="text-purple-200 font-medium">{decade || "All"}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {decades.map((d) => (
                        <button
                            key={d.value}
                            onClick={() => setDecade(decade === d.value ? null : d.value)}
                            className={`
                    px-4 py-2 rounded-lg transition-all
                    ${decade === d.value
                                    ? "bg-[#00E054] text-black font-medium shadow-[0_0_10px_rgba(0,224,84,0.3)]"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }
                `}
                        >
                            {d.label}
                        </button>
                    ))}
                    {decade && (
                        <button
                            onClick={() => setDecade(null)}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>
            {/* Popularity */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-sm">Popularity:</label>
                    <span className="text-purple-200 font-medium">{popularity}/5</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setPopularity(star)}
                            className="relative p-1 transition-all hover:scale-110"
                            aria-label={`Rate ${star} stars`}
                        >
                            <Star
                                className={`h-8 w-8 ${star <= popularity
                                    ? "fill-[#00E054] text-[#00E054]" // Letterboxd green
                                    : "text-gray-600 stroke-[1.5]"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
            {/* Duration Time */}
            <div className="flex justify-between items-center">
                <label className="text-gray-300 text-sm">Duration:</label>
                <span className="text-purple-200 font-medium">{getCurrentDurationLabel()}</span>
            </div>
            <div className="px-1">
                <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={duration}
                    onValueChange={setDuration}
                    max={120}
                    min={10}
                    step={1}
                >
                    <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
                        <Slider.Range className="absolute bg-gradient-to-r from-pink-400 to-purple-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow hover:bg-pink-500 focus:outline-none" />
                </Slider.Root>

                <div className="flex justify-between mt-2 text-xs text-gray-400">
                    {durationLabels.map((label, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <span className="h-1 w-1 rounded-full bg-gray-500 mb-1"></span>
                            {label.label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
