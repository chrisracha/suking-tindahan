import { NextResponse } from 'next/server';

const TMDB_ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    if (!TMDB_ACCESS_TOKEN) {
        console.error('NEXT_PUBLIC_TMDB_API_KEY is not defined');
        return NextResponse.json(
            { error: 'TMDB access token is not configured' },
            { status: 500 }
        );
    }

    try {
        console.log('Making TMDB API request with query:', query);
        
        // Search for movies
        const searchUrl = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
        console.log('Search URL:', searchUrl);
        
        const searchResponse = await fetch(searchUrl, {
            headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'accept': 'application/json'
            }
        });

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            console.error('TMDB API error response:', {
                status: searchResponse.status,
                statusText: searchResponse.statusText,
                body: errorText
            });
            
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { status_message: errorText };
            }
            
            throw new Error(`Failed to fetch from TMDB: ${errorData.status_message || searchResponse.statusText || 'Unknown error'}`);
        }

        const searchData = await searchResponse.json();
        console.log(`Found ${searchData.total_results} total results`);

        // Get additional details for each movie
        const moviesWithDetails = await Promise.all(
            searchData.results.slice(0, 10).map(async (movie: any) => {
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
                    return movie;
                }

                const details = await detailsResponse.json();
                return {
                    ...movie,
                    ...details
                };
            })
        );

        return NextResponse.json({
            results: moviesWithDetails,
            total_results: searchData.total_results,
            total_pages: searchData.total_pages
        });
    } catch (error) {
        console.error('Error searching movies:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to search movies' },
            { status: 500 }
        );
    }
} 