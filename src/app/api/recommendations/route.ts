import { NextResponse } from 'next/server';

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

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
        return NextResponse.json({ error: 'Emotion parameter is required' }, { status: 400 });
    }

    if (!TMDB_ACCESS_TOKEN) {
        console.error('NEXT_PUBLIC_TMDB_API_KEY is not defined');
        return NextResponse.json(
            { error: 'TMDB access token is not configured' },
            { status: 500 }
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
        discoverUrl.searchParams.append('with_genres', emotionMapping.genres.join('|')); // Use pipe for OR logic
        discoverUrl.searchParams.append('page', page);
        discoverUrl.searchParams.append('certification_country', 'PH');
        discoverUrl.searchParams.append('certification.lte', 'PG');

        // Add popularity filter if specified
        if (popularity) {
            const popularityValue = parseInt(popularity);
            if (!isNaN(popularityValue) && popularityValue > 0) {
                // Convert 1-5 scale to TMDB's 0-10 scale
                const tmdbRating = (popularityValue * 2).toString();
                discoverUrl.searchParams.append('vote_average.gte', tmdbRating);
            }
        }

        // Add decade filter if specified
        if (decades && decades.length > 0) {
            const yearRanges = decades.map(decade => {
                switch (decade) {
                    case '80s': return { start: 1980, end: 1989 };
                    case '90s': return { start: 1990, end: 1999 };
                    case '00s': return { start: 2000, end: 2009 };
                    case '10s': return { start: 2010, end: 2019 };
                    case '20s': return { start: 2020, end: 2029 };
                    default: return null;
                }
            }).filter(range => range !== null);

            if (yearRanges.length > 0) {
                discoverUrl.searchParams.append('primary_release_date.gte', yearRanges[0]?.start.toString() || '');
                discoverUrl.searchParams.append('primary_release_date.lte', yearRanges[yearRanges.length - 1]?.end.toString() || '');
            }
        }

        // Add duration filter if specified
        if (duration) {
            try {
                const durationRange = JSON.parse(duration);
                if (Array.isArray(durationRange) && durationRange.length > 0) {
                    discoverUrl.searchParams.append('with_runtime.gte', durationRange[0].toString());
                    if (durationRange.length > 1) {
                        discoverUrl.searchParams.append('with_runtime.lte', durationRange[1].toString());
                    }
                }
            } catch (e) {
                console.error('Invalid duration format:', duration);
            }
        }

        const response = await fetch(discoverUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to fetch movies:', response.statusText);
            return NextResponse.json(
                { error: 'Failed to fetch movies' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Process the results with details
        const processedResults = await Promise.all(
            data.results.map(async (movie: any) => {
                const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?append_to_response=credits,videos`;
                console.log('Fetching details for movie:', movie.title);
                
                const detailsResponse = await fetch(detailsUrl, {
                    headers: {
                        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                        'accept': 'application/json'
                    }
                });

                if (!detailsResponse.ok) {
                    console.error(`Failed to fetch details for movie ${movie.id}:`, {
                        status: detailsResponse.status,
                        statusText: detailsResponse.statusText
                    });
                    return null;
                }

                const details = await detailsResponse.json();
                
                // Get director and cast
                const director = details.credits?.crew?.find((person: any) => person.job === 'Director');
                const cast = details.credits?.cast?.slice(0, 6) || [];
                
                // Get trailer
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

        // Filter out any null results
        const validMovies = processedResults.filter(movie => movie !== null);

        // Limit to 6 results per page
        const limitedResults = validMovies.slice(0, 6);

        return NextResponse.json({
            results: limitedResults,
            total_results: data.total_results,
            total_pages: Math.ceil(data.total_results / 6), // Adjust total pages based on 6 items per page
            current_page: parseInt(page)
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
            { status: 500 }
        );
    }
} 