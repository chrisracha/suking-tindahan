"use client"

import { Send } from "lucide-react"

export default function FeelingInput() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault() }

return (
    <form onSubmit={handleSubmit} className="flex w-full gap-4 mt-6">
        <div className="relative flex-1">
            <input
            name="feeling"
            placeholder="k lungz"
            className="w-full h-10 px-4 rounded-md text-base text-black placeholder-gray-400 bg-amber-50 border-amber-200 focus-visible:ring-amber-500 outline-none"
            />
        </div>
        <button type="submit" className="flex items-center px-4 h-10 rounded-md bg-[#af3222] hover:bg-[#93281c] text-white text-base font-semibold">
        <Send className="h-5 w-5 mr-2" />
        <span>Ipasa</span>
      </button>
    </form>
)
}