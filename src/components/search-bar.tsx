"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
    const router = useRouter()

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const query = formData.get('query') as string
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query.trim())}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
            <Input
                type="search"
                name="query"
                placeholder="Search for movies..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border-gray-700/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </form>
    )
} 