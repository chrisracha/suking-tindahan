import { TMDB_CONFIG } from "@/config/constants";

export const getImageUrl = (path: string, size: string = TMDB_CONFIG.POSTER_SIZE) => {
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fil-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
};

export const getTrailerUrl = (videos: { results: Array<{ key: string; type: string; site: string }> }) => {
    const trailer = videos.results.find(
        video => video.type === "Trailer" && video.site === "YouTube"
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}; 