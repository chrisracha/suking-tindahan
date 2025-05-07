import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Movie } from "@/types/movie";

const FALLBACK_POSTER = '/images/no-poster.svg';

interface MovieCardProps {
    movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
    return (
        <div className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-black/50 hover:shadow-xl hover:shadow-black/60 transition-all hover:scale-[1.02] border border-white/5">
            <div className="h-48 relative">
                <Image 
                    src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : FALLBACK_POSTER
                    }
                    alt={movie.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_POSTER;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-2 text-white">
                        <p className="font-bold text-sm">{new Date(movie.release_date).getFullYear()}</p>
                        <p className="text-xs">{movie.genres?.filter(Boolean).join(' • ')}</p>
                    </div>
                </div>
            </div>
            <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-bold text-sm text-white line-clamp-2">{movie.title}</h3>
                <div className="mt-auto pt-2">
                    <Link href={`/movie/${movie.id}`}>
                        <Button className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-sm py-1">
                            Tingnan
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 