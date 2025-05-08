"use client"
import { Smile, Frown, Meh, Heart, Zap, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useState, createContext, useContext } from "react"

interface FilterContextType {
    selectedEmotion: string | null;
    setSelectedEmotion: (emotion: string | null) => void;
    popularity: number | null;
    setPopularity: (rating: number | null) => void;
    duration: number[];
    setDuration: (duration: number[]) => void;
    decade: string | null;
    setDecade: (decade: string | null) => void;
}

export const FilterContext = createContext<FilterContextType>({
    selectedEmotion: null,
    setSelectedEmotion: () => {},
    popularity: null,
    setPopularity: () => {},
    duration: [],
    setDuration: () => {},
    decade: null,
    setDecade: () => {}
});

export const useFilters = () => useContext(FilterContext);

const emotions = [
    {
        name: "Masaya", icon: Smile, color: "bg-gradient-to-br from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500", activeColor: "bg-gradient-to-br from-yellow-400 to-yellow-500", textColor: "text-yellow-950"
    },
    {
        name: "Kinikilig", icon: Heart, color: "bg-gradient-to-br from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500", activeColor: "bg-gradient-to-br from-pink-400 to-pink-500", textColor: "text-white"
    },
    {
        name: "Malungkot", icon: Frown, color: "bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500", activeColor: "bg-gradient-to-br from-blue-400 to-blue-500", textColor: "text-white"
    },
    {
        name: "Pagod", icon: Coffee, color: "bg-gradient-to-br from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500", activeColor: "bg-gradient-to-br from-amber-400 to-amber-500", textColor: "text-amber-950"
    },
    {
        name: "Bored", icon: Meh, color: "bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500", activeColor: "bg-gradient-to-br from-gray-400 to-gray-500", textColor: "text-gray-900"
    },
    {
        name: "Excited", icon: Zap, color: "bg-gradient-to-br from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500", activeColor: "bg-gradient-to-br from-purple-400 to-purple-500", textColor: "text-white"
    }
]

export default function EmotionSelector() {
    const { selectedEmotion, setSelectedEmotion } = useContext(FilterContext);
    
    const handleEmotionSelect = (emotion: string) => {
        setSelectedEmotion(emotion === selectedEmotion ? null : emotion);
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
            {emotions.map((emotion) => {
                const isSelected = selectedEmotion === emotion.name

                return (
                    <Button
                        key={emotion.name}
                        onClick={() => handleEmotionSelect(emotion.name)}
                        className={`
                            group
                            flex flex-col items-center justify-center h-24 
                            ${isSelected ? emotion.activeColor : emotion.color}
                            ${emotion.textColor}
                            rounded-xl
                            transition-all
                            ${isSelected ? "scale-105 shadow-[0_0_0_3px_#00E054,0_0_15px_rgba(0,224,84,0.5)]" : "hover:scale-105 shadow-black/20 hover:shadow-xl hover:shadow-black/30"}
                            border 
                            ${isSelected ? "border-[#7B1113]" : "border-white/10 hover:border-[#00E054]"}
                            relative
                        `}
                        variant="ghost"
                    >
                        <emotion.icon className={`h-8 w-8 mb-2 ${isSelected ? "text-current animate-pulse" : "group-hover:text-current"}`} />
                        <span className={isSelected ? "font-bold" : "group-hover:font-bold"}>{emotion.name}</span>
                    </Button>
                )
            })}
        </div>
    )
}
