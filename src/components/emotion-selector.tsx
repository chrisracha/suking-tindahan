import { Smile, Frown, Meh, Heart, Zap, Coffee } from "lucide-react"

const emotions = [
    {
        name: "Masaya", icon: Smile, color:"bg-[#e8a123] hover:bg-[#d48c00]", textColor: "text-[#201f1d]"
    },
    {
        name: "Kinikilig", icon: Heart, color:"bg-[#e8a123] hover:bg-[#d48c00]", textColor: "text-[#201f1d]"
    },
    {
        name: "Malungkot", icon: Frown, color:"bg-[#e8a123] hover:bg-[#d48c00]", textColor: "text-[#201f1d]"
    },
    {
        name: "Pagod", icon: Coffee, color:"bg-[#e8a123] hover:bg-[#d48c00]", textColor: "text-[#201f1d]"
    },
    {
        name: "Bored", icon: Meh, color:"bg-[#e8a123] hover:bg-[#d48c00]", textColor: "text-[#201f1d]"
    },
    {
        name: "Excited", icon: Zap, color:"bg-[#e8a123] hover:bg-[#d48c00]", textColor: "text-[#201f1d]"
    }
]

export default function EmotionSelector() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6">
            {emotions.map((emotion) => (
                <button
                    key={emotion.name}
                    className={`flex flex-col items-center justify-center h-24 ${emotion.color} ${emotion.textColor} rounded-lg shadow-md transition-transform hover:scale-105`}>
                <emotion.icon className="h-8 w-8 mb-2" />
                <span>{emotion.name}</span>
                </button>
            ))}
        </div>
    )
}