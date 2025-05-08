"use client"

import * as Slider from "@radix-ui/react-slider";
import { Star } from "lucide-react"
import { useFilters } from "./emotion-selector"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useContext, useEffect } from "react"
import { FilterContext } from "./emotion-selector"

export default function FilterControls() {
    const router = useRouter();
    const { 
        selectedEmotion, 
        popularity, 
        setPopularity, 
        duration, 
        setDuration, 
        decade, 
        setDecade 
    } = useFilters();

    // Decade options
    const decades = [
        { value: "80s", label: "80s", years: [1980, 1989] },
        { value: "90s", label: "90s", years: [1990, 1999] },
        { value: "00s", label: "00s", years: [2000, 2009] },
        { value: "10s", label: "10s", years: [2010, 2019] },
        { value: "20s", label: "20s", years: [2020, 2029] },
    ]

    // Duration labels with exact values
    const durationLabels = [
        { value: 0, label: "15m" },
        { value: 1, label: "30m" },
        { value: 2, label: "45m" },
        { value: 3, label: "1h" },
        { value: 4, label: "1h30m" },
        { value: 5, label: "2h" },
        { value: 6, label: "2h30m" },
        { value: 7, label: "3h+" },
    ]

    // Convert slider index to minutes
    const indexToMinutes = (index: number) => {
        const values = [15, 30, 45, 60, 90, 120, 150, 180];
        return values[index];
    }

    // Convert minutes to slider index
    const minutesToIndex = (minutes: number) => {
        const values = [15, 30, 45, 60, 90, 120, 150, 180];
        return values.indexOf(minutes);
    }

    // Format duration for display
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h${mins}m`;
    }

    // Get the current duration label
    const getCurrentDurationLabel = () => {
        if (!duration || duration.length !== 2) return "Any";
        const [min, max] = duration;
        if (min === max) {
            return formatDuration(min);
        }
        return `${formatDuration(min)} - ${formatDuration(max)}`;
    }

    // Initialize duration if empty
    useEffect(() => {
        if (!duration || duration.length !== 2) {
            setDuration([30, 120]);
        }
    }, []);

    // Handle duration change
    const handleDurationChange = (newValue: number[]) => {
        const minutes = newValue.map(indexToMinutes);
        setDuration(minutes);
    };

    // Convert current duration to slider indices
    const currentSliderValues = duration ? duration.map(minutesToIndex) : [1, 5];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedEmotion) params.append('emotion', selectedEmotion);
        if (popularity !== null) params.append('popularity', popularity.toString());
        if (duration && duration.length === 2) params.append('duration', JSON.stringify(duration));
        if (decade) params.append('decades', decade);
        router.push(`/recommendations?${params.toString()}`);
    };

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
                    <label className="text-gray-300 text-sm">Rating:</label>
                    <span className="text-purple-200 font-medium">{popularity == 0 ? "Any" : `${popularity}/5`}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setPopularity(popularity === star ? null : star)}
                            className="relative p-1 transition-all hover:scale-110"
                            aria-label={`Rate ${star} stars`}
                        >
                            <Star
                                className={`h-8 w-8 ${popularity !== null && star <= popularity
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
                <div className="px-1 mt-4">
                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5"
                        min={0}
                        max={7}
                        step={1}
                        value={currentSliderValues}
                        onValueChange={handleDurationChange}
                    >
                        <Slider.Track className="bg-gray-700 relative grow rounded-full h-[3px]">
                            <Slider.Range className="absolute bg-gradient-to-r from-pink-400 to-purple-500 rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb 
                            className="block w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            aria-label="Minimum duration"
                        />
                        <Slider.Thumb 
                            className="block w-5 h-5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                            aria-label="Maximum duration"
                        />
                    </Slider.Root>

                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        {durationLabels.map((label) => (
                            <div key={label.value} className="flex flex-col items-center">
                                <span className="h-1 w-1 rounded-full bg-gray-500 mb-1"></span>
                                {label.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <Button
                onClick={handleSearch}
                disabled={!selectedEmotion}
                className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Hanapin
            </Button>
        </div>
    )
}
