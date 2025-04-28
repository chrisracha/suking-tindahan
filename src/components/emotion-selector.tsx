import { Smile, Frown, Meh, Heart, Zap, Coffee } from "lucide-react"

const emotions = [
    {
        name: "Masaya", icon: Smile, color:"bg-gradient-to-br from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500", textColor: "text-yellow-950"
    },
    {
        name: "Kinikilig", icon: Heart, color:"bg-gradient-to-br from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500", textColor: "text-white"
    },
    {
        name: "Malungkot", icon: Frown, color:"bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500", textColor: "text-white"
    },
    {
        name: "Pagod", icon: Coffee, color:"bg-gradient-to-br from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500", textColor: "text-amber-950"
    },
    {
        name: "Bored", icon: Meh, color:"bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500", textColor: "text-gray-900"
    },
    {
        name: "Excited", icon: Zap, color:"bg-gradient-to-br from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500", textColor: "text-white"
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