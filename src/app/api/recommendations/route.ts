import { NextResponse } from 'next/server';

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Mapping Filipino emotions to TMDB genres and search parameters
const emotionMappings: Record<string, { genres: number[], keywords: string[] }> = {
    'Masaya': {
        genres: [35, 10751], // Comedy, Family
        keywords: ['feel-good', 'heartwarming', 'funny']
    },
    'Kinikilig': {
        genres: [10749], // Just Romance genre
        keywords: ['romance', 'love', 'romantic']
    },
    'Malungkot': {
        genres: [18], // Just Drama genre
        keywords: ['emotional', 'touching', 'dramatic', 'sad', 'melancholy']
    },
    'Pagod': {
        genres: [35, 16, 10751], // Comedy, Animation, Family
        keywords: ['relaxing', 'light-hearted', 'feel-good', 'family-friendly']
    },
    'Bored': {
        genres: [28, 12, 35, 53], // Action, Adventure, Comedy, Thriller
        keywords: ['exciting', 'thrilling', 'action-packed', 'adventure']
    },
    'Excited': {
        genres: [28, 12, 878], // Action, Adventure, Science Fiction
        keywords: ['action-packed', 'adventure', 'thrilling', 'exciting']
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
        // First, get keyword IDs for the keywords
        const keywordPromises = emotionMapping.keywords.map(async (keyword) => {
            const keywordUrl = `${TMDB_BASE_URL}/search/keyword?query=${encodeURIComponent(keyword)}`;
            console.log('Searching for keyword:', keyword);
            
            const keywordResponse = await fetch(keywordUrl, {
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'accept': 'application/json'
                }
            });

            if (!keywordResponse.ok) {
                console.error(`Failed to fetch keyword ${keyword}:`, keywordResponse.statusText);
                return null;
            }

            const keywordData = await keywordResponse.json();
            console.log(`Keyword search results for "${keyword}":`, keywordData.results);
            return keywordData.results[0]?.id;
        });

        const keywordIds = (await Promise.all(keywordPromises)).filter(id => id !== null);
        console.log('Found keyword IDs:', keywordIds);

        // Discover movies based on genres
        const discoverUrl = new URL(`${TMDB_BASE_URL}/discover/movie`);
        discoverUrl.searchParams.append('language', 'en-US');
        discoverUrl.searchParams.append('region', 'PH');
        discoverUrl.searchParams.append('sort_by', 'popularity.desc');
        discoverUrl.searchParams.append('include_adult', 'false');
        discoverUrl.searchParams.append('certification_country', 'PH');
        discoverUrl.searchParams.append('certification.lte', 'PG');
        discoverUrl.searchParams.append('with_genres', emotionMapping.genres.join(','));
        discoverUrl.searchParams.append('page', page);
        discoverUrl.searchParams.append('with_origin_country', 'PH');

        // For specific emotions, try a different approach
        if (emotion === 'Kinikilig' || emotion === 'Excited' || emotion === 'Pagod' || emotion === 'Bored' || emotion === 'Malungkot') {
            // First try with original genres
            const initialResponse = await fetch(discoverUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'accept': 'application/json'
                }
            });

            if (initialResponse.ok) {
                const initialData = await initialResponse.json();
                if (initialData.total_results > 0) {
                    return processAndReturnResults(initialData, page);
                }
            }

            // If not enough results, try with expanded genres
            let expandedGenres = emotionMapping.genres;
            if (emotion === 'Excited') {
                expandedGenres = [28, 12, 878, 53, 80]; // Action, Adventure, Sci-Fi, Thriller, Crime
            } else if (emotion === 'Pagod') {
                expandedGenres = [35, 16, 10751, 14, 10770]; // Comedy, Animation, Family, Fantasy, TV Movie
            } else if (emotion === 'Bored') {
                expandedGenres = [28, 12, 35, 53, 80, 9648]; // Action, Adventure, Comedy, Thriller, Crime, Mystery
            } else if (emotion === 'Malungkot') {
                expandedGenres = [18, 9648, 53]; // Drama, Mystery, Thriller
            }

            discoverUrl.searchParams.set('with_genres', expandedGenres.join(','));
            const expandedResponse = await fetch(discoverUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'accept': 'application/json'
                }
            });

            if (expandedResponse.ok) {
                const expandedData = await expandedResponse.json();
                if (expandedData.total_results > 0) {
                    return processAndReturnResults(expandedData, page);
                }
            }

            // If still not enough, try without origin country restriction but keep strict filters
            discoverUrl.searchParams.delete('with_origin_country');
            const globalResponse = await fetch(discoverUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'accept': 'application/json'
                }
            });

            if (globalResponse.ok) {
                const globalData = await globalResponse.json();
                if (globalData.total_results > 0) {
                    return processAndReturnResults(globalData, page);
                }
            }
        }

        // Add popularity filter with more flexible ranges
        if (popularity && popularity !== '0') {
            const rating = parseInt(popularity);
            const ratingRanges = {
                1: { min: 0, max: 6 },     // 0-6 stars
                2: { min: 0, max: 7 },     // 0-7 stars
                3: { min: 0, max: 8 },     // 0-8 stars
                4: { min: 0, max: 9 },     // 0-9 stars
                5: { min: 0, max: 10 }     // 0-10 stars
            };
            
            const range = ratingRanges[rating as keyof typeof ratingRanges];
            if (range) {
                discoverUrl.searchParams.append('vote_average.lte', range.max.toString());
                console.log('Setting vote average range:', range);
            }
        }

        // Add duration filter with more flexibility
        if (duration) {
            try {
                const [maxDuration] = JSON.parse(duration);
                // Add more flexibility to duration (±45 minutes)
                const minDuration = Math.max(10, maxDuration - 45);
                const maxDurationFlexible = maxDuration + 45;
                
                discoverUrl.searchParams.append('with_runtime.gte', minDuration.toString());
                discoverUrl.searchParams.append('with_runtime.lte', maxDurationFlexible.toString());
                console.log('Setting duration range:', { minDuration, maxDurationFlexible });
            } catch (e) {
                console.error('Invalid duration format:', duration);
            }
        }

        // Add decade filters with more flexibility
        if (decades.length > 0) {
            const validDecades = decades.filter(decade => decadeRanges[decade]);
            if (validDecades.length > 0) {
                const yearRanges = validDecades.map(decade => decadeRanges[decade]);
                const startYear = Math.min(...yearRanges.map(range => range.start));
                const endYear = Math.max(...yearRanges.map(range => range.end));
                
                // Add more flexibility to year range (±5 years)
                const flexibleStartYear = Math.max(1900, startYear - 5);
                const flexibleEndYear = Math.min(2024, endYear + 5);
                
                discoverUrl.searchParams.append('primary_release_date.gte', `${flexibleStartYear}-01-01`);
                discoverUrl.searchParams.append('primary_release_date.lte', `${flexibleEndYear}-12-31`);
                console.log('Setting year range:', { flexibleStartYear, flexibleEndYear });
            }
        }

        // Try with keywords first
        if (keywordIds.length > 0) {
            console.log('Trying discover with keywords first...');
            discoverUrl.searchParams.append('with_keywords', keywordIds.join('|'));
            
            const keywordResponse = await fetch(discoverUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'accept': 'application/json'
                }
            });

            if (keywordResponse.ok) {
                const keywordData = await keywordResponse.json();
                console.log(`Found ${keywordData.total_results} results with keywords`);
                
                if (keywordData.total_results > 0) {
                    return processAndReturnResults(keywordData, page);
                }
            }
        }

        // If no results with keywords, try without them
        console.log('Not enough results with keywords, trying without...');
        discoverUrl.searchParams.delete('with_keywords');

        // Try with original filters
        const response = await fetch(discoverUrl.toString(), {
            headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'accept': 'application/json'
            }
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch (error) {
            console.error('Error parsing response:', error);
            return NextResponse.json(
                { error: 'Failed to parse response from TMDB' },
                { status: 500 }
            );
        }

        if (!response.ok || responseData.total_results === 0) {
            // If no results, try with minimal filters
            console.log('No results found, trying with minimal filters...');
            
            const minimalUrl = new URL(`${TMDB_BASE_URL}/discover/movie`);
            minimalUrl.searchParams.append('language', 'en-US');
            minimalUrl.searchParams.append('region', 'PH');
            minimalUrl.searchParams.append('sort_by', 'popularity.desc');
            minimalUrl.searchParams.append('include_adult', 'false');
            minimalUrl.searchParams.append('certification_country', 'PH');
            minimalUrl.searchParams.append('certification.lte', 'PG');
            minimalUrl.searchParams.append('with_genres', emotionMapping.genres.join(','));
            minimalUrl.searchParams.append('page', page);

            const minimalResponse = await fetch(minimalUrl.toString(), {
                headers: {
                    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                    'accept': 'application/json'
                }
            });

            if (minimalResponse.ok) {
                const minimalData = await minimalResponse.json();
                if (minimalData.total_results > 0) {
                    console.log(`Found ${minimalData.total_results} results with minimal filters`);
                    return processAndReturnResults(minimalData, page);
                }
            }

            // If still no results, return empty results instead of error
            return NextResponse.json({
                results: [],
                total_results: 0,
                total_pages: 0,
                current_page: parseInt(page)
            });
        }

        return processAndReturnResults(responseData, page);
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

// Helper function to process and return results
async function processAndReturnResults(data: any, page: string) {
    const moviesWithDetails = await Promise.all(
        data.results.slice(0, 20).map(async (movie: any) => {
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
    const validMovies = moviesWithDetails.filter(movie => movie !== null);

    return NextResponse.json({
        results: validMovies,
        total_results: data.total_results,
        total_pages: Math.ceil(data.total_results / 20),
        current_page: parseInt(page)
    });
} 