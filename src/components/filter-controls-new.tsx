"use client"

import { useState, useEffect } from "react"
import * as Slider from "@radix-ui/react-slider";
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterControlsProps {
    onFilterChange: (filters: any) => void;
}

export default function FilterControls({ onFilterChange }: FilterControlsProps) {
    const router = useRouter()
    const [popularity, setPopularity] = useState(3)
    const [duration, setDuration] = useState([30, 120]) // Default range: 30min to 2h
    const [selectedDecades, setSelectedDecades] = useState<string[]>([])

    // Decade options
    const decades = [
        { value: "80s", label: "80s", years: [1980, 1989] },
        { value: "90s", label: "90s", years: [1990, 1999] },
        { value: "00s", label: "00s", years: [2000, 2009] },
        { value: "10s", label: "10s", years: [2010, 2019] },
        { value: "20s", label: "20s", years: [2020, 2029] },
    ]

    // Duration labels with more specific options
    const durationLabels = [
        { value: 15, label: "15m" },
        { value: 30, label: "30m" },
        { value: 45, label: "45m" },
        { value: 60, label: "1h" },
        { value: 90, label: "1.5h" },
        { value: 120, label: "2h" },
        { value: 150, label: "2.5h" },
        { value: 180, label: "3h+" },
    ]

    // Format duration for display
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    }

    // Get the current duration range label
    const getCurrentDurationLabel = () => {
        const [min, max] = duration;
        return `${formatDuration(min)} - ${formatDuration(max)}`;
    }

    // Toggle decade selection
    const toggleDecade = (decade: string) => {
        setSelectedDecades(prev => 
            prev.includes(decade)
                ? prev.filter(d => d !== decade)
                : [...prev, decade]
        );
    };

    // Update filters whenever they change
    useEffect(() => {
        const filters = {
            popularity,
            duration: JSON.stringify(duration),
            decades: selectedDecades.join(',')
        };
        onFilterChange(filters);
    }, [popularity, duration, selectedDecades, onFilterChange]);

    return (
        <div className="space-y-6 bg-gray-800/50 p-5 rounded-xl border border-gray-700/50">
            {/* Decades */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-sm">From the...</label>
                    <span className="text-purple-200 font-medium">
                        {selectedDecades.length > 0 
                            ? selectedDecades.join(', ')
                            : "All"}
                    </span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {decades.map((d) => (
                        <button
                            key={d.value}
                            onClick={() => toggleDecade(d.value)}
                            className={`
                                px-4 py-2 rounded-lg transition-all
                                ${selectedDecades.includes(d.value)
                                    ? "bg-[#00E054] text-black font-medium shadow-[0_0_10px_rgba(0,224,84,0.3)]"
                                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }
                            `}
                        >
                            {d.label}
                        </button>
                    ))}
                    {selectedDecades.length > 0 && (
                        <button
                            onClick={() => setSelectedDecades([])}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
                        >
                            Clear All
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
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <label className="text-gray-300 text-sm">Duration:</label>
                    <span className="text-purple-200 font-medium">{getCurrentDurationLabel()}</span>
                </div>
                
                <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-5"
                    value={duration}
                    onValueChange={setDuration}
                    max={180}
                    min={15}
                    step={5}
                >
                    <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
                        <Slider.Range className="absolute bg-gradient-to-r from-pink-400 to-purple-500 rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb 
                        className="block w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow hover:bg-pink-500 focus:outline-none"
                        aria-label="Minimum duration"
                    />
                    <Slider.Thumb 
                        className="block w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow hover:bg-pink-500 focus:outline-none"
                        aria-label="Maximum duration"
                    />
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