"use client"

import { Send } from "lucide-react"

export default function FeelingInput() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full gap-2 mt-6">
            <div className="relative flex-1">
                <input
                    name="feeling"
                    placeholder="k lungz"
                    className="w-full h-10 px-4 rounded-md text-base text-black placeholder-gray-400 bg-gray-800 border-gray-700 text-white focus-visible:ring-purple-400"
                />
            </div>
            <button type="submit" className="flex items-center px-4 h-10 rounded-md bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white text-base font-semibold">
                <Send className="h-5 w-5 mr-2" />
                <span>Ipasa</span>
            </button>
        </form>
    )
}