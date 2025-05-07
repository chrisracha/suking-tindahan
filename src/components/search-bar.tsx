"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsLoading(true)
        router.push(`/search?query=${encodeURIComponent(query.trim())}`)
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="relative flex items-center">
                <Input
                    type="text"
                    placeholder="Search for movies..."
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-6 bg-gray-800/50 border-gray-700/50 text-gray-100 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                <Button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Searching...</span>
                        </div>
                    ) : "Search"}
                </Button>
            </div>
        </form>
    )
} 