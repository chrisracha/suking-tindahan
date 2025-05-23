import { NextResponse } from 'next/server';

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// CORS headers configuration
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

// Mapping Filipino emotions to TMDB genres and search parameters
const emotionMappings: Record<string, { genres: number[], keywords: string[] }> = {
    'Masaya': {
        genres: [35, 10751, 16, 14, 10770, 281585, 288816], // Comedy, Family, Animation, Fantasy, TV Movie, Inspirational, Light-hearted
        keywords: ['feel-good', 'heartwarming', 'funny', 'uplifting', 'wholesome']
    },
    'Kinikilig': {
        genres: [10749], // Romance
        keywords: ['romance', 'love', 'romantic', 'sweet', 'heartwarming']
    },
    'Malungkot': {
        genres: [18, 1647, 5609], // Drama, Sadness, Nostlagia
        keywords: ['emotional', 'touching', 'dramatic', 'sad', 'melancholy', 'heartfelt', 'moving']
    },
    'Pagod': {
        genres: [35, 16, 10751, 14, 10770, 878, 12, 209897, 305015, 266370, 290395], // Comedy, Animation, Family, Fantasy, TV Movie, Sci-Fi, Adventure
        keywords: ['relaxing', 'light-hearted', 'feel-good', 'family-friendly', 'uplifting', 'easy-watching']
    },
    'Bored': {
        genres: [28, 12, 35, 53, 80, 9648, 878, 14], // Action, Adventure, Comedy, Thriller, Crime, Mystery, Sci-Fi, Fantasy
        keywords: ['exciting', 'thrilling', 'action-packed', 'adventure', 'suspense', 'engaging']
    },
    'Excited': {
        genres: [28, 12, 878, 53, 80, 9648, 14, 16], // Action, Adventure, Sci-Fi, Thriller, Crime, Mystery, Fantasy, Animation
        keywords: ['action-packed', 'adventure', 'thrilling', 'exciting', 'intense', 'epic']
    }
};

// Decade to year range mapping
const decadeRanges: Record<string, { start: number, end: number }> = {
    '80s': { start: 1980, end: 1989 },
    '90s': { start: 1990, end: 1999 },
    '00s': { start: 2000, end: 2009 },
    '10s': { start: 2010, end: 2019 },
    '20s': { start: 2020, end: 2029 }
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const emotion = searchParams.get('emotion');
    const popularity = searchParams.get('popularity');
    const duration = searchParams.get('duration');
    const decades = searchParams.get('decades')?.split(',') || [];
    const page = searchParams.get('page') || '1';

    console.log('Received parameters:', { emotion, popularity, duration, decades, page });

    if (!emotion) {
        return NextResponse.json(
            { error: 'Emotion parameter is required' }, 
            { 
                status: 400,
                headers: corsHeaders
            }
        );
    }

    if (!TMDB_ACCESS_TOKEN) {
        console.error('NEXT_PUBLIC_TMDB_API_KEY is not defined');
        return NextResponse.json(
            { error: 'TMDB access token is not configured' },
            { 
                status: 500,
                headers: corsHeaders
            }
        );
    }

    const emotionMapping = emotionMappings[emotion];
    if (!emotionMapping) {
        console.error('Invalid emotion:', emotion);
        return NextResponse.json({ error: 'Invalid emotion' }, { status: 400 });
    }

    try {
        // Create base discover URL with Philippine-only requirement
        const discoverUrl = new URL(`${TMDB_BASE_URL}/discover/movie`);
        discoverUrl.searchParams.append('region', 'PH');
        discoverUrl.searchParams.append('sort_by', 'popularity.desc');
        discoverUrl.searchParams.append('include_adult', 'false');
        discoverUrl.searchParams.append('with_origin_country', 'PH');
        
        // Strictly use only the genres for the selected emotion
        discoverUrl.searchParams.append('with_genres', emotionMapping.genres.join('|'));
        discoverUrl.searchParams.append('certification_country', 'PH');
        discoverUrl.searchParams.append('certification.lte', 'PG');

        // Add popularity filter if specified
        if (popularity) {
            const popularityValue = parseInt(popularity);
            if (!isNaN(popularityValue) && popularityValue > 0) {
                let tmdbRating;
                switch (popularityValue) {
                    case 1: tmdbRating = '2.0'; break;
                    case 2: tmdbRating = '4.0'; break;
                    case 3: tmdbRating = '6.0'; break;
                    case 4: tmdbRating = '8.0'; break;
                    case 5: tmdbRating = '8.5'; break;
                    default: tmdbRating = '0.0';
                }
                discoverUrl.searchParams.append('vote_average.gte', tmdbRating);
            }
        }

        // Add decade filter if specified
        if (decades && decades.length > 0) {
            const yearRanges = decades.map(decade => decadeRanges[decade]).filter(range => range !== null);
            if (yearRanges.length > 0) {
                const startYear = yearRanges[0]?.start;
                const endYear = yearRanges[yearRanges.length - 1]?.end;
                if (startYear && endYear) {
                    discoverUrl.searchParams.append('primary_release_date.gte', `${startYear}-01-01`);
                    discoverUrl.searchParams.append('primary_release_date.lte', `${endYear}-12-31`);
                }
            }
        }

        // Add duration filter if specified
        if (duration) {
            try {
                const durationRange = JSON.parse(duration);
                if (Array.isArray(durationRange) && durationRange.length === 2) {
                    const [minDuration, maxDuration] = durationRange;
                    const buffer = 5;
                    discoverUrl.searchParams.append('with_runtime.gte', (minDuration - buffer).toString());
                    discoverUrl.searchParams.append('with_runtime.lte', (maxDuration + buffer).toString());
                    discoverUrl.searchParams.append('with_runtime.gte', '10');
                }
            } catch (e) {
                console.error('Invalid duration format:', duration);
            }
        }

        // Calculate TMDB page number based on our desired page size of 6
        const moviesPerPage = 6;
        const tmdbPageSize = 20; // TMDB's default page size
        const tmdbPage = Math.ceil((parseInt(page) * moviesPerPage) / tmdbPageSize);
        discoverUrl.searchParams.append('page', tmdbPage.toString());

        // Fetch movies from TMDB
        const response = await fetch(discoverUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return NextResponse.json({
                results: [],
                total_results: 0,
                total_pages: 0,
                current_page: parseInt(page)
            });
        }

        // Calculate which movies we need from the TMDB page
        const startIndex = ((parseInt(page) - 1) * moviesPerPage) % tmdbPageSize;
        const endIndex = Math.min(startIndex + moviesPerPage, data.results.length);
        const pageMovies = data.results.slice(startIndex, endIndex);

        // Process only the movies we need
        const processedResults = await Promise.all(
            pageMovies.map(async (movie: any) => {
                const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?append_to_response=credits,videos`;
                const detailsResponse = await fetch(detailsUrl, {
                    headers: {
                        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                        'accept': 'application/json'
                    }
                });

                if (!detailsResponse.ok) {
                    console.error(`Failed to fetch details for movie ${movie.id}`);
                    return null;
                }

                const details = await detailsResponse.json();
                const director = details.credits?.crew?.find((person: any) => person.job === 'Director');
                const cast = details.credits?.cast?.slice(0, 6) || [];
                const trailer = details.videos?.results?.find((video: any) => 
                    video.type === 'Trailer' && video.site === 'YouTube'
                );

                return {
                    id: movie.id,
                    title: movie.title,
                    original_title: movie.original_title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date,
                    runtime: movie.runtime,
                    vote_average: movie.vote_average,
                    vote_count: movie.vote_count,
                    genres: details.genres?.map((g: any) => g.name) || [],
                    director: director ? {
                        name: director.name,
                        profile_path: director.profile_path
                    } : null,
                    cast: cast.map((actor: any) => ({
                        name: actor.name,
                        character: actor.character,
                        profile_path: actor.profile_path
                    })),
                    trailer: trailer ? {
                        key: trailer.key,
                        name: trailer.name
                    } : null
                };
            })
        );

        // Filter out null results
        const validMovies = processedResults.filter(movie => movie !== null);

        // Calculate total pages based on TMDB's total results
        const totalResults = data.total_results;
        const totalPages = Math.min(Math.ceil(totalResults / moviesPerPage), 500);

        return NextResponse.json({
            results: validMovies,
            total_results: totalResults,
            total_pages: totalPages,
            current_page: parseInt(page)
        }, {
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json(
            { 
                error: error instanceof Error ? error.message : 'Failed to fetch recommendations',
                results: [],
                total_results: 0,
                total_pages: 0,
                current_page: parseInt(page)
            },
            { 
                status: 500,
                headers: corsHeaders
            }
        );
    }
} 