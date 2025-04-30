"use client"
import { Smile, Frown, Meh, Heart, Zap, Coffee, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';
import { useState } from "react"

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
    const router = useRouter();
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
    const handleEmotionSelect = (emotion: string) => {
        setSelectedEmotion(emotion)
        {/*remove nalang the comment para redirect reco*/}
        // router.push('/recommendations');
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
                        {/* Check icon on hover or when selected */}
                        <div className={`
                            absolute top-2 right-2 bg-[#00E054] rounded-full p-0.5 
                            transition-opacity duration-200
                            ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                        `}>
                            <Check className="h-3 w-3 text-black" />
                        </div>

                        <emotion.icon className={`h-8 w-8 mb-2 ${isSelected ? "text-current animate-pulse" : "group-hover:text-current"}`} />
                        <span className={isSelected ? "font-bold" : "group-hover:font-bold"}>{emotion.name}</span>
                    </Button>
                )
            })}
        </div>
    )
}
