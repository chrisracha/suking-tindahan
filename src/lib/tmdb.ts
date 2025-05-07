import { TMDB_CONFIG } from "@/config/constants";
import { Movie, MovieDetails } from "@/types/movie";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMoviesFromTMDB(query: string) {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=fil-PH&region=PH&include_adult=false`
        );

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching from TMDB:', error);
        throw error;
    }
}

export function prepareTMDBQuery(emotion: string, filters: any) {
    let query = '';
    
    // Base query based on emotion
    switch (emotion.toLowerCase()) {
        case 'masaya':
            query = 'comedy OR "feel good" OR "feel-good" OR "feel good movie" OR "feel-good movie"';
            break;
        case 'malungkot':
            query = 'drama OR "emotional" OR "heartwarming" OR "touching"';
            break;
        case 'galit':
            query = 'action OR thriller OR "revenge" OR "justice"';
            break;
        case 'takot':
            query = 'horror OR "thriller" OR "suspense" OR "mystery"';
            break;
        case 'in love':
            query = 'romance OR "love story" OR "romantic comedy" OR "rom-com"';
            break;
        default:
            query = 'drama OR "feel good" OR "feel-good"';
    }

    // Add year filter if specified
    if (filters.year) {
        query += ` AND year:${filters.year}`;
    }

    // Add genre filter if specified
    if (filters.genre) {
        query += ` AND genre:${filters.genre}`;
    }

    return query;
}

class TMDBService {
    private static instance: TMDBService;
    private readonly apiKey: string;

    private constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('TMDB API key not configured');
        }
    }

    public static getInstance(): TMDBService {
        if (!TMDBService.instance) {
            TMDBService.instance = new TMDBService();
        }
        return TMDBService.instance;
    }

    private async fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
        const queryParams = new URLSearchParams({
            language: TMDB_CONFIG.LANGUAGE,
            region: TMDB_CONFIG.REGION,
            ...params
        });

        const url = `${TMDB_CONFIG.BASE_URL}${endpoint}?${queryParams}`;
        console.log('TMDB API URL:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'accept': 'application/json'
            }
        });
        console.log('TMDB Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('TMDB API Error:', errorData);
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    public async searchMovies(query: string, page: number = 1): Promise<{ results: Movie[] }> {
        return this.fetchFromTMDB('/search/movie', { 
            query: query, 
            page: page.toString(),
            with_origin_country: 'PH',
            with_original_language: 'tl'
        });
    }

    public async getMovieDetails(id: number): Promise<MovieDetails> {
        return this.fetchFromTMDB(`/movie/${id}`, { 
            append_to_response: 'credits,videos'
        });
    }

    public async getRecommendations(emotion: string, filters: any): Promise<{ results: Movie[] }> {
        const params: Record<string, string> = {
            sort_by: 'popularity.desc',
            page: '1',
            with_origin_country: 'PH',
            with_original_language: 'tl'
        };

        if (filters.year) params.year = filters.year;
        if (filters.rating) params.vote_average = filters.rating;
        if (filters.duration) params.with_runtime = filters.duration;

        return this.fetchFromTMDB('/discover/movie', params);
    }
}

export const tmdbService = TMDBService.getInstance(); 